"use client";

import { useContext, useEffect, useState } from "react";
import { Product } from "./product";
import { BasketContext } from "./basket-provider";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function Products() {
  const { addToBasket } = useContext(BasketContext);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (loading) {
      return;
    }

    setLoading(true);

    fetch("/api/products")
      .then((res) => res.json())
      .then((products) => {
        setProducts(products);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddToBasket = (product: any) => {
    addToBasket(product);
    toast({
      title: "Added to basket",
      description: `${product.name} has been added to your basket.`,
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(15)].map((_, index) => (
          <div key={index} className="border rounded-lg p-4 flex flex-col">
            <Skeleton className="h-[200px] w-full mb-4" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-10 w-full mt-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Product
          key={product.id}
          product={product}
          onAddToBasket={() => handleAddToBasket(product)}
        />
      ))}
    </div>
  );
}
