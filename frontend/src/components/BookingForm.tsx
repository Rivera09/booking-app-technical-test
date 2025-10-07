import { Button } from "@/components/ui/button";
import Label from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar } from "lucide-react";
import { ChangeEvent, useState } from "react";
import Card from "./ui/card";
import Input from "./ui/input";

interface BookingFormProps {
  onSubmit: (name: string, startTime: Date, endTime: Date) => void;
  isLoading?: boolean;
}

const DEFAULT_FORM_VALUES = {
  name: "",
  date: "",
  startTime: "",
  endTime: "",
};

export const BookingForm = ({ onSubmit, isLoading }: BookingFormProps) => {
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(formValues).some((value) => !value)) {
      toast.error("Please fill in all fields");
      return;
    }

    const { date, endTime, name, startTime } = formValues;

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    if (end <= start) {
      toast.error("End time must be after start time");
      return;
    }

    onSubmit(name, start, end);
    setFormValues(DEFAULT_FORM_VALUES);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name;
    const value = e.target.value;

    setFormValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const { date, endTime, name, startTime } = formValues;

  return (
    <Card className="p-6 bg-card shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">New Booking</h2>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Booking Name
          </Label>
          <Input
            id="name"
            value={name}
            name="name"
            onChange={handleChange}
            placeholder="e.g., designli interview"
            className="bg-background border-input cursor-text"
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium text-foreground">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            name="date"
            value={date}
            onChange={handleChange}
            className="bg-background border-input cursor-pointer w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="startTime"
              className="text-sm font-medium text-foreground"
            >
              Start Time
            </Label>
            <Input
              id="startTime"
              type="time"
              name="startTime"
              value={startTime}
              onChange={handleChange}
              className="bg-background border-input cursor-pointer w-full"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="endTime"
              className="text-sm font-medium text-foreground"
            >
              End Time
            </Label>
            <Input
              id="endTime"
              type="time"
              name="endTime"
              value={endTime}
              onChange={handleChange}
              className="bg-background border-input cursor-pointer w-full"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
          disabled={isLoading}
        >
          Create Booking
        </Button>
      </form>
    </Card>
  );
};
