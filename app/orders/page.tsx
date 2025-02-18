"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface Order {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((orders) => {
        setOrders(
          orders.map((order: any) => ({
            ...order,
            status: "processing",
          })),
        );
      });
  }, []);

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "shipped":
      case "delivered":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My FastCart Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order #{order.id}</h2>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status}</span>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Ordered on: {order.date}</p>
            </div>
            <table className="w-full mb-4">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Item</th>
                  <th className="text-right py-2">Quantity</th>
                  <th className="text-right py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="py-2">{item.name}</td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right font-semibold">
              Total: ${order.total.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
