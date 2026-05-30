import { useEffect, useRef, useState } from "react";
import type {
  LeafletMapInstance,
  MapCenter,
  MapTileStyle,
} from "../../providers/MapsProvider";
import { useMaps } from "../../providers/MapsProvider";

type LocationMapProps = {
  className?: string;
  center?: MapCenter;
  zoom?: number;
  tileStyle?: MapTileStyle;
  overlayClassName?: string;
  pinClassName?: string;
};

const LocationMap = ({
  className = "relative mb-6 h-[128px] w-full overflow-hidden rounded-xl border border-orange/20 bg-[#f4ebe3]",
  center,
  zoom,
  tileStyle,
  overlayClassName = "bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,250,244,0.26))]",
  pinClassName = "bg-orange",
}: LocationMapProps) => {
  const { createLeafletMap } = useMaps();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    const abortController = new AbortController();

    if (!mapRef.current || mapInstanceRef.current) {
      return;
    }

    setMapStatus("loading");

    void createLeafletMap(mapRef.current, {
      center,
      zoom,
      tileStyle,
      signal: abortController.signal,
    })
      .then((map) => {
        mapInstanceRef.current = map;
        setMapStatus("ready");
      })
      .catch((error: unknown) => {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        setMapStatus("error");
      });

    return () => {
      abortController.abort();
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [center, createLeafletMap, tileStyle, zoom]);

  return (
    <div className={`${className} isolate`}>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,112,45,0.18),transparent_38%),linear-gradient(135deg,#fffaf4,#f1e2d8)]" />

      <div
        ref={mapRef}
        className={`absolute inset-0 z-10 transition-opacity duration-500 ${
          mapStatus === "ready" ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className={`pointer-events-none absolute inset-0 z-20 ${overlayClassName}`} />

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 flex -translate-x-1/2 -translate-y-full flex-col items-center">
        <span
          className={`h-5 w-5 rounded-full border-[3px] border-white shadow-[0_6px_18px_rgba(27,27,27,0.18)] ${pinClassName}`}
        />
        <span className="h-3 w-3 -translate-y-1 rotate-45 rounded-[2px] bg-white/90 shadow-sm" />
      </div>

      {mapStatus !== "ready" ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center px-4 text-center text-[13px] font-light text-black/55">
          {mapStatus === "error" ? "Map unavailable" : "Loading map..."}
        </div>
      ) : null}
    </div>
  );
};

export default LocationMap;
