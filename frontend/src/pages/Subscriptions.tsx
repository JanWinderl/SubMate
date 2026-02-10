/**
 * Subscriptions Page - Abo-Verwaltung (A2: Detail-Seite)
 * 
 * Zeigt alle Abonnements mit Filter- und Suchfunktion.
 * CRUD-Operationen über SubscriptionDialog und SubscriptionContext.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubscriptionDialog, SubscriptionData } from "@/components/dialogs/SubscriptionDialog";
import { useSubscriptions, Subscription } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";
import {
    CreditCard,
    Search,
    PlusCircle,
    Grid,
    List,
    PlayCircle,
    Dumbbell,
    Cloud,
    Code,
    Gamepad2,
    Music,
    Newspaper,
    Box,
    Edit,
} from "lucide-react";
import { formatCurrency, formatDate, getBillingCycleLabel, getDaysUntil } from "@/lib/utils";
import { cn } from "@/lib/utils";


const categoryIcons: Record<string, React.ElementType> = {
    Streaming: PlayCircle,
    Musik: Music,
    Cloud: Cloud,
    Software: Code,
    Fitness: Dumbbell,
    Gaming: Gamepad2,
    News: Newspaper,
    Sonstiges: Box,
};

// Dumb Component: SubscriptionCard
interface SubscriptionCardProps {
    subscription: SubscriptionData;
    viewMode: "grid" | "list";
    onEdit: (sub: SubscriptionData) => void;
}

function SubscriptionCard({ subscription, viewMode, onEdit }: SubscriptionCardProps) {
    const Icon = categoryIcons[subscription.category] || Box;
    const daysUntil = getDaysUntil(subscription.nextBillingDate);

    if (viewMode === "list") {
        return (
            <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <Link to={`/subscriptions/${subscription.id}`} className="flex items-center gap-4 flex-1">
                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: subscription.color + "20", color: subscription.color }}
                    >
                        <Icon className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-medium">{subscription.name}</h3>
                        <p className="text-sm text-muted-foreground">{subscription.category}</p>
                    </div>
                </Link>
                <div className="text-right">
                    <p className="font-medium">{formatCurrency(subscription.price)}</p>
                    <p className="text-sm text-muted-foreground">{getBillingCycleLabel(subscription.billingCycle)}</p>
                </div>
                <div className="text-right hidden md:block ml-4">
                    <p className="text-sm">{formatDate(subscription.nextBillingDate)}</p>
                    <p className={cn("text-sm", daysUntil <= 7 ? "text-yellow-500" : "text-muted-foreground")}>
                        in {daysUntil} Tagen
                    </p>
                </div>
                <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium ml-4",
                    subscription.isActive
                        ? "bg-green-500/10 text-green-500"
                        : "bg-muted text-muted-foreground"
                )}>
                    {subscription.isActive ? "Aktiv" : "Gekündigt"}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={(e) => {
                        e.preventDefault();
                        onEdit(subscription);
                    }}
                >
                    <Edit className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <Card className="card-hover h-full relative group">
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={() => onEdit(subscription)}
            >
                <Edit className="h-4 w-4" />
            </Button>
            <Link to={`/subscriptions/${subscription.id}`}>
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-lg"
                            style={{ backgroundColor: subscription.color + "20", color: subscription.color }}
                        >
                            <Icon className="h-6 w-6" />
                        </div>
                        <div className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            subscription.isActive
                                ? "bg-green-500/10 text-green-500"
                                : "bg-muted text-muted-foreground"
                        )}>
                            {subscription.isActive ? "Aktiv" : "Gekündigt"}
                        </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{subscription.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{subscription.category}</p>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-2xl font-bold">{formatCurrency(subscription.price)}</p>
                            <p className="text-sm text-muted-foreground">{getBillingCycleLabel(subscription.billingCycle)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Nächste Zahlung</p>
                            <p className={cn("text-sm font-medium", daysUntil <= 7 ? "text-yellow-500" : "")}>
                                in {daysUntil} Tagen
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}

export default function Subscriptions() {
    const { subscriptions, stats, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions();
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState<SubscriptionData | null>(null);

    const filteredSubscriptions = subscriptions.filter((sub) => {
        const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !categoryFilter || sub.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(subscriptions.map((s) => s.category))].sort((a, b) => {
        // Sonstiges immer ans Ende
        if (a === 'Sonstiges') return 1;
        if (b === 'Sonstiges') return -1;
        return a.localeCompare(b);
    });


    const handleCreateNew = () => {
        setEditingSubscription(null);
        setDialogOpen(true);
    };

    const handleEdit = (sub: SubscriptionData) => {
        setEditingSubscription(sub);
        setDialogOpen(true);
    };

    const handleSave = async (data: SubscriptionData) => {
        try {
            if (data.id) {
                // Update existing
                await updateSubscription(data.id, data);
                toast.success("Abo aktualisiert", {
                    description: `${data.name} wurde erfolgreich aktualisiert.`,
                });
            } else {
                // Create new
                await addSubscription(data as Omit<Subscription, "id">);
                toast.success("Abo erstellt", {
                    description: `${data.name} wurde hinzugefügt.`,
                });
            }
        } catch (error) {
            toast.error("Fehler beim Speichern", {
                description: "Das Abo konnte nicht gespeichert werden."
            });
        }
    };

    const handleDelete = async (id: string) => {
        const sub = subscriptions.find(s => s.id === id);
        try {
            await deleteSubscription(id);
            toast.success("Abo gelöscht", {
                description: `${sub?.name || "Abo"} wurde gelöscht.`,
            });
        } catch (error) {
            toast.error("Fehler beim Löschen", {
                description: "Das Abo konnte nicht gelöscht werden."
            });
        }
    };

    return (
        <MainLayout>
            <div className="container py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Meine Abonnements</h1>
                        <p className="text-muted-foreground">
                            Verwalte und organisiere alle deine Abonnements
                        </p>
                    </div>
                    <Button onClick={handleCreateNew}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Neues Abo
                    </Button>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-4">
                            <p className="text-sm text-muted-foreground">Aktive Abos</p>
                            <p className="text-2xl font-bold">{subscriptions.filter(s => s.isActive).length}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4">
                            <p className="text-sm text-muted-foreground">Pro Monat</p>
                            <p className="text-2xl font-bold">{formatCurrency(stats.totalMonthly)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4">
                            <p className="text-sm text-muted-foreground">Pro Jahr</p>
                            <p className="text-2xl font-bold">{formatCurrency(stats.totalYearly)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4">
                            <p className="text-sm text-muted-foreground">Bald fällig</p>
                            <p className="text-2xl font-bold">{subscriptions.filter(s => getDaysUntil(s.nextBillingDate) <= 7).length}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Abos durchsuchen..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                        <div className="flex gap-1 p-1 bg-muted rounded-lg overflow-x-auto max-w-full">
                            <div className="flex gap-1 flex-nowrap">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap",
                                            categoryFilter === cat
                                                ? "bg-background shadow-sm"
                                                : "hover:bg-background/50"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-1 p-1 bg-muted rounded-lg">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={cn(
                                    "p-1.5 rounded-md transition-all",
                                    viewMode === "grid" ? "bg-background shadow-sm" : "hover:bg-background/50"
                                )}
                            >
                                <Grid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={cn(
                                    "p-1.5 rounded-md transition-all",
                                    viewMode === "list" ? "bg-background shadow-sm" : "hover:bg-background/50"
                                )}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Subscriptions Grid/List */}
                {viewMode === "grid" ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredSubscriptions.map((sub) => (
                            <SubscriptionCard key={sub.id} subscription={sub} viewMode={viewMode} onEdit={handleEdit} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredSubscriptions.map((sub) => (
                            <SubscriptionCard key={sub.id} subscription={sub} viewMode={viewMode} onEdit={handleEdit} />
                        ))}
                    </div>
                )}

                {filteredSubscriptions.length === 0 && (
                    <div className="text-center py-12">
                        <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Keine Abos gefunden</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchQuery ? "Versuche einen anderen Suchbegriff" : "Füge dein erstes Abo hinzu"}
                        </p>
                        <Button onClick={handleCreateNew}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Abo hinzufügen
                        </Button>
                    </div>
                )}
            </div>

            {/* CRUD Dialog */}
            <SubscriptionDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                subscription={editingSubscription}
                onSave={handleSave}
                onDelete={handleDelete}
            />
        </MainLayout>
    );
}
