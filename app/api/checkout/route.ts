import { CheckoutRequestSchema } from "./request-schema";
import {
  getProductStock,
  chargeCustomer,
  saveOrder,
  calculateTotal,
} from "./checkout-service";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = CheckoutRequestSchema.safeParse(body);

  if (!parsed.success) {
    return new Response(`Invalid checkout request: ${parsed.error}`, {
      status: 400,
    });
  }

  const { customerId, items, paymentMethodId } = parsed.data;

  // Check product availability
  for (const item of items) {
    const stock = await getProductStock(item.productId);
    if (stock < item.amount) {
      return new Response(`Not enough stock for product: ${item.productId}`, {
        status: 400,
      });
    }
  }

  // Calculate total amount
  const totalAmount = await calculateTotal(items);

  // Charge customer
  const chargeResult = await chargeCustomer(
    customerId,
    totalAmount,
    paymentMethodId,
  );
  if (!chargeResult.success) {
    return new Response(`Payment failed: ${chargeResult.error}`, {
      status: 402,
    });
  }

  // Save order
  const order = await saveOrder(
    customerId,
    items,
    totalAmount,
    chargeResult.transactionId,
  );

  return new Response(JSON.stringify({ success: true, orderId: order.id }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
