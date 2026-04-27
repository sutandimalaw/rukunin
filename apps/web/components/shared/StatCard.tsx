import React from "react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  onClick?: () => void
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  onClick,
}: StatCardProps) => {
  return (
    <Card
      className={cn(
        "gap-0 border-transparent shadow-xs hover:shadow-sm transition-all duration-200",
        onClick && "cursor-pointer hover:-translate-y-0.5"
      )}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-[13px] font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <CardAction>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/8 text-primary [&_svg]:size-[18px]">
              {icon}
            </div>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-[28px] font-bold tracking-tight leading-none">{value}</div>
        {subtitle && (
          <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
        )}
      </CardContent>
    </Card>
  )
}

export default StatCard
