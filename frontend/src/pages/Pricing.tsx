/**
 * Pricing Page - Preisübersicht
 * 
 * Zeigt die verschiedenen Abomodelle (Free, Pro, Team).
 * Mit Feature-Vergleichstabelle und FAQ.
 */
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MainLayout } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import {
    CheckCircle,
    Star,
    HelpCircle
} from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const pricingPlans = [
    {
        name: 'Basis',
        price: '0€',
        period: '/Monat',
        features: ['Bis zu 5 Abos', 'Basis Erinnerungen', 'Mobile App', 'Kosten-Übersicht'],
        buttonText: 'Kostenlos starten',
        buttonVariant: 'outline' as const,
        popular: false,
        href: '/login',
    },
    {
        name: 'Premium',
        price: '4,99€',
        period: '/Monat',
        features: ['Unbegrenzte Abos', 'Erweiterte Analytics', 'Abo-Sharing', 'Budget-Management', 'Kalender-Sync', 'Priority Support'],
        buttonText: 'Jetzt upgraden',
        buttonVariant: 'default' as const,
        popular: true,
        href: '/login',
    },
    {
        name: 'Team',
        price: '19,99€',
        period: '/Monat',
        features: ['Alles aus Premium', 'Team-Funktionen', 'API-Zugang', 'Custom Branding', 'Dedizierter Support'],
        buttonText: 'Team erstellen',
        buttonVariant: 'outline' as const,
        popular: false,
        href: '/login',
    },
];

const faqs = [
    {
        question: 'Kann ich jederzeit kündigen?',
        answer: 'Ja, du kannst dein Abo jederzeit kündigen. Es gibt keine versteckten Gebühren oder Mindestlaufzeiten. Nach der Kündigung hast du bis zum Ende des Abrechnungszeitraums Zugriff auf alle Funktionen.',
    },
    {
        question: 'Gibt es eine kostenlose Testversion?',
        answer: 'Unser Basic-Plan ist dauerhaft kostenlos und beinhaltet alle grundlegenden Funktionen. Du kannst jederzeit auf Premium oder Business upgraden, um erweiterte Features zu nutzen.',
    },
    {
        question: 'Wie funktioniert die Zahlung?',
        answer: 'Wir akzeptieren alle gängigen Zahlungsmethoden wie Kreditkarte, PayPal und SEPA-Lastschrift. Die Abrechnung erfolgt monatlich, und du erhältst immer eine Rechnung per E-Mail.',
    },
    {
        question: 'Kann ich zwischen Plänen wechseln?',
        answer: 'Ja, du kannst jederzeit zwischen den Plänen wechseln. Beim Upgrade wird der Restbetrag anteilig berechnet. Beim Downgrade behältst du die Premium-Features bis zum Ende des aktuellen Abrechnungszeitraums.',
    },
    {
        question: 'Sind meine Daten sicher?',
        answer: 'Absolut! Wir verwenden modernste Verschlüsselungstechnologien und speichern alle Daten auf Servern in Deutschland. Deine Daten werden niemals an Dritte weitergegeben.',
    },
    {
        question: 'Was passiert mit meinen Daten, wenn ich kündige?',
        answer: 'Nach der Kündigung hast du 30 Tage Zeit, deine Daten zu exportieren. Danach werden sie gemäß DSGVO vollständig gelöscht. Du kannst den Export jederzeit in den Einstellungen durchführen.',
    },
];

const comparisonFeatures = [
    { feature: 'Abo-Verwaltung', basic: '5 Abos', premium: 'Unbegrenzt', business: 'Unbegrenzt' },
    { feature: 'Erinnerungen', basic: 'Basis', premium: 'Erweitert', business: 'Erweitert' },
    { feature: 'Kosten-Analyse', basic: false, premium: true, business: true },
    { feature: 'Abo-Sharing', basic: false, premium: true, business: true },
    { feature: 'Budget-Management', basic: false, premium: true, business: true },
    { feature: 'Kalender-Sync', basic: false, premium: true, business: true },
    { feature: 'Team-Funktionen', basic: false, premium: false, business: true },
    { feature: 'API-Zugang', basic: false, premium: false, business: true },
    { feature: 'Custom Branding', basic: false, premium: false, business: true },
    { feature: 'Support', basic: 'E-Mail', premium: 'Priority', business: 'Dediziert' },
];

export default function Pricing() {
    return (
        <MainLayout>
            {/* Hero Section */}
            <section className="py-16 md:py-24">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Transparent & Fair
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Wähle den Plan, der zu dir passt
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-20 px-4 sm:px-6">
                <div className="grid gap-6 md:gap-8 md:grid-cols-3 max-w-7xl mx-auto">
                    {pricingPlans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`relative transition-all duration-300 hover:shadow-xl flex flex-col ${plan.popular ? 'border-primary shadow-lg md:scale-105 z-10' : 'hover:-translate-y-2'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                                        <Star className="h-3 w-3 mr-1 fill-current" />
                                        Beliebt
                                    </Badge>
                                </div>
                            )}
                            <CardContent className="pt-8 pb-6 flex-1 flex flex-col">
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-semibold text-foreground mb-4">{plan.name}</h3>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className={`text-4xl font-bold ${plan.popular ? 'text-primary' : 'text-foreground'}`}>
                                            {plan.price}
                                        </span>
                                        <span className="text-muted-foreground">{plan.period}</span>
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    variant={plan.buttonVariant}
                                    className="w-full"
                                    asChild
                                >
                                    <Link to={plan.href}>{plan.buttonText}</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Feature Comparison Table */}
            <section className="py-20 bg-muted/30">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Funktionen im Vergleich
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Finde den perfekten Plan für deine Bedürfnisse
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-4 px-4 font-semibold text-foreground">Funktion</th>
                                    <th className="text-center py-4 px-4 font-semibold text-foreground">Basis</th>
                                    <th className="text-center py-4 px-4 font-semibold text-primary">Premium</th>
                                    <th className="text-center py-4 px-4 font-semibold text-foreground">Team</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonFeatures.map((row, index) => (
                                    <tr key={row.feature} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                                        <td className="py-4 px-4 text-foreground font-medium">{row.feature}</td>
                                        <td className="py-4 px-4 text-center">
                                            {typeof row.basic === 'boolean' ? (
                                                row.basic ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )
                                            ) : (
                                                <span className="text-muted-foreground">{row.basic}</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {typeof row.premium === 'boolean' ? (
                                                row.premium ? (
                                                    <CheckCircle className="h-5 w-5 text-primary mx-auto" />
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )
                                            ) : (
                                                <span className="text-primary font-medium">{row.premium}</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {typeof row.business === 'boolean' ? (
                                                row.business ? (
                                                    <CheckCircle className="h-5 w-5 text-primary mx-auto" />
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )
                                            ) : (
                                                <span className="text-muted-foreground">{row.business}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20">
                <div className="container">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <HelpCircle className="h-8 w-8 text-primary" />
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                Häufige Fragen
                            </h2>
                        </div>
                        <p className="text-lg text-muted-foreground">
                            Antworten auf die wichtigsten Fragen zu unseren Preisen
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left text-foreground hover:text-primary">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                <div className="container text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                        Noch Fragen?
                    </h2>
                    <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                        Unser Team hilft dir gerne bei der Auswahl des richtigen Plans.
                    </p>
                    <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                        <Link to="/help">
                            Hilfe & Support
                        </Link>
                    </Button>
                </div>
            </section>
        </MainLayout>
    );
}
