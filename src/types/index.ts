export interface MenuItem {
  id: string
  name: string
  description: string
  price: string // e.g. "$18.00" — string for formatting flexibility
  category: MenuCategory
  imageSrc?: string // relative path or vite-imagetools import result
  image?: string
  imageAlt?: string
  featured?: boolean // drives DishCard featured variant (Epic 3 Story 3.4)
}

export type MenuCategory = 'starters' | 'mains' | 'sides' | 'drinks' | 'desserts'

export type TonalZone = 'dark' | 'warm' | 'gradient'
