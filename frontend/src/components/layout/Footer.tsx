/**
 * Footer Component - Einheitlicher Footer für alle Seiten (A1: Layout)
 */
import { Link } from "react-router-dom";
import { CreditCard } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="container py-8 md:py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <CreditCard className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold">SubMate</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Dein Abo-Killer gegen die Inflation. Verwalte alle deine Abonnements zentral.
                        </p>
                    </div>

                    {/* Produkt */}
                    <div>
                        <h4 className="font-semibold mb-4">Produkt</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                            <li><Link to="/subscriptions" className="hover:text-foreground transition-colors">Abos verwalten</Link></li>
                            <li><Link to="/analysis" className="hover:text-foreground transition-colors">Kostenanalyse</Link></li>
                            <li><Link to="/reminders" className="hover:text-foreground transition-colors">Erinnerungen</Link></li>
                        </ul>
                    </div>

                    {/* Hilfe */}
                    <div>
                        <h4 className="font-semibold mb-4">Hilfe</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/help" className="hover:text-foreground transition-colors">Hilfe & FAQ</Link></li>
                            <li><Link to="/settings" className="hover:text-foreground transition-colors">Einstellungen</Link></li>
                            <li><Link to="/profile" className="hover:text-foreground transition-colors">Mein Profil</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold mb-4">Rechtliches</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/impressum" className="hover:text-foreground transition-colors">Impressum</Link></li>
                            <li><Link to="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link></li>
                            <li><Link to="/agb" className="hover:text-foreground transition-colors">AGB</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t mt-8 pt-8">
                    <p className="text-sm text-muted-foreground text-center">
                        © 2026 SubMate. Alle Rechte vorbehalten.
                    </p>
                </div>
            </div>
        </footer>
    );
}
