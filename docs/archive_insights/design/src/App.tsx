import { useEffect, useMemo, useState } from 'react'
import { regencies, type Regency } from './data'

/* ============================================================
   Statistics - BPS 2021 (514 Kab/Kota)
   ============================================================ */
const N = regencies.length
const median = (a: number[]) => {
  const s = [...a].sort((x, y) => x - y)
  const n = s.length
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2
}
const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length
const corr = (a: number[], b: number[]) => {
  const ma = mean(a), mb = mean(b)
  let sab = 0, sa = 0, sb = 0
  for (let i = 0; i < a.length; i++) {
    sab += (a[i] - ma) * (b[i] - mb)
    sa += (a[i] - ma) ** 2
    sb += (b[i] - mb) ** 2
  }
  return sab / Math.sqrt(sa * sb)
}
const col = (k: keyof Regency) => regencies.map((r) => r[k] as number)
const f1 = (n: number) => n.toFixed(1)
const f2 = (n: number) => n.toFixed(2)

const WEST = [
  'ACEH', 'SUMATERA UTARA', 'SUMATERA BARAT', 'RIAU', 'JAMBI', 'SUMATERA SELATAN', 'BENGKULU', 'LAMPUNG',
  'KEP. BANGKA BELITUNG', 'KEPULAUAN RIAU', 'DKI JAKARTA', 'JAWA BARAT', 'JAWA TENGAH', 'D I YOGYAKARTA', 'JAWA TIMUR', 'BANTEN',
  'BALI', 'KALIMANTAN BARAT', 'KALIMANTAN TENGAH', 'KALIMANTAN SELATAN', 'KALIMANTAN TIMUR', 'KALIMANTAN UTARA'
]

const getIsland = (prov: string): string => {
  if (/ACEH|SUMATERA|RIAU|JAMBI|BENGKULU|LAMPUNG|BANGKA/.test(prov)) return 'Sumatera'
  if (/JAKARTA|JAWA|YOGYA|BANTEN|BALI/.test(prov)) return 'Jawa-Bali'
  if (/KALIMANTAN/.test(prov)) return 'Kalimantan'
  if (/SULAWESI|GORONTALO/.test(prov)) return 'Sulawesi'
  if (/NUSA TENGGARA/.test(prov)) return 'Nusa Tenggara'
  return 'Maluku-Papua'
}

const stats = (() => {
  const p0 = col('p0')
  const sorted = [...regencies].sort((a, b) => a.p0 - b.p0)
  const c1 = regencies.filter((r) => r.cls === 1)
  const c1West = c1.filter((r) => WEST.includes(r.prov))
  const nearZeroTpt = c1.filter((r) => r.tpt < 1).length
  const san = col('san')
  return {
    median: median(p0),
    min: sorted[0], max: sorted[N - 1],
    c1, c1West, nearZeroTpt,
    eastPct: ((c1.length - c1West.length) / c1.length) * 100,
    rTpt: corr(p0, col('tpt')), rTpak: corr(p0, col('tpak')),
    rSan: corr(p0, san), rGdp: -0.24,
    tiers: [
      regencies.filter((r) => r.p0 < 10).length,
      regencies.filter((r) => r.p0 >= 10 && r.p0 < 20).length,
      regencies.filter((r) => r.p0 >= 20 && r.p0 < 30).length,
      regencies.filter((r) => r.p0 >= 30).length,
    ],
  }
})()

const find = (kab: string) => regencies.find((r) => r.kab === kab)!
const isNias = (r: Regency) => /Nias|Gunungsitoli/.test(r.kab)
const isMentawai = (r: Regency) => /Mentawai/.test(r.kab)

/* ============================================================
   Sequential P0 (6 Classes Single Hue Blue)
   ============================================================ */
function getP0Color(p0: number) {
  if (p0 < 7) return '#EFF3FF'
  if (p0 < 12) return '#C6DBEF'
  if (p0 < 18) return '#9ECAE1'
  if (p0 < 25) return '#6BAED6'
  if (p0 < 32) return '#3182BD'
  return '#08519C'
}

const P0_STOPS = [
  { label: '< 7%', color: '#EFF3FF' },
  { label: '7-12%', color: '#C6DBEF' },
  { label: '12-18%', color: '#9ECAE1' },
  { label: '18-25%', color: '#6BAED6' },
  { label: '25-32%', color: '#3182BD' },
  { label: '≥ 32%', color: '#08519C' },
]

/* ============================================================
   Shell & Tabs
   ============================================================ */
type Tab = 'overview' | 'regional' | 'labor' | 'infra'
const tabs: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'regional', label: 'Regional Chasm' },
  { id: 'labor', label: 'Labor Paradox' },
  { id: 'infra', label: 'Infrastructure Audit' },
]

function Visual({ title, sub, tags, tab, className = '', children, right }: {
  title: string; sub?: string; tags: Tab[]; tab: Tab; className?: string; children: React.ReactNode; right?: React.ReactNode
}) {
  const dim = tab !== 'overview' && !tags.includes(tab)
  return (
    <section className={`card visual ${className} ${dim ? 'opacity-40' : ''}`}>
      <header className="visual-head">
        <div>
          <div className="card-title">{title}</div>
          {sub && <div className="card-sub">{sub}</div>}
        </div>
        {right}
      </header>
      <div className="visual-body">{children}</div>
    </section>
  )
}

/* ============================================================
   KPI Strip (4 Cards Equal Grid)
   ============================================================ */
function KpiStrip({ tab }: { tab: Tab }) {
  const c1 = stats.c1.length
  const gapRatio = (stats.max.p0 / stats.min.p0).toFixed(1)
  const items = [
    { 
      type: 'accent', 
      tab: 'regional', 
      label: 'Jurang Kesenjangan Daerah', 
      value: `${gapRatio}x Lipat`,
      sub: `Sawahlunto terbaik (${f1(stats.min.p0)}%) vs Intan Jaya terparah (${f1(stats.max.p0)}%). Median: ${f1(stats.median)}%.` 
    },
    { 
      type: 'alert', 
      tab: 'regional', 
      label: 'Konsentrasi Kemiskinan Akut', 
      value: `${Math.round(stats.eastPct)}% di Wilayah Timur`,
      sub: `${c1 - stats.c1West.length} dari ${c1} daerah kritis di Papua & NTT. Hanya ${stats.c1West.length} di Barat (Kep. Nias).` 
    },
    { 
      type: 'accent', 
      tab: 'labor', 
      label: 'Paradoks "Working Poor"', 
      value: 'Pengangguran < 1%',
      sub: 'Di daerah termiskin, 98%+ warga bekerja subsistensi. Pengangguran hak kelas menengah.' 
    },
    { 
      type: 'accent', 
      tab: 'infra', 
      label: 'Faktor Kunci Pengentasan', 
      value: 'Sanitasi 2.3x > PDRB',
      sub: 'Jamban & sanitasi layak 2.3x lebih ampuh tekan kemiskinan dibanding kekayaan PDRB daerah.' 
    },
  ]
  return (
    <div className="kpi-strip">
      {items.map((k) => (
        <div 
          key={k.label} 
          className={`card kpi ${k.type === 'alert' ? 'alert-card' : 'accent-card'} ${tab !== 'overview' && tab !== k.tab ? 'opacity-40' : ''}`}
        >
          <div className="kpi-label">{k.label}</div>
          <div className={`kpi-val ${k.type === 'alert' ? 'alert-text' : ''}`}>{k.value}</div>
          <div className="kpi-sub">{k.sub}</div>
        </div>
      ))}
    </div>
  )
}

/* ============================================================
   Tier Bars (Sequential Blues Scale)
   ============================================================ */
const tierDef = [
  { name: '1. Low Poverty', range: 'P0 < 10%', color: '#9ECAE1', key: 't1' },
  { name: '2. Moderate', range: 'P0 10-20%', color: '#6BAED6', key: 't2' },
  { name: '3. High', range: 'P0 20-30%', color: '#3182BD', key: 't3' },
  { name: '4. Extreme', range: 'P0 > 30%', color: '#08519C', key: 't4' },
]

function TierBars({ selectedTier, onSelectTier }: { selectedTier: string; onSelectTier: (t: string) => void }) {
  const maxTier = stats.tiers[0]
  return (
    <div className="tier-bars">
      {tierDef.map((t, i) => {
        const n = stats.tiers[i]
        const pctLinear = (n / maxTier) * 100
        const isSelected = selectedTier === t.key
        return (
          <div 
            className="tier-bar-row" 
            key={t.name}
            onClick={() => onSelectTier(isSelected ? 'all' : t.key)}
            title="Klik untuk filter dashboard"
            style={{ opacity: selectedTier !== 'all' && !isSelected ? 0.35 : 1 }}
          >
            <div>
              <b>{t.name}</b>
              <span>{t.range}</span>
            </div>
            <div className="tier-bar-track">
              <div className="tier-bar-fill" style={{ width: `${pctLinear}%`, background: t.color }}>
                {n}&nbsp;Kab/Kota
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <b style={{ fontSize: '13px' }}>{((n / N) * 100).toFixed(1)}%</b>
              <span>share</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ============================================================
   Island Matrix Table
   ============================================================ */
function Matrix() {
  const rows = useMemo(() => {
    const names = ['SUMATERA', 'JAWA-BALI', 'KALIMANTAN', 'SULAWESI', 'NUSA TENGGARA', 'MALUKU-PAPUA']
    const agg = (rs: Regency[]) => ({ p0: mean(rs.map((r) => r.p0)), san: mean(rs.map((r) => r.san)), n: rs.length })
    const out: { name: string; p0: number; san: number; n: number; sub?: boolean }[] = []
    for (const name of names) {
      const rs = regencies.filter((r) => getIsland(r.prov).toUpperCase() === name.replace('-', '-'))
      out.push({ name, ...agg(rs) })
      if (name === 'SUMATERA') {
        out.push({ name: 'Nias archipelago', ...agg(rs.filter(isNias)), sub: true })
        out.push({ name: 'Kep. Mentawai', ...agg(rs.filter(isMentawai)), sub: true })
      }
    }
    return out
  }, [])
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      <table className="matrix-table">
        <thead>
          <tr>
            <th>Region Name</th>
            <th className="num">Avg P0 %</th>
            <th>Poverty</th>
            <th className="num">Avg San %</th>
            <th>Sanitation</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const warn = r.san < 45
            return (
              <tr key={r.name} style={{ background: warn ? 'var(--alert-bg)' : undefined }}>
                <td>
                  <span style={{ paddingLeft: r.sub ? '12px' : '0' }}>{r.name}</span>
                  <span style={{ color: 'var(--text-2)', fontSize: '10px' }}>{r.sub ? '' : ` (${r.n})`}</span>
                  {warn && <span className="alert-pill" style={{ marginLeft: '6px' }}>San &lt;45%</span>}
                </td>
                <td className="num" style={{ fontWeight: 600 }}>{f1(r.p0)}%</td>
                <td style={{ width: '22%' }}>
                  <div className="neutral-bar p0-bar">
                    <i style={{ width: `${Math.min(100, (r.p0 / 30) * 100)}%` }} />
                  </div>
                </td>
                <td className="num">{f1(r.san)}%</td>
                <td style={{ width: '22%' }}>
                  <div className="neutral-bar">
                    <i style={{ width: `${Math.min(100, (r.san / 100) * 100)}%` }} />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>Nasional ({N})</td>
            <td className="num">{f1(mean(col('p0')))}%</td>
            <td />
            <td className="num">{f1(mean(col('san')))}%</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

/* ============================================================
   Cartogram Map - 1 cell = 1 Kab/Kota (Hero Visual)
   ============================================================ */
type Pt = [number, number]
const polys: Record<string, Pt[]> = {
  sumatera: [[40, 40], [90, 48], [150, 98], [205, 148], [212, 176], [186, 172], [120, 128], [58, 82]],
  nias: [[14, 80], [30, 78], [34, 112], [20, 116]],
  mentawai: [[44, 124], [58, 120], [84, 150], [72, 156]],
  jawa: [[218, 184], [270, 180], [336, 188], [338, 204], [272, 206], [218, 198]],
  kalimantan: [[232, 58], [292, 44], [348, 70], [358, 122], [330, 162], [270, 162], [236, 122]],
  sulawesi: [[384, 70], [424, 78], [414, 108], [446, 120], [436, 152], [404, 132], [394, 164], [378, 152], [388, 110]],
  nt: [[346, 196], [420, 194], [506, 202], [506, 218], [420, 212], [348, 208]],
  maluku: [[470, 98], [512, 92], [524, 130], [492, 142]],
  papua: [[566, 80], [654, 84], [724, 120], [718, 174], [642, 178], [602, 150], [564, 130]],
}

const mapGroup = (r: Regency) =>
  isNias(r) ? 'nias' : isMentawai(r) ? 'mentawai'
  : /ACEH|SUMATERA|RIAU|JAMBI|BENGKULU|LAMPUNG|BANGKA/.test(r.prov) ? 'sumatera'
  : /JAKARTA|JAWA|YOGYA|BANTEN/.test(r.prov) ? 'jawa'
  : /KALIMANTAN/.test(r.prov) ? 'kalimantan'
  : /SULAWESI|GORONTALO/.test(r.prov) ? 'sulawesi'
  : /BALI|NUSA TENGGARA/.test(r.prov) ? 'nt'
  : /MALUKU/.test(r.prov) ? 'maluku' : 'papua'

function inPoly(p: Pt, poly: Pt[]) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
const rnd = (n: number) => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s) }

function buildCells() {
  const groups: Record<string, Regency[]> = {}
  regencies.forEach((r) => (groups[mapGroup(r)] ||= []).push(r))
  const cells: { x: number; y: number; s: number; r: Regency }[] = []
  for (const [g, list] of Object.entries(groups)) {
    const poly = polys[g]
    const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1])
    let pts: Pt[] = []
    let step = 14
    for (; step > 2; step -= 0.1) {
      pts = []
      for (let x = Math.min(...xs) + step / 2; x < Math.max(...xs); x += step)
        for (let y = Math.min(...ys) + step / 2; y < Math.max(...ys); y += step)
          if (inPoly([x, y], poly)) pts.push([x, y])
      if (pts.length >= list.length) break
    }
    let extra = pts.length - list.length, k = 0
    while (extra > 0) {
      const idx = Math.floor(rnd(++k) * pts.length)
      pts.splice(idx, 1); extra--
    }
    pts.sort((a, b) => a[0] - b[0] || a[1] - b[1])
    list.forEach((r, i) => cells.push({ x: pts[i][0], y: pts[i][1], s: step * 0.92, r }))
  }
  return cells
}

function ChoroplethMap({
  islandFilter,
  tierFilter,
  classFilter,
}: {
  islandFilter: string
  tierFilter: string
  classFilter: string
}) {
  const cells = useMemo(buildCells, [])
  const [hover, setHover] = useState<Regency | null>(null)

  const isMatched = (r: Regency) => {
    if (islandFilter !== 'all' && getIsland(r.prov) !== islandFilter) return false
    if (classFilter !== 'all' && String(r.cls) !== classFilter) return false
    if (tierFilter === 't1' && r.p0 >= 10) return false
    if (tierFilter === 't2' && (r.p0 < 10 || r.p0 >= 20)) return false
    if (tierFilter === 't3' && (r.p0 < 20 || r.p0 >= 30)) return false
    if (tierFilter === 't4' && r.p0 < 30) return false
    return true
  }

  const isFiltered = islandFilter !== 'all' || tierFilter !== 'all' || classFilter !== 'all'

  return (
    <div className="map">
      <svg viewBox="0 15 760 235" role="img" aria-label="Cartogram 514 Kab/Kota menurut persentase kemiskinan">
        {cells.map((c, i) => {
          const matched = isMatched(c.r)
          const isClass1 = c.r.cls === 1
          return (
            <rect
              key={i}
              x={c.x - c.s / 2}
              y={c.y - c.s / 2}
              width={c.s}
              height={c.s}
              rx={2}
              fill={getP0Color(c.r.p0)}
              stroke={isClass1 ? '#C62828' : '#FFFFFF'}
              strokeWidth={isClass1 ? 1.4 : 0.4}
              className={`cell ${isFiltered && !matched ? 'muted' : ''}`}
              onMouseEnter={() => setHover(c.r)}
              onMouseLeave={() => setHover(null)}
            />
          )
        })}
        <g className="map-label">
          <text x="615" y="68">PAPUA</text>
          <text x="475" y="84">MALUKU</text>
          <text x="395" y="236">BALI - NTB - NTT</text>
          <text x="270" y="38">KALIMANTAN</text>
          <text x="105" y="60">SUMATERA</text>
          <text x="395" y="60">SULAWESI</text>
          <text x="250" y="224">JAWA</text>
        </g>
        <g>
          <path d="M24 100 8 74" stroke="#C62828" strokeWidth="1" strokeDasharray="2 2" />
          <rect x="0" y="46" width="112" height="28" rx="2" fill="#FFFFFF" stroke="#C62828" strokeWidth="1" />
          <text x="6" y="58" className="map-note">Kepulauan Nias</text>
          <text x="6" y="68" className="map-note sm">Sanitasi {f1(mean(regencies.filter(isNias).map((r) => r.san)))}% (Kritis 3T Barat)</text>
        </g>
      </svg>

      <div className="hoverline">
        {hover ? (
          <div>
            <b>{hover.kab}</b>, {hover.prov} &nbsp;|&nbsp; P0: <b>{f2(hover.p0)}%</b> &nbsp;|&nbsp; Sanitasi: <b>{f1(hover.san)}%</b> &nbsp;|&nbsp; Lama Sekolah: <b>{f2(hover.school)} thn</b> &nbsp;|&nbsp; TPT: <b>{f2(hover.tpt)}%</b> &nbsp;|&nbsp; TPAK: <b>{f2(hover.tpak)}%</b>
            {hover.cls === 1 && <span className="alert-pill" style={{ marginLeft: '8px' }}>Class 1 Akut</span>}
          </div>
        ) : (
          <span style={{ color: 'var(--text-2)' }}>Arahkan kursor pada sel daerah untuk melihat detail metrik. Outline merah = Class 1 Akut.</span>
        )}
      </div>

      <div className="map-legend">
        <span>Skala Kemiskinan (P0):</span>
        <div className="ramp-blocks">
          {P0_STOPS.map((s) => (
            <div key={s.label} className="ramp-block" style={{ background: s.color, color: s.color === '#08519C' || s.color === '#3182BD' ? '#fff' : '#201F1E' }}>
              <span style={{ fontSize: '8.5px', fontWeight: 600 }}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '12px' }}>
          <span style={{ display: 'inline-block', width: '12px', height: '12px', border: '1.5px solid var(--alert)', background: '#fff', borderRadius: '2px' }} />
          <span>Class 1 Akut (N={stats.c1.length})</span>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Drill-down Table (Full Width 12-Cols, Memanjang & Scrollable)
   ============================================================ */
type SortField = 'kab' | 'prov' | 'p0' | 'tpak' | 'tpt' | 'san' | 'school' | 'cls'

function DrillTable({
  islandFilter,
  tierFilter,
  classFilter,
}: {
  islandFilter: string
  tierFilter: string
  classFilter: string
}) {
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('p0')
  const [sortAsc, setSortAsc] = useState(false)

  const filtered = useMemo(() => {
    return regencies.filter((r) => {
      if (islandFilter !== 'all' && getIsland(r.prov) !== islandFilter) return false
      if (classFilter !== 'all' && String(r.cls) !== classFilter) return false
      if (tierFilter === 't1' && r.p0 >= 10) return false
      if (tierFilter === 't2' && (r.p0 < 10 || r.p0 >= 20)) return false
      if (tierFilter === 't3' && (r.p0 < 20 || r.p0 >= 30)) return false
      if (tierFilter === 't4' && r.p0 < 30) return false
      if (search) {
        const q = search.toLowerCase()
        if (!r.kab.toLowerCase().includes(q) && !r.prov.toLowerCase().includes(q)) return false
      }
      return true
    }).sort((a, b) => {
      let va = a[sortField]
      let vb = b[sortField]
      if (typeof va === 'string') {
        const cmp = (va as string).localeCompare(vb as string)
        return sortAsc ? cmp : -cmp
      }
      return sortAsc ? (va as number) - (vb as number) : (vb as number) - (va as number)
    })
  }, [islandFilter, tierFilter, classFilter, search, sortField, sortAsc])

  const toggleSort = (f: SortField) => {
    if (sortField === f) setSortAsc(!sortAsc)
    else { setSortField(f); setSortAsc(false) }
  }

  return (
    <div className="drill-full">
      <div className="drill-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="text"
            className="drill-search"
            placeholder="Cari kabupaten/kota atau provinsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              style={{ fontSize: '11px', color: 'var(--text-2)', background: 'none', border: 'none', textDecoration: 'underline' }}
            >
              Reset cari
            </button>
          )}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>
          Menampilkan <b>{filtered.length}</b> dari {N} Kabupaten / Kota
        </div>
      </div>

      <div className="drill-scroll">
        <table className="drill-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('kab')} style={{ width: '22%' }}>
                Kabupaten / Kota {sortField === 'kab' && (sortAsc ? '▲' : '▼')}
              </th>
              <th onClick={() => toggleSort('prov')} style={{ width: '18%' }}>
                Provinsi {sortField === 'prov' && (sortAsc ? '▲' : '▼')}
              </th>
              <th className="num" onClick={() => toggleSort('p0')} style={{ width: '10%' }}>
                Poverty (P0) {sortField === 'p0' && (sortAsc ? '▲' : '▼')}
              </th>
              <th className="num" onClick={() => toggleSort('tpak')} style={{ width: '10%' }}>
                TPAK % {sortField === 'tpak' && (sortAsc ? '▲' : '▼')}
              </th>
              <th className="num" onClick={() => toggleSort('tpt')} style={{ width: '10%' }}>
                TPT (Pengangguran) {sortField === 'tpt' && (sortAsc ? '▲' : '▼')}
              </th>
              <th className="num" onClick={() => toggleSort('school')} style={{ width: '10%' }}>
                Rata Lama Sekolah {sortField === 'school' && (sortAsc ? '▲' : '▼')}
              </th>
              <th className="num" onClick={() => toggleSort('san')} style={{ width: '10%' }}>
                Sanitasi Layak % {sortField === 'san' && (sortAsc ? '▲' : '▼')}
              </th>
              <th className="ctr" onClick={() => toggleSort('cls')} style={{ width: '10%' }}>
                Klasifikasi {sortField === 'cls' && (sortAsc ? '▲' : '▼')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const isAlert = r.cls === 1
              return (
                <tr key={r.prov + r.kab} className={isAlert ? 'alert-row' : ''}>
                  <td>
                    <b style={{ color: isAlert ? 'var(--alert)' : 'var(--text)' }}>{r.kab}</b>
                    {r.san === 0 && <span className="alert-pill" style={{ marginLeft: '6px' }}>Sanitasi 0%</span>}
                    {r.water === 0 && <span className="alert-pill" style={{ marginLeft: '6px' }}>Air Bersih 0%</span>}
                  </td>
                  <td style={{ color: 'var(--text-2)' }}>{r.prov}</td>
                  <td className="num" style={{ fontWeight: 600, color: isAlert ? 'var(--alert)' : 'var(--text)' }}>
                    {f2(r.p0)}%
                  </td>
                  <td className="num">{f2(r.tpak)}%</td>
                  <td className="num" style={{ fontWeight: r.tpt < 1 ? 600 : 400, color: r.tpt < 1 ? 'var(--alert)' : undefined }}>
                    {f2(r.tpt)}%
                  </td>
                  <td className="num">{f2(r.school)} thn</td>
                  <td className="num">{f1(r.san)}%</td>
                  <td className="ctr">
                    {isAlert ? (
                      <span className="alert-pill">Class 1 Akut</span>
                    ) : (
                      <span className="neutral-pill">Reguler</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ============================================================
   Main Application
   ============================================================ */
export default function App() {
  const [tab, setTab] = useState<Tab>('overview')
  const [islandFilter, setIslandFilter] = useState('all')
  const [tierFilter, setTierFilter] = useState('all')
  const [classFilter, setClassFilter] = useState('all')

  useEffect(() => {
    document.title = 'PovertyRadar SDGs - Indonesia Regional Poverty Dashboard'
  }, [])

  const lj = find('Lanny Jaya')
  const nd = find('Nduga')
  const dp = find('Kota Depok')
  const ts = find('Kota Tangerang Selatan')
  const sampang = find('Sampang')

  const resetFilters = () => {
    setIslandFilter('all')
    setTierFilter('all')
    setClassFilter('all')
  }

  const hasFilter = islandFilter !== 'all' || tierFilter !== 'all' || classFilter !== 'all'

  return (
    <div className="stage">
      <div className="canvas">
        {/* Row 1: Header */}
        <header className="ribbon header-sticky">
          <div>
            <h1 className="page-title">Indonesia Regional Poverty Dashboard</h1>
            <p className="page-sub">Analisis Sosioekonomi SDGs BPS 2021 · 514 Kabupaten / Kota</p>
          </div>
          <nav className="pills" aria-label="Fokus Analisis">
            {tabs.map((t) => (
              <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </nav>
        </header>

        {/* Row 2: Slicer Bar */}
        <div className="card slicer-strip">
          <div className="slicer-left">
            <div className="slicer-item">
              <label>Pulau:</label>
              <select
                className="slicer-select"
                value={islandFilter}
                onChange={(e) => setIslandFilter(e.target.value)}
              >
                <option value="all">Semua Wilayah Pulau (Nasional)</option>
                <option value="Sumatera">Sumatera</option>
                <option value="Jawa-Bali">Jawa-Bali</option>
                <option value="Kalimantan">Kalimantan</option>
                <option value="Sulawesi">Sulawesi</option>
                <option value="Nusa Tenggara">Nusa Tenggara</option>
                <option value="Maluku-Papua">Maluku-Papua</option>
              </select>
            </div>

            <div className="slicer-item">
              <label>Tier:</label>
              <select
                className="slicer-select"
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
              >
                <option value="all">Semua Tier Kemiskinan</option>
                <option value="t1">1. Low (&lt;10%)</option>
                <option value="t2">2. Moderate (10-20%)</option>
                <option value="t3">3. High (20-30%)</option>
                <option value="t4">4. Extreme (&gt;30%)</option>
              </select>
            </div>

            <div className="slicer-item">
              <label>Klasifikasi:</label>
              <select
                className="slicer-select"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="1">Class 1 (Akut Prioritas)</option>
                <option value="0">Class 0 (Reguler)</option>
              </select>
            </div>

            {hasFilter && (
              <button className="slicer-btn" onClick={resetFilters}>
                Reset Filter
              </button>
            )}
          </div>

          <div className="slicer-right">
            <span>Sumber Data: <b>BPS 2021</b> · Cakupan Lengkap 514 Daerah</span>
          </div>
        </div>

        {/* Row 3: KPI Strip */}
        <KpiStrip tab={tab} />

        {/* Row 4: Hero Visual Grid (Map 8 Cols + Side 4 Cols) */}
        <div className="hero-grid">
          {/* Kolom 1-8: Hero Cartogram Map */}
          <div className="hero-map">
            <Visual
              tab={tab}
              tags={['regional']}
              title="P0 Poverty Rate & 3T Spatial Clustering (514 Kab/Kota)"
              sub="Cartogram spasial sekuensial satu sel satu daerah. Outline merah menandai Class 1 Akut."
              right={
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="alert-pill">Class 1 (N={stats.c1.length})</span>
                  <span className="neutral-pill">Nasional (N=514)</span>
                </div>
              }
            >
              <ChoroplethMap
                islandFilter={islandFilter}
                tierFilter={tierFilter}
                classFilter={classFilter}
              />
            </Visual>
          </div>

          {/* Kolom 9-12: Tier Bars & Island Matrix */}
          <div className="hero-side">
            {/* Top: Tier Bars */}
            <div className="hero-tier">
              <Visual
                tab={tab}
                tags={['regional']}
                title="Poverty Severity by Classification Tier"
                sub="Frekuensi linear jumlah daerah per ambang P0 kemiskinan"
                right={tierFilter !== 'all' ? <span className="alert-pill">Terfilter</span> : undefined}
              >
                <TierBars selectedTier={tierFilter} onSelectTier={setTierFilter} />
              </Visual>
            </div>

            {/* Bottom: Island Matrix */}
            <div className="hero-island">
              <Visual
                tab={tab}
                tags={['regional', 'infra']}
                title="Poverty & Infrastructure by Island Region"
                sub="Rata-rata tingkat kemiskinan dan akses sanitasi layak per gugus kepulauan"
              >
                <Matrix />
              </Visual>
            </div>
          </div>
        </div>

        {/* Row 5: Executive Callouts Row (2 Equal Columns) */}
        <div className="callouts-row">
          <div className="card exec-callout alert-edge">
            <div className="exec-callout-title alert-text">Paradoks Ketenagakerjaan: "The Working Poor"</div>
            <div className="exec-callout-body">
              Lanny Jaya (TPT <b>{f2(lj.tpt)}%</b>, P0 <b>{f2(lj.p0)}%</b>) &amp; Nduga (TPT <b>{f2(nd.tpt)}%</b>, P0 <b>{f2(nd.p0)}%</b>) vs Depok (TPT <b>{f2(dp.tpt)}%</b>, P0 <b>{f2(dp.p0)}%</b>) dan Tangsel (TPT <b>{f2(ts.tpt)}%</b>, P0 <b>{f2(ts.p0)}%</b>).
            </div>
            <div className="exec-callout-highlight alert-text">
              Pengangguran terbuka adalah hak istimewa kelas menengah; di daerah miskin ekstrem warga wajib bekerja serabutan agar bertahan hidup.
            </div>
          </div>

          <div className="card exec-callout accent-edge">
            <div className="exec-callout-title" style={{ color: 'var(--accent)' }}>Disparitas Wilayah: Anomali Pulau Madura (Jawa Timur)</div>
            <div className="exec-callout-body">
              Dari 119 kabupaten/kota di Pulau Jawa, hanya 3 daerah yang masuk Class 1 Akut: Sampang, Bangkalan, dan Sumenep.
            </div>
            <div className="exec-callout-highlight" style={{ color: 'var(--accent)' }}>
              Rata-rata lama sekolah di Sampang hanya <b>{f2(sampang.school)} tahun</b> (terendah se-Pulau Jawa, di bawah tamatan SD) vs Kota Surabaya 10.50 tahun.
            </div>
          </div>
        </div>

        {/* Row 6: The Working Poor & Regional Drilldown (Memanjang Full Width & Scrollable) */}
        <Visual
          tab={tab}
          tags={['labor', 'infra']}
          title="The Working Poor & Regional Drilldown"
          sub="Tabel data mikro 514 kabupaten/kota dengan metrik kemiskinan, ketenagakerjaan, dan sanitasi dasar (sortable & filterable)"
          right={
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="alert-pill">Merah: Class 1 Akut</span>
              <span className="neutral-pill">Abu-abu: Reguler</span>
            </div>
          }
        >
          <DrillTable
            islandFilter={islandFilter}
            tierFilter={tierFilter}
            classFilter={classFilter}
          />
        </Visual>
      </div>
    </div>
  )
}
