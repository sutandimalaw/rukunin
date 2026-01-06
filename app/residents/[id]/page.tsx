import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import HistoryPayment from './history-payment'

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
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                        Data Warga
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Detail</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            </div>
        </header>
        <div className='m-5'>
            <div className='mb-6'>
                <h1 className="text-2xl font-semibold">Detail Warga</h1>
                <p className="text-sm text-muted-foreground">
                    Sutandi Azhari Malau | SB2-23
                </p>
            </div>         
            <div className=''>
                <Card className="w-full mb-5">
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-4 gap-5'>
                            <div>
                                <div className='text-gray-400 text-sm mb-1'>Nama</div>
                                <div>Sutandi Azhari Malau</div>
                            </div>  
                            <div>
                                <div className='text-gray-400 text-sm mb-1'>KK</div>
                                <div>1201123123213</div>
                            </div>
                            <div>
                                <div className='text-gray-400 text-sm mb-1'>Blok</div>
                                <div>SB-2</div>
                            </div>
                            <div>
                                <div className='text-gray-400 text-sm mb-1'>No</div>
                                <div>23</div>
                            </div> 
                            <div>
                                <div className='text-gray-400 text-sm mb-1'>Gender</div>
                                <div>Male</div>
                            </div>  
                            <div>
                                <div className='text-gray-400 text-sm mb-1'>Pekerjaan</div>
                                <div>Karyawan Swasta</div>
                            </div>
                            <div>
                                <div className='text-gray-400 text-sm mb-1'>Status Kepemilikan</div>
                                <div>Owner</div>
                            </div>
                            <div>
                                <div className='text-gray-400 text-sm mb-1'>Tanggal Mulai Tinggal</div>
                                <div>01-01-2025</div>
                            </div>                                
                        </div>                   
                    </CardContent>
                    <CardFooter>
                        {/* <p>Card Footer</p> */}
                    </CardFooter>
                </Card>
               <HistoryPayment />
            </div>          
        </div>
    </SidebarInset>
  )
}

export default page
