/**
 * Categories Page - Kategorie-Verwaltung
 */
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRole } from "@/contexts/RoleContext";
import { PlusCircle, PlayCircle, Dumbbell, Cloud, Code, Gamepad2, Music, Newspaper, Box, Edit, Trash2 } from "lucide-react";

const demoCategories = [
    { id: "1", name: "Streaming", icon: "play-circle", color: "#8b5cf6", count: 2 },
    { id: "2", name: "Software", icon: "code", color: "#3b82f6", count: 1 },
    { id: "3", name: "Fitness", icon: "dumbbell", color: "#10b981", count: 1 },
    { id: "4", name: "Cloud", icon: "cloud", color: "#06b6d4", count: 1 },
    { id: "5", name: "Gaming", icon: "gamepad-2", color: "#f59e0b", count: 1 },
    { id: "6", name: "Musik", icon: "music", color: "#ec4899", count: 1 },
    { id: "7", name: "News", icon: "newspaper", color: "#64748b", count: 1 },
    { id: "8", name: "Sonstiges", icon: "box", color: "#6b7280", count: 0 },
];

const iconMap: Record<string, React.ElementType> = {
    "play-circle": PlayCircle,
    "dumbbell": Dumbbell,
    "cloud": Cloud,
    "code": Code,
    "gamepad-2": Gamepad2,
    "music": Music,
    "newspaper": Newspaper,
    "box": Box,
};

export default function Categories() {
    const { isAdmin } = useRole();

    return (
        <MainLayout>
            <div className="container py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Kategorien</h1>
                        <p className="text-muted-foreground">
                            Organisiere deine Abos nach Kategorien
                        </p>
                    </div>
                    {isAdmin && (
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Neue Kategorie
                        </Button>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {demoCategories.map((category) => {
                        const Icon = iconMap[category.icon] || Box;
                        return (
                            <Card key={category.id} className="card-hover">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div
                                            className="flex h-12 w-12 items-center justify-center rounded-lg"
                                            style={{ backgroundColor: category.color + "20", color: category.color }}
                                        >
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        {isAdmin && (
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-lg">{category.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {category.count} {category.count === 1 ? "Abo" : "Abos"}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </MainLayout>
    );
}
