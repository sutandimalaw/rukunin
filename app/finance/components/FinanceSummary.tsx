import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CircleDollarSign, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import React from 'react'

type IFinanceSummaryProps = {
    balance : number
}

const FinanceSummary = ({ balance } : IFinanceSummaryProps) => {
    return (
        <div className='m-6 grid grid-cols-4 gap-5'>
            <Card className="gap-3 " >
                <CardHeader>
                    <CardTitle>Saldo Kas</CardTitle>
                    <CardAction><CircleDollarSign/></CardAction>
                </CardHeader>
                <CardContent className='py-2'>
                    <div className='text-2xl font-bold text-green-700'>
                    Rp. {balance}                      
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
    )
}

export default FinanceSummary
