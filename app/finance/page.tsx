import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Card, CardAction, CardContent, CardDescription,  CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@radix-ui/react-separator'
import { CircleDollarSign, TrendingDown, TrendingUp, Wallet, WalletCards } from 'lucide-react'
import React from 'react'
import List from './list.tsx/page'

const page = () => {
  return (
    <SidebarInset>
         <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Keuangan RT 4</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
        <div className='m-6 grid grid-cols-4 gap-5'>
            <Card className="gap-3 " >
                <CardHeader>
                    <CardTitle>Saldo Kas</CardTitle>
                    <CardAction><CircleDollarSign/></CardAction>
                </CardHeader>
                <CardContent className='py-2'>
                    <div className='text-2xl font-bold text-green-700'>
                      Rp. 45.000.000                            
                    </div>  
                    <div className='text-sm text-gray-500'> Saldo Tersedia</div>                 
                </CardContent>
               
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Pemasukan Bulan Ini</CardTitle>
                    <CardAction><TrendingUp/></CardAction>
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>
                      Rp. 15.000.000                            
                    </div> 
                    <div className='text-sm text-gray-500'> +7.3% dari bulan lalu</div>                  
                </CardContent>   
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Pengeluaran Bulan Ini</CardTitle>
                    <CardAction><TrendingDown/></CardAction>
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold '>
                      Rp. 45.000.000                            
                    </div>   
                    <div className='text-sm text-gray-500'> -32% dari bulan lalu</div>                
                </CardContent>
                
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Tagihan Tertunggak</CardTitle>
                    <CardAction><Wallet/></CardAction>
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold '>
                      Rp. 45.000.000                            
                    </div>                   
                    <div className='text-sm text-gray-500'> dari 35 warga</div> 
                </CardContent>
                
            </Card>
        </div>
        <List />

    </SidebarInset>
  )
}

export default page
