"use client";

import { useContext, useState } from "react";
import { BasketContext } from "./basket-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, CheckCircle2, XCircle, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for saved credit cards
const savedCards = [
  { id: "1", last4: "4242", brand: "visa" },
  { id: "2", last4: "9012", brand: "amex" },
];

export function Basket() {
  const { basket, removeFromBasket, clearBasket } = useContext(BasketContext);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [selectedCard, setSelectedCard] = useState<string>(savedCards[0].id);
  const { toast } = useToast();

  const total = basket.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    fetch("/api/checkout");

    // Simulate API call with a 7-second delay
    await new Promise((resolve) => setTimeout(resolve, 7000));

    // Randomly determine if checkout is successful (95% success rate)
    const isSuccessful = Math.random() > 0.95;

    const selectedCardDetails = savedCards.find(
      (card) => card.id === selectedCard,
    );

    if (isSuccessful) {
      setCheckoutStatus("success");
      clearBasket();
      toast({
        title: "Order Placed",
        description: `Your FastCart order has been successfully placed using your ${selectedCardDetails?.brand.toUpperCase()} card ending in ${selectedCardDetails?.last4}.`,
      });
    } else {
      setCheckoutStatus("error");
      toast({
        title: "Checkout Failed",
        description: "We couldn't process your order. Please try again.",
        variant: "destructive",
      });
    }
    setIsCheckingOut(false);
  };

  const resetCheckout = () => {
    setCheckoutStatus("idle");
  };

  return (
    <Sheet onOpenChange={(open) => !open && resetCheckout()}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {basket.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {basket.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your FastCart Basket</SheetTitle>
          <SheetDescription>
            {basket.length === 0
              ? "Your basket is empty"
              : `You have ${basket.length} item(s) in your basket`}
          </SheetDescription>
        </SheetHeader>
        {checkoutStatus === "success" ? (
          <div className="flex flex-col items-center justify-center h-full">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Order Successful!</h2>
            <p className="text-center mb-4">
              Your FastCart order has been successfully processed.
            </p>
            <Button onClick={resetCheckout}>Continue Shopping</Button>
          </div>
        ) : checkoutStatus === "error" ? (
          <div className="flex flex-col items-center justify-center h-full">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Checkout Failed</h2>
            <p className="text-center mb-4">
              We couldn't process your order. Please try again.
            </p>
            <Button onClick={resetCheckout}>Try Again</Button>
          </div>
        ) : (
          <>
            {basket.length > 0 && (
              <div className="mt-4 space-y-4">
                {basket.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        ${item.price} x {item.quantity}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFromBasket(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <p className="font-semibold text-lg">
                    Total: ${total.toFixed(2)}
                  </p>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">
                    Select Payment Method
                  </h3>
                  <Select value={selectedCard} onValueChange={setSelectedCard}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a card" />
                    </SelectTrigger>
                    <SelectContent>
                      {savedCards.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                          <div className="flex items-center">
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>
                              {card.brand.toUpperCase()} **** {card.last4}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Checkout"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
