'use client'

import { Trash } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  ColumnDef,
  // Sorting:新增此項
  SortingState,
  // Filtering:新增此項
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  // Filtering:新增此項
  getFilteredRowModel,
  // 分頁: 新增此項
  getPaginationRowModel,
  // Sorting:新增此項
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
// Filtering:新增此項
import { Input } from '@/components/ui/input'

interface Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  // 增加型別
  searchKey: string
  // 增加型別
  searchName?: string
  setSelectedData: (data: TData[]) => void
  onDelete: () => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  // 增加此項，用來接收搜尋目標
  searchKey,
  // 增加此項，用來說明搜尋目標
  searchName,
  setSelectedData,
  onDelete,
}: Props<TData, TValue>) {
  // Sorting:新增此項
  const [sorting, setSorting] = useState<SortingState>([])
  // Filtering:新增此項
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  // 行可選: 新增此項
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // 分頁: 新增此項
    getPaginationRowModel: getPaginationRowModel(),
    // Sorting:新增此項
    onSortingChange: setSorting,
    // Sorting:新增此項
    getSortedRowModel: getSortedRowModel(),
    // Filtering:新增此項
    onColumnFiltersChange: setColumnFilters,
    // Filtering:新增此項
    getFilteredRowModel: getFilteredRowModel(),
    // 行可選: 新增此項
    onRowSelectionChange: setRowSelection,
    state: {
      // Sorting:新增此項
      sorting,
      // Filtering:新增此項
      columnFilters,
      // 行可選: 新增此項
      rowSelection,
    },
  })

  // 執行刪除已勾選項目
  const handleDelete = () => {
    onDelete()
  }

  // 當有勾選時，儲存紀錄
  useEffect(() => {
    setSelectedData(
      table.getFilteredSelectedRowModel().rows.map((row) => row.original)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getFilteredSelectedRowModel().rows])

  // 當行數發生變動時，清空已勾選行
  useEffect(() => {
    setRowSelection({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getRowCount()])

  return (
    // 增加div包覆全部，因為還要增加區塊
    <div>
      <div className={'flex items-center justify-between'}>
        {/* Filtering:新增以下區塊 */}
        <div className='flex items-center py-4'>
          <Input
            id='input'
            placeholder={`Search ${searchName} `}
            // 改為動態名稱searchKey
            value={(table.getColumn(searchKey)
              ?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              // 改為動態名稱searchKey
              table.getColumn(searchKey)
                ?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          />
        </div>

        {/* 刪除已選擇項目 */}
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button
            variant={'destructive'}
            onClick={handleDelete}
          >
            <Trash className={'h-4 w-4 mr-2'} />
            刪除
          </Button>
        )}
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups()
              .map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells()
                    .map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className={'flex'}>
        {/* 顯示已選擇幾行 */}
        <div className="flex-1 flex items-center text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        {/* 上一頁、下一頁 */}
        <div className='flex items-center justify-end space-x-2 py-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}