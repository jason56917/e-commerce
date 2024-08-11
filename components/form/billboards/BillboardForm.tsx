'use client'

import { Trash } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { createBillboardByStoreId } from '@/actions/billboards/createBillboardByStoreId'
import { updateBillboardById } from '@/actions/billboards/updateBillboardById'
import { useDialog } from '@/hook/dialog/useDialog'

import { useEdgeStore } from '@/lib/edgestore'

import { billboardFormSchema, BillboardFormType } from '@/prisma/formSchemas'
import { Billboard } from '@prisma/client'

import { Heading } from '@/components/Heading'
import { FormError } from '@/components/form/FormError'
import { UploadSingleImage } from '@/components/edgestore/UploadSingleImage'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  storeId: string
  billboard?: Billboard
}

const formSchema = billboardFormSchema
type FormValues = BillboardFormType

export const BillboardForm = ({
  storeId,
  billboard,
}: Props) => {
  const router = useRouter()

  const { edgestore } = useEdgeStore()

  const dialog = useDialog()

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  // 儲存檔案給edgestore上傳
  const [file, setFile] = useState<File>()
  // 紀錄上傳進度
  const [progress, setProgress] = useState<number>()

  const title = billboard ? '編輯 Billboard' : '建立 Billboard'
  const description = billboard ? 'Edit a billboard' : 'Add a new billboard'
  const action = billboard ? '變更' : '建立'

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: billboard || {
      name: '',
      imageUrl: '',
    },
  })

  const handleDeleteImage = async () => {
    try {
      if (file && billboard?.imageUrl) {
        await edgestore.publicFiles.delete({ url: billboard.imageUrl })
        toast.success('舊圖片已刪除!')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUploadImage = async () => {
    if (file) {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (process) => {
          setProgress(process)
        },
      })
      form.setValue('imageUrl', res.url)
    }
  }

  const handleSubmit = (values: FormValues) => {
    setError('')

    // 開始表單提交
    startTransition(async () => {
      // 如果有新文件，先上傳圖片
      if (file) {
        // 如果有舊照片先刪除
        await handleDeleteImage()
        // 再上傳新照片
        await handleUploadImage()
      }

      // 因參數values的imageUrl仍然是預覽照片的url
      // 因此需要更新為執行上傳照片後，表單欄位imageUrl的最新值
      const updatedValues = {
        ...values,
        imageUrl: form.getValues('imageUrl'),
      }

      if (billboard) {
        updateBillboardById(billboard.storeId, billboard.id, updatedValues)
          .then((data) => {
            if (data.error) {
              setError(data.error)
            }
            if (data.success) {
              toast.success(data.success)
              router.push(`/${billboard.storeId}/billboards`)
            }
          })
          .catch((error: Error) => {
            setError(error.message || 'Something went wrong!')
          })
      } else {
        createBillboardByStoreId(storeId, updatedValues)
          .then((data) => {
            if (data.error) {
              setError(data.error)
            }
            if (data.success) {
              toast.success(data.success)
              router.push(`/${storeId}/billboards`)
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
        {billboard && (
          <Button
            disabled={isPending}
            variant={'destructive'}
            size={'icon'}
            onClick={() => dialog.onOpen('deleteBillboard', billboard)}
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
          <FormField
            name={'imageUrl'}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Upload a billboard image
                </FormLabel>
                <UploadSingleImage
                  setFile={setFile}
                  setPreviewUrl={field.onChange}
                  previewUrl={field.value}
                />
                {progress !== undefined && progress !== 100 && (
                  <div>
                    上傳中... {progress}%
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
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