import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import MarkerIcon from "../../assets/location pin.svg";

interface LocationMapProps {
  latitude: number;
  longitude: number;
}

const markerIcon = new L.Icon({
  iconUrl: MarkerIcon,
  iconSize: [60, 60],
  iconAnchor: [21, 42],
});

const LocationMap = ({ latitude, longitude }: LocationMapProps) => {
  return (
    <div className="h-[128px] w-full overflow-hidden rounded-[10px]">
      <MapContainer
        center={[latitude, longitude]}
        zoom={18}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution=""
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[latitude, longitude]} icon={markerIcon}>
          <Popup>You are here</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LocationMap;