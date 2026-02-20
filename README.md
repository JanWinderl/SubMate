REPO runterladen

### 1. Backend (Terminal 1)
Das Backend muss permanent laufen, damit die Seite funktioniert.

1. cd backend
2. npm install (Nur beim ersten Mal nötig, dauert etwas --> muss man noch überprüfen, was man braucht)
3. npm run start:dev
   - WICHTIG: Sobald dieser Befehl läuft, ist dieses Terminal "besetzt" und zeigt Logs an. Man kann hier nichts mehr eintippen.

### 2. Daten befüllen (Terminal 2 - Einmalig)
Da Terminal 1 blockiert ist, neues Terminal öffnen für das Seeding.

1. cd backend
2. node seed.js (--> erstellt 20 Test-Abos)
   - Hinweis: Nur einmal ausführen. Wenn man es öfter macht, hat man die Test-Abos doppelt und dreifach in der Datenbank, da das Skript einfach neue Einträge hinzufügt.

### 3. Frontend (Terminal 2 oder 3)
Neues Terminal öffnen.

1. cd frontend
2. npm install (Wieder nur beim ersten Mal)
3. npm run dev

### Zusammenfassung für den täglichen Start
npm install und node seed.js braucht man nur einmal. Es reicht dann:

- Terminal A: cd backend -> npm run start:dev
- Terminal B: cd frontend -> npm run dev
