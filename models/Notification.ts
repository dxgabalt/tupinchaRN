export interface Notification {
  id?: number;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  type_id: number;
}
