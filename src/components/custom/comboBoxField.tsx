import { useState } from "react";
import { cn } from "@/lib/utils"; // Assumes `cn` is a utility for conditional classNames
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { IconChevronDown, IconCheck } from "@tabler/icons-react"; // Replace with your actual icons
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const ComboBoxField = <T extends { id: number; name: string }>({
  form,
  items,
  formKey,
  title,
}: {
  form: any;
  items: T[];
  formKey: string;
  title: string;
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
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  aria-controls="reporter-listbox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? items.find((item) => item.id === field.value)?.name
                    : `Select ${title}`}
                  <IconChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder={`Search ${title}...`} />
                <CommandEmpty>No reporter found.</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() => {
                        field.onChange(item.id); // Properly update the form field
                        setOpen(false);
                      }}
                      role="option"
                      aria-selected={field.value === item.id}
                    >
                      <IconCheck
                        className={cn(
                          "mr-2 h-4 w-4",
                          item.id === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};