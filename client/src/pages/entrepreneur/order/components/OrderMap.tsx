import LocationMap from "../../../../components/common/LocationMap";
import { DEFAULT_MAP_CENTER } from "../../../../providers/MapsProvider";
import { ACTIVE_MAP_STYLE } from "../orderFlow.constants";

function OrderMap() {
  return (
    <LocationMap
      center={DEFAULT_MAP_CENTER}
      zoom={17}
      tileStyle={ACTIVE_MAP_STYLE}
      overlayClassName={ACTIVE_MAP_STYLE.overlayClass}
      pinClassName="bg-maroon"
      className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-[#f4ebe3]"
    />
  );
}

export default OrderMap;
