import { useEffect, useRef } from "react";
import {
  ACTIVE_MAP_STYLE,
  LEAFLET_CSS_URL,
  LEAFLET_JS_URL,
  MAP_CENTER,
} from "../orderFlow.constants";
import AppIcon from "./icons";

type LeafletMapInstance = {
  remove: () => void;
};

type LeafletNamespace = {
  map: (
    element: HTMLElement,
    options: {
      zoomControl: boolean;
      attributionControl: boolean;
      dragging: boolean;
      touchZoom: boolean;
      doubleClickZoom: boolean;
      scrollWheelZoom: boolean;
      boxZoom: boolean;
      keyboard: boolean;
      tap?: boolean;
    },
  ) => LeafletMapInstance & {
    setView: (center: [number, number], zoom: number) => unknown;
  };
  tileLayer: (
    url: string,
    options: {
      attribution: string;
      subdomains?: string;
    },
  ) => {
    addTo: (map: LeafletMapInstance) => unknown;
  };
};

declare global {
  interface Window {
    L?: LeafletNamespace;
  }
}

const LEAFLET_SCRIPT_ID = "picku-leaflet-script";
const LEAFLET_STYLE_ID = "picku-leaflet-style";

export default function OrderMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);

  useEffect(() => {
    let cancelled = false;

    const initMap = () => {
      const leaflet = window.L;
      if (!leaflet || !mapRef.current || cancelled || mapInstanceRef.current) {
        return;
      }

      const map = leaflet.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        boxZoom: true,
        keyboard: true,
      });

      map.setView([MAP_CENTER.lat, MAP_CENTER.lng], 17);

      leaflet
        .tileLayer(ACTIVE_MAP_STYLE.tileUrl, {
          attribution: ACTIVE_MAP_STYLE.attribution,
          subdomains: ACTIVE_MAP_STYLE.subdomains,
        })
        .addTo(map);

      window.requestAnimationFrame(() => {
        const tilePane = mapRef.current?.querySelector(
          ".leaflet-tile-pane",
        ) as HTMLElement | null;
        if (!tilePane) return;
        tilePane.classList.add(ACTIVE_MAP_STYLE.tileFilterClass);
      });

      mapInstanceRef.current = map;
    };

    const ensureLeafletAssets = async () => {
      ensureLeafletStyles();

      if (window.L) {
        initMap();
        return;
      }

      await loadLeafletScript();
      initMap();
    };

    void ensureLeafletAssets();

    return () => {
      cancelled = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <>
      <div ref={mapRef} className="absolute inset-0 z-0" />
      <div
        className={`pointer-events-none absolute inset-0 z-[1] ${ACTIVE_MAP_STYLE.overlayClass}`}
      />

      <div className="pointer-events-none absolute inset-0 z-10">
        <RouteOverlay />
        <MapPins />
      </div>
    </>
  );
}

function ensureLeafletStyles() {
  if (document.getElementById(LEAFLET_STYLE_ID)) return;

  const link = document.createElement("link");
  link.id = LEAFLET_STYLE_ID;
  link.rel = "stylesheet";
  link.href = LEAFLET_CSS_URL;
  document.head.appendChild(link);
}

function loadLeafletScript() {
  return new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(
      LEAFLET_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Leaflet")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = LEAFLET_SCRIPT_ID;
    script.src = LEAFLET_JS_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Leaflet"));
    document.head.appendChild(script);
  });
}

function RouteOverlay() {
  return (
    <>
      <div className="absolute left-[69px] top-[98px] h-[82px] w-px border-l-2 border-dashed border-maroon" />
      <div className="absolute left-[68px] top-[178px] h-px w-[74px] border-t-2 border-dashed border-maroon" />
      <div className="absolute left-[141px] top-[178px] h-[44px] w-px border-l-2 border-dashed border-maroon" />
    </>
  );
}

function MapPins() {
  return (
    <>
      <div className="absolute left-[42px] top-[72px]">
        <MapPinBadge color="bg-maroon" iconColor="text-white" iconName="smartphone" />
      </div>

      <div className="absolute left-[109px] top-[148px]">
        <span className="absolute left-1/2 top-[-18px] -translate-x-1/2 rounded-full bg-orange px-3 py-0.5 text-xs font-medium text-white shadow-[0_4px_10px_rgba(255,112,45,0.35)]">
          You
        </span>
        <MapPinBadge color="bg-orange" iconColor="text-white" iconName="map-pin" />
      </div>
    </>
  );
}

type MapPinBadgeProps = {
  color: string;
  iconColor: string;
  iconName: "smartphone" | "map-pin";
};

function MapPinBadge({ color, iconColor, iconName }: MapPinBadgeProps) {
  return (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-white shadow-[0_10px_22px_rgba(0,0,0,0.14)] ${color}`}>
      <AppIcon name={iconName} className={`h-5 w-5 ${iconColor}`} />
    </div>
  );
}
