/**
 * TypeScript Types für SubMate
 */

export type BillingCycle = "monthly" | "yearly" | "weekly" | "quarterly";
export type SubscriptionCategory = "streaming" | "software" | "fitness" | "cloud" | "gaming" | "news" | "musik" | "sonstiges";
export type UserRole = "user" | "premium" | "admin";
export type ReminderType = "cancellation" | "renewal" | "price_change";
export type JobStatus = "pending" | "running" | "completed" | "failed";

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    householdSize: number;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    createdAt: string;
    subscriptions?: Subscription[];
}

export interface Subscription {
    id: string;
    name: string;
    price: number;
    billingCycle: BillingCycle;
    nextBillingDate: string;
    cancellationDeadline?: string;
    isActive: boolean;
    notes?: string;
    sharedWith?: string[];
    userId: string;
    categoryId: string;
    category?: Category;
    user?: User;
    reminders?: Reminder[];
    createdAt: string;
    updatedAt: string;
}

export interface Reminder {
    id: string;
    subscriptionId: string;
    reminderDate: string;
    type: ReminderType;
    isActive: boolean;
    message: string;
    subscription?: Subscription;
    createdAt: string;
}

export interface CostAnalysis {
    totalMonthly: number;
    totalYearly: number;
    perPersonMonthly: number;
    perPersonYearly: number;
    byCategory: Record<string, number>;
    upcomingPayments: Array<{
        subscriptionId: string;
        subscriptionName: string;
        dueDate: string;
        amount: number;
    }>;
}

export interface Job {
    id: string;
    type: string;
    status: JobStatus;
    progress: number;
    result?: Record<string, unknown>;
    error?: string;
    userId: string;
    createdAt: string;
    completedAt?: string;
}
