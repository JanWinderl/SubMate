/**
 * Index Page - Landing Page (A1: Landing Page)
 * 
 * Zeigt die Marketing-Seite mit Features, Stats und CTA.
 */
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
    CreditCard,
    Bell,
    PieChart,
    Shield,
    Users,
    TrendingDown,
    ArrowRight,
    Star,
} from "lucide-react";

const features = [
    {
        icon: CreditCard,
        title: "Alle Abos im Blick",
        description: "Verwalte Netflix, Spotify, Gym und alle anderen Abos an einem zentralen Ort.",
    },
    {
        icon: Bell,
        title: "Nie mehr Fristen verpassen",
        description: "Automatische Erinnerungen vor Kündigungsfristen und Verlängerungen.",
    },
    {
        icon: PieChart,
        title: "Kosten-Analyse",
        description: "Verstehe genau, wohin dein Geld fließt – monatlich, jährlich, pro Kopf.",
    },
    {
        icon: Users,
        title: "Haushalt teilen",
        description: "Berechne die Kosten pro Person für geteilte Familien-Abos.",
    },
    {
        icon: TrendingDown,
        title: "Sparpotenzial erkennen",
        description: "Finde ungenutzte Abos und spare bares Geld.",
    },
    {
        icon: Shield,
        title: "Sicher & Privat",
        description: "Deine Daten bleiben bei dir – keine Weitergabe an Dritte.",
    },
];

const stats = [
    { value: "12.500+", label: "Aktive Nutzer" },
    { value: "€89", label: "Ø Ersparnis/Monat" },
    { value: "45.000+", label: "Verwaltete Abos" },
    { value: "4.9/5", label: "Nutzerbewertung" },
];

const testimonials = [
    {
        quote: "Endlich habe ich den Überblick über meine Abos! Habe direkt 3 ungenutzte gekündigt.",
        name: "Lisa M.",
        role: "Marketing Managerin",
    },
    {
        quote: "Die Erinnerungsfunktion ist Gold wert. Nie mehr vergessene Kündigungsfristen!",
        name: "Thomas K.",
        role: "Software Entwickler",
    },
    {
        quote: "Perfekt für unseren 4-Personen-Haushalt. Die Pro-Kopf-Berechnung ist super.",
        name: "Familie Weber",
        role: "Premium Nutzer",
    },
];

export default function Index() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* Hero Section */}
            <section className="relative py-12 sm:py-16 md:py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 gradient-hero" />
                <div className="container relative px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
                            Behalte den Überblick über{" "}
                            <span className="text-primary">alle deine Abos</span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                            Streaming, Gym, iCloud, Software – jeder hat zu viele Abos und vergisst
                            Kündigungsfristen. SubMate hilft dir, bares Geld zu sparen.
                        </p>
                        <Button size="lg" asChild>
                            <Link to="/pricing">
                                Kostenlos starten
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
                <div className="container px-4 sm:px-6">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Alles was du brauchst</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                            SubMate bietet dir alle Werkzeuge, um deine Abonnements effizient zu
                            verwalten und unnötige Kosten zu vermeiden.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => (
                            <Card key={feature.title} className="card-hover">
                                <CardContent className="pt-6">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 sm:py-16 md:py-20">
                <div className="container px-4 sm:px-6">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">SubMate in Zahlen</h2>
                        <p className="text-muted-foreground text-sm sm:text-base">
                            Vertrauen durch tausende zufriedene Nutzer
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">{stat.value}</div>
                                <div className="text-muted-foreground text-xs sm:text-sm md:text-base">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
                <div className="container px-4 sm:px-6">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Das sagen unsere Nutzer</h2>
                        <p className="text-muted-foreground text-sm sm:text-base">
                            Echte Erfahrungen von echten Menschen
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial) => (
                            <Card key={testimonial.name} className="card-hover">
                                <CardContent className="pt-6">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                                    <div>
                                        <div className="font-semibold">{testimonial.name}</div>
                                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-16 md:py-20 gradient-primary text-white">
                <div className="container text-center px-4 sm:px-6">

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                        Bereit, Geld zu sparen?
                    </h2>
                    <p className="text-white/80 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
                        Starte jetzt kostenlos und behalte den Überblick über alle deine
                        Abonnements.
                    </p>
                    <Button size="lg" variant="secondary" asChild>
                        <Link to="/pricing">
                            Jetzt kostenlos starten
                            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </Link>
                    </Button>
                </div>
            </section>

            <Footer />
        </div>
    );
}
