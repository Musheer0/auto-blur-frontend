import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface GenerateButtonProps
  extends React.ComponentProps<typeof Button> {
}

export function GenerateButton({
  className,
  ...props
}: GenerateButtonProps) {
  return (
    <Button
      {...props}
      className={`
        h-auto! w-full
        rounded-xl
        py-1.5
        z-999
        relative
        border-0
        bg-[#d7ff00]
        text-xl font-semibold text-black
        shadow-[0_5px_0_#8eaa00]
        transition-all
        hover:bg-[#d7ff00]
        hover:shadow-[0_3px_0_#8eaa00]
        hover:translate-y-[2px]
        active:translate-y-[5px]
        active:shadow-none
        ${className ?? ""}
      `}
    >
      <Sparkles className="size-5 fill-black" />
      <span>Generate</span>


    </Button>
  )
}