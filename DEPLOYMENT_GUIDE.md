# Vercel-ə Deploy Etmə Bələdçisi

## 🎯 Addım-addım Təlimatlar

### 1️⃣ Frontend-i Vercel-ə Deploy Et

```bash
# Layihəyə daxil ol
cd c:\Users\seidi\Desktop\makler-az-main

# Vercel CLI-ni qur
npm install -g vercel

# Deploy et
vercel
```

**Sualları belə cavablandır:**
- `Which scope do you want to deploy to?` → Şəxsi hesab seç
- `Link to existing project?` → No
- `Project name?` → makler-az
- `Directory to deploy?` → client
- `Override settings?` → No

---

### 2️⃣ Backend-i Railway-ə Deploy Et

#### Railway.app Hesab Aç
1. https://railway.app adresində qeydiyyatdan keç (GitHub ilə)
2. "New Project" → "Deploy from GitHub repo"
3. Reponu seç

#### Dockerfile Yarat

`server/Dockerfile` faylı yarat:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

#### railway.json Konfigurasyonu

`server/railway.json` faylı yarat:

```json
{
  "build": {
    "builder": "dockerfile"
  },
  "deploy": {
    "startCommand": "npm start",
    "numReplicas": 1
  }
}
```

---

### 3️⃣ Vercel-də Ortam Dəyişənlərini Ayarla

1. Vercel Dashboard-a git → Layihə → Settings
2. **Environment Variables** bölməsinə git
3. Əlavə et:

```
VITE_API_URL = https://your-railway-app.up.railway.app
```

---

### 4️⃣ Frontend-də API URL-ni Dəyiş

`client/src/api.js` faylı yarat:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  login: (username, password) =>
    fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }),

  // Digər endpoints...
};
```

---

### 5️⃣ Localhost-da Test Et

```bash
# Terminal 1 - Backend
cd server
npm install
npm start

# Terminal 2 - Frontend
cd client
npm install
npm run dev

# http://localhost:5173 aç
```

---

## 🔒 Monitorlaş

**Railway Dashboard:**
- Logs → Problemləri gör
- Deployments → Versiya tarixi

**Vercel Dashboard:**
- Deployments → Qurulma statusu
- Analytics → İstifadə metrikaları

---

## ⚠️ Ümumi Problemlər

| Problem | Həlli |
|---------|------|
| CORS xətası | Server-də CORS müəyyən et |
| 404 API | `VITE_API_URL` dəyişənini yoxla |
| Database xətası | Railway-də database bağlantısını yoxla |
| Upload problemləri | Railway-də `/uploads` qovluğunu yarat |
