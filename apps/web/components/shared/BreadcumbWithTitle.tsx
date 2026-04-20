import React from 'react'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '@radix-ui/react-separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb'

type BreadcumbWithTitleProps = {
    Title : string
}

const BreadcumbWithTitle = ({ Title }: BreadcumbWithTitleProps) => {
  return (
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
                        <BreadcrumbPage>{Title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList> 
            </Breadcrumb>
        </div>
    </header>
  )
}

export default BreadcumbWithTitle
