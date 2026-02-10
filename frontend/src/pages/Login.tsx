import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Link to="/" className="flex items-center justify-center gap-2 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                            <CreditCard className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-bold">SubMate</span>
                    </Link>
                    <CardTitle className="text-2xl">Willkommen zurück</CardTitle>
                    <CardDescription>
                        Melde dich an, um deine Abos zu verwalten
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">E-Mail</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="email" type="email" placeholder="max@example.com" className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Passwort</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="password" type="password" placeholder="••••••••" className="pl-10" />
                        </div>
                    </div>
                    <Button className="w-full" asChild>
                        <Link to="/dashboard">
                            Anmelden
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="text-center text-sm text-muted-foreground">
                        Noch kein Konto?{" "}
                        <Link to="/" className="text-primary hover:underline">
                            Jetzt registrieren
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
