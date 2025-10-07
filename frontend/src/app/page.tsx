"use client";

import { BookingForm } from "@/components/BookingForm";
import { BookingList } from "@/components/BookingList";
import { Button } from "@/components/ui/button";
import apiRoutes from "@/consts/apiRoutes";
import { fetcher } from "@/lib/fetcher";
import {
  createBookingService,
  deleteBookingService,
} from "@/services/bookings.service";
import { Booking } from "@/types/booking";
import Link from "next/link";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const Home = () => {
  const { data, isLoading: loadingBookings } = useSWR<Booking[]>(
    apiRoutes.BOOKINGS.BASE,
    fetcher
  );

  const { trigger: createBooking, isMutating: isCreating } = useSWRMutation(
    apiRoutes.BOOKINGS.BASE,
    createBookingService
  );

  const { trigger: deleteBooking, isMutating: isDeleting } = useSWRMutation(
    apiRoutes.BOOKINGS.BASE,
    deleteBookingService
  );

  const isLoading = loadingBookings || isCreating || isDeleting;

  const handleCreateBooking = async (
    name: string,
    startTime: Date,
    endTime: Date
  ) => {
    await createBooking({ name, startTime, endTime });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex-1" />
            <div className="text-center space-y-2 flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Time Slot Booking
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Easily manage your time slots and avoid scheduling conflicts
              </p>
            </div>
            <div className="flex-1 flex justify-end gap-2">
              <Button variant="link">
                <Link href="/auth/logout">Logout</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <BookingForm onSubmit={handleCreateBooking} isLoading={isLoading} />
          </div>

          <div className="space-y-8">
            <BookingList
              bookings={data || []}
              onDelete={deleteBooking}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
