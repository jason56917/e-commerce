'use client'

import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from 'lucide-react'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useDialog } from '@/hook/dialog/useDialog'
import { cn } from '@/lib/utils'
import { Store } from '@prisma/client'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface Props extends PopoverTriggerProps {
  stores: Store[]
}

export const StoreSwitcher = ({
  stores,
}: Props) => {
  const params = useParams()
  const router = useRouter()
  // 管理Popover是否開啟
  const [isOpen, setIsOpen] = useState(false)

  const dialog = useDialog()


  // 找出與當前網址參數相同id的商店
  const currentStore = stores.find((store) => store.id === params.storeId)

  // 商店選擇切換
  const handleStoreSelect = (store: Store) => {
    // 選完後關閉Popover
    setIsOpen(false)
    // 導引到該商店頁面
    router.push(`/${store.id}`)
  }

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          size={'sm'}
          role={'combobox'}
          aria-expanded={isOpen}
          aria-label={'Select a store'}
          className={'w-[200px] justify-between'}
        >
          <StoreIcon className={'h-4 w-4 mr-2'} />
          {currentStore?.name}
          <ChevronsUpDown className={'h-4 w-4 ml-auto shrink-0 opacity-50'} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className={'w-[200px] p-0'}>
        {/* 操作介面，可以進行查詢與操作 */}
        <Command>
          {/* 命令列表-查詢與商店列表 */}
          <CommandList>
            {/* 查詢 */}
            {/* 可輸入來查詢 */}
            <CommandInput placeholder={'Search store...'} />
            {/* 若查無結果將顯示的訊息 */}
            <CommandEmpty>
              No store found
            </CommandEmpty>

            {/* 列表 */}
            <CommandGroup heading={'Stores'}>
              {stores.map((store) => (
                <CommandItem
                  key={store.id}
                  onSelect={() => handleStoreSelect(store)}
                  data-disabled={false}
                  className={'text-sm'}
                >
                  <StoreIcon className={'h-4 w-4 mr-2'} />
                  {store.name}
                  <Check
                    className={cn(
                      'h-4 w-4 ml-auto',
                      currentStore?.id === store.id
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          <CommandSeparator />

          {/* 命令列表-建立商店 */}
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  // 關閉Popover
                  setIsOpen(false)
                  // 開啟建立store dialog
                  dialog.onOpen('createStore')
                }}
              >
                <PlusCircle className={'h-5 w-5 mr-2'} />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}