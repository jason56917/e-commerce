'use client'

import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { createStore } from '@/actions/stores/createStore'
import { storeFormSchema, StoreFormType } from '@/prisma/formSchemas'

import { FormError } from '../FormError'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { toast } from 'sonner'

interface Props {
  // 承接來自Dialog的關閉Dialog動作
  onClose: () => void
}

// 1. 導入在formSchemas建立好的表單欄位規範
const formSchema = storeFormSchema

// 2. 導入在formSchemas建立好的表單欄位型別
type FormValues = StoreFormType

export const CreateStoreForm = ({
  onClose,
}: Props) => {
  // 3. 解構出表單提交狀態以及掌控表單狀態
  const [isPending, startTransition] = useTransition()
  // 4. 設置提交後若發生錯誤的錯誤訊息
  const [error, setError] = useState('')

  // 5. 使用react-hook-form建立表單
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })

  // 6. 建立提交方法
  const handleSubmit = (values: FormValues) => {
    // 先清空欄位資訊
    setError('')

    // 使用startTransition()執行提交內容
    startTransition(() => {
      // 以下為server action
      createStore(values)
        .then((data) => {
          if (data.error) {
            setError(data.error)
          }
          if (data.success) {
            form.reset()
            onClose()
            // 成功時以Toast顯示
            toast.success(data.success)
          }
        })
        // 因在createStore拋出一個Error物件，所以可以安全設置型別為Error
        .catch((error: Error) => {
          setError(error.message || 'Something went wrong!')
        })
    })
  }

  const handleCancel = () => {
    setError('')
    // 表單欄位重置
    form.reset()
    // 關閉Dialog
    onClose()
  }

  return (
    // 7. 建立表單
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={'space-y-4 py-2'}
      >
        {/* 表單欄位 */}
        <FormField
          name={'name'}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Store Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder={'Create your own store.'}
                />
              </FormControl>
              {/* 顯示不符合欄位規範的訊息 */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 顯示提交後回傳的結果 */}
        {/* 成功時應以Toast顯示 */}
        <FormError message={error} />

        {/* 取消與提交按鈕 */}
        <div className={'w-full pt-6 space-x-2 flex items-center justify-end'}>
          <Button
            type={'button'}
            variant={'secondary'}
            disabled={isPending}
            onClick={handleCancel}
          >
            取消
          </Button>
          <Button
            disabled={isPending}
          >
            建立
          </Button>
        </div>
      </form>
    </Form>
  )
}