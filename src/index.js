const SCHEDULE = [
  {
    name: 'نقشه‌کشی صنعتی ۲',
    day: 1,
    weekParity: 'odd',
    time: '۰۷:۳۰ - ۱۰:۴۵',
    location: '-'
  }
]
const PERSIAN_WEEKDAYS = [
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
  'شنبه'
]

const TEHRAN_OFFSET_MINUTES = 3 * 60 + 30

function tehranNow () {
  const now = new Date()
  return new Date(now.getTime() + TEHRAN_OFFSET_MINUTES * 60000)
}

function addDaysUTC (date, days) {
  const d = new Date(date.getTime())
  d.setUTCDate(d.getUTCDate() + days)
  return d
}

function getWeekParity (date, referenceDateStr) {
  if (!referenceDateStr) return null
  const ref = new Date(referenceDateStr + 'T00:00:00Z')
  const diffDays = Math.floor((date.getTime() - ref.getTime()) / 86400000)
  const weekNumber = Math.floor(diffDays / 7) + 1
  return weekNumber % 2 === 1 ? 'odd' : 'even'
}

function formatJalali (date) {
  try {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  } catch (e) {
    return date.toISOString().slice(0, 10)
  }
}

function buildReminderMessage (env) {
  const today = tehranNow()
  const tomorrow = addDaysUTC(today, 1)

  const weekday = tomorrow.getUTCDay()
  const weekParity = getWeekParity(tomorrow, env.REFERENCE_DATE)

  const classes = SCHEDULE.filter(
    c =>
      c.day === weekday &&
      (c.weekParity === null || c.weekParity === weekParity)
  ).sort((a, b) => a.time.localeCompare(b.time, 'fa'))

  const dayName = PERSIAN_WEEKDAYS[weekday]
  const jalaliDate = formatJalali(tomorrow)

  let text = `📚 یادآوری کلاس‌های فردا\n🗓 ${dayName}، ${jalaliDate}\n\n`

  if (classes.length === 0) {
    text += 'فردا کلاسی نداری 🎉'
    return text
  }

  classes.forEach((c, i) => {
    text += `${i + 1}. ${c.name}\n🕐 ${c.time}`
    if (c.location && c.location !== '-') {
      text += `\n📍 ${c.location}`
    }
    text += '\n\n'
  })

  return text.trim()
}

async function sendTelegramMessage (env, text) {
  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`

  const payload = {
    chat_id: env.TELEGRAM_CHAT_ID,
    text,
    parse_mode: 'HTML'
  }

  if (env.TELEGRAM_THREAD_ID) {
    payload.message_thread_id = Number(env.TELEGRAM_THREAD_ID)
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`ارسال پیام تلگرام ناموفق بود: ${res.status} ${body}`)
  }
  return res.json()
}

export default {
  async scheduled (event, env, ctx) {
    const message = buildReminderMessage(env)
    ctx.waitUntil(sendTelegramMessage(env, message))
  },

  async fetch (request, env, ctx) {
    const url = new URL(request.url)

    if (url.pathname === '/send') {
      const secret = url.searchParams.get('secret')
      if (!env.TEST_SECRET || secret !== env.TEST_SECRET) {
        return new Response('Unauthorized', { status: 401 })
      }
      const message = buildReminderMessage(env)
      await sendTelegramMessage(env, message)
      return new Response('ارسال شد:\n\n' + message, {
        headers: { 'content-type': 'text/plain; charset=utf-8' }
      })
    }

    if (url.pathname === '/preview') {
      const message = buildReminderMessage(env)
      return new Response(message, {
        headers: { 'content-type': 'text/plain; charset=utf-8' }
      })
    }

    return new Response(
      'ربات یادآوری کلاس فعال است. مسیرهای /preview و /send وجود دارد.',
      {
        headers: { 'content-type': 'text/plain; charset=utf-8' }
      }
    )
  }
}
