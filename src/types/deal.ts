export type DealStatus =
  | "new"
  | "site_visit"
  | "negotiation"
  | "token_paid"
  | "agreement"
  | "registration"
  | "closed"
  | "cancelled";

export interface Deal {
  _id: string;
  dealNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  propertyTitle: string;
  finalPrice: number;
  status: DealStatus;
  createdAt: string;
}