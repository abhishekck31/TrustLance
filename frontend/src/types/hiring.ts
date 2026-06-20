/**
 * Type definition for a single public hiring opportunity.
 */
export interface HiringOpportunity {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: number; // Stored as a numeric type
  postedAt: string; // ISO date string from backend
  isPublic: boolean;
}