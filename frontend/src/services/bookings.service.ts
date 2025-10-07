import { Booking } from "@/types/booking";
import axios from "axios";
import { toast } from "sonner";

export const createBookingService = async (
  url: string,
  { arg }: { arg: Omit<Booking, "id"> }
) => {
  try {
    const res = await axios.post(`api${url}`, arg);

    return res.data;
  } catch (e) {
    toast.error(
      (e as { response: { data: { message: string } } }).response.data.message
    );
  }
};

export const deleteBookingService = async (
  url: string,
  { arg }: { arg: string }
) => {
  const res = await axios.delete(`api${url}/${arg}`);

  toast.success("Booking cancelled successfully");
  return res.data;
};
