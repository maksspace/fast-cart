import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ProductProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  onAddToBasket: () => void;
}

export function Product({ product, onAddToBasket }: ProductProps) {
  return (
    <div className="border rounded-lg p-4 flex flex-col">
      <div className="flex-1">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={200}
          height={200}
          className="mb-4 w-full"
        />
      </div>
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-600 mb-4">${product.price}</p>
      <Button onClick={onAddToBasket} className="mt-auto">
        Add to Basket
      </Button>
    </div>
  );
}
