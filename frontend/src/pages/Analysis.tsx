/**
 * Analysis Page - Kostenanalyse mit PDF Export (A2: Detail-Seite, Premium Feature)
 */
import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "@/contexts/RoleContext";
import { toast } from "sonner";
import {
    TrendingDown,
    Crown,
    Lock,
    FileText,
} from "lucide-react";
import {
    PieChart as RechartsPie,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";
// @ts-ignore - jspdf hat keine perfekten Types
import jsPDF from "jspdf";
// @ts-ignore
import "jspdf-autotable";

import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { useMemo } from "react";

// Farben für Kategorien
const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#06b6d4", "#f59e0b", "#ec4899", "#ef4444", "#6366f1"];

export default function Analysis() {
    const { isPremium, householdSize } = useRole();
    const { subscriptions, stats } = useSubscriptions();

    // Berechne Kategorie-Daten dynamisch
    const categoryData = useMemo(() => {
        const categories: Record<string, number> = {};
        subscriptions.filter(s => s.isActive).forEach(sub => {
            categories[sub.category] = (categories[sub.category] || 0) + sub.price;
        });

        return Object.entries(categories).map(([name, value], index) => ({
            name,
            value,
            color: COLORS[index % COLORS.length]
        })).sort((a, b) => b.value - a.value);
    }, [subscriptions]);

    // Da wir keine Historie haben, projizieren wir die Kosten für die nächsten 6 Monate
    const monthlyTrend = useMemo(() => {
        const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
        const currentMonth = new Date().getMonth();

        return Array.from({ length: 6 }).map((_, i) => {
            const monthIndex = (currentMonth + i) % 12;
            // Hier könnte man später echte Fälligkeiten einberechnen (z.B. jährliche Zahlungen)
            // Vorerst nehmen wir die aktuellen monatlichen Kosten als Basis
            return {
                month: months[monthIndex],
                amount: stats.totalMonthly
            };
        });
    }, [stats.totalMonthly]);

    const totalMonthly = stats.totalMonthly;
    const totalYearly = stats.totalYearly;
    const perPerson = totalMonthly / (householdSize || 1);

    const handleExportPDF = () => {
        try {
            // PDF erstellen
            const doc = new jsPDF();

            // Titel
            doc.setFontSize(20);
            doc.setTextColor(139, 92, 246); // Violett
            doc.text("SubMate - Kostenanalyse", 20, 20);

            // Datum
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Erstellt am: ${new Date().toLocaleDateString("de-DE")}`, 20, 30);

            // Zusammenfassung
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text("Zusammenfassung", 20, 45);

            doc.setFontSize(11);
            doc.text(`Monatliche Kosten: ${formatCurrency(totalMonthly)}`, 20, 55);
            doc.text(`Jährliche Kosten: ${formatCurrency(totalYearly)}`, 20, 62);
            doc.text(`Kosten pro Person: ${formatCurrency(perPerson)} (${householdSize} Personen)`, 20, 69);
            doc.text(`Einsparpotenzial: ${formatCurrency(totalMonthly * 0.15)}/Monat`, 20, 76);

            // Kosten nach Kategorie
            doc.setFontSize(14);
            doc.text("Kosten nach Kategorie", 20, 95);

            // Tabelle mit AutoTable
            const tableData = categoryData.map(cat => [
                cat.name,
                formatCurrency(cat.value),
                `${((cat.value / totalMonthly) * 100).toFixed(1)}%`
            ]);

            (doc as any).autoTable({
                startY: 100,
                head: [["Kategorie", "Monatlich", "Anteil"]],
                body: tableData,
                theme: "striped",
                headStyles: { fillColor: [139, 92, 246] },
                styles: { fontSize: 10 },
            });

            // Monatlicher Verlauf
            const currentY = (doc as any).lastAutoTable.finalY + 15;
            doc.setFontSize(14);
            doc.text("Monatlicher Verlauf", 20, currentY);

            const trendData = monthlyTrend.map(m => [m.month, formatCurrency(m.amount)]);

            (doc as any).autoTable({
                startY: currentY + 5,
                head: [["Monat", "Betrag"]],
                body: trendData,
                theme: "striped",
                headStyles: { fillColor: [139, 92, 246] },
                styles: { fontSize: 10 },
            });

            // Optimierungsvorschläge
            const finalY = (doc as any).lastAutoTable.finalY + 15;
            doc.setFontSize(14);
            doc.text("Optimierungsvorschläge", 20, finalY);

            doc.setFontSize(10);
            doc.text("• Zeit Online wenig genutzt - Einsparpotenzial: 4,99€/Monat", 20, finalY + 10);
            doc.text("• Doppelte Streaming-Dienste - Einsparpotenzial: 7,49€/Monat", 20, finalY + 17);

            // Footer
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text("Generiert mit SubMate - Dein Abo-Manager", 20, 285);

            // PDF herunterladen
            doc.save("SubMate_Kostenanalyse.pdf");

            toast.success("PDF exportiert!", {
                description: "Die Kostenanalyse wurde als PDF heruntergeladen.",
            });
        } catch (error) {
            console.error("PDF Export Fehler:", error);
            toast.error("Export fehlgeschlagen", {
                description: "Beim Erstellen der PDF ist ein Fehler aufgetreten.",
            });
        }
    };

    if (!isPremium) {
        return (
            <MainLayout>
                <div className="container py-8">
                    <div className="max-w-2xl mx-auto text-center py-20">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10 mx-auto mb-6">
                            <Lock className="h-10 w-10 text-yellow-500" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
                        <p className="text-muted-foreground mb-8">
                            Die detaillierte Kostenanalyse ist nur für Premium-Nutzer verfügbar.
                            Upgrade jetzt, um Einsparpotenziale zu entdecken und deine Ausgaben zu optimieren.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button size="lg">
                                <Crown className="mr-2 h-5 w-5" />
                                Jetzt upgraden
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link to="/dashboard">Zurück zum Dashboard</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Kostenanalyse</h1>
                        <p className="text-muted-foreground">
                            Verstehe genau, wohin dein Geld fließt
                        </p>
                    </div>
                    <Button onClick={handleExportPDF}>
                        <FileText className="mr-2 h-4 w-4" />
                        Export als PDF
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4 mb-8">
                    <Card className="bg-primary text-primary-foreground">
                        <CardContent className="pt-6">
                            <p className="text-sm opacity-80">Monatlich gesamt</p>
                            <p className="text-3xl font-bold">{formatCurrency(totalMonthly)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground">Jährlich gesamt</p>
                            <p className="text-3xl font-bold">{formatCurrency(totalYearly)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground">Pro Person/Monat</p>
                            <p className="text-3xl font-bold">{formatCurrency(perPerson)}</p>
                            <p className="text-sm text-muted-foreground">({householdSize} Personen)</p>
                        </CardContent>
                    </Card>
                    <Card className="border-green-500/50 bg-green-500/5">
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground">Einsparpotenzial</p>
                            <p className="text-3xl font-bold text-green-500">{formatCurrency(totalMonthly * 0.15)}</p>
                            <p className="text-sm text-muted-foreground">pro Monat möglich</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Pie Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kosten nach Kategorie</CardTitle>
                            <CardDescription>Verteilung deiner monatlichen Ausgaben</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPie>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    </RechartsPie>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                {categoryData.map((cat) => (
                                    <div key={cat.name} className="flex items-center gap-2 text-sm">
                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="text-muted-foreground">{cat.name}</span>
                                        <span className="ml-auto font-medium">{formatCurrency(cat.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bar Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kosten-Prognose</CardTitle>
                            <CardDescription>Geschätzte Kosten für die nächsten 6 Monate</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyTrend}>
                                        <XAxis dataKey="month" />
                                        <YAxis tickFormatter={(v: number) => `${v}€`} />
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                        <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex items-center justify-between mt-4 p-3 rounded-lg bg-muted">
                                <div className="flex items-center gap-2">
                                    <TrendingDown className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm">Basierend auf aktuellen Abos</span>
                                </div>
                                <span className="font-medium text-muted-foreground">konstant</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Optimization Suggestions */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingDown className="h-5 w-5 text-green-500" />
                                Optimierungsvorschläge
                            </CardTitle>
                            <CardDescription>Basierend auf deiner Nutzung</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div>
                                        <p className="font-medium">Zeit Online wenig genutzt</p>
                                        <p className="text-sm text-muted-foreground">
                                            Dieses Abo wurde in den letzten 30 Tagen nicht genutzt
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-green-500">+{formatCurrency(4.99)}/Monat</p>
                                        <Button variant="outline" size="sm" className="mt-2">Überprüfen</Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div>
                                        <p className="font-medium">Doppelte Streaming-Dienste</p>
                                        <p className="text-sm text-muted-foreground">
                                            Netflix und Disney+ haben ähnliche Inhalte
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-green-500">+{formatCurrency(7.49)}/Monat</p>
                                        <Button variant="outline" size="sm" className="mt-2">Vergleichen</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
