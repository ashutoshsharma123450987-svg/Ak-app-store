# AK Apps Store – Website (GitHub Pages)

## 1. Files ka structure
```
index.html
style.css
script.js
apps.json        <- yahan apni apps add karein
logo.png         <- aapka logo (zaroori)
icons/           <- har app ka icon (png)
apk/             <- APK files (ya GitHub Releases use karein)
```

## 2. Logo lagana
Apna logo `logo.png` naam se isi folder mein rakhein (root mein, `index.html` ke bagal mein).

## 3. Nayi app add karna
`apps.json` mein ek naya block jodein:
```json
{
  "name": "My App",
  "category": "Tools",
  "description": "Short description",
  "version": "1.0",
  "size": "15 MB",
  "rating": "4.6",
  "icon": "icons/myapp.png",
  "apk": "apk/myapp.apk"
}
```
Badi APK (25 MB+) ke liye GitHub **Releases** mein upload karein aur uska direct link `apk` mein daalein.
Note: GitHub par single file ki limit 100 MB hai.

## 4. GitHub par live karna (free)
1. github.com par naya repository banayein, jaise `ak-apps-store` (Public).
2. Saari files upload karein (Add file → Upload files).
3. Settings → Pages → Source: **Deploy from a branch** → Branch: `main` / `(root)` → Save.
4. 1–2 minute baad site live hogi: `https://USERNAME.github.io/ak-apps-store/`

## 5. Earning setup
- `script.js` ke upar `CONFIG` mein apna email aur Telegram daalein.
- `index.html` mein **Advertisement** wale 3 slots hain (top, mid, download popup). Wahan apna ad code paste karein.
- **Google AdSense**: `<head>` mein commented script uncomment karke apna `ca-pub-...` ID daalein. AdSense approval aam taur par custom domain aur original content maangta hai.
- Alternatives: Adsterra, Monetag, PropellerAds (jinki approval aasan hoti hai).
- Download popup mein 5 second ka ad-countdown hai, jisse ad impressions badhte hain.

## 6. Zaroori suggestions
- Ek Privacy Policy page banayein (AdSense ke liye zaroori).
- Sirf apni banayi hui, original apps hi daalein. Kisi aur ki cracked/modded APK daalne par site band ho sakti hai aur ads account ban ho sakta hai.
