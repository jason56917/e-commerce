'use client'

import { Trash } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { createSizeByStoreId } from '@/actions/sizes/createSizeByStoreId'
import { updateSizeById } from '@/actions/sizes/updateSizeById'
import { useDialog } from '@/hook/dialog/useDialog'

import { sizeFormSchema, SizeFormType } from '@/prisma/formSchemas'
import { Size } from '@prisma/client'

import { Heading } from '@/components/Heading'
import { FormError } from '@/components/form/FormError'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  storeId: string
  size?: Size
}

const formSchema = sizeFormSchema
type FormValues = SizeFormType

export const SizeForm = ({
  storeId,
  size,
}: Props) => {
  const router = useRouter()

  const dialog = useDialog()

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const title = size ? '編輯 Size' : '建立 Size'
  const description = size ? 'Edit a size' : 'Add a new size'
  const action = size ? '變更' : '建立'

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: size || {
      name: '',
      value: '',
    },
  })

  const handleSubmit = (values: FormValues) => {
    setError('')

    // 開始表單提交
    startTransition(async () => {
      if (size) {
        updateSizeById(size.storeId, size.id, values)
          .then((data) => {
            if (data.error) {
              setError(data.error)
            }
            if (data.success) {
              toast.success(data.success)
              router.push(`/${size.storeId}/sizes`)
            }
          })
          .catch((error: Error) => {
            setError(error.message || 'Something went wrong!')
          })
      } else {
        createSizeByStoreId(storeId, values)
          .then((data) => {
            if (data.error) {
              setError(data.error)
            }
            if (data.success) {
              toast.success(data.success)
              router.push(`/${storeId}/sizes`)
            }
          })
          .catch((error: Error) => {
            setError(error.message || 'Something went wrong!')
          })
      }
    })
  }

  return (
    <>
      <div className={'flex items-center justify-between'}>
        <Heading
          title={title}
          description={description}
        />
        {size && (
          <Button
            disabled={isPending}
            variant={'destructive'}
            size={'icon'}
            onClick={() => dialog.onOpen('deleteSize', size)}
          >
            <Trash className={'h-4 w-4'} />
          </Button>
        )}
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
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder={'Name'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name={'value'}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Value
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder={'Value'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={'w-56'}>
            <FormError message={error} />
          </div>
          <Button
            disabled={isPending}
            className={'ml-auto'}
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}