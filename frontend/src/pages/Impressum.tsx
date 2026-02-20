import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Impressum() {
    return (
        <MainLayout>
            <div className="container py-12">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Impressum</h1>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Angaben gemäß § 5 TMG</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <div>
                                    <p className="font-semibold text-foreground">SubMate GmbH</p>
                                    <p>Musterstraße 123</p>
                                    <p>12345 Musterstadt</p>
                                    <p>Deutschland</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Kontakt</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-muted-foreground">
                                <p>Telefon: +49 151 234 567 89</p>
                                <p>E-Mail: info@submate.de</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Vertretungsberechtigte Geschäftsführer</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                <p>Max Mustermann</p>
                                <p>Maria Musterfrau</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Registereintrag</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-muted-foreground">
                                <p>Eintragung im Handelsregister</p>
                                <p>Registergericht: Amtsgericht Musterstadt</p>
                                <p>Registernummer: HRB 12345</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Umsatzsteuer-ID</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
                                <p>DE 123 456 789</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                <p>Max Mustermann</p>
                                <p>Musterstraße 123</p>
                                <p>12345 Musterstadt</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Streitschlichtung</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground space-y-4">
                                <p>
                                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                                    <a href="https://ec.europa.eu/consumers/odr/" className="text-primary hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                                        https://ec.europa.eu/consumers/odr/
                                    </a>
                                </p>
                                <p>
                                    Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                                    Verbraucherschlichtungsstelle teilzunehmen.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
