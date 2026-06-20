export interface Activity {
  id: number;
  title: string;
  description: string;
  date: string; // Stored as string from backend, should be handled carefully if complex date logic is needed on the client
  type: string;
  details?: string;
}