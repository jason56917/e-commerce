'use client'

import { Trash } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { createColorByStoreId } from '@/actions/colors/createColorByStoreId'
import { updateColorById } from '@/actions/colors/updateColorById'
import { useDialog } from '@/hook/dialog/useDialog'

import { colorFormSchema, ColorFormType } from '@/prisma/formSchemas'
import { Color } from '@prisma/client'

import { Heading } from '@/components/Heading'
import { FormError } from '@/components/form/FormError'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  storeId: string
  color?: Color
}

const formSchema = colorFormSchema
type FormValues = ColorFormType

export const ColorForm = ({
  storeId,
  color,
}: Props) => {
  const router = useRouter()

  const dialog = useDialog()

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const title = color ? '編輯 Color' : '建立 Color'
  const description = color ? 'Edit a color' : 'Add a new color'
  const action = color ? '變更' : '建立'

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: color || {
      name: '',
      value: '',
    },
  })

  const handleSubmit = (values: FormValues) => {
    setError('')

    // 開始表單提交
    startTransition(async () => {
      if (color) {
        updateColorById(color.storeId, color.id, values)
          .then((data) => {
            if (data.error) {
              setError(data.error)
            }
            if (data.success) {
              toast.success(data.success)
              router.push(`/${color.storeId}/colors`)
            }
          })
          .catch((error: Error) => {
            setError(error.message || 'Something went wrong!')
          })
      } else {
        createColorByStoreId(storeId, values)
          .then((data) => {
            if (data.error) {
              setError(data.error)
            }
            if (data.success) {
              toast.success(data.success)
              router.push(`/${storeId}/colors`)
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
        {color && (
          <Button
            disabled={isPending}
            variant={'destructive'}
            color={'icon'}
            onClick={() => dialog.onOpen('deleteColor', color)}
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
                    <div className={'flex items-center gap-x-4'}>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder={'#FFFC00'}
                      />
                      <div
                        className={'border p-4 rounded-full'}
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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