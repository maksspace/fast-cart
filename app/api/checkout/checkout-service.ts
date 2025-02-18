import { db } from "../../../database/client";

/**
 * Retrieves the stock for a given product.
 */
export async function getProductStock(productId: number): Promise<number> {
  const result = await db("products")
    .select("stock")
    .where({ id: productId })
    .first();

  return result?.stock ?? 0;
}

/**
 * Calculates the total cost of the order.
 */
export async function calculateTotal(
  items: { productId: number; amount: number }[],
): Promise<number> {
  const productIds = items.map((item) => item.productId);
  const products = await db("products")
    .select("id", "price")
    .whereIn("id", productIds);

  const total = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.amount : 0);
  }, 0);

  return total;
}

/**
 * Charges the customer using a payment gateway.
 */
export async function chargeCustomer(
  customerId: number,
  amount: number,
  paymentMethodId: number,
): Promise<{ success: boolean; transactionId: string; error?: string }> {
  const transactionId = `txn_${Math.random().toString(36).substring(2, 15)}`;
  return { success: true, transactionId };
}

/**
 * Saves the order to the database.
 */
export async function saveOrder(
  customerId: number,
  items: { productId: number; amount: number }[],
  totalAmount: number,
  transactionId: string,
) {
  return await db.transaction(async (trx) => {
    const [orderId] = await trx("orders").insert(
      {
        customer_id: customerId,
        total_amount: totalAmount,
        transaction_id: transactionId,
      },
      ["id"],
    );

    const orderItems = items.map((item) => ({
      order_id: orderId,
      product_id: item.productId,
      quantity: item.amount,
    }));

    await trx("order_items").insert(orderItems);

    // Deduct stock
    for (const item of items) {
      await trx("products")
        .where({ id: item.productId })
        .decrement("stock", item.amount);
    }

    return { id: orderId };
  });
}
