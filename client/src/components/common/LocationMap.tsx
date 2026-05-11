import { useEffect, useRef } from "react";

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

const MAP_CENTER: [number, number] = [3.339998, -76.529993];
const LEAFLET_CSS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const LEAFLET_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const LEAFLET_TILE_ATTRIBUTION =
  "&copy; OpenStreetMap contributors &copy; CARTO";
const LEAFLET_SCRIPT_ID = "picku-leaflet-script";
const LEAFLET_STYLE_ID = "picku-leaflet-style";

const LocationMap = () => {
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

      map.setView(MAP_CENTER, 16);

      leaflet
        .tileLayer(LEAFLET_TILE_URL, {
          attribution: LEAFLET_TILE_ATTRIBUTION,
          subdomains: "abcd",
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
    <div className="relative mb-6 h-[128px] w-full overflow-hidden rounded-[10px]">
      <div ref={mapRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.28))]" />
    </div>
  );
};

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
      if (window.L) {
        resolve();
        return;
      }

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

export default LocationMap;
