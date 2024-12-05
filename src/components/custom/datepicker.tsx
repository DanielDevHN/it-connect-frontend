import { useState } from "react";
import { cn } from "@/lib/utils"; // Assumes `cn` is a utility for conditional classNames
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { IconCalendar } from "@tabler/icons-react"; // Replace with your actual icon
import { format } from "date-fns"; // You may need to install date-fns for date formatting
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";

export const DatePickerField = ({
  disabled,
  form,
  formKey,
  title,
  tillToday
}: {
    disabled?: boolean;
    form: any;
    formKey: string;
    title: string;
    tillToday: boolean
}) => {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name={formKey}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{title.charAt(0).toLocaleUpperCase() + title.substring(1)}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  disabled={disabled}
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP") // Format the date value
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  tillToday ? 
                  (date > new Date() || date < new Date("1900-01-01")) : date < new Date("1900-01-01")
                }			
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};