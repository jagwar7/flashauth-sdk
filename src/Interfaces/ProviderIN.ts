export type provider = "google" | "facebook" | "github" | "local" | "linkedin";
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}
