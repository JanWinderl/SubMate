/**
 * Reminder Dialog - CRUD für Erinnerungen
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
import { Textarea } from "@/components/ui/textarea";

export interface ReminderData {
    id?: string;
    title: string;
    description: string;
    reminderDate: string;
    type: "billing" | "cancellation" | "custom" | "renewal" | "price_change";
    subscriptionId?: string;
}

interface ReminderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reminder?: ReminderData | null;
    onSave: (data: ReminderData) => void;
    onDelete?: (id: string) => void;
}

const defaultData: ReminderData = {
    title: "",
    description: "",
    reminderDate: new Date().toISOString().split("T")[0],
    type: "custom",
};

export function ReminderDialog({
    open,
    onOpenChange,
    reminder,
    onSave,
    onDelete,
}: ReminderDialogProps) {
    const [formData, setFormData] = useState<ReminderData>(defaultData);
    const isEditing = !!reminder?.id;

    useEffect(() => {
        if (reminder) {
            setFormData(reminder);
        } else {
            setFormData(defaultData);
        }
    }, [reminder, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onOpenChange(false);
    };

    const handleDelete = () => {
        if (reminder?.id && onDelete) {
            onDelete(reminder.id);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? "Erinnerung bearbeiten" : "Neue Erinnerung"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Bearbeite die Details der Erinnerung."
                                : "Erstelle eine neue Erinnerung."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Titel</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                placeholder="z.B. Netflix kündigen"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Beschreibung</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                placeholder="Optionale Notizen..."
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="date">Datum</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.reminderDate}
                                    onChange={(e) =>
                                        setFormData({ ...formData, reminderDate: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="type">Typ</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value: "billing" | "cancellation" | "custom") =>
                                        setFormData({ ...formData, type: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="billing">Zahlung</SelectItem>
                                        <SelectItem value="cancellation">Kündigung</SelectItem>
                                        <SelectItem value="renewal">Verlängerung</SelectItem>
                                        <SelectItem value="price_change">Preisänderung</SelectItem>
                                        <SelectItem value="custom">Sonstiges</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        {isEditing && onDelete && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                Löschen
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
        </Dialog>
    );
}
