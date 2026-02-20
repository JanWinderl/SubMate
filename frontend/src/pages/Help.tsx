import { MainLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, BookOpen, MessageCircle, Mail } from "lucide-react";

const faqs = [
    { q: "Wie füge ich ein neues Abo hinzu?", a: "Klicke auf 'Neues Abo' im Dashboard oder auf der Abos-Seite und fülle das Formular aus." },
    { q: "Wie funktionieren die Erinnerungen?", a: "SubMate erinnert dich automatisch vor Kündigungsfristen und Zahlungen per E-Mail." },
    { q: "Was ist im Premium-Plan enthalten?", a: "Premium bietet detaillierte Analysen, Export-Funktionen und unbegrenzte Abos." },
    { q: "Kann ich Abos mit meiner Familie teilen?", a: "Ja, Premium-Nutzer können Abos mit anderen teilen und die Kosten pro Person berechnen." },
];

export default function Help() {
    return (
        <MainLayout>
            <div className="container py-8 max-w-3xl">
                <div className="text-center mb-12">
                    <HelpCircle className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h1 className="text-3xl font-bold mb-2">Hilfe & FAQ</h1>
                    <p className="text-muted-foreground">
                        Antworten auf häufig gestellte Fragen
                    </p>
                </div>

                <div className="space-y-4 mb-12">
                    {faqs.map((faq, idx) => (
                        <Card key={idx}>
                            <CardHeader>
                                <CardTitle className="text-lg">{faq.q}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{faq.a}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="text-center card-hover">
                        <CardContent className="pt-6">
                            <BookOpen className="h-8 w-8 mx-auto text-primary mb-3" />
                            <h3 className="font-semibold mb-1">Dokumentation</h3>
                            <p className="text-sm text-muted-foreground">Ausführliche Anleitungen</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center card-hover">
                        <CardContent className="pt-6">
                            <MessageCircle className="h-8 w-8 mx-auto text-primary mb-3" />
                            <h3 className="font-semibold mb-1">Live Chat</h3>
                            <p className="text-sm text-muted-foreground">Sofortige Hilfe</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center card-hover">
                        <CardContent className="pt-6">
                            <Mail className="h-8 w-8 mx-auto text-primary mb-3" />
                            <h3 className="font-semibold mb-1">E-Mail Support</h3>
                            <p className="text-sm text-muted-foreground">support@submate.de</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
