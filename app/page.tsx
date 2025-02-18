import { Products } from "@/components/products"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to FastCart</h1>
      <p className="text-lg mb-6">Discover our amazing products and shop with ease!</p>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Products</h2>
        <Products />
      </div>
    </main>
  )
}

