import { Booking } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Clock, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Card from "./ui/card";

interface BookingCardProps {
  booking: Booking;
  onDelete: (id: string) => void;
}

export const BookingCard = ({ booking, onDelete }: BookingCardProps) => {
  const formatDateTime = (date: Date) => {
    return format(date, "MMM d, yyyy • h:mm a");
  };

  const duration = Math.round(
    (new Date(booking.endTime).getTime() -
      new Date(booking.startTime).getTime()) /
      (1000 * 60)
  );

  return (
    <Card className="p-5 bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-semibold text-foreground">
            {booking.name}
          </h3>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">{duration} minutes</span>
            </div>

            <div className="space-y-1 pl-6">
              <div>
                <span className="text-foreground/70">From:</span>{" "}
                <span className="text-foreground">
                  {formatDateTime(booking.startTime)}
                </span>
              </div>
              <div>
                <span className="text-foreground/70">To:</span>{" "}
                <span className="text-foreground">
                  {formatDateTime(booking.endTime)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="destructive"
          size="icon"
          onClick={() => {
            onDelete(booking.id);
          }}
          className="shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
