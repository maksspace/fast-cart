import { getAllProducts } from "./products-service";

export async function GET() {
  const products = await getAllProducts();

  return Response.json(products);
}
