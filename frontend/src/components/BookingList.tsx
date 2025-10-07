"use client";

import { Booking } from "@/types/booking";
import { BookingCard } from "./BookingCard";
import { CalendarDays } from "lucide-react";
import Skeleton from "./ui/skeleton";

interface BookingListProps {
  bookings: Booking[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const BookingList = ({
  bookings,
  onDelete,
  isLoading,
}: BookingListProps) => {
  if (!bookings.length) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <CalendarDays className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No bookings yet
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Create your first booking using the form above to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-accent/10">
          <CalendarDays className="h-5 w-5 text-accent" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">
          Your Bookings ({bookings.length})
        </h2>
      </div>

      <div className="grid gap-4">
        {isLoading
          ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full" />)
          : bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onDelete={onDelete}
              />
            ))}
      </div>
    </div>
  );
};
