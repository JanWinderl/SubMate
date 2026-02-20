import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Datenschutz() {
    return (
        <MainLayout>
            <div className="container py-12">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Datenschutzerklärung</h1>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>1. Datenschutz auf einen Blick</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <div>
                                    <h4 className="font-semibold text-foreground mb-2">Allgemeine Hinweise</h4>
                                    <p>
                                        Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
                                        personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
                                        Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground mb-2">Datenerfassung auf dieser Website</h4>
                                    <p>
                                        Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
                                        Die Kontaktdaten finden Sie im Impressum dieser Website.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>2. Hosting</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                <p>
                                    Wir hosten die Inhalte unserer Website bei folgendem Anbieter: Die externen
                                    Hostinganbieter werden sorgfältig ausgewählt und erfüllen hohe Datenschutzstandards.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>3. Allgemeine Hinweise und Pflichtinformationen</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <div>
                                    <h4 className="font-semibold text-foreground mb-2">Datenschutz</h4>
                                    <p>
                                        Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
                                        Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den
                                        gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground mb-2">Hinweis zur verantwortlichen Stelle</h4>
                                    <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
                                    <p className="mt-2">
                                        SubMate GmbH<br />
                                        Musterstraße 123<br />
                                        12345 Musterstadt<br />
                                        E-Mail: info@submate.de
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>4. Datenerfassung auf dieser Website</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <div>
                                    <h4 className="font-semibold text-foreground mb-2">Cookies</h4>
                                    <p>
                                        Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine
                                        Datenpakete und richten auf Ihrem Endgerät keinen Schaden an. Sie werden
                                        entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder
                                        dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground mb-2">Server-Log-Dateien</h4>
                                    <p>
                                        Der Provider der Seiten erhebt und speichert automatisch Informationen in
                                        so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>5. Ihre Rechte</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>Sie haben jederzeit das Recht:</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Auskunft über Ihre gespeicherten personenbezogenen Daten zu erhalten</li>
                                    <li>Berichtigung unrichtiger personenbezogener Daten zu verlangen</li>
                                    <li>Löschung Ihrer gespeicherten personenbezogenen Daten zu verlangen</li>
                                    <li>Einschränkung der Datenverarbeitung zu verlangen</li>
                                    <li>Der Datenverarbeitung zu widersprechen</li>
                                    <li>Datenübertragbarkeit zu verlangen</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>6. Kontakt</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                <p>
                                    Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden:
                                </p>
                                <p className="mt-2">
                                    E-Mail: datenschutz@submate.de<br />
                                    Telefon: +49 151 234 567 89
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
