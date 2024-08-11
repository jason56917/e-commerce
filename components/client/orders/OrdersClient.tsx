'use client'

import { ArrowUpDown } from 'lucide-react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { useDialog } from '@/hook/dialog/useDialog'
import { Order, OrderItem, Product } from '@prisma/client'

import { Heading } from '@/components/Heading'
import { CellAction } from '@/components/client/CellAction'
import { DataTable } from '@/components/client/DataTable'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface Props {
  storeId: string
  route: string
  title: string
  description: string
  searchKey: string
  searchName: string
  data: (Order & { orderItems: OrderItem[] })[]
}

export const OrdersClient = ({
  storeId,
  route,
  title,
  description,
  searchKey,
  searchName,
  data,
}: Props) => {
  const router = useRouter()

  // 傳遞給DataTable執行多選刪除
  const dialog = useDialog()
  const [selectedData, setSelectedData] = useState<typeof data>([])
  const handleDelete = () => {
    dialog.onOpen('deleteSelectedOrders', selectedData)
  }

  // 設定DataTable的欄位
  const columns: ColumnDef<Order & { orderItems: OrderItem[] }>[]
    = [
      // 設定行可勾選
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
              || (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className={'p-0'}
            >
              訂購人
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      },
      {
        accessorKey: 'phone',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className={'p-0'}
            >
              電話
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      },
      {
        accessorKey: 'isPaid',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className={'p-0'}
            >
              已付款
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      },
      {
        accessorKey: 'createdAt',
        // 排序
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className={'p-0'}
            >
              建立時間
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        // 轉換Date格式為字串
        cell: ({ row }) => {
          const date = row.original.createdAt
          return format(date, 'yyyy-MM-dd')
        },
      }
      // {
      //   id: 'actions',
      //   cell: ({ row }) => (
      //     <CellAction
      //       route={route}
      //       dialogName={'deleteOrder'}
      //       data={row.original}
      //     />
      //   ),
      // }
    ]

  return (
    <>
      <div className={'flex items-center justify-between'}>
        <Heading
          title={title}
          description={description}
        />
      </div>
      <Separator />
      <DataTable
        columns={columns}
        data={data}
        searchKey={searchKey}
        searchName={searchName}
        setSelectedData={setSelectedData}
        onDelete={handleDelete}
      />
    </>
  )
}