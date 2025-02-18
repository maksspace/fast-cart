"use client"

import type React from "react"
import { createContext, useState, useCallback } from "react"

interface BasketItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface BasketContextType {
  basket: BasketItem[]
  addToBasket: (product: { id: number; name: string; price: number }) => void
  removeFromBasket: (id: number) => void
  clearBasket: () => void
}

export const BasketContext = createContext<BasketContextType>({
  basket: [],
  addToBasket: () => {},
  removeFromBasket: () => {},
  clearBasket: () => {},
})

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [basket, setBasket] = useState<BasketItem[]>([])

  const addToBasket = useCallback((product: { id: number; name: string; price: number }) => {
    setBasket((prevBasket) => {
      const existingItem = prevBasket.find((item) => item.id === product.id)
      if (existingItem) {
        return prevBasket.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prevBasket, { ...product, quantity: 1 }]
      }
    })
  }, [])

  const removeFromBasket = useCallback((id: number) => {
    setBasket((prevBasket) => prevBasket.filter((item) => item.id !== id))
  }, [])

  const clearBasket = useCallback(() => {
    setBasket([])
  }, [])

  return (
    <BasketContext.Provider value={{ basket, addToBasket, removeFromBasket, clearBasket }}>
      {children}
    </BasketContext.Provider>
  )
}

