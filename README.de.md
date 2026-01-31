# ⌨️ Tippsy Tries Typing

[🇺🇸 English Version](README.md)

**Lerne das 10-Finger-System spielerisch und interaktiv.**  
Keine Langeweile, nur Fortschritt.

Tippsy Tries Typing ist ein webbasierter Tipptrainer mit **zwei Tastaturlayouts** (QWERTZ für Deutsch, QWERTY für US) und **zwei Sprachen** (Deutsch und Englisch). Beim ersten Start wählst du Sprache und Layout; beides kannst du jederzeit in den Einstellungen ändern. Mit strukturierten Lektionen, dem Lernbegleiter Tippsy und klaren Statistiken verbesserst du Schritt für Schritt deine Tippgeschwindigkeit und Genauigkeit.

---

## 📸 Screenshots

| Start & Tutorial | Hauptmenü – Lernpfad |
|------------------|----------------------|
| ![Willkommen](screenshots/01-start-screen.png) | ![Hauptmenü](screenshots/05-main-menu.png) |

| Statistik | Übung abgeschlossen |
|-----------|----------------------|
| ![Statistik](screenshots/06-statistics.png) | ![Fertig](screenshots/07-finished.png) |

| Beim Tippen | Lektion wird geladen |
|-------------|----------------------|
| ![Spiel](screenshots/08-playing.png) | ![Laden](screenshots/09-loading.png) |

*Grundstellung lernen – „Deine Hände sind das Werkzeug“:*  
![Tutorial Hände](screenshots/02-tutorial-hands.png)

---

## Was ist Tippsy Tries Typing?

- **Geführter Lernpfad:** Über 15 Stufen von den Zeigefingern (F & J) bis zu Sonderzeichen und „Endless Zone“.
- **Tippsy als Begleiter:** Ein freundlicher Lernbegleiter führt dich durch die Lektionen.
- **Zwei Sprachen:** App auf **Deutsch** und **Englisch**; Auswahl beim ersten Start oder in den Einstellungen.
- **Zwei Tastaturlayouts:** Wähle **QWERTZ (Deutsch)** oder **QWERTY (US)**; QWERTZ inkl. Ä, Ö, Ü, ß und Sonderzeichen.
- **Finger-Zuordnung:** Jede Taste ist einem Finger zugeordnet; farbige virtuelle Tastatur und Hinweise (z. B. „Rechter Zeigefinger“).
- **Statistik:** WPM, Genauigkeit, Fehler, Spielzeit und Fortschritt pro Stufe und über alle Sessions.
- **Verschiedene Modi:** Standard-Lektionen, Freies Üben pro Stufe, Wörter & Sätze.

---

## 🚀 Installation

### Docker (empfohlen)

Wenn du nicht lokal bauen möchtest, kannst du das bereitgestellte Docker-Image aus der GitHub Container Registry nutzen:

```bash
docker pull ghcr.io/timbornemann/tippsy:latest
```

```bash
docker run -d --name tippsy -p 3300:80 ghcr.io/timbornemann/tippsy:latest
```

Die App ist danach unter **http://localhost:3300** erreichbar.

#### Automatische Updates mit Watchtower

Damit der Container stets aktuell bleibt, kannst du [Watchtower](https://containrrr.dev/watchtower/) verwenden. Es prüft regelmäßig auf neue Images und startet betroffene Container neu.

**Alle Container überwachen:**

```bash
docker run -d --name watchtower --restart unless-stopped -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower --interval 3600
```

**Nur diesen Container aktualisieren:**

```bash
docker run -d --name watchtower --restart unless-stopped -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower tippsy --interval 3600
```

**Einmalig prüfen und beenden:**

```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower tippsy --run-once
```

#### Docker Compose: Image selbst bauen

Die Anwendung kannst du auch komplett mit Docker Compose ausführen; dabei wird automatisch ein Image gebaut.

1. Repository klonen und in das Projektverzeichnis wechseln.
2. Container bauen und starten (optional mit gesetzter Versionsnummer):

```bash
VERSION=$(git describe --tags --abbrev=0) docker compose up --build -d
```

Der Dienst lauscht auf Port **3300**. Im Browser unter **http://localhost:3300** erreichbar. Mit `docker compose down` kannst du den Container stoppen.

---

### Lokale Entwicklung

**Voraussetzungen:** [Node.js](https://nodejs.org) v18 oder neuer.

1. **Projekt klonen und Verzeichnis wechseln**

   ```bash
   git clone <repository-url>
   cd Tippsy
   ```

2. **Abhängigkeiten installieren**

   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**

   ```bash
   npm run dev
   ```

   Die App läuft z. B. unter `http://localhost:5173`. Im Browser öffnen und loslegen.

**Produktion bauen:**

```bash
npm run build
npm run preview
```

`npm run build` erzeugt die Dateien in `dist/`. Mit `npm run preview` kannst du den Build lokal testen.

---

## 📖 Nutzung

1. **Erster Start**  
   Beim ersten Besuch siehst du den Willkommensbildschirm. Mit **„Los geht's“** oder **Enter** startest du.

2. **Tutorial**  
   Du wirst durch die Grundstellung geführt (F und J, alle 8 Grundstellungstasten). So lernst du die richtige Handhaltung.

3. **Hauptmenü**  
   Im **Lern-Abenteuer** siehst du alle Stufen. Die aktuelle Stufe ist hervorgehoben; Fortschritt und Level (1–10 pro Stufe) werden angezeigt.  
   - **Level starten:** Stufe auswählen und gewünschtes Level anklicken (oder Tastatur: Pfeiltasten, Enter).  
   - **Freies Üben** bzw. **Wörter & Sätze** pro Stufe sind über die jeweiligen Karten erreichbar.

4. **Übung**  
   - Zeichen erscheinen nacheinander; tippe sie mit dem angezeigten Finger.  
   - Die virtuelle Tastatur zeigt die nächste Taste farbig an.  
   - Oben siehst du WPM, Fehler und Fortschritt.

5. **Nach der Übung**  
   Du erhältst eine Auswertung (WPM, Genauigkeit, Fehler, Zeit, Zeichen).  
   - **Weiter** (oder Enter): nächste Übung/Level.  
   - **Wiederholen:** gleiche Übung nochmal.  
   - **Menü** (oder Esc): zurück ins Hauptmenü.

6. **Statistik**  
   Über **„Dein Profil“** / Statistik erreichst du getippte Zeichen, Spielzeit, Rekord-WPM, absolvierte Übungen, Durchschnitts-WPM und Genauigkeit.

7. **Einstellungen**  
   In den **Einstellungen** (Zahnrad) kannst du **Sprache** (Deutsch / Englisch) und **Tastaturlayout** (QWERTZ / QWERTY) jederzeit ändern.

### Tastenkürzel (Auswahl)

- **Enter** – Starten / Weiter  
- **Esc** – Zurück zum Menü (z. B. aus Statistik oder Ergebnis)  
- **Pfeiltasten / W A S D** – Im Menü zwischen Stufen und Leveln navigieren  

---

## 🛠 Technik

- **React 19** + **TypeScript**
- **Vite 6** (Build & Dev-Server)
- **Tailwind-kompatible** Utility-Klassen (u. a. für Dark Theme)
- **Lucide React** für Icons

---

## 📄 Lizenz

Dieses Projekt steht unter der [GNU General Public License v3.0](LICENSE) (GPL-3.0).

---

*Viel Erfolg beim Tippen lernen mit Tippsy!* ⌨️
