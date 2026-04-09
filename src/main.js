// ─────────────────────────────────────────
// Line Souza Designs — main.js
// ─────────────────────────────────────────

import './style.css'

// ══ NAV SCROLL ══
const nav = document.getElementById('nav')
window.addEventListener('scroll', () => nav.classList.toggle('stuck', scrollY > 50), { passive: true })

// ══ SCROLL REVEAL ══
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in')
      obs.unobserve(e.target)
    }
  })
}, { threshold: .1 })

document.querySelectorAll('.rev, .rev-l').forEach(el => obs.observe(el))

// ══ PORTFOLIO FILTER ══
document.querySelectorAll('.f-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('on'))
    btn.classList.add('on')
    const f = btn.dataset.f
    document.querySelectorAll('.pi').forEach(p => {
      const show = f === 'all' || p.dataset.cat === f
      p.style.opacity    = show ? '1'         : '0.1'
      p.style.transform  = show ? ''           : 'scale(.97)'
      p.style.transition = 'opacity .4s, transform .4s'
    })
  })
})

// ══════════════════════════════════════════
// HERO CANVAS — Interactive Particle Mesh
// ══════════════════════════════════════════
;(function () {
  const canvas = document.getElementById('hero-canvas')
  const ctx    = canvas.getContext('2d')
  const hero   = document.getElementById('hero')

  let W, H
  let mouse = { x: -9999, y: -9999 }

  const N  = 65    // particle count
  const CD = 145   // connect distance
  const RD = 110   // repel distance

  const COLS = [
    [175, 87,  18],   // Simba (terra)
    [153, 100, 58],   // Cappuccino
    [197, 105, 28],   // terra-light
    [235, 237, 236],  // Branco Gelo
  ]

  class Particle {
    constructor () { this.init(true) }

    init (rand) {
      this.x  = Math.random() * W
      this.y  = rand ? Math.random() * H : Math.random() * H
      this.vx = (Math.random() - .5) * .38
      this.vy = (Math.random() - .5) * .38
      this.r  = Math.random() * 1.7 + .5
      this.c  = COLS[Math.floor(Math.random() * COLS.length)]
      this.a  = Math.random() * .32 + .08
    }

    update () {
      const dx = this.x - mouse.x
      const dy = this.y - mouse.y
      const d  = Math.sqrt(dx * dx + dy * dy)
      if (d < RD && d > 0) {
        const f = (RD - d) / RD * 2.4
        this.vx += (dx / d) * f * .045
        this.vy += (dy / d) * f * .045
      }
      this.vx *= .984; this.vy *= .984
      this.x  += this.vx; this.y += this.vy
      if (this.x < -20) this.x = W + 10
      if (this.x > W + 20) this.x = -10
      if (this.y < -20) this.y = H + 10
      if (this.y > H + 20) this.y = -10
    }

    draw () {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${this.c[0]},${this.c[1]},${this.c[2]},${this.a})`
      ctx.fill()
    }
  }

  let pts = []

  function resize () {
    W = canvas.width  = canvas.offsetWidth
    H = canvas.height = canvas.offsetHeight
  }

  function init () {
    resize()
    pts = Array.from({ length: N }, () => new Particle())
  }

  function frame () {
    ctx.clearRect(0, 0, W, H)

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a  = pts[i], b = pts[j]
        const dx = a.x - b.x, dy = a.y - b.y
        const d  = Math.sqrt(dx * dx + dy * dy)
        if (d < CD) {
          const op = (1 - d / CD) * .16
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(175,87,18,${op})`
          ctx.lineWidth   = .55
          ctx.stroke()
        }
      }
    }

    pts.forEach(p => { p.update(); p.draw() })
    requestAnimationFrame(frame)
  }

  window.addEventListener('resize', init, { passive: true })
  hero.addEventListener('mousemove',  e => { mouse.x = e.clientX; mouse.y = e.clientY })
  hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999 })

  init()
  frame()
})()

// ══ FAQ ACCORDION ══
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item')
    const isOpen = item.classList.contains('open')
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'))
    document.querySelectorAll('.faq-q').forEach(b => b.setAttribute('aria-expanded', 'false'))
    if (!isOpen) {
      item.classList.add('open')
      btn.setAttribute('aria-expanded', 'true')
    }
  })
})

// ══ HAMBURGER MENU ══
const hamb     = document.getElementById('navHamburger')
const navLinks = document.getElementById('navLinks')

if (hamb && navLinks) {
  // Abrir/fechar ao clicar no botão
  hamb.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open')
    hamb.classList.toggle('open', isOpen)
    hamb.setAttribute('aria-expanded', isOpen)
    document.body.style.overflow = isOpen ? 'hidden' : ''
  })

  // Fechar ao clicar em qualquer link
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open')
      hamb.classList.remove('open')
      hamb.setAttribute('aria-expanded', 'false')
      document.body.style.overflow = ''
    })
  })

  // Fechar com ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open')
      hamb.classList.remove('open')
      hamb.setAttribute('aria-expanded', 'false')
      document.body.style.overflow = ''
    }
  })
}
