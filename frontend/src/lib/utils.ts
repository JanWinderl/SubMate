import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BillingCycle } from "@/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Formatiert einen Preis als EUR-Währung
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
    }).format(amount);
}

/**
 * Formatiert ein Datum im deutschen Format
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

/**
 * Berechnet den monatlichen Preis basierend auf dem Abrechnungszyklus
 */
export function getMonthlyPrice(price: number, cycle: BillingCycle): number {
    switch (cycle) {
        case "weekly":
            return price * 4.33;
        case "monthly":
            return price;
        case "quarterly":
            return price / 3;
        case "yearly":
            return price / 12;
        default:
            return price;
    }
}

/**
 * Gibt das deutsche Label für einen Abrechnungszyklus zurück
 */
export function getBillingCycleLabel(cycle: BillingCycle): string {
    const labels: Record<BillingCycle, string> = {
        weekly: "Wöchentlich",
        monthly: "Monatlich",
        quarterly: "Vierteljährlich",
        yearly: "Jährlich",
    };
    return labels[cycle];
}

/**
 * Berechnet die Tage bis zu einem Datum
 */
export function getDaysUntil(dateString: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Gibt eine Urgency-Klasse basierend auf Tagen zurück
 */
export function getUrgencyClass(days: number): string {
    if (days <= 3) return "text-destructive";
    if (days <= 7) return "text-warning";
    return "text-muted-foreground";
}
