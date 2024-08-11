'use client'

import { Plus, ArrowUpDown } from 'lucide-react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { useDialog } from '@/hook/dialog/useDialog'
import { currencyFormatter } from '@/lib/utils'
import { Category, Color, Image, Product, Size } from '@prisma/client'

import { Heading } from '@/components/Heading'
import { ApiAlert } from '@/components/ApiAlert'
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
  data: (Product & {
    category: Category
    sizes: Size[]
    colors: Color[]
    images: Image[]
  })[]
}

export const ProductsClient = ({
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
    dialog.onOpen('deleteSelectedProducts', selectedData)
  }

  // 設定DataTable的欄位
  const columns: ColumnDef<
    Product & {
      category: Category
      sizes: Size[]
      colors: Color[]
      images: Image[]
    }
  >[]
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
        // 設定抓取資料的屬性值
        // 但row.original不受此變更，仍然是指原始data
        // 若有需要顯示複雜的資料，使用cell
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
        accessorKey: 'category.name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className={'p-0'}
            >
              所屬分類
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      },
      {
        accessorKey: 'price',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className={'p-0'}
            >
              價格
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const price = row.original.price
          return currencyFormatter.format(price)
        },
      },
      {
        accessorKey: 'sizes',
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
        cell: ({ row }) => {
          return (
            <div className={'flex flex-wrap'}>
              {row.original.sizes.map((size) => size.value)
                .join(', ')}
            </div>
          )
        },
      },
      {
        accessorKey: 'colors',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className={'p-0'}
            >
              顏色
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        // 顯示顏色
        cell: ({ row }) => {
          return (
            <div className={'flex flex-wrap gap-x-2'}>
              {row.original.colors.map((color) => (
                <div
                  key={color.id}
                  className={'border h-5 w-5 rounded-full'}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          )
        },
      },
      {
        accessorKey: 'isFeatured',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className={'p-0'}
            >
              已上架
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      },
      {
        accessorKey: 'isArchived',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className={'p-0'}
            >
              已封存
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
            dialogName={'deleteProduct'}
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
      {/* <ApiList
        storeId={storeId}
        route={route}
      /> */}

      <ApiAlert
        title={'NEXT_PUBLIC_PRODUCTS_API_URL'}
        description={`${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}/products`}
        variant={'public'}
      />
    </>
  )
}