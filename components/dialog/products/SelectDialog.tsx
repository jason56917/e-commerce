'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Color, Size } from '@prisma/client'

interface Props {
  title: string
  description: string
  data: Size[] | Color[]
  value: string[]
  onChange: (selected: string[]) => void
}

export const SelectDialog = ({
  title,
  description,
  data,
  value,
  onChange,
}: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={'secondary'}
        >
          選擇 {title}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          {title}選擇
        </DialogTitle>
        <DialogDescription>
          {description}
        </DialogDescription>
        <div className={'max-h-48 space-y-2'}>
          {data.map((item) => (
            <div
              key={item.id}
              className={'flex items-center gap-x-2'}
            >
              <Checkbox
                id={item.id}
                checked={value.includes(item.id)}
                onCheckedChange={(checked) => {
                  return checked
                    ? onChange([...value, item.id])
                    : onChange(value.filter((value) => value !== item.id))
                }}
              />
              {item.value.includes('#')
                ? (
                  <Label
                    htmlFor={item.id}
                    className={'flex items-center'}
                  >
                    <div
                      className={'h-5 w-5 rounded-full border'}
                      style={{ backgroundColor: item.value }}
                    />
                    &nbsp;{item.name}
                  </Label>
                )
                : (
                  <Label htmlFor={item.id}>
                    {item.value}
                  </Label>

                )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}