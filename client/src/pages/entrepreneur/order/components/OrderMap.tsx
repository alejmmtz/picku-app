import { useEffect, useRef } from "react";
import {
  ACTIVE_MAP_STYLE,
  LEAFLET_CSS_URL,
  LEAFLET_JS_URL,
  MAP_CENTER,
} from "../orderFlow.constants";

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

function OrderMap() {
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
      <div ref={mapRef} className="absolute inset-0 z-0 " />

      <div
        className={`pointer-events-none absolute inset-0 z-1 ${ACTIVE_MAP_STYLE.overlayClass}`}
      />
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

export default OrderMap;
