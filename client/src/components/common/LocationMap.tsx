import { useEffect, useRef, useState } from "react";
import type {
  LeafletMapInstance,
  LeafletMarkerInstance,
  MapCenter,
  MapTileStyle,
} from "../../providers/MapsProvider";
import {
  DEFAULT_MAP_CENTER,
  useMaps,
} from "../../providers/MapsProvider";
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
};

type LocationMapMarker = {
  id: string;
  center: MapCenter;
  pinClassName?: string;
};

const markerHtml = (pinClassName: string) => `
  <div class="pointer-events-none flex -translate-x-1/2 -translate-y-full flex-col items-center">
    <span class="h-5 w-5 rounded-full border-[3px] border-white shadow-[0_6px_18px_rgba(27,27,27,0.18)] ${pinClassName}"></span>
    <span class="h-3 w-3 -translate-y-1 rotate-45 bg-white/90 shadow-sm"></span>
  </div>
`;

const LocationMap = ({
  className = "relative mb-6 h-64 w-full overflow-hidden rounded-xl border border-orange/20 bg-[#f4ebe3]",
  center,
  zoom = 16,
  tileStyle,
  overlayClassName = "bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,250,244,0.26))]",
  pinClassName = "bg-orange",
  markerMode = "fixed-center",
  markers,
}: LocationMapProps) => {
  const { createLeafletMap } = useMaps();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);
  const markerRefs = useRef(
    new Map<string, { marker: LeafletMarkerInstance; pinClassName: string }>(),
  );
  const initialCenterRef = useRef<MapCenter>(center ?? DEFAULT_MAP_CENTER);
  const renderedCenterRef = useRef<MapCenter>(center ?? DEFAULT_MAP_CENTER);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    const abortController = new AbortController();
    const activeMarkerRefs = markerRefs.current;

    if (!mapRef.current || mapInstanceRef.current) {
      return;
    }

    setMapStatus("loading");

    void createLeafletMap(mapRef.current, {
      center: initialCenterRef.current,
      zoom,
      tileStyle,
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
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [createLeafletMap, markerMode, pinClassName, tileStyle, zoom]);

  useEffect(() => {
    if (!mapInstanceRef.current || mapStatus !== "ready" || !center) {
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
  }, [center, center?.lat, center?.lng, mapStatus, zoom]);

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
      const current = markerRefs.current.get(nextMarker.id);

      if (current && current.pinClassName === nextPinClassName) {
        current.marker.setLatLng([
          nextMarker.center.lat,
          nextMarker.center.lng,
        ]);
        return;
      }

      current?.marker.remove();

      const marker = window.L!
        .marker([nextMarker.center.lat, nextMarker.center.lng], {
          icon: window.L!.divIcon({
            className: "",
            html: markerHtml(nextPinClassName),
            iconSize: [28, 36],
            iconAnchor: [14, 36],
          }),
          interactive: false,
          keyboard: false,
        })
        .addTo(mapInstanceRef.current!);

      markerRefs.current.set(nextMarker.id, {
        marker,
        pinClassName: nextPinClassName,
      });
    });
  }, [center, markerMode, markers, mapStatus, pinClassName]);

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
            className={`h-5 w-5 rounded-full border-[3px] border-white shadow-[0_6px_18px_rgba(27,27,27,0.18)] ${pinClassName}`}
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
