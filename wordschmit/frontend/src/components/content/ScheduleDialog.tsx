import * as React from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScheduleSettings } from "@/types/content";

type RepeatOption = ScheduleSettings['repeat'];

const REPEAT_OPTIONS: { value: RepeatOption; label: string }[] = [
  { value: "none", label: "No repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const PLATFORMS = [
  { id: "twitter", label: "Twitter/X" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "facebook", label: "Facebook" },
] as const;

interface ScheduleDialogProps {
  onSchedule: (settings: ScheduleSettings) => void;
}

export function ScheduleDialog({ onSchedule }: ScheduleDialogProps) {
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState("09:00");
  const [repeat, setRepeat] = React.useState<RepeatOption>("none");
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<string[]>([]);

  const handleSchedule = () => {
    if (!date) return;

    onSchedule({
      date,
      time,
      repeat,
      platforms: selectedPlatforms,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Content</DialogTitle>
          <DialogDescription>
            Set when and where you want to publish your content.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(currentDate: Date) => currentDate < new Date()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <Label>Repeat</Label>
            <Select
              value={repeat}
              onValueChange={(value) => setRepeat(value as RepeatOption)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {REPEAT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            <Label>Platforms</Label>
            {PLATFORMS.map((platform) => (
              <div key={platform.id} className="flex items-center space-x-2">
                <Checkbox
                  id={platform.id}
                  checked={selectedPlatforms.includes(platform.id)}
                  onCheckedChange={(checked: boolean) => {
                    if (checked) {
                      setSelectedPlatforms([...selectedPlatforms, platform.id]);
                    } else {
                      setSelectedPlatforms(
                        selectedPlatforms.filter((id) => id !== platform.id)
                      );
                    }
                  }}
                />
                <label
                  htmlFor={platform.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {platform.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSchedule} disabled={!date || selectedPlatforms.length === 0}>
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 