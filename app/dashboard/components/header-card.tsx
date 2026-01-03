import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Users,UsersRound } from 'lucide-react';

const HeaderCard = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Total Warga</CardTitle>
          <CardAction> 
            <UsersRound color='oklch(52.7% 0.154 150.069)' />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>142</div>
          <div className="text-sm text-gray-500">35 Keluarga</div>
        </CardContent>
      </Card>
    </div>
  )
}




export default HeaderCard
