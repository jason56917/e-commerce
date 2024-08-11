'use client'

import { Trash } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { createProductByStoreId } from '@/actions/products/createProductByStoreId'
import { updateProductById } from '@/actions/products/updateProductById'
import { useDialog } from '@/hook/dialog/useDialog'

import { useEdgeStore } from '@/lib/edgestore'

import { productFormSchema, ProductFormType } from '@/prisma/formSchemas'
import { Category, Color, Image, Product, Size } from '@prisma/client'

import { Heading } from '@/components/Heading'
import { FormError } from '@/components/form/FormError'
import { UploadMultiImage } from '@/components/edgestore/UploadMultiImage'
import { SelectDialog } from '@/components/dialog/products/SelectDialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { deleteImageByUrl } from '@/actions/images/DeleteImageByUrl'
import { createImageByProductId } from '@/actions/images/createImageByProductId'

interface Props {
  storeId: string
  product?: Product & { images: Image[] }
  categories?: Category[]
  sizes?: Size[]
  colors?: Color[]
}

const formSchema = productFormSchema
type FormValues = ProductFormType

export const ProductForm = ({
  storeId,
  product,
  categories,
  sizes,
  colors,
}: Props) => {
  const router = useRouter()
  const { edgestore } = useEdgeStore()
  const dialog = useDialog()

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  // 儲存檔案給edgestore上傳
  const [files, setFiles] = useState<File[]>([])
  // 紀錄上傳進度
  const [progress, setProgress] = useState<number>()
  // 儲存選擇的圖片產生的暫時連結或既有的圖片連結
  const [previewUrls, setPreviewUrls] = useState<string[]>(product?.images.map((image) => image.imageUrl) || [])

  const title = product ? '編輯 Product' : '建立 Product'
  const description = product ? 'Edit a product' : 'Add a new product'
  const action = product ? '變更' : '建立'

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: product || {
      name: '',
      price: undefined,
      categoryId: '',
      images: [],
      sizeIds: [],
      colorIds: [],
      isFeatured: true,
      isArchived: false,
    },
  })

  // 已有產品的情況下才會有刪除圖片
  const handleDeleteImage = async () => {
    try {
      // 仍然存在沒有被刪除的圖片連結
      const stillExistedImageUrls = previewUrls.filter((url) => url.includes('edgestore'))
        .filter((url) => url.includes('edgestore'))
      const setB = new Set(stillExistedImageUrls)
      // 跟原本的圖片連結比對，過去出被刪除的圖片連結
      const removedImageUrl = product?.images.map((image) => image.imageUrl)
        .filter((x) => !setB.has(x))
      if (removedImageUrl) {
        removedImageUrl?.map(async (imageUrl) => {
          await edgestore.publicFiles.delete({ url: imageUrl })
          await deleteImageByUrl(imageUrl)
            .then((data) => {
              if (data.success) {
                toast.success(data.success)
              }
            })
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUploadImage = async () => {
    if (files.length > 0) {
      // 如果已有產品
      if (product) {
        await Promise.all(
          files.map(async (file) => {
            const res = await edgestore.publicFiles.upload({
              file,
              onProgressChange: (process) => {
                setProgress(process)
              },
            })
            // 直接新增照片，不經由表單來新增照片
            // 因為此時已有產品id可登記
            await createImageByProductId(product?.id, res.url)
              .then((data) => {
                if (data.success) {
                  toast.success(data.success)
                }
              })
          })
        )
      } else {
        // 否則由建立產品時一併建立
        const uploadUrls: string[] = []

        // map不會等待異步處理，需使用Promise.all來確保
        await Promise.all(
          files.map(async (file) => {
            const res = await edgestore.publicFiles.upload({
              file,
              onProgressChange: (process) => {
                setProgress(process)
              },
            })
            uploadUrls.push(res.url)
          })
        )
        form.setValue('images', uploadUrls.map((url) => ({ imageUrl: url })))
      }
    }
  }

  const handleSubmit = (values: FormValues) => {
    setError('')

    // 開始表單提交
    startTransition(async () => {
      // 如果有新文件，先上傳圖片
      // if (files.length > 0) {
      // 如果有舊照片先刪除
      await handleDeleteImage()
      // 再上傳新照片
      await handleUploadImage()
      // }

      // 因參數values的imageUrl仍然是預覽照片的url
      // 因此需要更新為執行上傳照片後，表單欄位imageUrl的最新值
      const updatedValues = {
        ...values,
        images: form.getValues('images'),
      }

      if (product) {
        updateProductById(product.storeId, product.id, updatedValues)
          .then((data) => {
            if (data.error) {
              setError(data.error)
            }
            if (data.success) {
              toast.success(data.success)
              router.push(`/${product.storeId}/products`)
            }
          })
          .catch((error: Error) => {
            setError(error.message || 'Something went wrong!')
          })
      } else {
        createProductByStoreId(storeId, updatedValues)
          .then((data) => {
            if (data.error) {
              setError(data.error)
            }
            if (data.success) {
              toast.success(data.success)
              router.push(`/${storeId}/products`)
            }
          })
          .catch((error: Error) => {
            setError(error.message || 'Something went wrong!')
          })
      }
    })
  }

  // 用來繞過zod的欄位檢測
  useEffect(() => {
    form.setValue('images', previewUrls.map((url) => ({ imageUrl: url })))
  }, [previewUrls, form])

  return (
    <>
      <div className={'flex items-center justify-between'}>
        <Heading
          title={title}
          description={description}
        />
        {product && (
          <Button
            disabled={isPending}
            variant={'destructive'}
            size={'icon'}
            onClick={() => dialog.onOpen('deleteProduct', product)}
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
            name={'images'}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Upload multiple product images
                </FormLabel>
                <UploadMultiImage
                  setFiles={setFiles}
                  files={files}
                  setPreviewUrls={setPreviewUrls}
                  previewUrls={previewUrls}
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
          <FormField
            name={'categoryId'}
            control={form.control}
            render={({ field }) => (
              <FormItem className={'w-48'}>
                <FormLabel>
                  Category
                </FormLabel>
                <FormControl>
                  <Select
                    disabled={isPending}
                    defaultValue={field.value}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder={'Select a category'}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className={'max-w-[768px] grid grid-cols-1 md:grid-cols-2 gap-8'}>
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
              name={'price'}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Price
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={'number'}
                      step={'0.01'}
                      disabled={isPending}
                      placeholder={'9.99'}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        // 正則表達式限制輸入值最多兩位小數
                        const regex = /^\d*\.?\d{0,2}$/

                        if (regex.test(value)) {
                          field.onChange(value) // 更新表單值
                        } else {
                          // 如果輸入不符合規則，則重新設置為合法值
                          field.onChange(value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1'))
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {sizes && (
              <FormField
                name={'sizeIds'}
                control={form.control}
                render={({ field }) => (
                  <FormItem className={'flex flex-col'}>
                    <FormLabel>
                      Sizes
                    </FormLabel>
                    <FormControl>
                      <SelectDialog
                        title={'尺寸'}
                        description={'可複選'}
                        data={sizes}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    {form.getValues('sizeIds')
                      .map((sizeId) => (
                        <div
                          key={sizeId}
                          className={'flex items-center text-sm text-muted-foreground leading-3'}
                        >
                          {sizes.filter((size) => size.id === sizeId)[0].value}: {sizes.filter((size) => size.id === sizeId)[0].name}
                        </div>
                      ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {colors && (
              <FormField
                name={'colorIds'}
                control={form.control}
                render={({ field }) => (
                  <FormItem className={'flex flex-col'}>
                    <FormLabel>
                      Colors
                    </FormLabel>
                    <FormControl>
                      <SelectDialog
                        title={'顏色'}
                        description={'可複選'}
                        data={colors}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    {form.getValues('colorIds')
                      .map((colorId) => {
                        const name = colors.filter((color) => color.id === colorId)[0].name
                        const value = colors.filter((color) => color.id === colorId)[0].value

                        return (
                          <div
                            key={colorId}
                            className={'flex items-center leading-3 text-sm text-muted-foreground'}
                          >
                            <div
                              className={'h-3 w-3 border rounded-full mr-2'}
                              style={{ backgroundColor: value }}
                            />
                            {name}
                          </div>
                        )
                      })}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              name={'isFeatured'}
              control={form.control}
              render={({ field }) => (
                <FormItem className={'flex items-start space-x-3 space-y-0 border p-4 rounded-md'}>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className={'space-y-1 leading-none'}>
                    <FormLabel>
                      Featured
                    </FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={'isArchived'}
              control={form.control}
              render={({ field }) => (
                <FormItem className={'flex items-start space-x-3 space-y-0 border p-4 rounded-md'}>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className={'space-y-1 leading-none'}>
                    <FormLabel>
                      Archived
                    </FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store
                    </FormDescription>
                  </div>
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