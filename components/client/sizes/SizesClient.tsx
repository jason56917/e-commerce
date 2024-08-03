'use client'

import { ArrowUpDown, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { useDialog } from '@/hook/dialog/useDialog'
import { Size } from '@prisma/client'

import { Heading } from '@/components/Heading'
import { CellAction } from '@/components/client/CellAction'
import { DataTable } from '@/components/client/DataTable'
import { ApiList } from '@/components/client/ApiList'
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
  data: Size[]
}

export const SizesClient = ({
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
    console.log(setSelectedData)
    dialog.onOpen('deleteSelectedSizes', selectedData)
  }

  // 設定DataTable的欄位
  const columns: ColumnDef<Size>[]
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
              名稱
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      },
      {
        accessorKey: 'value',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className={'p-0'}
            >
              尺寸
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
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <CellAction
            route={route}
            dialogName={'deleteSize'}
            data={row.original}
          />
        ),
      }
    ]

  const handleClick = () => {
    router.push(`/${storeId}/${route}/new`)
  }

  return (
    <>
      <div className={'flex items-center justify-between'}>
        <Heading
          title={title}
          description={description}
        />
        <Button
          type={'button'}
          onClick={handleClick}
        >
          <Plus className={'h-4 w-4 mr-2'} />
          Add new
        </Button>
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

      <Heading
        title={'API'}
        description={`API calls for ${route}`}
      />
      <Separator />
      <ApiList
        storeId={storeId}
        route={route}
      />
    </>
  )
}