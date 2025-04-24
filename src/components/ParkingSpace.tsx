
import { cn } from "@/lib/utils";
import { ParkingSpot } from "@/types/parking";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ParkingSpaceProps {
  spot: ParkingSpot;
}

const ParkingSpace = ({ spot }: ParkingSpaceProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="relative flex items-center justify-center">
            <div
              className={cn(
                "w-4 h-4 rounded-sm transition-colors duration-300",
                spot.isOccupied ? "bg-[#ea384c]" : "bg-[#34c759]"
              )}
            >
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[0.75rem] text-gray-600">
                {spot.spotNumber}
              </span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p>Spot {spot.spotNumber}</p>
            <p>{spot.isOccupied ? "Occupied" : "Available"}</p>
            {spot.registrationNumber && (
              <p>Vehicle: {spot.registrationNumber}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ParkingSpace;
