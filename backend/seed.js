
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Konfiguration
const API_URL = 'http://localhost:3000';
const DEMO_USER_ID = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";
const DB_PATH = path.join(__dirname, 'submate.db');

async function seed() {
    console.log('🌱 Starte Seeding (Full v2)...');

    // 1. User erstellen (Direct DB Access)
    console.log(`Verbinde mit DB: ${DB_PATH}`);
    const db = new sqlite3.Database(DB_PATH);

    const createUserPromise = new Promise((resolve, reject) => {
        db.run(`
            INSERT OR IGNORE INTO users (id, email, name, role, householdSize, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `, [DEMO_USER_ID, 'demo@submate.app', 'Demo User', 'premium', 1], function (err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });

    try {
        const changes = await createUserPromise;
        console.log(`User erstellt/geprüft. Changes: ${changes}`);
    } catch (err) {
        console.error("Fehler beim Erstellen des Users:", err);
        db.close();
        return;
    }

    db.close();

    // 2. Kategorien holen
    let categories = [];
    const headers = { 'Content-Type': 'application/json', 'X-Role': 'admin' };

    try {
        const catRes = await fetch(`${API_URL}/categories`, { method: 'GET', headers });
        if (catRes.ok) {
            categories = await catRes.json();
        }
    } catch (e) {
        console.error("Konnte Kategorien nicht laden", e);
    }

    if (categories.length === 0) {
        console.log('Keine Kategorien gefunden. Erstelle Defaults...');
        await fetch(`${API_URL}/categories/seed`, { method: 'POST', headers });
        const catRes = await fetch(`${API_URL}/categories`, { method: 'GET', headers });
        if (catRes.ok) categories = await catRes.json();
    }

    if (categories.length === 0) {
        console.error("❌ Fehler: Keine Kategorien verfügbar. Abbruch.");
        return;
    }

    const getCategoryIdByName = (name) => {
        const cat = categories.find(c => c.name === name);
        if (cat) return cat.id;
        // Fallback: Sonstiges oder erste Kategorie
        const fallback = categories.find(c => c.name === 'Sonstiges') || categories[0];
        return fallback?.id || categories[0]?.id;
    };

    // 3. Abo-Daten
    const subscriptions = [
        { name: "Netflix", price: 17.99, cycle: "monthly", cat: "Streaming", color: "#e50914" },
        { name: "Spotify Premium", price: 10.99, cycle: "monthly", cat: "Musik", color: "#1DB954" },
        { name: "Amazon Prime", price: 8.99, cycle: "monthly", cat: "Sonstiges", color: "#00A8E1" },
        { name: "Disney+", price: 89.90, cycle: "yearly", cat: "Streaming", color: "#113CCF" },
        { name: "Gymondo", price: 4.99, cycle: "monthly", cat: "Fitness", color: "#F5A623" },
        { name: "iCloud+", price: 2.99, cycle: "monthly", cat: "Cloud", color: "#007AFF" },
        { name: "Adobe Creative Cloud", price: 64.99, cycle: "monthly", cat: "Software", color: "#FF0000" },
        { name: "YouTube Premium", price: 12.99, cycle: "monthly", cat: "Streaming", color: "#FF0000" },
        { name: "ChatGPT Plus", price: 22.00, cycle: "monthly", cat: "Software", color: "#10A37F" },
        { name: "GitHub Copilot", price: 10.00, cycle: "monthly", cat: "Software", color: "#000000" },
        { name: "Audible", price: 9.95, cycle: "monthly", cat: "Sonstiges", color: "#F8991C" },
        { name: "Dropbox Plus", price: 11.99, cycle: "monthly", cat: "Cloud", color: "#0061FF" },
        { name: "Nintendo Switch Online", price: 19.99, cycle: "yearly", cat: "Gaming", color: "#E60012" },
        { name: "PlayStation Plus", price: 71.99, cycle: "yearly", cat: "Gaming", color: "#00439C" },
        { name: "Xbox Game Pass", price: 14.99, cycle: "monthly", cat: "Gaming", color: "#107C10" },
        { name: "Headspace", price: 57.99, cycle: "yearly", cat: "Fitness", color: "#F47C7C" },
        { name: "Blinkist", price: 79.99, cycle: "yearly", cat: "Sonstiges", color: "#2CE080" },
        { name: "Office 365", price: 69.00, cycle: "yearly", cat: "Software", color: "#EB3C00" },
        { name: "DAZN", price: 29.99, cycle: "monthly", cat: "Streaming", color: "#000000" },
        { name: "Sky Ticket", price: 19.99, cycle: "monthly", cat: "Streaming", color: "#F50057" },
    ];

    console.log(`Erstelle ${subscriptions.length} Abonnements...`);

    let createdCount = 0;
    try { fs.unlinkSync('seed_errors.log'); } catch (e) { }

    for (const sub of subscriptions) {
        const nextBilling = new Date();
        nextBilling.setDate(nextBilling.getDate() + Math.floor(Math.random() * 30));

        const payload = {
            name: sub.name,
            price: sub.price,
            billingCycle: sub.cycle,
            nextBillingDate: nextBilling.toISOString().split('T')[0],
            categoryId: getCategoryIdByName(sub.cat),
            userId: DEMO_USER_ID,
            isActive: true,
            notes: `Test Subscription for ${sub.name}`,
            color: sub.color
        };

        try {
            const res = await fetch(`${API_URL}/subscriptions`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                createdCount++;
                const data = await res.json();

                // Erinnerung
                const reminderDate = new Date(nextBilling);
                reminderDate.setDate(reminderDate.getDate() - 3);

                const remRes = await fetch(`${API_URL}/reminders`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        title: `Zahlung für ${sub.name}`,
                        description: `Abo verlängert sich bald (${sub.price}€)`,
                        reminderDate: reminderDate.toISOString().split('T')[0],
                        isActive: true,
                        type: 'renewal',
                        subscriptionId: data.id
                    })
                });

                if (!remRes.ok) {
                    const txt = await remRes.text();
                    fs.appendFileSync('seed_errors.log', `Reminder failed for ${sub.name}: ${remRes.status} ${txt}\n`);
                }
            } else {
                const errText = await res.text();
                fs.appendFileSync('seed_errors.log', `Subscription failed for ${sub.name}: ${res.status} ${errText}\n`);
            }
        } catch (error) {
            fs.appendFileSync('seed_errors.log', `Request failed for ${sub.name}: ${error}\n`);
        }
    }

    console.log(`✅ Fertig! ${createdCount} von ${subscriptions.length} Abos erstellt.`);
}

seed();
