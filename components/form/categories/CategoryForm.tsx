'use client'

import { Trash } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { createCategoryByStoreId } from '@/actions/categories/createCategoryByStoreId'
import { updateCategoryById } from '@/actions/categories/updateCategoryById'
import { useDialog } from '@/hook/dialog/useDialog'

import { useEdgeStore } from '@/lib/edgestore'

import { categoryFormSchema, CategoryFormType } from '@/prisma/formSchemas'
import { Category } from '@prisma/client'

import { Heading } from '@/components/Heading'
import { FormError } from '@/components/form/FormError'
import { UploadSingleImage } from '@/components/edgestore/UploadSingleImage'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  storeId: string
  category?: Category
}

const formSchema = categoryFormSchema
type FormValues = CategoryFormType

export const CategoryForm = ({
  storeId,
  category,
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

  const title = category ? '編輯 Category' : '建立 Category'
  const description = category ? 'Edit a category' : 'Add a new category'
  const action = category ? '變更' : '建立'

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: category || {
      name: '',
      imageUrl: '',
    },
  })

  const handleDeleteImage = async () => {
    try {
      if (file && category?.imageUrl) {
        await edgestore.publicFiles.delete({ url: category.imageUrl })
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

      if (category) {
        updateCategoryById(category.storeId, category.id, updatedValues)
          .then((data) => {
            if (data.error) {
              setError(data.error)
            }
            if (data.success) {
              toast.success(data.success)
              router.push(`/${category.storeId}/categories`)
            }
          })
          .catch((error: Error) => {
            setError(error.message || 'Something went wrong!')
          })
      } else {
        createCategoryByStoreId(storeId, updatedValues)
          .then((data) => {
            if (data.error) {
              setError(data.error)
            }
            if (data.success) {
              toast.success(data.success)
              router.push(`/${storeId}/categories`)
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
        {category && (
          <Button
            disabled={isPending}
            variant={'destructive'}
            size={'icon'}
            onClick={() => dialog.onOpen('deleteCategory', category)}
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
                  Upload a category image
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