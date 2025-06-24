# 🌐 Tarang – Uninterrupted Communication, Anytime, Anywhere

Tarang is a **disaster-resilient Progressive Web App (PWA)** built to enable emergency communication **without the internet or cellular network** during critical situations like floods, earthquakes, or power outages. It empowers people with offline SOS messaging, cached maps, local peer-to-peer alert sharing, and multilingual support – even on low-end Android devices.

## 🚨 Why Tarang?

In times of disaster, traditional communication systems often fail. This leads to:
- ❌ Delayed rescue operations  
- ❌ Spread of misinformation  
- ❌ Inability to reach volunteers or shelters  

**Tarang bridges this gap** by offering offline-first tools to stay connected and safe when infrastructure collapses.

---

## ✨ Key Features

- 📶 **Offline SOS Communication**  
  Send/receive help or volunteer requests, queued and synced when online.

- 🌍 **Offline Map Integration**  
  View cached maps with shelter locations and safe routes.

- 📡 **Peer-to-Peer Bluetooth Alerts**  
  Share emergency updates via Web Bluetooth API.

- 🗣️ **Multilingual Interface**  
  Available in Hindi, English, and more for regional accessibility.

- 🔋 **Optimized for Low Battery/Storage**  
  Designed for resilience on basic Android devices.

---

## 🔧 Tech Stack

| Layer            | Tech Used                             |
|------------------|----------------------------------------|
| **Frontend**     | React, TypeScript, Tailwind CSS        |
| **Offline PWA**  | Service Workers, IndexedDB, Manifest   |
| **Maps**         | Leaflet.js (offline tile caching), GPS |
| **Sync/Hosting** | GitHub Pages, Vercel                   |
| **Database**     | MongoDB                                |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/CodeBytes0101/Tarang.git
cd Tarang
```
### 2. Install dependencies
```
npm install
```
### 3. Run the app
```
npm run dev
```
## Future Scope
 * Full map caching and real-time sync logic
 * Integration with Aadhaar/Digilocker APIs for verified identity
 * AI-based alert verification to prevent false signals
 * NGO collaboration for on-ground deployment
 * Regional data packs for nationwide rollout
