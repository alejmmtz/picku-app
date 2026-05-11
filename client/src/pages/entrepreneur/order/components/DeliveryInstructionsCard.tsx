import AppIcon from "./icons";

type DeliveryInstructionsCardProps = {
  instructions: string;
};

export default function DeliveryInstructionsCard({
  instructions,
}: DeliveryInstructionsCardProps) {
  return (
    <div className="mb-8 rounded-xl border border-black/25 bg-background px-4 py-4">
      <div className="flex items-center gap-2">
        <AppIcon name="map-pin" className="h-5 w-5 text-orange" />
        <p className="text-lg  text-black">Delivery Instructions</p>
      </div>

      <p className="font-light  text-black">{instructions}</p>
    </div>
  );
}
