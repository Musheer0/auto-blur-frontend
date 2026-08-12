"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditor } from "@/store/editor-store";
import { blur_type } from "@/generated/prisma/enums";

export function BlurMethodSelect() {
  const { blur_type, setBlurType } = useEditor();

  return (
    <Select
      value={blur_type}
      onValueChange={(value) => setBlurType(value as blur_type)}
    >
      <SelectTrigger className="w-full rounded-lg">
        <SelectValue placeholder="Select blur method" />
      </SelectTrigger>

      <SelectContent className="w-full">
        <SelectItem value="PIXELATE">
          Pixelate
        </SelectItem>

        <SelectItem value="GAUSSIAN">
          Gaussian
        </SelectItem>

        <SelectItem value="BLACKOUT">
          Blackout
        </SelectItem>

        <SelectItem value="ELLIPTICAL">
          Elliptical
        </SelectItem>

        <SelectItem value="MEDIAN">
          Median
        </SelectItem>
      </SelectContent>
    </Select>
  );
}