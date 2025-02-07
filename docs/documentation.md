# EvalEase - Survey Authoring System

EvalEase ist eine webbasierte Anwendung zur Erstellung und Verwaltung von Umfragen.  
Sie umfasst einen **Admin-Bereich für Professoren** zur Umfrageerstellung sowie eine **mobile Darstellung für Studenten**, um Umfragen bequem auszufüllen.

## Tech-Stack

### **Frontend:**

- **Vite**
- **React**
- **TypeScript**
- **TailwindCSS**
- **Heroicons**
- **Recharts**
- **react-wordcloud**
- **qrcode**

### **Backend:**

- **Express.js**
- **MongoDB mit Mongoose**

## Architektur & Implementierung

Die Anwendung folgt einer **klassischen Client-Server-Architektur**:

- Das **Frontend (React)** kommuniziert über eine **REST-API** mit dem **Backend (Express)**.
- Die **Datenbank (MongoDB oder JSON-Dateien)** speichert Umfragen.
- **State-Management** erfolgt über `useState`, `useMemo` sowie `react-query` für asynchrones Caching.

### **Wichtige Komponenten:**

- **Frontend:** Modular aufgebaut mit separaten (wiederverwendbaren) Komponenten für UI, Logik und API-Zugriffe.
- **Backend:** Trennung von Controller-, Service- und Datenbanklogik.
- **Middleware:** Authentifizierung & Validierung in Express über JWT.

---

## Tech-Stack & Entscheidungsgründe

### **Frontend-Technologien:**

- **Vite** → Wird als Build-Tool verwendet, da es deutlich schneller als Webpack ist und eine bessere **Developer Experience (DX)** bietet. Liefert das Grundgerüst für ein Mono-Repository mit **Hot-Reloading**.
- **React mit TypeScript** → React ermöglicht eine **komponentenbasierte Entwicklung**, während TypeScript für **Typensicherheit und Fehlervermeidung** sorgt.
- **TailwindCSS** → Ein **Utility-First-Framework**, das eine schnelle und flexible Gestaltung des UI erlaubt, ohne manuell CSS-Klassen zu schreiben.
- **Heroicons** → Icon-Bibliothek von den Machern von Tailwind für eine konsistente Designsprache.
- **Recharts** → Ermöglicht eine **einfache Visualisierung von Umfragedaten** mit interaktiven Diagrammen sowie individuelle Anpassungen.
- **react-wordcloud** → Wird für die **Analyse und visuelle Darstellung** von häufigen Begriffen in offenen Umfrageantworten genutzt.
- **qrcode** → Generiert **QR-Codes zum Download** für den einfachen Zugriff auf Umfragen per Smartphone und erlaubt **bequemes Teilen**.

### **Backend-Technologien:**

- **Express.js** → Minimalistisches, aber leistungsfähiges Web-Framework für Node.js, das eine schnelle API-Entwicklung ermöglicht. Nutzt Middleware für **Benutzerauthentifizierung**.
- **MongoDB mit Mongoose** → Schema-basierte NoSQL-Datenbank für **flexible Datenspeicherung**. Mongoose wird genutzt, um eine **klare Datenstruktur und Validierung** sicherzustellen.
- **JWT (JSON Web Token)** → **Authentifizierungslösung** für sichere API-Zugriffe und Sitzungsverwaltung.

---

Durch die gewählten Technologien konnten wir eine **effiziente und skalierbare Architektur** schaffen.

- Das **komponentenbasierte Frontend** ermöglicht eine **modulare Erweiterung**.
- Das **leichtgewichtige Backend mit Express** stellt eine **performante API** bereit.
- **MongoDB** erlaubt eine **flexible Speicherung der Umfragedaten**, die sich je nach Anwendungsfall dynamisch anpassen lässt.

**Weitere Details zum Setup und zur Nutzung befinden sich in der [README.md](../README.md).**
