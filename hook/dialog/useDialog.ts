import { create } from 'zustand'
import { Billboard, Category, Color, Order, Product, Size, Store } from '@prisma/client'

// 指定的開啟名稱
export type DialogName =
  | 'createStore'
  | 'deleteStore'
  | 'deleteBillboard'
  | 'deleteSelectedBillboards'
  | 'deleteCategory'
  | 'deleteSelectedCategories'
  | 'deleteSize'
  | 'deleteSelectedSizes'
  | 'deleteColor'
  | 'deleteSelectedColors'
  | 'deleteProduct'
  | 'deleteSelectedProducts'
  | 'deleteOrder'
  | 'deleteSelectedOrders'


// 傳遞指定的資料類型
type DataType =
  | Store
  | Billboard
  | Billboard[]
  | Category
  | Category[]
  | Size
  | Size[]
  | Color
  | Color[]
  | Product
  | Product[]
  | Order
  | Order[]

interface State {
  name: DialogName | null
  // 資料傳遞可選
  data?: DataType
  isOpen: boolean
  onOpen: (name: DialogName, data?: DataType) => void
  onClose: () => void
}

export const useDialog = create<State>((set) => ({
  name: null,
  data: undefined,
  isOpen: false,
  onOpen: (name, data) => set({ name, data, isOpen: true }),
  onClose: () => set({ name: null, isOpen: false }),
}))