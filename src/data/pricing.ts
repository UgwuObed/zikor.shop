import { IPricing } from "../types";

export const tiers: IPricing[] = [
  {
    name: "Starter",
    price: 0,
    yearlyPrice: 0,
    features: [
      "Basic storefront",
      "Up to 100 products",
      "Basic payment integration",
      "Community support"
    ],
  },
  {
    name: "Pro",
    price: 4500,
    yearlyPrice: 45000,
    popular: true,
    features: [
      "Full-featured storefront",
      "Unlimited Products",
      "Instagram product import",
      "AI Business Assistant",
      "Sales channels (WhatsApp, Facebook)",
      "Inventory management",
      "Marketing tools (Bulk SMS, Email)",
      "Auto-invoicing & receipts",
      "Customer database & CRM",
      "Abandoned cart recovery",
      "Basic sales reports",
      "Fast support"
    ],
  },
  {
    name: "Business",
    price: 15000,
    yearlyPrice: 150000,
    features: [
      "Everything in Pro, plus:",
      "Custom domain included",
      "Real-time logistics tracking",
      "Dedicated account representative",
      "Up to 5 team members",
      "Advanced analytics dashboard",
      "Customer behavior insights",
      "Referral links & promo codes",
      "Multiple payment gateways",
      "Priority customer support",
      "Advanced inventory management",
      "Unlimited discounts & coupons"
    ],
  },
];