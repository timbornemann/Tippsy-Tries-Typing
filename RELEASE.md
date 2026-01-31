# Tippsy – Release Notes

## Summary

Tippsy is a web-based touch typing trainer. It offers a structured learning path, an on-screen companion, and clear statistics so you can improve speed and accuracy step by step. The app runs in the browser and supports two languages and two keyboard layouts out of the box.

---

## Features

### Learning

- **Guided learning path:** More than 15 stages from the index fingers (F and J) through the full keyboard to special characters and an "Endless Zone."
- **Stages and levels:** Each stage has multiple levels (1–10) with standard lessons and optional master tests.
- **Free practice:** Practice any unlocked stage with mixed drills.
- **Words and sentences:** Type real words and sentences per stage for more natural practice.
- **Tutorial:** Optional start screen and home-row tutorial ("Your hands are the tool") to establish correct hand position.

### Language and keyboard

- **Two languages:** Interface and content in **English** and **German**. Language is chosen at first start and can be changed in Settings.
- **Two keyboard layouts:** **QWERTZ (German)** and **QWERTY (US)**. Layout is chosen at first start and can be changed in Settings. QWERTZ includes Ä, Ö, Ü, ß and special characters.

### Interface and feedback

- **Virtual keyboard:** On-screen keyboard with finger colors and the next key highlighted.
- **Finger hints:** Each key is assigned to a finger; hints (e.g. "Right index finger") are shown during exercises.
- **WPM and accuracy:** Live display of words per minute, errors, and progress during each exercise.
- **Results screen:** After each exercise: WPM, accuracy, errors, time, and characters typed; options for Next, Retry, or back to Menu.

### Statistics and progress

- **Profile and statistics:** Total characters typed, playtime, record WPM, completed exercises, average WPM, and average accuracy.
- **Per-stage progress:** Current stage and level are tracked; progress is stored locally on the device.
- **Session history:** Optional tracking of WPM and accuracy over time.

### Settings

- **Language:** Switch between English and German.
- **Keyboard layout:** Switch between QWERTZ and QWERTY.
- **Sound:** Optional sound effects (can be turned off).
- **Data:** Export and import progress (JSON); option to reset progress.

### Shortcuts

- **Enter** – Start / Next
- **Esc** – Back to menu (e.g. from statistics or results)
- **Arrow keys / W A S D** – Navigate between stages and levels in the main menu

---

## Installation

### Docker (recommended)

Pre-built image from GitHub Container Registry:

```bash
docker pull ghcr.io/timbornemann/tippsy:latest
docker run -d --name tippsy -p 3300:80 ghcr.io/timbornemann/tippsy:latest
```

The app is available at **http://localhost:3300**.

Use [Watchtower](https://containrrr.dev/watchtower/) to automatically update the container. To build and run with Docker Compose from the repository:

```bash
VERSION=$(git describe --tags --abbrev=0) docker compose up --build -d
```

### Local development

**Requirements:** Node.js v18 or newer.

```bash
git clone <repository-url>
cd Tippsy
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Production build:

```bash
npm run build
npm run preview
```

---

## Technology

- **React 19** and **TypeScript**
- **Vite 6** for build and dev server
- **Tailwind-compatible** utility CSS (including dark theme)
- **Lucide React** for icons

---

## License

This project is licensed under the **GNU General Public License v3.0** (GPL-3.0). See the [LICENSE](LICENSE) file for details.

---

## Documentation

- [README](README.md) (English)
- [README.de.md](README.de.md) (German)
