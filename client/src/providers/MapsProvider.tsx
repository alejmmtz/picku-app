/* eslint-disable react-refresh/only-export-components */

import { createContext, useCallback, useContext, useMemo } from "react";
import type { ReactNode } from "react";

export type MapCenter = {
  lat: number;
  lng: number;
};

export type MapTileStyle = {
  tileUrl: string;
  attribution: string;
  subdomains?: string | string[];
  tileFilterClass?: string;
  overlayClass?: string;
};

export type LeafletMapInstance = {
  fitBounds: (
    bounds: Array<[number, number]>,
    options?: { padding?: [number, number]; maxZoom?: number },
  ) => void;
  invalidateSize: () => void;
  off: (event: string, handler: (event: LeafletMapEvent) => void) => void;
  on: (event: string, handler: (event: LeafletMapEvent) => void) => void;
  remove: () => void;
  setView: (
    center: [number, number],
    zoom?: number,
    options?: { animate?: boolean },
  ) => void;
};

export type LeafletMapEvent = {
  latlng: {
    lat: number;
    lng: number;
  };
};

export type LeafletMarkerInstance = {
  addTo: (map: LeafletMapInstance) => LeafletMarkerInstance;
  getLatLng: () => { lat: number; lng: number };
  off: (event: string, handler: () => void) => void;
  on: (event: string, handler: () => void) => void;
  remove: () => void;
  setLatLng: (center: [number, number]) => void;
};

export type LeafletPolylineInstance = {
  addTo: (map: LeafletMapInstance) => LeafletPolylineInstance;
  remove: () => void;
  setLatLngs: (points: Array<[number, number]>) => void;
};

type LeafletNamespace = {
  map: (
    element: HTMLElement,
    options: LeafletMapOptions,
  ) => LeafletMapInstance & {
    setView: (center: [number, number], zoom: number) => unknown;
  };
  tileLayer: (
    url: string,
    options: {
      attribution: string;
      subdomains?: string | string[];
    },
  ) => {
    addTo: (map: LeafletMapInstance) => unknown;
  };
  marker: (
    center: [number, number],
    options?: {
      autoPan?: boolean;
      draggable?: boolean;
      icon?: unknown;
      keyboard?: boolean;
      interactive?: boolean;
    },
  ) => LeafletMarkerInstance;
  divIcon: (options: {
    className?: string;
    html: string;
    iconSize?: [number, number];
    iconAnchor?: [number, number];
  }) => unknown;
  polyline: (
    points: Array<[number, number]>,
    options?: {
      color?: string;
      dashArray?: string;
      opacity?: number;
      weight?: number;
    },
  ) => LeafletPolylineInstance;
};

type LeafletMapOptions = {
  zoomControl: boolean;
  attributionControl: boolean;
  dragging: boolean;
  touchZoom: boolean;
  doubleClickZoom: boolean;
  scrollWheelZoom: boolean;
  boxZoom: boolean;
  keyboard: boolean;
  tap?: boolean;
};

declare global {
  interface Window {
    L?: LeafletNamespace;
  }
}

type CreateLeafletMapOptions = {
  center?: MapCenter;
  zoom?: number;
  tileStyle?: MapTileStyle;
  mapOptions?: Partial<LeafletMapOptions>;
  signal?: AbortSignal;
};

type MapsContextType = {
  createLeafletMap: (
    element: HTMLElement,
    options?: CreateLeafletMapOptions,
  ) => Promise<LeafletMapInstance>;
};

export const DEFAULT_MAP_CENTER: MapCenter = {
  lat: 3.339998,
  lng: -76.529993,
};

const LEAFLET_CSS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const LEAFLET_SCRIPT_ID = "picku-leaflet-script";
const LEAFLET_STYLE_ID = "picku-leaflet-style";

export const DEFAULT_MAP_TILE_STYLE: MapTileStyle = {
  tileUrl: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
  subdomains: "abcd",
};

const DEFAULT_MAP_OPTIONS: LeafletMapOptions = {
  zoomControl: false,
  attributionControl: false,
  dragging: true,
  touchZoom: true,
  doubleClickZoom: true,
  scrollWheelZoom: true,
  boxZoom: true,
  keyboard: true,
};

const MapsContext = createContext<MapsContextType | null>(null);

export const MapsProvider = ({ children }: { children: ReactNode }) => {
  const createLeafletMap = useCallback(
    async (
      element: HTMLElement,
      {
        center = DEFAULT_MAP_CENTER,
        zoom = 16,
        tileStyle = DEFAULT_MAP_TILE_STYLE,
        mapOptions,
        signal,
      }: CreateLeafletMapOptions = {},
    ) => {
      if (signal?.aborted) {
        throw new DOMException("Map creation was cancelled", "AbortError");
      }

      const leaflet = await getLeaflet();

      if (signal?.aborted) {
        throw new DOMException("Map creation was cancelled", "AbortError");
      }

      const map = leaflet.map(element, {
        ...DEFAULT_MAP_OPTIONS,
        ...mapOptions,
      });

      map.setView([center.lat, center.lng], zoom);

      leaflet
        .tileLayer(tileStyle.tileUrl, {
          attribution: tileStyle.attribution,
          subdomains: tileStyle.subdomains,
        })
        .addTo(map);

      setTimeout(() => {
        map.invalidateSize();
      }, 100);

      return map;
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      createLeafletMap,
    }),
    [createLeafletMap],
  );

  return (
    <MapsContext.Provider value={contextValue}>{children}</MapsContext.Provider>
  );
};

function getLeaflet() {
  ensureLeafletStyles();

  if (window.L) {
    return Promise.resolve(window.L);
  }

  return loadLeafletScript().then(() => {
    if (!window.L) {
      throw new Error("Leaflet is not available");
    }

    return window.L;
  });
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

export const useMaps = () => {
  const ctx = useContext(MapsContext);

  if (!ctx) {
    throw new Error("useMaps must be used within MapsProvider");
  }

  return ctx;
};
