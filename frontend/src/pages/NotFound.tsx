import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-2">Seite nicht gefunden</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                    Die angeforderte Seite existiert nicht oder wurde verschoben.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button asChild>
                        <Link to="/">
                            <Home className="mr-2 h-4 w-4" />
                            Zur Startseite
                        </Link>
                    </Button>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Zurück
                    </Button>
                </div>
            </div>
        </div>
    );
}
