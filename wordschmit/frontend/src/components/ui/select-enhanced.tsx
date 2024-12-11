import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface SelectEnhancedProps {
  label: string
  description?: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

export function SelectEnhanced({
  label,
  description,
  options,
  value,
  onChange,
  className,
  placeholder = "Select an option",
}: SelectEnhancedProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label>{label}</Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 