// Payment service — Paystack initialize + verify.
import { api } from "@/lib/api/http";
import { Endpoints } from "@/lib/api/endpoints";
import type { PaymentInit } from "@/lib/domain/models";

export const paymentApi = {
  initialize(plan: "weekly" | "monthly"): Promise<PaymentInit> {
    return api<PaymentInit>(Endpoints.payment.initialize, { method: "POST", body: { plan } });
  },
  verify(reference: string): Promise<void> {
    return api(Endpoints.payment.verify, { method: "POST", body: { reference } }).then(() => {});
  },
};
