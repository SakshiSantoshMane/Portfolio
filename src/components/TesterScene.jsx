import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Float, Billboard, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

/* ---------- canvas textures (no network, no font files needed) ---------- */
function useCanvasTexture(w, h, draw, deps = []) {
  return useMemo(() => {
    const c = document.createElement('canvas'); c.width = w; c.height = h
    draw(c.getContext('2d'), w, h)
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8
    return t
  }, deps) // eslint-disable-line
}
const FONT = '"DM Sans Variable", system-ui, sans-serif'
const MONO = '"JetBrains Mono", Consolas, monospace'
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r) }

function drawPage(ctx, w, h, dark) {
  ctx.fillStyle = dark ? '#0F1530' : '#FFFFFF'; ctx.fillRect(0, 0, w, h)
  // nav
  ctx.fillStyle = dark ? '#18213F' : '#F1F3FA'; ctx.fillRect(0, 0, w, 70)
  ctx.fillStyle = '#4338CA'; rr(ctx, 28, 20, 30, 30, 8); ctx.fill()
  ctx.fillStyle = dark ? '#9AA3C7' : '#9AA3BD'
  ;[110, 190, 270].forEach((x) => { rr(ctx, x, 30, 56, 10, 5); ctx.fill() })
  ctx.fillStyle = '#4338CA'; rr(ctx, w - 130, 22, 100, 28, 8); ctx.fill()
  // hero text lines
  ctx.fillStyle = dark ? '#E8EBFA' : '#121833'; rr(ctx, 40, 110, 420, 34, 8); ctx.fill(); rr(ctx, 40, 156, 300, 34, 8); ctx.fill()
  ctx.fillStyle = dark ? '#3A4470' : '#D6DBEA'; [212, 232, 252].forEach((y, i) => { rr(ctx, 40, y, 380 - i * 60, 10, 5); ctx.fill() })
  // button with a visible defect (misaligned)
  ctx.fillStyle = '#4338CA'; rr(ctx, 40, 290, 160, 46, 10); ctx.fill()
  ctx.fillStyle = '#fff'; ctx.font = `700 20px ${FONT}`; ctx.fillText('Sigm in', 76, 320)
  // image card
  const g = ctx.createLinearGradient(520, 100, 860, 340); g.addColorStop(0, '#C7D2FE'); g.addColorStop(1, '#A5F3FC')
  ctx.fillStyle = g; rr(ctx, 520, 100, 340, 240, 16); ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.arc(600, 180, 30, 0, 7); ctx.fill()
  ctx.fillStyle = 'rgba(67,56,202,.35)'; ctx.beginPath(); ctx.moveTo(540, 330); ctx.lineTo(650, 220); ctx.lineTo(740, 300); ctx.lineTo(800, 250); ctx.lineTo(850, 330); ctx.fill()
  // feature cards
  ;[0, 1, 2].forEach((i) => {
    const x = 40 + i * 280
    ctx.fillStyle = dark ? '#18213F' : '#F6F7FB'; rr(ctx, x, 380, 250, 120, 14); ctx.fill()
    ctx.fillStyle = ['#16A34A', '#F59E0B', '#4338CA'][i]; rr(ctx, x + 20, 400, 34, 34, 9); ctx.fill()
    ctx.fillStyle = dark ? '#3A4470' : '#D6DBEA'; rr(ctx, x + 20, 450, 180, 10, 5); ctx.fill(); rr(ctx, x + 20, 470, 120, 10, 5); ctx.fill()
  })
  // inspector highlight (tester view)
  ctx.setLineDash([8, 6]); ctx.strokeStyle = '#E5484D'; ctx.lineWidth = 3; rr(ctx, 32, 282, 176, 62, 12); ctx.stroke(); ctx.setLineDash([])
  ctx.fillStyle = '#E5484D'; rr(ctx, 214, 296, 132, 30, 8); ctx.fill()
  ctx.fillStyle = '#fff'; ctx.font = `700 15px ${MONO}`; ctx.fillText('label typo', 228, 316)
}

function drawChip(ctx, w, h, { text, bg, fg, icon }) {
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = bg; rr(ctx, 4, 4, w - 8, h - 8, (h - 8) / 2); ctx.fill()
  ctx.fillStyle = fg; ctx.font = `800 ${Math.round(h * 0.44)}px ${MONO}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'center'
  ctx.fillText(icon ? `${icon} ${text}` : text, w / 2, h / 2 + 2)
}

function drawFound(ctx, w, h) {
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#E5484D'; rr(ctx, 4, 4, w - 8, h - 8, (h - 8) / 2); ctx.fill()
  ctx.fillStyle = '#fff'; ctx.font = `800 ${Math.round(h * 0.42)}px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText('BUG FOUND!', w / 2, h / 2 + 2)
}

function drawTicket(ctx, w, h) {
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#FFFFFF'; rr(ctx, 4, 4, w - 8, h - 8, 22); ctx.fill()
  ctx.strokeStyle = '#16A34A'; ctx.lineWidth = 5; rr(ctx, 4, 4, w - 8, h - 8, 22); ctx.stroke()
  ctx.fillStyle = '#121833'; ctx.font = `800 34px ${MONO}`; ctx.fillText('BUG-102', 32, 64)
  ctx.fillStyle = '#E5484D'; rr(ctx, 260, 34, 110, 42, 21); ctx.fill()
  ctx.fillStyle = '#fff'; ctx.font = `800 22px ${MONO}`; ctx.fillText('HIGH', 286, 63)
  ctx.fillStyle = '#5A6385'; ctx.font = `600 24px ${FONT}`; ctx.fillText('Button label typo', 32, 116)
  ctx.fillStyle = '#16A34A'; rr(ctx, 32, 140, 170, 46, 23); ctx.fill()
  ctx.fillStyle = '#fff'; ctx.font = `800 22px ${MONO}`; ctx.fillText('✓ VERIFIED', 46, 171)
}

/* ---------- pieces ---------- */
function Chip({ position, spec, speed = 1.4 }) {
  const label = spec.icon ? `${spec.icon} ${spec.text}` : spec.text
  const W = 80 + label.length * 30, H = 96
  const tex = useCanvasTexture(W, H, (c, w, h) => drawChip(c, w, h, spec), [spec.text])
  const ph = 0.3, pw = ph * (W / H)
  return (
    <Float speed={speed} rotationIntensity={0.25} floatIntensity={0.9} position={position}>
      <Billboard>
        <mesh><planeGeometry args={[pw, ph]} /><meshBasicMaterial map={tex} transparent toneMapped={false} /></mesh>
      </Billboard>
    </Float>
  )
}

function Bug({ bugRef }) {
  const legs = useRef([])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 18
    legs.current.forEach((l, i) => { if (l) l.rotation.z = (i % 2 ? 1 : -1) * 0.5 + Math.sin(t + i) * 0.35 })
  })
  return (
    <group ref={bugRef} scale={1.6}>
      <mesh scale={[1, 0.62, 0.5]}><sphereGeometry args={[0.13, 24, 16]} /><meshStandardMaterial color="#E5484D" roughness={0.35} metalness={0.1} /></mesh>
      <mesh position={[0.15, 0, 0]}><sphereGeometry args={[0.065, 20, 14]} /><meshStandardMaterial color="#2A1A1F" roughness={0.4} /></mesh>
      <mesh position={[0, 0, 0.055]} scale={[1, 0.08, 0.1]}><boxGeometry args={[0.26, 1, 1]} /><meshStandardMaterial color="#7A1D22" /></mesh>
      {[-0.07, 0, 0.07].map((x, i) => [1, -1].map((s) => (
        <mesh key={`${i}${s}`} ref={(el) => (legs.current[i * 2 + (s > 0 ? 0 : 1)] = el)} position={[x, s * 0.07, -0.01]} rotation={[0, 0, s * 0.5]}>
          <cylinderGeometry args={[0.008, 0.008, 0.16, 6]} /><meshStandardMaterial color="#2A1A1F" />
        </mesh>
      )))}
      {[1, -1].map((s) => (
        <mesh key={s} position={[0.22, s * 0.04, 0]} rotation={[0, 0, s * 0.6 - Math.PI / 2]}><cylinderGeometry args={[0.006, 0.006, 0.12, 6]} /><meshStandardMaterial color="#2A1A1F" /></mesh>
      ))}
    </group>
  )
}

function Magnifier({ magRef, ringRef, glassRef }) {
  return (
    <group ref={magRef}>
      <mesh><torusGeometry args={[0.24, 0.035, 16, 48]} /><meshStandardMaterial ref={ringRef} color="#4338CA" emissive="#E5484D" emissiveIntensity={0} metalness={0.5} roughness={0.25} /></mesh>
      <mesh><circleGeometry args={[0.23, 40]} /><meshPhysicalMaterial ref={glassRef} color="#BFE3FF" transparent opacity={0.28} roughness={0} transmission={0.4} /></mesh>
      <mesh position={[0.25, -0.25, 0]} rotation={[0, 0, Math.PI / 4]}><cylinderGeometry args={[0.04, 0.05, 0.38, 16]} /><meshStandardMaterial color="#1E1B4B" roughness={0.5} /></mesh>
    </group>
  )
}

function Scene({ dark }) {
  const root = useRef(), bug = useRef(), mag = useRef(), check = useRef(), ticket = useRef(), ring = useRef(), glass = useRef(), found = useRef()
  const page = useCanvasTexture(900, 540, (c, w, h) => drawPage(c, w, h, dark), [dark])
  const checkTex = useCanvasTexture(128, 128, (c) => {
    c.fillStyle = '#16A34A'; c.beginPath(); c.arc(64, 64, 58, 0, 7); c.fill()
    c.strokeStyle = '#fff'; c.lineWidth = 14; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(36, 66); c.lineTo(56, 86); c.lineTo(94, 44); c.stroke()
  })
  const ticketTex = useCanvasTexture(400, 210, drawTicket)
  const foundTex = useCanvasTexture(360, 96, drawFound)
  const indigo = useMemo(() => new THREE.Color('#4338CA'), []), red = useMemo(() => new THREE.Color('#E5484D'), [])
  const frame = dark ? '#1C2547' : '#FFFFFF'
  const LOOP = 10
  // timeline (seconds): hunt 0–4 · lock on and blink 4–5.6 · bug fixed 5.6–6 · verified ticket 6–9.2 · reset
  const HUNT = 4, LOCK = 4.25, FIX = 5.6
  const bugAt = (t) => [-1.0 + Math.sin(t * 0.9) * 0.9, -0.15 + Math.sin(t * 1.7) * 0.45]

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime % LOOP
    // gentle tilt that follows the pointer
    root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, -0.32 + pointer.x * 0.25, 0.05)
    root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, 0.06 - pointer.y * 0.12, 0.05)

    // 1. the bug wanders over the page until it is caught, then freezes and twitches
    const [cx, cy] = bugAt(HUNT)
    if (t < HUNT) {
      const [bx, by] = bugAt(t)
      bug.current.position.set(bx, by, 0.12)
      bug.current.rotation.z = Math.atan2(Math.cos(t * 1.7) * 0.76, Math.cos(t * 0.9) * 0.81)
      bug.current.scale.setScalar(1)
    } else if (t < FIX) {
      bug.current.position.set(cx + Math.sin(t * 60) * 0.008, cy, 0.12)
      bug.current.scale.setScalar(1)
    } else {
      bug.current.scale.setScalar(Math.max(0.0001, 1 - (t - FIX) / 0.3))
    }

    // 2. the lens chases it, stops right on top of it, then leaves once it is fixed
    const target = new THREE.Vector3(cx, cy, 0.35)
    if (t < HUNT) {
      const k = Math.pow(t / HUNT, 2), [bx, by] = bugAt(t)
      mag.current.position.set(THREE.MathUtils.lerp(1.6, bx, k), THREE.MathUtils.lerp(1.0, by, k), 0.35)
    } else if (t < FIX + 0.4) {
      mag.current.position.lerp(target, 0.25)
    } else {
      mag.current.position.lerp(new THREE.Vector3(1.7, 1.05, 0.35), 0.05)
    }

    // 3. while locked on, the lens blinks red and pulses
    const locked = t > LOCK && t < FIX
    const blink = locked && Math.floor((t - LOCK) / 0.18) % 2 === 0
    ring.current.color.copy(blink ? red : indigo)
    ring.current.emissiveIntensity = blink ? 0.9 : 0
    glass.current.opacity = blink ? 0.5 : 0.28
    glass.current.color.set(blink ? '#FECACA' : '#BFE3FF')
    mag.current.scale.setScalar(locked ? 1 + Math.abs(Math.sin((t - LOCK) * 9)) * 0.12 : 1)

    // 4. "BUG FOUND!" pops up above the lens
    const fIn = THREE.MathUtils.clamp((t - LOCK) / 0.25, 0, 1), fOut = THREE.MathUtils.clamp(1 - (t - (FIX + 0.5)) / 0.3, 0, 1)
    const fk = fIn * fOut
    found.current.position.set(mag.current.position.x, mag.current.position.y + 0.42 + (1 - fIn) * -0.15, 0.5)
    found.current.scale.setScalar(0.0001 + fk * (1 + (fIn < 1 ? 0 : Math.sin(t * 12) * 0.04)))

    // 5. a green check replaces the bug, then the ticket shows "verified"
    const ct = THREE.MathUtils.clamp((t - FIX - 0.1) / 0.35, 0, 1)
    const cOut = t > 9.2 ? THREE.MathUtils.clamp(1 - (t - 9.2) / 0.4, 0, 1) : 1
    check.current.position.set(cx, cy, 0.14)
    check.current.scale.setScalar(0.0001 + ct * cOut * 0.42 * (1 + Math.sin(ct * Math.PI) * 0.25))
    const tk = THREE.MathUtils.clamp((t - FIX - 0.5) / 0.4, 0, 1) * cOut
    ticket.current.scale.setScalar(0.0001 + tk)
    ticket.current.position.y = 1.05 + (1 - tk) * -0.3
  })

  return (
    <group ref={root} position={[0, 0.05, 0]}>
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.35}>
        {/* the browser under test */}
        <RoundedBox args={[3.3, 2.2, 0.14]} radius={0.08} smoothness={6} castShadow>
          <meshStandardMaterial color={frame} roughness={0.45} metalness={0.05} />
        </RoundedBox>
        <mesh position={[0, 0.98, 0.072]}><planeGeometry args={[3.2, 0.16]} /><meshStandardMaterial color={dark ? '#141B38' : '#EEF0F8'} /></mesh>
        {[['#FF5F57', -1.5], ['#FEBC2E', -1.4], ['#28C840', -1.3]].map(([c, x]) => (
          <mesh key={c} position={[x, 0.98, 0.075]}><circleGeometry args={[0.028, 20]} /><meshBasicMaterial color={c} /></mesh>
        ))}
        <mesh position={[0.25, 0.98, 0.075]}><planeGeometry args={[1.6, 0.08]} /><meshBasicMaterial color={dark ? '#0F1530' : '#FFFFFF'} /></mesh>
        <mesh position={[0, -0.08, 0.073]}><planeGeometry args={[3.18, 1.92]} /><meshBasicMaterial map={page} toneMapped={false} /></mesh>
        <Bug bugRef={bug} />
        <mesh ref={check}><planeGeometry args={[1, 1]} /><meshBasicMaterial map={checkTex} transparent toneMapped={false} /></mesh>
        <Magnifier magRef={mag} ringRef={ring} glassRef={glass} />
        <group ref={found}>
          <Billboard><mesh><planeGeometry args={[0.9, 0.24]} /><meshBasicMaterial map={foundTex} transparent toneMapped={false} depthTest={false} /></mesh></Billboard>
        </group>
        <group ref={ticket} position={[1.25, 1.05, 0.5]}>
          <Billboard><mesh><planeGeometry args={[1.25, 0.66]} /><meshBasicMaterial map={ticketTex} transparent toneMapped={false} /></mesh></Billboard>
        </group>
      </Float>

      {/* orbiting results and severity tags */}
      <Chip position={[-2.05, 0.95, 0.4]} spec={{ text: 'PASS', icon: '✓', bg: '#16A34A', fg: '#fff' }} />
      <Chip position={[-2.15, -0.2, 0.6]} spec={{ text: 'FAIL', icon: '✗', bg: '#E5484D', fg: '#fff' }} speed={1.7} />
      <Chip position={[2.05, 0.2, 0.5]} spec={{ text: 'HIGH', bg: '#FDE2E2', fg: '#B42318' }} speed={1.9} />
      <Chip position={[1.95, -0.5, 0.7]} spec={{ text: 'MEDIUM', bg: '#FEF0C7', fg: '#B54708' }} speed={1.5} />
      <Chip position={[1.85, -1.2, 0.5]} spec={{ text: 'LOW', bg: '#D1FADF', fg: '#067647' }} speed={1.6} />
      <Chip position={[-1.7, -1.25, 0.6]} spec={{ text: 'P1 · OPEN', bg: '#E0E7FF', fg: '#3730A3' }} speed={1.3} />
      <Chip position={[-0.4, 1.55, 0.3]} spec={{ text: 'EXPECTED = ACTUAL', bg: '#121833', fg: '#A5F3FC' }} speed={1.1} />

      <ContactShadows position={[0, -1.55, 0]} opacity={0.35} scale={7} blur={2.6} far={2.5} color="#2B2350" />
    </group>
  )
}

export default function TesterScene({ dark }) {
  const wrap = useRef(null)
  const [visible, setVisible] = useState(true)
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={wrap} className="scene3d" aria-label="3D illustration: a web page under test, a bug being found, and test result tags" role="img">
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.1, 7.4], fov: 38 }} frameloop={visible && !reduce ? 'always' : 'demand'} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} />
        <pointLight position={[-4, 1, 3]} intensity={18} color="#8B83FF" />
        <Scene dark={dark} />
      </Canvas>
    </div>
  )
}
