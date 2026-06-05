import { useEffect, useRef, useState } from "react";
import type {
  LeafletMapEvent,
  LeafletMapInstance,
  LeafletMarkerInstance,
  LeafletPolylineInstance,
  MapCenter,
  MapTileStyle,
} from "../../providers/MapsProvider";
import { DEFAULT_MAP_CENTER, useMaps } from "../../providers/MapsProvider";
import { isSameMapCenter } from "../../utils/geo";

type LocationMapProps = {
  className?: string;
  center?: MapCenter;
  zoom?: number;
  tileStyle?: MapTileStyle;
  overlayClassName?: string;
  pinClassName?: string;
  markerMode?: "fixed-center" | "leaflet";
  markers?: LocationMapMarker[];
  polylines?: LocationMapPolyline[];
  fitToMarkers?: boolean;
  mapOptions?: {
    dragging?: boolean;
    touchZoom?: boolean;
    doubleClickZoom?: boolean;
    scrollWheelZoom?: boolean;
    boxZoom?: boolean;
    keyboard?: boolean;
  };
  onMapClick?: (center: MapCenter) => void;
  onMarkerDragEnd?: (markerId: string, center: MapCenter) => void;
};

type LocationMapMarker = {
  id: string;
  center: MapCenter;
  draggable?: boolean;
  pinClassName?: string;
};

type LocationMapPolyline = {
  id: string;
  points: MapCenter[];
  color?: string;
  dashArray?: string;
  opacity?: number;
  weight?: number;
};

const markerHtml = (pinClassName: string) => `
  <div class="pointer-events-none flex h-9 w-7 flex-col items-center">
    <span class="h-5 w-5 rounded-full border-4 border-white  ${pinClassName}"></span>
    <span class="h-3 w-3 -translate-y-1 rotate-45 bg-white/90 shadow-sm"></span>
  </div>
`;

const toLatLngTuple = (center: MapCenter): [number, number] => [
  center.lat,
  center.lng,
];

const LocationMap = ({
  className = "relative mb-6 h-64 w-full overflow-hidden rounded-xl border border-orange/20 bg-[#f4ebe3]",
  center,
  zoom = 8,
  tileStyle,
  overlayClassName = "bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,250,244,0.26))]",
  pinClassName = "bg-orange",
  markerMode = "fixed-center",
  markers,
  polylines,
  fitToMarkers = false,
  mapOptions,
  onMapClick,
  onMarkerDragEnd,
}: LocationMapProps) => {
  const { createLeafletMap } = useMaps();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);
  const markerRefs = useRef(
    new Map<
      string,
      {
        draggable: boolean;
        marker: LeafletMarkerInstance;
        onDragEnd?: () => void;
        pinClassName: string;
      }
    >(),
  );
  const polylineRefs = useRef(new Map<string, LeafletPolylineInstance>());
  const initialCenterRef = useRef<MapCenter>(center ?? DEFAULT_MAP_CENTER);
  const renderedCenterRef = useRef<MapCenter>(center ?? DEFAULT_MAP_CENTER);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    const abortController = new AbortController();
    const activeMarkerRefs = markerRefs.current;
    const activePolylineRefs = polylineRefs.current;

    if (!mapRef.current || mapInstanceRef.current) {
      return;
    }

    setMapStatus("loading");

    void createLeafletMap(mapRef.current, {
      center: initialCenterRef.current,
      zoom,
      tileStyle,
      mapOptions,
      signal: abortController.signal,
    })
      .then((map) => {
        mapInstanceRef.current = map;
        setMapStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setMapStatus("error");
      });

    return () => {
      abortController.abort();
      activeMarkerRefs.forEach(({ marker }) => marker.remove());
      activeMarkerRefs.clear();
      activePolylineRefs.forEach((polyline) => polyline.remove());
      activePolylineRefs.clear();
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [createLeafletMap, markerMode, pinClassName, tileStyle, zoom, mapOptions]);

  useEffect(() => {
    if (!mapRef.current || !mapInstanceRef.current || mapStatus !== "ready") {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });

    resizeObserver.observe(mapRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [mapStatus]);

  useEffect(() => {
    if (!mapInstanceRef.current || mapStatus !== "ready" || !center) {
      return;
    }

    if (fitToMarkers) {
      return;
    }

    if (isSameMapCenter(renderedCenterRef.current, center)) {
      return;
    }

    renderedCenterRef.current = center;
    mapInstanceRef.current.setView([center.lat, center.lng], zoom, {
      animate: true,
    });
    mapInstanceRef.current.invalidateSize();
  }, [center, center?.lat, center?.lng, fitToMarkers, mapStatus, zoom]);

  useEffect(() => {
    if (!mapInstanceRef.current || mapStatus !== "ready" || !onMapClick) {
      return;
    }

    const handleMapClick = (event: LeafletMapEvent) => {
      onMapClick({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    };

    mapInstanceRef.current.on("click", handleMapClick);

    return () => {
      mapInstanceRef.current?.off("click", handleMapClick);
    };
  }, [mapStatus, onMapClick]);

  useEffect(() => {
    if (
      markerMode !== "leaflet" ||
      !mapInstanceRef.current ||
      mapStatus !== "ready" ||
      !window.L
    ) {
      return;
    }

    const nextMarkers =
      markers ??
      (center
        ? [
            {
              id: "primary",
              center,
              pinClassName,
            },
          ]
        : []);
    const nextMarkerIds = new Set(nextMarkers.map((marker) => marker.id));

    markerRefs.current.forEach(({ marker }, markerId) => {
      if (!nextMarkerIds.has(markerId)) {
        marker.remove();
        markerRefs.current.delete(markerId);
      }
    });

    nextMarkers.forEach((nextMarker) => {
      const nextPinClassName = nextMarker.pinClassName ?? pinClassName;
      const isDraggable = nextMarker.draggable ?? false;
      const current = markerRefs.current.get(nextMarker.id);

      if (
        current &&
        current.pinClassName === nextPinClassName &&
        current.draggable === isDraggable
      ) {
        current.marker.setLatLng([
          nextMarker.center.lat,
          nextMarker.center.lng,
        ]);
        return;
      }

      if (current?.onDragEnd) {
        current.marker.off("dragend", current.onDragEnd);
      }
      current?.marker.remove();

      const marker = window
        .L!.marker([nextMarker.center.lat, nextMarker.center.lng], {
          autoPan: isDraggable,
          draggable: isDraggable,
          icon: window.L!.divIcon({
            className: "",
            html: markerHtml(nextPinClassName),
            iconSize: [28, 36],
            iconAnchor: [14, 36],
          }),
          interactive: isDraggable,
          keyboard: false,
        })
        .addTo(mapInstanceRef.current!);
      const handleDragEnd = isDraggable
        ? () => {
            const nextCenter = marker.getLatLng();
            onMarkerDragEnd?.(nextMarker.id, {
              lat: nextCenter.lat,
              lng: nextCenter.lng,
            });
          }
        : undefined;

      if (handleDragEnd) {
        marker.on("dragend", handleDragEnd);
      }

      markerRefs.current.set(nextMarker.id, {
        draggable: isDraggable,
        marker,
        onDragEnd: handleDragEnd,
        pinClassName: nextPinClassName,
      });
    });
  }, [center, markerMode, markers, mapStatus, onMarkerDragEnd, pinClassName]);

  useEffect(() => {
    if (!mapInstanceRef.current || mapStatus !== "ready" || !window.L) {
      return;
    }

    const nextPolylines = polylines ?? [];
    const nextPolylineIds = new Set(
      nextPolylines.map((polyline) => polyline.id),
    );

    polylineRefs.current.forEach((polyline, polylineId) => {
      if (!nextPolylineIds.has(polylineId)) {
        polyline.remove();
        polylineRefs.current.delete(polylineId);
      }
    });

    nextPolylines.forEach((nextPolyline) => {
      const points = nextPolyline.points.map(
        (point) => [point.lat, point.lng] as [number, number],
      );

      if (points.length < 2) {
        return;
      }

      const current = polylineRefs.current.get(nextPolyline.id);

      if (current) {
        current.setLatLngs(points);
        return;
      }

      const polyline = window
        .L!.polyline(points, {
          color: nextPolyline.color ?? "#500311",
          dashArray: nextPolyline.dashArray,
          opacity: nextPolyline.opacity ?? 0.78,
          weight: nextPolyline.weight ?? 4,
        })
        .addTo(mapInstanceRef.current!);

      polylineRefs.current.set(nextPolyline.id, polyline);
    });
  }, [mapStatus, polylines]);

  useEffect(() => {
    if (
      !fitToMarkers ||
      !mapInstanceRef.current ||
      mapStatus !== "ready" ||
      !markers ||
      markers.length < 2
    ) {
      return;
    }

    mapInstanceRef.current.fitBounds(
      [
        ...markers.map((marker) => marker.center),
        ...(polylines ?? []).flatMap((polyline) => polyline.points),
      ].map(toLatLngTuple),
      {
        maxZoom: zoom,
        padding: [42, 42],
      },
    );
    mapInstanceRef.current.invalidateSize();
  }, [fitToMarkers, markers, mapStatus, polylines, zoom]);

  return (
    <div className={`${className} isolate`}>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,112,45,0.18),transparent_38%),linear-gradient(135deg,#fffaf4,#f1e2d8)]" />

      <div ref={mapRef} className="absolute inset-0 z-10" />

      <div
        className={`pointer-events-none absolute inset-0 z-20 ${overlayClassName}`}
      />

      {markerMode === "fixed-center" ? (
        <div
          className={`pointer-events-none absolute left-1/2 top-1/2 z-30 flex -translate-x-1/2 -translate-y-full flex-col items-center transition-opacity duration-500 ${mapStatus === "ready" ? "opacity-100" : "opacity-0"}`}
        >
          <span
            className={`h-5 w-5 rounded-full border-8 border-white shadow-[0_6px_18px_rgba(27,27,27,0.18)] ${pinClassName}`}
          />
          <span className="h-3 w-3 -translate-y-1 rotate-45 bg-white/90 shadow-sm" />
        </div>
      ) : null}

      {mapStatus !== "ready" ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#f4ebe3] transition-opacity duration-500 px-4 text-center text-[13px] font-light text-black/55">
          {mapStatus === "error" ? "Map unavailable" : "Loading map..."}
        </div>
      ) : null}
    </div>
  );
};

export default LocationMap;
