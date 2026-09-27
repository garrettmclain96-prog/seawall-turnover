// Turnover requests from the site's form, delivered to Garrett's inbox through Resend.
// Needs RESEND_API_KEY and BOOKING_TO_EMAIL in the Vercel project settings.
// BOOKING_FROM_EMAIL is optional. The default sender uses the already verified
// provisionloop.org domain so production delivery is not tied to resend.dev testing limits.

const AREAS = new Set(['West End', 'Seawall', 'East End', 'Jamaica Beach', 'Bolivar', 'Other Galveston Island area'])
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEFAULT_FROM = 'Seawall Turnover <bookings@provisionloop.org>'

function text(value: unknown, max: number) {
  return typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max) : ''
}

function notes(value: unknown) {
  return typeof value === 'string' ? value.replace(/\r\n?/g, '\n').trim().slice(0, 2000) : ''
}

function count(value: unknown, max: number) {
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 && n <= max ? n : null
}

function escape(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)
}

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY
  const to = process.env.BOOKING_TO_EMAIL
  if (!key || !to) return Response.json({ ok: false, error: 'not_configured' }, { status: 503 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'bad_request' }, { status: 400 })
  }

  // Hidden field that people never see; bots fill it in. Pretend it worked.
  if (text(body.company, 200)) return Response.json({ ok: true })

  const name = text(body.name, 120)
  const email = text(body.email, 200)
  const phone = text(body.phone, 40)
  const area = text(body.area, 60)
  const bedrooms = count(body.bedrooms, 30)
  const bathrooms = count(body.bathrooms, 30)
  const turnovers = count(body.turnovers, 60)
  const listing = text(body.listing, 500)
  const storm = body.storm === true
  const extra = notes(body.notes)

  if (!name || !EMAIL.test(email) || !phone || !AREAS.has(area) || bedrooms === null || bathrooms === null || turnovers === null || turnovers < 1) {
    return Response.json({ ok: false, error: 'invalid' }, { status: 400 })
  }
  if (listing && !/^https?:\/\//i.test(listing)) {
    return Response.json({ ok: false, error: 'invalid' }, { status: 400 })
  }

  const rows: [string, string][] = [
    ['Host', name],
    ['Email', email],
    ['Phone', phone],
    ['Area', area],
    ['Bedrooms / baths', `${bedrooms} BR / ${bathrooms} BA`],
    ['Turnovers a month', String(turnovers)],
    ['Listing', listing || '—'],
    ['Storm-Ready checks', storm ? 'Yes, interested' : 'No'],
    ['Notes', extra || '—'],
  ]
  const plain = rows.map(([label, value]) => `${label}: ${value}`).join('\n') + '\n\nReply to this email to answer the host directly.'
  const html =
    '<table cellpadding="6" style="font-family:system-ui,sans-serif;font-size:15px;border-collapse:collapse">' +
    rows.map(([label, value]) => `<tr><td style="color:#555;vertical-align:top"><b>${escape(label)}</b></td><td style="white-space:pre-wrap">${escape(value)}</td></tr>`).join('') +
    '</table><p style="font-family:system-ui,sans-serif;color:#555">Reply to this email to answer the host directly.</p>'

  const upstream = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: process.env.BOOKING_FROM_EMAIL || DEFAULT_FROM,
      to: [to],
      reply_to: email,
      subject: `Turnover request: ${name} · ${area} · ${bedrooms} BR${storm ? ' · Storm-Ready' : ''}`,
      text: plain,
      html,
    }),
  }).catch(() => null)

  if (!upstream || !upstream.ok) {
    const detail = upstream ? await upstream.text().catch(() => '') : 'network error'
    console.error('Resend rejected the booking email:', upstream?.status, detail.slice(0, 300))
    return Response.json({ ok: false, error: 'send_failed' }, { status: 502 })
  }
  return Response.json({ ok: true })
}
