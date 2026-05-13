export type CustomerSegment = 'Retail' | 'Priority' | 'Wealth';

export interface Customer {
  CIF: string;
  name: string;
  nationalId: string;
  segment: CustomerSegment;
  email: string;
  phone: string;
}
