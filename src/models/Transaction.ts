export interface Transaction {
  id?: number;
  user_id: number;
  amount: number;
  service_id: number;
  provider_id: number;
  type_id: number;
}
