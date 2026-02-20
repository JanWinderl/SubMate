/**
 * Subscription Dialog - CRUD für Abonnements
 */
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { BillingCycle } from "@/types";

export interface SubscriptionData {
    id?: string;
    name: string;
    price: number;
    billingCycle: BillingCycle;
    category: string;
    nextBillingDate: string;
    isActive: boolean;
    color: string;
}

interface SubscriptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subscription?: SubscriptionData | null;
    onSave: (data: SubscriptionData) => void;
    onDelete?: (id: string) => void;
}

const categories = [
    "Streaming",
    "Musik",
    "Cloud",
    "Software",
    "Fitness",
    "Gaming",
    "News",
    "Sonstiges",
];

const colors = [
    { name: "Rot", value: "#e50914" },
    { name: "Grün", value: "#1db954" },
    { name: "Blau", value: "#007aff" },
    { name: "Lila", value: "#8b5cf6" },
    { name: "Orange", value: "#ff6b00" },
    { name: "Pink", value: "#ec4899" },
];

const defaultData: SubscriptionData = {
    name: "",
    price: 0,
    billingCycle: "monthly",
    category: "Sonstiges",
    nextBillingDate: new Date().toISOString().split("T")[0],
    isActive: true,
    color: "#8b5cf6",
};

export function SubscriptionDialog({
    open,
    onOpenChange,
    subscription,
    onSave,
    onDelete,
}: SubscriptionDialogProps) {
    const [formData, setFormData] = useState<SubscriptionData>(defaultData);
    const isEditing = !!subscription?.id;
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        if (subscription) {
            setFormData(subscription);
        } else {
            setFormData(defaultData);
        }
    }, [subscription, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onOpenChange(false);
    };

    const handleDelete = () => {
        if (!subscription?.id || !onDelete) {
            return;
        }
        onDelete(subscription.id);
        setConfirmOpen(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? "Abo bearbeiten" : "Neues Abo erstellen"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Bearbeite die Details deines Abonnements."
                                : "Füge ein neues Abonnement hinzu."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                placeholder="z.B. Netflix, Spotify..."
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Preis (€)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            price: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="cycle">Abrechnungszyklus</Label>
                                <Select
                                    value={formData.billingCycle}
                                    onValueChange={(value: BillingCycle) =>
                                        setFormData({ ...formData, billingCycle: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="weekly">Wöchentlich</SelectItem>
                                        <SelectItem value="monthly">Monatlich</SelectItem>
                                        <SelectItem value="yearly">Jährlich</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Kategorie</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, category: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="color">Farbe</Label>
                                <Select
                                    value={formData.color}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, color: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {colors.map((c) => (
                                            <SelectItem key={c.value} value={c.value}>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-3 w-3 rounded-full"
                                                        style={{ backgroundColor: c.value }}
                                                    />
                                                    {c.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nextBilling">Nächste Zahlung</Label>
                            <Input
                                id="nextBilling"
                                type="date"
                                value={formData.nextBillingDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, nextBillingDate: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="active">Aktiv</Label>
                            <Switch
                                id="active"
                                checked={formData.isActive}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, isActive: checked })
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        {isEditing && onDelete && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => setConfirmOpen(true)}
                            >
                                Kündigen
                            </Button>
                        )}
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Abbrechen
                        </Button>
                        <Button type="submit">
                            {isEditing ? "Speichern" : "Erstellen"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Abo kündigen</DialogTitle>
                        <DialogDescription>
                            Möchtest du das Abo „{subscription?.name}“ wirklich kündigen? Diese Aktion kann nicht
                            rückgängig gemacht werden.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setConfirmOpen(false)}>
                            Abbrechen
                        </Button>
                        <Button variant="destructive" type="button" onClick={handleDelete}>
                            Ja, Abo kündigen
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Dialog>
    );
}
