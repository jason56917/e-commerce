'use client'

import { Trash } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateStoreById } from '@/actions/stores/updateStoreById'
import { useDialog } from '@/hook/dialog/useDialog'
import { storeFormSchema, StoreFormType } from '@/prisma/formSchemas'
import { Store } from '@prisma/client'

import { Heading } from '@/components/Heading'
import { ApiAlert } from '@/components/ApiAlert'
import { FormError } from '@/components/form/FormError'
import { FormSuccess } from '@/components/form/FormSuccess'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  store: Store
}

const formSchema = storeFormSchema
type FormValues = StoreFormType

export const SettingsForm = ({
  store,
}: Props) => {
  // 使用管理的hook
  const dialog = useDialog()

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: store,
  })

  const handleSubmit = (values: FormValues) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      updateStoreById(store.id, values)
        .then((data) => {
          if (data.error) {
            setError(data.error)
          }
          if (data.success) {
            setSuccess(data.success)
          }
        })
        .catch((error: Error) => {
          setError(error.message || 'Something went wrong!')
        })
    })
  }

  return (
    <>
      <div className={'flex items-center justify-between'}>
        <Heading
          title={'Settings'}
          description={'Manage store preferences'}
        />
        <Button
          disabled={isPending}
          variant={'destructive'}
          size={'icon'}
          // 給予指定的名稱呼叫該Dialog
          onClick={() => dialog.onOpen('deleteStore', store)}
        >
          <Trash className={'h-4 w-4'} />
        </Button>
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={'space-y-8'}
        >
          <div className={'grid grid-cols-3 gap-8'}>
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
                      placeholder={'Store name'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={'w-56'}>
            <FormError message={error} />
            <FormSuccess message={success} />
          </div>
          <Button
            disabled={isPending}
            className={'ml-auto'}
          >
            更新
          </Button>
        </form>
      </Form>

      <Separator />

      <ApiAlert
        title={'NEXT_PUBLIC_STORE_API_URL'}
        description={`${process.env.NEXT_PUBLIC_API_URL}/api/stores/${store.id}`}
        variant={'public'}
      />
    </>
  )
}