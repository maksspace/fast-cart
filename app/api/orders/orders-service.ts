import { db } from "@/database/client";

export async function getAllOrders() {
  try {
    const products = await db("orders").select(
      "id",
      "name",
      "price",
      "image",
      "stock",
    );

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}
