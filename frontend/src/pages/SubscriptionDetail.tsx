import { useParams, Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRole } from "@/contexts/RoleContext";
import {
    ArrowLeft,
    Edit,
    Trash2,
    Bell,
    Share2,
    PlayCircle,
} from "lucide-react";
import { formatCurrency, formatDate, getBillingCycleLabel, getDaysUntil } from "@/lib/utils";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { useEffect, useState } from "react";
import { ReminderData } from "@/components/dialogs/ReminderDialog";
import { api } from "@/lib/api";
import { SubscriptionDialog, SubscriptionData } from "@/components/dialogs/SubscriptionDialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function SubscriptionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isPremium } = useRole();
    const { subscriptions, updateSubscription, deleteSubscription } = useSubscriptions();
    const [reminders, setReminders] = useState<ReminderData[]>([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

    const subscription = subscriptions.find(s => s.id === id);

    const handleSave = async (data: SubscriptionData) => {
        if (!data.id) {
            return;
        }
        try {
            await updateSubscription(data.id, data);
            toast.success("Abo aktualisiert", {
                description: `${data.name} wurde erfolgreich aktualisiert.`,
            });
        } catch (error) {
            toast.error("Fehler beim Speichern", {
                description: "Das Abo konnte nicht gespeichert werden.",
            });
        }
    };

    const handleConfirmCancel = async () => {
        if (!subscription) {
            return;
        }
        try {
            await deleteSubscription(subscription.id);
            toast.success("Abo gekündigt", {
                description: `${subscription.name} wurde gelöscht.`,
            });
            setCancelDialogOpen(false);
            navigate("/subscriptions");
        } catch (error) {
            toast.error("Fehler beim Kündigen", {
                description: "Das Abo konnte nicht gekündigt werden.",
            });
        }
    };

    useEffect(() => {
        const loadReminders = async () => {
            if (!subscription) return;
            try {
                // Hier könnten wir später nach subscriptionId filtern, 
                // aktuell laden wir alle und filtern client-seitig (oder zeigen allgemeine an)
                // Da das Backend noch keine Relation explizit exposed für den Client in getAll,
                // zeigen wir hier vorerst allgemeine Erinnerungen oder keine an.
                // Besser: Wir lassen die Erinnerungs-Karte vorerst leer oder zeigen nur relevante
                // Erinnerungen an, die wir im Frontend filtern können (wenn wir sie hätten).
                // Für jetzt: Lade alle und filtere (simuliert) oder lasse es leer.
                const allReminders = await api.reminders.getAll();
                // Filterlogik müsste hier rein, wenn Reminders eine subscriptionId hätten.
                // Aktuelles Reminder-Modell im Frontend hat kein subscriptionId Feld sichtbar in Types,
                // aber vielleicht im Backend. 
                // Wir zeigen einfach keine Hardcoded-Daten mehr an.
                setReminders(allReminders as ReminderData[]);
            } catch (e) {
                console.error(e);
            }
        };
        loadReminders();
    }, [subscription]);

    if (!subscription) {
        return (
            <MainLayout>
                <div className="container py-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">Abo nicht gefunden</h1>
                    <Button asChild>
                        <Link to="/subscriptions">Zurück zur Übersicht</Link>
                    </Button>
                </div>
            </MainLayout>
        );
    }

    const daysUntilBilling = getDaysUntil(subscription.nextBillingDate);
    // cancellationDate existiert noch nicht im Backend-Model, daher Fallback auf nextBillingDate oder wir blenden es aus
    const cancellationDeadline = subscription.nextBillingDate;
    const daysUntilCancellation = getDaysUntil(cancellationDeadline);

    return (
        <MainLayout>
            <div className="container py-8">
                {/* Back Button */}
                <Button variant="ghost" className="mb-4" asChild>
                    <Link to="/subscriptions">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Zurück zu allen Abos
                    </Link>
                </Button>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="flex h-16 w-16 items-center justify-center rounded-xl"
                                            style={{ backgroundColor: subscription.color + "20", color: subscription.color }}
                                        >
                                            <PlayCircle className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl">{subscription.name}</CardTitle>
                                            <CardDescription>{subscription.category}</CardDescription>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Kosten</p>
                                            <p className="text-3xl font-bold">{formatCurrency(subscription.price)}</p>
                                            <p className="text-sm text-muted-foreground">{getBillingCycleLabel(subscription.billingCycle)}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Nächste Zahlung</p>
                                            <p className="font-medium">{formatDate(subscription.nextBillingDate)}</p>
                                            <p className="text-sm text-muted-foreground">in {daysUntilBilling} Tagen</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Status</p>
                                            <span className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${subscription.isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                                                {subscription.isActive ? "Aktiv" : "Inaktiv"}
                                            </span>
                                        </div>
                                        <Separator />
                                        {daysUntilCancellation !== null && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Kündigungsfrist</p>
                                                <p className="font-medium">{formatDate(cancellationDeadline)}</p>
                                                <p className={`text-sm ${daysUntilCancellation <= 7 ? "text-warning" : "text-muted-foreground"}`}>
                                                    in {daysUntilCancellation} Tagen
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Notes section removed as not currently supported by backend */}
                            </CardContent>
                        </Card>

                        {/* History / Reminders */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Erinnerungen
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {reminders.length > 0 ? (
                                        reminders.map(r => (
                                            <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border">
                                                <div>
                                                    <p className="font-medium">{r.title}</p>
                                                    <p className="text-sm text-muted-foreground">{formatDate(r.reminderDate)}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-4">Keine Erinnerungen</p>
                                    )}
                                </div>
                                <Button variant="outline" className="w-full mt-4" asChild>
                                    <Link to="/reminders">
                                        <Bell className="mr-2 h-4 w-4" />
                                        Erinnerungen verwalten
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Aktionen</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => setEditDialogOpen(true)}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Abo ändern
                                </Button>
                                {isPremium && (
                                    <Button variant="outline" className="w-full justify-start">
                                        <Share2 className="mr-2 h-4 w-4" />
                                        Abo teilen
                                    </Button>
                                )}
                                <Button
                                    variant="destructive"
                                    className="w-full justify-start"
                                    onClick={() => setCancelDialogOpen(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Abo kündigen
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Shared With - Placeholder for now as backend doesn't support sharing yet */}
                        {/* 
                                <Card>
                                   ...
                                </Card>
                                */}

                        {/* Meta Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Hinzugefügt am</span>
                                    {/* createAt ist nicht im Subscription Interface, daher lassen wir es weg oder nehmen Fallback */}
                                    <span>-</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">ID</span>
                                    <span className="font-mono text-xs">{id}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <SubscriptionDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                subscription={subscription as SubscriptionData}
                onSave={handleSave}
            />

            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Abo kündigen</DialogTitle>
                        <DialogDescription>
                            Möchtest du das Abo „{subscription.name}“ wirklich kündigen? Diese Aktion kann nicht
                            rückgängig gemacht werden.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                            Abbrechen
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmCancel}>
                            Ja, Abo kündigen
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}
