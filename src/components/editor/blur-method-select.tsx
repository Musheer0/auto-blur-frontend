"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BlurMethod } from "@/types"


type BlurMethodSelectProps = {
  value: BlurMethod
  onValueChange: (value: BlurMethod) => void
}

export function BlurMethodSelect({
  value,
  onValueChange,
}: BlurMethodSelectProps) {
  return (
    <Select
      value={value}
    
      onValueChange={(value) => onValueChange(value as BlurMethod)}
    >
      <SelectTrigger className="w-full rounded-lg">
        <SelectValue placeholder="Select blur method" />
      </SelectTrigger>

      <SelectContent className={"w-full"}>
        <SelectItem value={BlurMethod.PIXELATE}>
          Pixelate
        </SelectItem>

        <SelectItem value={BlurMethod.GAUSSIAN}>
          Gaussian
        </SelectItem>

        <SelectItem value={BlurMethod.BLACKOUT}>
          Blackout
        </SelectItem>

        <SelectItem value={BlurMethod.ELLIPTICAL}>
          Elliptical
        </SelectItem>

        <SelectItem value={BlurMethod.MEDIAN}>
          Median
        </SelectItem>
      </SelectContent>
    </Select>
  )
}