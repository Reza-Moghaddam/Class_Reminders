<div align="center">

# 📚 Class Reminder Bot

### ربات تلگرامی یادآوری کلاس‌های دانشگاه

هر شب، برنامهٔ کلاسیِ **فردا** را خودکار به یک گروه یا تاپیک تلگرام می‌فرستد —
ساخته‌شده با Cloudflare Workers، بدون سرور، بدون هزینه.

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Telegram Bot API](https://img.shields.io/badge/Telegram-Bot%20API-26A5E4?style=flat-square&logo=telegram&logoColor=white)](https://core.telegram.org/bots/api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](#-لایسنس)

</div>

---

## ✨ ویژگی‌ها

- 🕘 **ارسال خودکار شبانه** — هر روز در ساعتی که خودت تعیین می‌کنی (پیش‌فرض ۲۱:۰۰ به وقت تهران)
- 🗓 **تشخیص هفتهٔ فرد/زوج** — دروسی که فقط هفته درمیان برگزار می‌شن رو درست تشخیص می‌ده
- 📍 **پشتیبانی از تاپیک‌های گروه (Forum Topics)** — پیام رو مستقیم تو تاپیک دلخواه می‌فرسته
- 📆 **تاریخ جلالی (فارسی)** — تاریخ فردا رو به‌صورت شمسی نشون می‌ده
- 🧪 **مسیرهای تست دستی** — بدون نیاز به صبر برای cron، هر وقت خواستی پیام رو تست کن
- ☁️ **کاملاً سرورلس** — روی Cloudflare Workers اجرا می‌شه؛ بدون نیاز به هاست یا سرور شخصی
- 🔒 **بدون هیچ اطلاعات حساس در کد** — توکن و شناسه‌ها همه به‌صورت Secret ذخیره می‌شن

---

## 📸 نمونهٔ پیام

```
📚 یادآوری کلاس‌های فردا
🗓 شنبه، ۱۲ دی ۱۴۰۵

۱. ترمودینامیک (۲)
🕐 ۰۷:۳۰ - ۰۹:۰۰
📍 علامه طباطبایی۳۰۶

۲. دینامیک
🕐 ۰۹:۱۵ - ۱۳:۰۰
📍 علامه طباطبایی۲۰۲
```

---

## 🚀 شروع سریع

### پیش‌نیازها
- یک حساب [Cloudflare](https://dash.cloudflare.com/sign-up) (رایگان)
- Node.js نصب‌شده روی سیستم
- یک ربات تلگرام (از [@BotFather](https://t.me/BotFather) بساز)

### نصب

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
npm install -g wrangler
wrangler login
```

### تنظیم Secrets

```bash
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_CHAT_ID
wrangler secret put TEST_SECRET
wrangler secret put REFERENCE_DATE
wrangler secret put TELEGRAM_THREAD_ID   # اختیاری — برای ارسال به یک تاپیک خاص
```

### دیپلوی

```bash
wrangler deploy
```

همین! ربات هر شب طبق زمان‌بندی cron خودکار اجرا می‌شه. 🎉

---

## 📖 راهنمای کامل

<details>
<summary><b>۱. ساخت ربات تلگرام</b></summary>
<br>

1. در تلگرام به [@BotFather](https://t.me/BotFather) پیام بده و `/newbot` رو بزن.
2. یک نام و یوزرنیم انتخاب کن. در پایان یک **توکن** می‌گیری (مثل `123456789:AAF...`).
3. ربات رو به گروه موردنظر اضافه کن.

</details>

<details>
<summary><b>۲. گرفتن Chat ID گروه</b></summary>
<br>

1. یک پیام ساده در گروه بفرست.
2. این آدرس رو در مرورگر باز کن (به‌جای `<TOKEN>` توکن ربات رو بذار):
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. دنبال `"chat":{"id": -1001234567890, ...}` بگرد؛ همون عدد (منفی) chat id توئه.

</details>

<details>
<summary><b>۳. تشخیص هفتهٔ فرد/زوج (REFERENCE_DATE)</b></summary>
<br>

اگر بعضی از درس‌هات فقط هفتهٔ فرد یا زوج برگزار می‌شن، باید یک تاریخ
مرجع بدی که می‌دونی «هفتهٔ فرد» بوده (مثلاً اولین شنبهٔ ترم)، به فرم
میلادی `YYYY-MM-DD`. اگر تنظیم نشه، ربات این محدودیت رو نادیده می‌گیره.

</details>

<details>
<summary><b>۴. ارسال به یک تاپیک خاص (Forum Topics)</b></summary>
<br>

اگر گروهت حالت Topics فعال داره و می‌خوای پیام فقط تو یک تاپیک خاص بره:

1. داخل همون تاپیک یک پیام تستی بفرست.
2. `https://api.telegram.org/bot<TOKEN>/getUpdates` رو باز کن و دنبال
   `"message_thread_id"` بگرد.
3. این عدد رو با `wrangler secret put TELEGRAM_THREAD_ID` تنظیم کن.

</details>

<details>
<summary><b>۵. تست دستی بدون صبر برای cron</b></summary>
<br>

بعد از دیپلوی، دو مسیر تست در دسترس داری:

| مسیر | کاربرد |
|---|---|
| `/preview` | فقط نمایش متن پیام، بدون ارسال |
| `/send?secret=<TEST_SECRET>` | ارسال واقعی پیام به گروه |

</details>

<details>
<summary><b>۶. تغییر زمان ارسال</b></summary>
<br>

در `wrangler.toml` مقدار `crons` رو عوض کن. Cloudflare همیشه با وقت
**UTC** کار می‌کنه؛ ایران بدون تغییر ساعت فصلی روی UTC+3:30 هست. برای
مثال، ارسال ساعت ۲۰:۰۰ تهران می‌شه:

```toml
crons = ["30 16 * * *"]
```

</details>

<details>
<summary><b>۷. تغییر برنامهٔ درسی</b></summary>
<br>

آرایهٔ `SCHEDULE` در `src/index.js` رو ویرایش کن — برای هر درس روز هفته
(`day`: ۰=یکشنبه تا ۶=شنبه)، فرد/زوج بودن (`weekParity`)، ساعت و مکان
رو مشخص کن. بعد دوباره `wrangler deploy` بزن.

</details>

---

## 🗂 ساختار پروژه

```
.
├── src/
│   └── index.js        # منطق اصلی: برنامهٔ کلاسی + ارسال به تلگرام
├── wrangler.toml        # تنظیمات Worker و زمان‌بندی cron
├── package.json
├── .dev.vars.example    # نمونهٔ متغیرهای محیطی برای تست محلی
└── .gitignore
```

---

## 🔒 امنیت

هیچ‌کدام از مقادیر حساس (توکن ربات، chat id، شمارهٔ تاپیک) داخل کد یا
`wrangler.toml` نوشته نشده‌اند. همه با `wrangler secret put` مستقیم
روی Cloudflare ذخیره می‌شوند و هرگز در ریپازیتوری دیده نمی‌شوند.

---

## 📄 لایسنس

MIT — آزاد برای استفاده، تغییر و توزیع.

<div align="center">

ساخته‌شده با ❤️ روی Cloudflare Workers

</div>
