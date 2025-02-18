import { getAllProducts } from "./products-service";

export async function GET() {
  try {
    const products = await getAllProducts();
    return Response.json(products);
  } catch (err) {
    console.log(err);
  }
}
