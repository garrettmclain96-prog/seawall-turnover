'use client'

import { useState } from 'react'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  CloudLightning,
  Droplets,
  KeyRound,
  MapPin,
  Menu,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Waves,
  X,
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const included = [
  'Linens changed and beds made guest-ready',
  'Kitchen reset, surfaces wiped, and dishes handled',
  'Bathrooms sanitized from tile to fixtures',
  'Floors vacuumed and mopped throughout',
  'Trash removed and bins relined',
  'Guest supplies restocked to your standard',
  'Sand sweep of entry, porch, and deck',
  'Damage and missing-item photo report sent to you',
]

const benefits = [
  { icon: ShieldCheck, title: 'Photo proof, every clean', text: 'A visual record of the details, not a vague “done.”' },
  { icon: ClipboardCheck, title: 'Issues before check-in', text: 'Damage and missing items flagged while there is still time to act.' },
  { icon: Waves, title: 'Beach-house know-how', text: 'Sand, salt, humidity, and high-turnover weekends are our normal.' },
  { icon: Phone, title: 'One local operator', text: 'Garrett answers the phone and owns the outcome.' },
]

const work = [
  { src: '/work/living-room.jpg', label: 'Living room, ready for check-in' },
  { src: '/work/primary-tub.jpg', label: 'Primary bath, tub and tile' },
  { src: '/work/primary-bath.jpg', label: 'Shower glass, no spots' },
  { src: '/work/bedroom-ocean.jpg', label: 'Guest room, floors polished' },
  { src: '/work/kitchen-wide.jpg', label: 'Open kitchen, ready for guests', wide: true },
  { src: '/work/kitchen.jpg', label: 'Kitchen reset' },
  { src: '/work/counters.jpg', label: 'Counters wiped, streak-free' },
  { src: '/work/bedroom-epoxy.jpg', label: 'Primary bedroom' },
  { src: '/work/laundry-room.jpg', label: 'Laundry room, supplies restocked' },
  { src: '/work/stairs.jpg', label: 'Stairs, wiped top to bottom' },
  { src: '/work/living-area.jpg', label: 'Rugs vacuumed, floors done' },
]

const stormReady = [
  'Before a named storm: patio furniture, grills and loose items secured',
  'Doors, windows and shutters checked; fridge and trash emptied',
  'A dated photo record of the property before the storm',
  'After it passes: a walk-through and photo report of what the storm did',
]

const steps = [
  { number: '01', icon: Send, title: 'Send your calendar', text: 'Share your turnover rhythm, property details, and what “ready” means to you.' },
  { number: '02', icon: KeyRound, title: 'Get a flat quote', text: 'You get straightforward per-property pricing, quoted within 24 hours.' },
  { number: '03', icon: Sparkles, title: 'Get the report', text: 'Every turnover ends with a clean, clear photo report in your inbox.' },
]

export default function Page() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return
    setSending(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const payload: Record<string, unknown> = Object.fromEntries(form.entries())
    payload.storm = form.get('storm') === 'on'
    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json().catch(() => ({ ok: false }))
      if (!response.ok || !result.ok) throw new Error(result.error || 'failed')
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error && err.message === 'invalid'
        ? 'Something in the form looks off. Check the email and the numbers, then send it again.'
        : 'That didn’t send. Wait a minute and try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-20">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10" aria-label="Main navigation">
          <a href="#top" className="flex items-center gap-3" aria-label="Seawall Turnover Co. home">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground"><Waves className="size-5" /></span>
            <span className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-primary-foreground">Seawall<br />Turnover Co.</span>
          </a>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#included" className="text-sm font-medium text-primary-foreground/75 transition hover:text-primary-foreground">The clean</a>
            <a href="#work" className="text-sm font-medium text-primary-foreground/75 transition hover:text-primary-foreground">Our work</a>
            <a href="#process" className="text-sm font-medium text-primary-foreground/75 transition hover:text-primary-foreground">How it works</a>
            <a href="#storm" className="text-sm font-medium text-primary-foreground/75 transition hover:text-primary-foreground">Storm-Ready</a>
            <a href="#request" className={cn(buttonVariants({ className: 'rounded-full bg-accent px-5 text-accent-foreground hover:bg-accent/90' }))}>Request a turnover <ArrowRight data-icon="inline-end" /></a>
          </div>
          <button className="text-primary-foreground md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </nav>
        {menuOpen && <div className="mx-4 flex flex-col gap-4 rounded-2xl bg-primary p-6 text-primary-foreground shadow-xl md:hidden"><a href="#included" onClick={() => setMenuOpen(false)}>The clean</a><a href="#work" onClick={() => setMenuOpen(false)}>Our work</a><a href="#process" onClick={() => setMenuOpen(false)}>How it works</a><a href="#storm" onClick={() => setMenuOpen(false)}>Storm-Ready</a><a href="#request" onClick={() => setMenuOpen(false)} className={cn(buttonVariants({ className: 'rounded-full bg-accent text-accent-foreground' }))}>Request a turnover <ArrowRight data-icon="inline-end" /></a></div>}
      </header>

      <section id="top" className="relative isolate bg-primary text-primary-foreground">
        <div className="mx-auto grid min-h-[720px] max-w-7xl items-end gap-12 px-6 pb-20 pt-36 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pb-28">
          <div className="relative z-10 max-w-3xl">
            <p className="mb-7 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-accent"><MapPin className="size-4" /> Galveston Island, Texas</p>
            <h1 className="font-serif text-6xl font-medium leading-[0.92] tracking-[-0.045em] text-balance sm:text-7xl lg:text-[7.6rem]">Checkout at 10.<br /><span className="text-accent">Five-star</span> ready by 3.</h1>
            <p className="mt-8 max-w-md text-lg leading-7 text-primary-foreground/75">Same-day short-term-rental turnovers for the beach houses and condos that keep Galveston moving.</p>
            <a href="#request" className={cn(buttonVariants({ size: 'lg', className: 'mt-9 rounded-full bg-accent px-7 text-base text-accent-foreground hover:bg-accent/90' }))}>Request a turnover <ArrowRight data-icon="inline-end" /></a>
          </div>
          <div className="relative hidden min-h-[380px] lg:block" aria-hidden="true">
            <div className="absolute bottom-4 right-16 h-72 w-56 rounded-[10rem] border border-primary-foreground/20" />
            <div className="absolute bottom-20 right-32 h-56 w-40 rounded-[10rem] border border-accent/50" />
            <div className="absolute right-0 top-12 text-right font-serif text-[11rem] leading-none text-primary-foreground/[0.08]">24</div>
            <div className="absolute bottom-2 right-4 max-w-[180px] border-l border-accent pl-4 text-sm leading-6 text-primary-foreground/65">A clean that feels like a fresh start for every guest.</div>
          </div>
        </div>
        <div className="h-10 bg-background [clip-path:polygon(0_100%,100%_0,100%_100%)]" />
      </section>

      <section id="included" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div><p className="eyebrow">The baseline</p><h2 className="section-title mt-4">Every turnover,<br /><span className="text-accent">handled.</span></h2><p className="mt-6 max-w-sm leading-7 text-muted-foreground">The details guests notice, the ones they don&apos;t, and the ones that protect your property.</p></div>
          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">{included.map((item) => <div key={item} className="flex gap-3 border-b border-border pb-5"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" /><span className="text-sm leading-6">{item}</span></div>)}</div>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32"><div className="mb-14 max-w-xl"><p className="eyebrow">The local advantage</p><h2 className="section-title mt-4">Why hosts<br />switch.</h2></div><div className="grid gap-px overflow-hidden rounded-3xl border border-primary/10 bg-primary/10 sm:grid-cols-2 lg:grid-cols-4">{benefits.map(({ icon: Icon, title, text }) => <article key={title} className="bg-sand p-7 lg:p-8"><Icon className="size-7 text-accent" /><h3 className="mt-14 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div></div>
      </section>

      <section id="work" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-24">
          <div><p className="eyebrow">Recent work</p><h2 className="section-title mt-4">Real turnovers,<br /><span className="text-accent">real photos.</span></h2></div>
          <p className="max-w-md leading-7 text-muted-foreground">Taken after the clean, before the next guests arrived. No stock photos. This is what your photo report looks like.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <figure className="relative col-span-2 aspect-[4/5] overflow-hidden rounded-2xl bg-primary lg:row-span-2 lg:aspect-auto">
            <video className="absolute inset-0 h-full w-full object-cover" src="/work/walkthrough.mp4" poster="/work/walkthrough-poster.jpg" controls muted playsInline preload="none" aria-label="Walkthrough video of a rental after a turnover" />
            <figcaption className="pointer-events-none absolute left-3 top-3 rounded-full bg-primary/80 px-3 py-1 text-xs font-semibold text-primary-foreground">Walkthrough after a turnover</figcaption>
          </figure>
          {work.map(({ src, label, wide }) => (
            <figure key={src} className={cn('group relative overflow-hidden rounded-2xl bg-sand', wide && 'col-span-2 aspect-[8/5] lg:aspect-auto')}>
              <img src={src} alt={label} width={wide ? 1200 : 960} height={wide ? 736 : 1200} loading="lazy" decoding="async" className={cn('h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]', wide ? 'absolute inset-0' : 'aspect-[4/5]')} />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-3 pt-10 text-xs font-semibold text-white sm:text-sm">{label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="process" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32"><div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24"><div><p className="eyebrow">No runaround</p><h2 className="section-title mt-4">Simple from<br /><span className="text-accent">day one.</span></h2></div><div className="grid gap-10 sm:grid-cols-3">{steps.map(({ number, icon: Icon, title, text }) => <article key={number} className="relative border-t-2 border-primary pt-5"><div className="flex items-center justify-between"><span className="font-mono text-xs font-bold text-accent">{number}</span><Icon className="size-5 text-primary/45" /></div><h3 className="mt-12 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div></div></section>

      <section id="storm" className="bg-sand">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-10 lg:py-32">
          <div>
            <p className="eyebrow">Add-on for owners who live off the island</p>
            <h2 className="section-title mt-4">Storm-Ready<br /><span className="text-accent">checks.</span></h2>
            <p className="mt-6 max-w-sm leading-7 text-muted-foreground">Hurricane season runs June 1 to November 30. If you can’t get to the house before or after a storm, we can. Add it to any turnover plan.</p>
          </div>
          <div className="grid content-start gap-x-8 gap-y-5 sm:grid-cols-2">
            {stormReady.map((item) => <div key={item} className="flex gap-3 border-b border-primary/15 pb-5"><CloudLightning className="mt-0.5 size-5 shrink-0 text-accent" /><span className="text-sm leading-6">{item}</span></div>)}
          </div>
        </div>
      </section>

      <section id="request" className="bg-primary text-primary-foreground"><div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:px-10 lg:py-32"><div><p className="eyebrow text-accent">Let&apos;s get you covered</p><h2 className="section-title mt-4">Request a<br /><span className="text-accent">turnover.</span></h2><p className="mt-6 max-w-sm leading-7 text-primary-foreground/70">Tell us a little about your property. We&apos;ll follow up with flat per-property pricing, quoted within 24 hours.</p></div>{submitted ? <div className="flex flex-col justify-center rounded-3xl bg-primary-foreground/10 p-8 lg:p-12"><Check className="size-10 text-accent" /><h3 className="mt-8 font-serif text-4xl">Request received.</h3><p className="mt-4 max-w-sm leading-7 text-primary-foreground/70">Thanks for reaching out. Garrett will be in touch within 24 hours to talk through your property.</p></div> : <form onSubmit={handleSubmit} className="relative grid gap-5 sm:grid-cols-2"><label className="field"><span>Host name</span><input required name="name" autoComplete="name" /></label><label className="field"><span>Email</span><input required type="email" name="email" autoComplete="email" /></label><label className="field"><span>Phone</span><input required type="tel" name="phone" autoComplete="tel" /></label><label className="field"><span>Property address or neighborhood</span><select required name="area" defaultValue=""><option value="" disabled>Select an area</option><option>West End</option><option>Seawall</option><option>East End</option><option>Jamaica Beach</option><option>Bolivar</option><option>Other Galveston Island area</option></select><ChevronDown className="pointer-events-none absolute bottom-3 right-0 size-4" /></label><label className="field"><span>Bedrooms</span><input required type="number" min="0" name="bedrooms" /></label><label className="field"><span>Bathrooms</span><input required type="number" min="0" step="0.5" name="bathrooms" /></label><label className="field"><span>Typical turnovers / month</span><input required type="number" min="1" name="turnovers" /></label><label className="field"><span>Listing link <em>(optional)</em></span><input type="url" name="listing" placeholder="https://" /></label><label className="field sm:col-span-2"><span>Anything else we should know?</span><textarea name="notes" rows={4} /></label><label className="flex items-center gap-3 text-sm text-primary-foreground/80 sm:col-span-2"><input type="checkbox" name="storm" className="size-4 accent-[var(--accent)]" /> Add Storm-Ready checks (before and after storms)</label><div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden"><label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label></div>{error && <p role="alert" className="text-sm text-accent sm:col-span-2">{error}</p>}<Button type="submit" size="lg" disabled={sending} className="mt-2 w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 sm:col-span-2">{sending ? 'Sending…' : <>Send request <ArrowRight data-icon="inline-end" /></>}</Button></form>}</div></section>

      <footer className="bg-primary px-6 pb-8 text-primary-foreground lg:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-primary-foreground/15 pt-7 text-xs text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between"><span>Seawall Turnover Co. · Galveston Island, TX</span><span>a McLain Systems company</span></div></footer>
    </main>
  )
}
