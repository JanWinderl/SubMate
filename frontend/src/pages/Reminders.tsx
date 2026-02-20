/**
 * Reminders Page - Erinnerungsverwaltung (A2: Detail-Seite)
 * 
 * CRUD für Erinnerungen mit ReminderDialog.
 * Expandable Details für jede Erinnerung.
 */
import { useState } from "react";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReminderDialog, ReminderData } from "@/components/dialogs/ReminderDialog";
import { toast } from "sonner";
import {
    Bell,
    PlusCircle,
    Calendar,
    Clock,
    AlertTriangle,
    Check,
    Edit,
    Trash2,
    ChevronDown,
    ChevronUp,
    Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useEffect } from "react";
// Initialdaten leer - wird vom Backend geladen
const initialReminders: ReminderData[] = [];

const typeLabels = {
    billing: { label: "Zahlung", color: "text-blue-500", bg: "bg-blue-500/10" },
    cancellation: { label: "Kündigung", color: "text-red-500", bg: "bg-red-500/10" },
    custom: { label: "Sonstiges", color: "text-purple-500", bg: "bg-purple-500/10" },
    renewal: { label: "Verlängerung", color: "text-green-500", bg: "bg-green-500/10" },
    price_change: { label: "Preisänderung", color: "text-orange-500", bg: "bg-orange-500/10" },
};

function getDaysUntil(dateStr: string): number {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export default function Reminders() {
    const [reminders, setReminders] = useState<ReminderData[]>(initialReminders);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingReminder, setEditingReminder] = useState<ReminderData | null>(null);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    // Lade Erinnerungen vom Backend
    useEffect(() => {
        const loadReminders = async () => {
            try {
                const data = await api.reminders.getAll();
                setReminders(data as ReminderData[]);
            } catch (error) {
                console.error("Failed to load reminders:", error);
                toast.error("Fehler beim Laden der Erinnerungen");
            }
        };
        loadReminders();
    }, []);

    const activeReminders = reminders.filter(r => getDaysUntil(r.reminderDate) >= 0);
    const pastReminders = reminders.filter(r => getDaysUntil(r.reminderDate) < 0);
    const urgentReminders = activeReminders.filter(r => getDaysUntil(r.reminderDate) <= 7);

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleCreateNew = () => {
        setEditingReminder(null);
        setDialogOpen(true);
    };

    const handleEdit = (reminder: ReminderData) => {
        setEditingReminder(reminder);
        setDialogOpen(true);
    };

    const handleSave = async (data: ReminderData) => {
        try {
            if (data.id) {
                // Nur erlaubte Felder für Update senden
                const payload: any = {
                    title: data.title,
                    description: data.description,
                    reminderDate: data.reminderDate,
                    type: data.type,
                };

                // subscriptionId nur hinzufügen wenn vorhanden
                if (data.subscriptionId) {
                    payload.subscriptionId = data.subscriptionId;
                }

                await api.reminders.update(data.id, payload);
                setReminders(prev => prev.map(r => r.id === data.id ? data : r));
                toast.success("Erinnerung aktualisiert", {
                    description: `"${data.title}" wurde gespeichert.`,
                });
            } else {
                const created = await api.reminders.create(data) as ReminderData;
                setReminders(prev => [...prev, created]);
                toast.success("Erinnerung erstellt", {
                    description: `"${data.title}" wurde hinzugefügt.`,
                });
            }
        } catch (error) {
            console.error("Failed to save reminder:", error);
            toast.error("Fehler beim Speichern der Erinnerung");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const reminder = reminders.find(r => r.id === id);
            await api.reminders.delete(id);
            setReminders(prev => prev.filter(r => r.id !== id));
            toast.success("Erinnerung gelöscht", {
                description: `"${reminder?.title || "Erinnerung"}" wurde entfernt.`,
            });
        } catch (error) {
            console.error("Failed to delete reminder:", error);
            toast.error("Fehler beim Löschen der Erinnerung");
        }
    };

    const handleQuickDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        handleDelete(id);
    };

    const handleMarkDone = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const reminder = reminders.find(r => r.id === id);
            // Wir löschen die Erinnerung einfach, wenn sie erledigt ist (für den Moment)
            // Alternativ könnten wir ein isActive Flag im Backend setzen
            await api.reminders.delete(id);
            setReminders(prev => prev.filter(r => r.id !== id));
            toast.success("Erledigt!", {
                description: `"${reminder?.title}" wurde als erledigt markiert.`,
            });
        } catch (error) {
            console.error("Failed to mark reminder done:", error);
            toast.error("Fehler beim Verarbeiten");
        }
    };

    return (
        <MainLayout>
            <div className="container py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Erinnerungen</h1>
                        <p className="text-muted-foreground">
                            Verpasse keine Zahlungen oder Kündigungsfristen
                        </p>
                    </div>
                    <Button onClick={handleCreateNew}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Neue Erinnerung
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-2xl font-bold">{activeReminders.length}</p>
                                    <p className="text-sm text-muted-foreground">Aktive</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className={urgentReminders.length > 0 ? "border-yellow-500/50" : ""}>
                        <CardContent className="pt-4">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className={cn("h-5 w-5", urgentReminders.length > 0 ? "text-yellow-500" : "text-muted-foreground")} />
                                <div>
                                    <p className="text-2xl font-bold">{urgentReminders.length}</p>
                                    <p className="text-sm text-muted-foreground">Dringend</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <div>
                                    <p className="text-2xl font-bold">{pastReminders.length}</p>
                                    <p className="text-sm text-muted-foreground">Vergangen</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Reminders */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Anstehende Erinnerungen
                        </CardTitle>
                        <CardDescription>
                            Erinnerungen, die bald fällig sind. Klicke auf "Details", um mehr zu erfahren.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {activeReminders.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Keine aktiven Erinnerungen</p>
                                <Button variant="outline" className="mt-4" onClick={handleCreateNew}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Erinnerung erstellen
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {activeReminders.map((reminder) => {
                                    const daysUntil = getDaysUntil(reminder.reminderDate);
                                    const typeInfo = typeLabels[reminder.type];
                                    const isExpanded = expandedIds.has(reminder.id!);

                                    return (
                                        <div
                                            key={reminder.id}
                                            className={cn(
                                                "rounded-lg border transition-colors",
                                                daysUntil <= 3 && "border-yellow-500/50 bg-yellow-500/5"
                                            )}
                                        >
                                            {/* Main Row */}
                                            <div
                                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                                                onClick={(e) => toggleExpand(reminder.id!, e)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={cn("p-2 rounded-lg", typeInfo.bg)}>
                                                        <Bell className={cn("h-5 w-5", typeInfo.color)} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium">{reminder.title}</h4>
                                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                                            {reminder.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right hidden sm:block">
                                                        <p className="text-sm font-medium">{formatDate(reminder.reminderDate)}</p>
                                                        <p className={cn(
                                                            "text-sm",
                                                            daysUntil <= 3 ? "text-yellow-500 font-medium" : "text-muted-foreground"
                                                        )}>
                                                            {daysUntil === 0 ? "Heute" : daysUntil === 1 ? "Morgen" : `in ${daysUntil} Tagen`}
                                                        </p>
                                                    </div>
                                                    <div className={cn("px-2 py-1 rounded-full text-xs font-medium hidden sm:block", typeInfo.bg, typeInfo.color)}>
                                                        {typeInfo.label}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="gap-1"
                                                        onClick={(e) => toggleExpand(reminder.id!, e)}
                                                    >
                                                        <Info className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Details</span>
                                                        {isExpanded ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Expanded Details */}
                                            {isExpanded && (
                                                <div className="px-4 pb-4 border-t bg-muted/20">
                                                    <div className="pt-4 space-y-4">
                                                        {/* Full Description */}
                                                        <div>
                                                            <h5 className="text-sm font-medium mb-1">Beschreibung</h5>
                                                            <p className="text-sm text-muted-foreground">
                                                                {reminder.description}
                                                            </p>
                                                        </div>

                                                        {/* Info Grid */}
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                            <div>
                                                                <h5 className="text-sm font-medium mb-1">Datum</h5>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {formatDate(reminder.reminderDate)}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h5 className="text-sm font-medium mb-1">Typ</h5>
                                                                <span className={cn("px-2 py-1 rounded-full text-xs font-medium", typeInfo.bg, typeInfo.color)}>
                                                                    {typeInfo.label}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <h5 className="text-sm font-medium mb-1">Status</h5>
                                                                <p className={cn(
                                                                    "text-sm",
                                                                    daysUntil <= 3 ? "text-yellow-500 font-medium" : "text-muted-foreground"
                                                                )}>
                                                                    {daysUntil === 0 ? "Heute fällig" : daysUntil === 1 ? "Morgen fällig" : `Noch ${daysUntil} Tage`}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex gap-2 pt-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex-1"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEdit(reminder);
                                                                }}
                                                            >
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Bearbeiten
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                onClick={(e) => handleMarkDone(reminder.id!, e)}
                                                            >
                                                                <Check className="h-4 w-4 mr-2" />
                                                                Erledigt
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                onClick={(e) => handleQuickDelete(reminder.id!, e)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Past Reminders */}
                {pastReminders.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-5 w-5" />
                                Vergangene Erinnerungen
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {pastReminders.map((reminder) => {
                                    return (
                                        <div
                                            key={reminder.id}
                                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 opacity-60"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Bell className="h-4 w-4 text-muted-foreground" />
                                                <span className="line-through">{reminder.title}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-muted-foreground">{formatDate(reminder.reminderDate)}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => handleDelete(reminder.id!)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* CRUD Dialog */}
            <ReminderDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                reminder={editingReminder}
                onSave={handleSave}
                onDelete={handleDelete}
            />
        </MainLayout>
    );
}
