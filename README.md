# "Xaritamiz" — Aqlli Shahar va Dam Olish Marshrutlari Platformasi

> **Toshkent shahrining eng saralangan lokatsiyalari bo‘yicha soatbay, tayyor dam olish rejasi, Near Me radari va Claude AI aqlli yo‘lboshchisi.**
> Mobilga moslashgan zamonaviy veb-ilova va **Telegram WebApp (TMA)** sifatida ishlaydi.

---

## 🌟 Asosiy Xususiyatlar va Imkoniyatlar

### 1. 4 Bosqichli Tezkor Tanlov (Core Flow)
Foydalanuvchini charchatuvchi 20 ta so‘rovnomasiz, bor-yo‘g‘i 4 ta tezkor filtr:
* **Kim bilan?** (Juftlik / Do‘stlar bilan / Oila / Yolg‘iz)
* **Kayfiyat/Vibe:** (Sokin & Tabiat / Shahar & Jonli / Estetik & Qahva / Sarguzasht & Faol / Tungi shahar)
* **Byudjet:** (Tejamkor: 20k-60k / O‘rtacha: 70k-160k / Premium: 200k+)
* **Vaqt oralig‘i:** (2-3 soatlik oqshom / Yarim kun: 4-5 soat / Butun kun: 10:30-21:00)
* **AI Smart Prompt (Gibrid LLM):** Nostandart istaklar (masalan: *"Mashinada oqshom aylanib, sokin qahva ichadigan joy"*) uchun aqlli kalit so‘zlar tahlili va filtr adaptatsiyasi.
* **🎲 "Taqdirga topshirish" (Roulette):** O‘ylab o‘tirishni istamaganlar uchun bitta tugma bilan tasodifiy, ammo tekshirilgan va ajoyib sarguzasht marshruti.

### 2. "Menga yaqin joylar" (Near Me Radar) Moduli
* **Geolokatsiya va Haversine masofasi:** Brauzerning GPS geolokatsiyasi (`navigator.geolocation`) yoki Toshkent markazi asosida har bir joygacha bo‘lgan masofani aniq hisoblash (*"114 m yaqinlikda"*, *"2.4 km yaqinlikda"*).
* **Eng yaqindan uzoqqa saralash (Sort by distance):** Barcha nuqtalar doimo foydalanuvchiga eng yaqinidan boshlab o‘sish tartibida joylashadi.
* **Toifalar (Category Chips):** Barchasi, Restoran & Kafe, Qahvaxonalar, Bog‘lar & Sayrgoh, Ko‘ngilochar & O‘yin.
* **Hamroh teglari (Audience Filters):** Juftlik, Do‘stlar bilan, Oila bilan, Yakka o‘zi.
* **Masofa radiusi:** Cheksiz, < 1 km, < 3 km, < 5 km, < 10 km.
* **Barcha filtrlarni tozalash (Reset):** Bitta bosishda barcha filtrlarni bekor qilib, to‘liq ro‘yxatni ko‘rish.
* **Rejamga qo‘shish:** Yaqin atrofdagi joylarni saralab olib, bitta tugma bilan xronologik shaxsiy marshrutga aylantirish.

### 3. Natijalar Sahifasi & Xronologik Reja
* **Vaqt chizig‘i (Timeline):** Soatbay ketma-ketlik (masalan: 18:45 Qahva/Nonushta ➔ 20:15 Teatr/Kechki ovqat).
* **Insayd-maslahatlar:** Har bir lokatsiya uchun Toshkentliklarga xos 1 jumlalik jonli tavsiyalar (*"Ertalab soat 09:30 gacha keling: yangi pechdan chiqqan kruassan tutuni chiqib turgan holda tatib ko‘ring"*, *"Balkon qismiga oldindan bron qiling"*).
* **Taksi & Xaritalar integratsiyasi:** Har bir nuqta ostida to‘g‘ridan-to‘g‘ri **Yandex Go** (taksi chaqirish) va **Yandex Xarita** tashqi havolalari.
* **Bekatni almashtirish (Shuffle Stop):** Yoqmagan bitta bekatni boshqa mos lokatsiyaga bir zumda almashtirish.

### 3. Virusli Tarqalish Mexanikalari (Growth Hacks)
* **🗳️ "Guruhda ovoz berish" (Poll mode):** Marshrut havolasini Telegram guruhga yuborish va do‘stlar bilan har bir nuqtaga "Boramiz 👍" / "Boshqasi 👎" deb ovoz berish paneli.
* **📸 Instagram Stories kartasi:** 9:16 vertikal formatdagi estetik, neon gradientli vizual kartani bitta tugma bilan **PNG rasm** qilib saqlab olish (`html-to-image`).
* **✈️ Telegramga yuborish:** Generatsiya qilingan marshrut parametrlarini URL orqali do‘stlarga yuborish.

---

## 🛠️ Texnologik Stek

* **Frontend Framework:** Next.js (App Router), React 19, TypeScript
* **Styling:** Tailwind CSS v4, Glassmorphism, CSS Variables
* **Animatsiya va Ikonkalar:** Lucide Icons, Framer Motion, Canvas Confetti
* **Eksport va Media:** `html-to-image` (Instagram Story vizual kartasi)
* **Platforma moslashuvi:** Telegram WebApp (TMA script va Haptic Feedback)
* **Lokal Baza (Seed):** Toshkent shahar va Bo‘stonliq/Chimyon/Amirsoy bo‘yicha 32 ta eng saralangan lokatsiyalar.

---

## 🚀 Ishga Tushirish

Loyihani o‘rnatish va ishga tushirish:

```bash
# Kutubxonalarni o'rnatish
npm install

# Dasturchi rejimida ishga tushirish (Dev server)
npm run dev

# Production build qilish
npm run build

# Production serverni ishga tushirish
npm run start
```

Standart port: `http://localhost:3000`

---

## 📂 Loyiha Tuzilmasi

```
src/
├── app/
│   ├── globals.css         # Dark/Light mavzular, glassmorphism
│   ├── layout.tsx          # Telegram WebApp script, metadata va viewport
│   └── page.tsx            # Asosiy sahifa va holat boshqaruvi
├── components/
│   ├── Navbar.tsx          # Logotip, roulette tugmasi va mavzu almashtirgich
│   ├── QuizFilter.tsx      # 4 bosqichli tezkor filtr + AI prompt
│   ├── LocationCard.tsx    # Bekat kartasi, insayd maslahat, Yandex Go
│   ├── RouteResult.tsx     # Xronologik timeline va pastki action bar
│   ├── PollModal.tsx       # Guruhda ovoz berish modali (Poll mode)
│   └── StoryModal.tsx      # 9:16 Instagram Story eksport modali
├── data/
│   └── locations.ts        # Toshkent lokatsiyalari bazasi (32 ta obyekt)
├── lib/
│   ├── routeGenerator.ts   # Skoring va diversifikatsiyalangan marshrutlash
│   └── utils.ts            # Yandex Go, xaritalar va TMA Haptic yordamchilari
└── types/
    └── index.ts            # TypeScript interfeyslari (Location, Route, Filters)
```
