import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import prisma from '@/lib/prisma'
import React from 'react'

export default async function OrderPage() {
    const orders = await prisma.order.findMany({
        include: {
            items: {
                include: {
                    product: true,
                }
            }
        }
    })
  return (
    <div>
      <Breadcrumb pageName='Order Page'>
      
      </Breadcrumb>
    </div>
  )
}
