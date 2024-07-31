'use client'

import { Trash } from 'lucide-react'
import Image from 'next/image'

import { Input } from '../ui/input'

interface Props {
  // 若要使用callback函式時，需使用此定義
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
  files: File[]
  setPreviewUrls: React.Dispatch<React.SetStateAction<string[]>>
  previewUrls: string[]
}

export const UploadMultiImage = ({
  setFiles,
  files,
  setPreviewUrls,
  previewUrls,
}: Props) => {
  const handleClearUrl = (index: number) => {
    // 若沒有重新定義類型會發生typescript錯誤
    setPreviewUrls((prev: string[]) => prev.filter((_, i) => i !== index))
    setFiles((prev: File[]) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className={'space-y-2'}>
      <div className={'flex flex-col space-y-2 justify-between'}>
        {/* 預覽選擇的照片 */}
        <div className={'flex flex-wrap gap-x-2'}>
          {previewUrls?.map((previewUrl, index) => (
            <div
              key={previewUrl}
              className={'relative mt-2 h-48 w-48'}
            >
              <Image
                src={previewUrl}
                alt={'Preview'}
                fill
                className={'rounded-md object-cover'}
              />
              <Trash
                onClick={() => handleClearUrl(index)}
                className={'absolute top-2 right-2 bg-red-500 rounded-md p-1 cursor-pointer'}
              />
            </div>
          ))}
        </div>

        {/* 新建照片 */}
        <div className={'flex flex-col w-48'}>
          <Input
            type={'file'}
            accept={'image/*'}
            onChange={(e) => {
              const selectedFile = e.target.files?.[0]
              if (selectedFile) {
                const objectUrl = URL.createObjectURL(selectedFile)
                // 若沒有重新定義類型會發生typescript錯誤
                setPreviewUrls([...previewUrls, objectUrl])
                setFiles([...files, selectedFile])
              }
              // 清空輸入欄位值
              e.target.value = ''
            }}
            className={'focus-visible:ring-0 focus-visible:ring-offset-0'}
          />
        </div>
      </div>
    </div>
  )
}