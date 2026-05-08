"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TransactionDatePickerProps {
  date: Date;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (hours: number, minutes: number) => void;
}

export function TransactionDatePicker({
  date,
  onDateChange,
  onTimeChange,
}: TransactionDatePickerProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="transactionDate">Transaction Date & Time</Label>
      <div className="flex space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-[9999]">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
              disabled={{ after: new Date() }}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <Clock className="mr-2 h-4 w-4" />
              {date ? format(date, "HH:mm") : <span>Set time</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 z-[9999]">
            {/* <div className="space-y-2">
              <div className="grid gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="hours">Hours</Label>
                    <Input
                      id="hours"
                      type="number"
                      min={0}
                      max={23}
                      value={date.getHours()}
                      onChange={(e) =>
                        onTimeChange(
                          Number.parseInt(e.target.value) || 0,
                          date.getMinutes()
                        )
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="minutes">Minutes</Label>
                    <Input
                      id="minutes"
                      type="number"
                      min={0}
                      max={59}
                      value={date.getMinutes()}
                      onChange={(e) =>
                        onTimeChange(
                          date.getHours(),
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div> */}
            <div className="grid gap-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="hours">Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    min={1}
                    max={12}
                    value={(() => {
                      const h = date.getHours();
                      return h === 0 || h === 12 ? 12 : h % 12;
                    })()}
                    onChange={(e) => {
                      const inputHour = Number.parseInt(e.target.value) || 1;
                      const isPM = date.getHours() >= 12;
                      const adjustedHour = isPM
                        ? (inputHour % 12) + 12
                        : inputHour % 12 === 12
                        ? 0
                        : inputHour % 12;
                      onTimeChange(adjustedHour, date.getMinutes());
                    }}
                    className="w-full"
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="minutes">Minutes</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min={0}
                    max={59}
                    value={date.getMinutes()}
                    onChange={(e) =>
                      onTimeChange(
                        date.getHours(),
                        Number.parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full"
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="ampm">AM/PM</Label>
                  <select
                    id="ampm"
                    value={date.getHours() >= 12 ? "PM" : "AM"}
                    onChange={(e) => {
                      const hours = date.getHours();
                      const isPM = e.target.value === "PM";
                      let newHours = hours;

                      if (isPM && hours < 12) newHours = hours + 12;
                      if (!isPM && hours >= 12) newHours = hours - 12;

                      onTimeChange(newHours, date.getMinutes());
                    }}
                    className="w-full border border-input rounded-md px-2 py-1 text-sm"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
