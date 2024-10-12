export interface CustomOrder {
  productName: string;
  description: string;
  image: string | null;
  externalLink: string;
  additionalNotes: string;
  deliveryInfo: DeliveryInfo;
}

export interface Order {
  deliveryInfo: DeliveryInfo;
}

export interface DeliveryInfo {
  id: string;
  fullName: string;
  address: string;
  city: string;
  contactPhone: string;
  deliveryInstructions?: string;
  saveInfo?: boolean;
}
