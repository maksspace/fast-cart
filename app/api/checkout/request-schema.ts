import z from "zod";

export const CheckoutRequestSchema = z.object({
  customerId: z.number().int().default(1),
  paymentMethodId: z.number().int(),
  items: z.array(
    z.object({
      productId: z.number().int(),
      amount: z.number().int(),
    }),
  ),
});
