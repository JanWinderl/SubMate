import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AGB() {
    return (
        <MainLayout>
            <div className="container py-12">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Allgemeine Geschäftsbedingungen</h1>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>§ 1 Geltungsbereich</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    (1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen
                                    der SubMate GmbH (nachfolgend „Anbieter") und dem Nutzer (nachfolgend „Kunde")
                                    über die Nutzung der SubMate-Plattform.
                                </p>
                                <p>
                                    (2) Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn,
                                    der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>§ 2 Vertragsgegenstand</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    (1) SubMate ist eine digitale Plattform zur Verwaltung von Abonnements.
                                    Der Anbieter stellt dem Kunden die Plattform zur Nutzung bereit.
                                </p>
                                <p>
                                    (2) Der genaue Leistungsumfang ergibt sich aus der jeweiligen Leistungsbeschreibung
                                    und dem gewählten Tarif (Basic, Premium oder Business).
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>§ 3 Registrierung und Vertragsschluss</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    (1) Die Nutzung der Plattform setzt eine Registrierung voraus. Der Kunde muss
                                    bei der Registrierung wahrheitsgemäße Angaben machen.
                                </p>
                                <p>
                                    (2) Der Vertrag kommt mit Abschluss der Registrierung zustande.
                                </p>
                                <p>
                                    (3) Der Kunde hat keinen Anspruch auf Abschluss eines Vertrages.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>§ 4 Preise und Zahlung</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    (1) Es gelten die zum Zeitpunkt des Vertragsschlusses gültigen Preise gemäß
                                    der Preisliste auf der Website.
                                </p>
                                <p>
                                    (2) Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer.
                                </p>
                                <p>
                                    (3) Die Zahlung erfolgt per Kreditkarte, PayPal oder SEPA-Lastschrift.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>§ 5 Laufzeit und Kündigung</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    (1) Der Vertrag läuft auf unbestimmte Zeit und kann jederzeit zum Ende des
                                    jeweiligen Abrechnungszeitraums gekündigt werden.
                                </p>
                                <p>
                                    (2) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
                                </p>
                                <p>
                                    (3) Die Kündigung kann über das Kundenkonto oder per E-Mail erfolgen.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>§ 6 Pflichten des Kunden</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>Der Kunde verpflichtet sich:</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Seine Zugangsdaten geheim zu halten</li>
                                    <li>Die Plattform nicht missbräuchlich zu nutzen</li>
                                    <li>Keine rechtswidrigen Inhalte einzustellen</li>
                                    <li>Änderungen seiner Kontaktdaten unverzüglich mitzuteilen</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>§ 7 Haftung</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    (1) Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens,
                                    des Körpers oder der Gesundheit sowie bei Vorsatz und grober Fahrlässigkeit.
                                </p>
                                <p>
                                    (2) Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung
                                    wesentlicher Vertragspflichten, der Höhe nach begrenzt auf den vorhersehbaren,
                                    vertragstypischen Schaden.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>§ 8 Datenschutz</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                <p>
                                    Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäß unserer
                                    Datenschutzerklärung, die unter dem Menüpunkt „Datenschutz" einsehbar ist.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>§ 9 Schlussbestimmungen</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
                                    UN-Kaufrechts.
                                </p>
                                <p>
                                    (2) Gerichtsstand für alle Streitigkeiten ist der Sitz des Anbieters,
                                    sofern der Kunde Kaufmann ist.
                                </p>
                                <p>
                                    (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die
                                    Wirksamkeit der übrigen Bestimmungen unberührt.
                                </p>
                            </CardContent>
                        </Card>

                        <p className="text-sm text-muted-foreground text-center pt-4">
                            Stand: Januar 2026
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
