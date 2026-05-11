import { useEffect, useRef } from "react";
import MarkerIcon from "../../assets/location pin.svg";

interface LocationMapProps {
  latitude: number;
  longitude: number;
}

type LeafletMapInstance = {
  remove: () => void;
  setView: (center: [number, number], zoom: number) => unknown;
};

type LocationMapLeafletNamespace = {
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
  ) => LeafletMapInstance;
  tileLayer: (
    url: string,
    options: {
      attribution: string;
      subdomains?: string;
    },
  ) => {
    addTo: (map: LeafletMapInstance) => unknown;
  };
  icon: (options: {
    iconUrl: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
    popupAnchor: [number, number];
  }) => unknown;
  marker: (
    position: [number, number],
    options: {
      icon: unknown;
    },
  ) => {
    addTo: (map: LeafletMapInstance) => {
      bindPopup: (content: string) => unknown;
    };
  };
};

const LEAFLET_CSS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const LEAFLET_SCRIPT_ID = "picku-leaflet-script";
const LEAFLET_STYLE_ID = "picku-leaflet-style";

const LocationMap = ({ latitude, longitude }: LocationMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);

  useEffect(() => {
    let cancelled = false;

    const initMap = () => {
      const leaflet = window.L as LocationMapLeafletNamespace | undefined;

      if (!leaflet || !mapRef.current || cancelled) {
        return;
      }

      mapInstanceRef.current?.remove();

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

      map.setView([latitude, longitude], 17);

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "",
        })
        .addTo(map);

      const marker = leaflet.marker([latitude, longitude], {
        icon: leaflet.icon({
          iconUrl: MarkerIcon,
          iconSize: [42, 42],
          iconAnchor: [21, 42],
          popupAnchor: [0, -36],
        }),
      });

      marker.addTo(map).bindPopup("Pickup location");
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
  }, [latitude, longitude]);

  return <div ref={mapRef} className="h-[128px] w-full overflow-hidden rounded-[10px]" />;
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
