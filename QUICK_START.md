# SÜRƏTLI BAŞLANĞIC BƏLƏDÇI - VERCEL DEPLOY

## 📋 Tələb olunanlar
✅ Node.js v18+ (node -v ilə yoxla)  
✅ npm v9+ (npm -v ilə yoxla)  
✅ Git qurulu  
✅ Vercel hesabı (vercel.com)  
✅ Railway hesabı (railway.app)  

---

## ⚡ 5 DAQİQƏ-DƏ DEPLOY

### Addım 1: Local Test Et
```bash
# Backend-i test et
cd server
npm install
npm start
# Terminal-da: "Server running on port 3000" görməli

# Yeni terminal açıq
cd client
npm install
npm run dev
# http://localhost:5173 aç
```

### Addım 2: Backend-i Containerize Et (Railway üçün)
Backend qovluğunda already `Dockerfile` var ✅

### Addım 3: Railway-ə Push Et
```bash
# 1. Git repo-suna push et (GitHub-a)
git add .
git commit -m "Vercel deploy hazırlaması"
git push

# 2. railway.app-da yeni layihə yarat
# - New Project → Deploy from GitHub repo seç
# - Repo-nu seç
# - Railway-in URL-ni kopyala (məs: your-app.up.railway.app)
```

### Addım 4: Vercel-ə Deploy Et
```bash
# Vercel CLI qur
npm install -g vercel

# Vercel-ə daxil ol və deploy et
vercel --prod

# Sualları cavablandır:
# "Which project?" → makler-az
# "Directory?" → client
# "Build command?" → npm run build (Enter)
```

### Addım 5: Ortam Dəyişənini Ayarla
1. **Vercel Dashboard**-a git
2. Layihə → Settings → Environment Variables
3. Əlavə et:
   ```
   VITE_API_URL = https://your-railway-url.up.railway.app
   ```
4. Redeploy et (Vercel → Deployments → Redeploy)

---

## ✅ Test Et
1. https://your-vercel-app.vercel.app aç
2. **Admin Login-ə git:**
   - İstifadəçi: `Feqan`
   - Şifrə: `Feqan1234F`
3. Yeni elan əlavə et (rəsim upload et)
4. Home-da görün

---

## 🔗 Faydalı Linkləri

| Xidmət | URL | Nə üncün |
|--------|-----|----------|
| Vercel Dashboard | https://vercel.com/dashboard | Deployments idarə et |
| Railway Dashboard | https://railway.app | Backend sehat-ını gör |
| API Base | Railway URL | Bütün API sorğuları buradan |

---

## ⚠️ Rast Gəlinən Problemlər

### ❌ "CORS xətası"
**Həlli:** Server-də CORS aktif (Dockerfile-da görə bilərsən)

### ❌ "API 404 xətası"
**Həlli:** Vercel Environment Variables-da `VITE_API_URL` düzgün qurulu?

### ❌ "Database xətası"
**Həlli:** Railway-də logları yoxla → Deployments → Logs

### ❌ "Upload işləmir"
**Həlli:** Railway-də volumes yaratmansa, serverless platformda uploads işləmir. **Çözüm:** Image URL-lərini (imgix, Cloudinary) istifadə et

---

## 🚀 İyunlaşdırma (Production)

```bash
# Local dəyişiklər
git add .
git commit -m "Yeni xüsusiyyətləri əlavə et"
git push

# Railway otomatik redeploy edir
# Vercel-ə əl ilə push etmən lazımsa:
vercel --prod
```

**Ehtiyac? `#help` mesaj yaz!**
