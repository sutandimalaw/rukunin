import React from "react"
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
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
}: StatCardProps) => {
  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {icon && <CardAction>{icon}</CardAction>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <div className="text-sm text-gray-500">{subtitle}</div>
        )}
      </CardContent>
    </Card>
  )
}

export default StatCard