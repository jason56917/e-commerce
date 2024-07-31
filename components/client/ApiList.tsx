'use client'

import { ApiAlert } from '../ApiAlert'

interface Props {
  storeId: string
  route: string
}

export const ApiList = ({
  storeId,
  route,
}: Props) => {
  return (
    <>
      <ApiAlert
        variant='public'
        title='GET'
        description={`${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}/${route}`}
      />
    </>
  )
}