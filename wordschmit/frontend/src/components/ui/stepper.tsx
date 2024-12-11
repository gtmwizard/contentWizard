import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface StepperProps {
  steps: string[]
  activeStep: number
  className?: string
}

export function Stepper({ steps, activeStep, className }: StepperProps) {
  return (
    <div className={cn("flex justify-between", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < activeStep
        const isCurrent = index === activeStep

        return (
          <div key={step} className="flex flex-1 items-center">
            <div className="relative flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                  {
                    "border-primary bg-primary text-primary-foreground": isCompleted || isCurrent,
                    "border-muted-foreground": !isCompleted && !isCurrent,
                  }
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              <span
                className={cn("text-xs mt-2 absolute -bottom-6 text-center", {
                  "text-primary font-medium": isCompleted || isCurrent,
                  "text-muted-foreground": !isCompleted && !isCurrent,
                })}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn("h-[2px] w-full", {
                  "bg-primary": isCompleted,
                  "bg-border": !isCompleted,
                })}
              />
            )}
          </div>
        )
      })}
    </div>
  )
} 