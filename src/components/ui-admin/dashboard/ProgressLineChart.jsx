'use client'

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts'
import { Activity, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useDashboardData } from '@/hooks/useDashboardData'

// ─── Config ───────────────────────────────────────────────────────────────────

const GRAD_WAVE   = 'waveGradient'
const GRAD_GLOW   = 'glowGradient'
const COLOR_WAVE  = '#6366f1'   // indigo
const COLOR_GLOW  = '#a5b4fc'   // indigo light

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcTrend(data) {
    if (data.length < 2) return { pct: 0, dir: 'flat' }
    const prev = data.at(-2)?.pendaftar ?? 0
    const curr = data.at(-1)?.pendaftar ?? 0
    if (prev === 0) return { pct: 0, dir: 'flat' }
    const raw = (((curr - prev) / prev) * 100).toFixed(1)
    return { pct: Math.abs(raw), dir: raw > 0 ? 'up' : raw < 0 ? 'down' : 'flat' }
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label, activeYear }) {
    if (!active || !payload?.length) return null
    const isActive = label === activeYear
    return (
        <div style={{
            background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(99,102,241,0.15)',
            border: '1px solid #e0e7ff',
            padding: '14px 18px',
            minWidth: 170,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <p style={{
                    margin: 0, fontSize: 10, fontWeight: 800,
                    color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase'
                }}>
                    Tahun {label}
                </p>
                {isActive && (
                    <span style={{
                        fontSize: 9, background: '#e0e7ff', color: '#4f46e5',
                        borderRadius: 99, padding: '2px 8px', fontWeight: 700
                    }}>Aktif</span>
                )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                    display: 'inline-block', width: 10, height: 10,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${COLOR_WAVE}, ${COLOR_GLOW})`,
                    flexShrink: 0
                }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Pendaftar</span>
                <span style={{ marginLeft: 'auto', fontSize: 18, fontWeight: 900, color: '#1e293b', fontVariantNumeric: 'tabular-nums' }}>
                    {payload[0]?.value ?? 0}
                </span>
            </div>
        </div>
    )
}

// ─── Custom Active Dot ────────────────────────────────────────────────────────

function ActiveDot({ cx, cy }) {
    return (
        <g>
            <circle cx={cx} cy={cy} r={12} fill={COLOR_WAVE} fillOpacity={0.12} />
            <circle cx={cx} cy={cy} r={7}  fill={COLOR_WAVE} fillOpacity={0.2} />
            <circle cx={cx} cy={cy} r={4}  fill={COLOR_WAVE} stroke="#fff" strokeWidth={2} />
        </g>
    )
}

function InactiveDot({ cx, cy }) {
    return <circle cx={cx} cy={cy} r={4} fill="#fff" stroke={COLOR_WAVE} strokeWidth={2.5} />
}

// ─── Custom X-Axis Tick ───────────────────────────────────────────────────────

function CustomXTick({ x, y, payload, activeYear }) {
    const isActive = payload.value === activeYear
    const textStr = String(payload.value)
    // Asumsi 1 karakter lebarnya ~7px, ditambah padding 16px
    const rectWidth = (textStr.length * 7) + 16
    const rectX = -(rectWidth / 2)

    return (
        <g transform={`translate(${x},${y})`}>
            {isActive && (
                <rect x={rectX} y={2} width={rectWidth} height={19} rx={8} fill="#e0e7ff" />
            )}
            <text
                x={0} y={15} textAnchor="middle"
                fill={isActive ? '#4f46e5' : '#94a3b8'}
                fontSize={11} fontWeight={isActive ? 800 : 600}
            >
                {payload.value}
            </text>
        </g>
    )
}

// ─── Custom Legend ────────────────────────────────────────────────────────────

function CustomLegend({ trend, activeYear }) {
    const TrendIcon = trend.dir === 'up' ? TrendingUp : trend.dir === 'down' ? TrendingDown : Minus
    const trendColor = trend.dir === 'up' ? '#10b981' : trend.dir === 'down' ? '#ef4444' : '#94a3b8'
    const trendBg    = trend.dir === 'up' ? '#ecfdf5'  : trend.dir === 'down' ? '#fef2f2'  : '#f8fafc'
    const trendLabel = trend.dir === 'up' ? `+${trend.pct}%` : trend.dir === 'down' ? `-${trend.pct}%` : `${trend.pct}%`

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, paddingTop: 10 }}>
            {/* Legend item */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width={24} height={12}>
                    <defs>
                        <linearGradient id="legendLine" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%"   stopColor={COLOR_WAVE} />
                            <stop offset="100%" stopColor={COLOR_GLOW} />
                        </linearGradient>
                    </defs>
                    <line x1="0" y1="6" x2="24" y2="6" stroke="url(#legendLine)" strokeWidth={2.5} />
                    <circle cx="12" cy="6" r="3" fill="#fff" stroke={COLOR_WAVE} strokeWidth={2} />
                </svg>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Pendaftar / Tahun</span>
            </div>

            {/* Trend badge */}
            {/* {trend.pct > 0 && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: trendBg, border: `1px solid ${trendColor}22`,
                    borderRadius: 99, padding: '3px 10px',
                }}>
                    <TrendIcon size={11} color={trendColor} />
                    <span style={{ fontSize: 11, fontWeight: 800, color: trendColor }}>{trendLabel} vs tahun lalu</span>
                </div>
            )} */}

            {/* Active year badge */}
            {activeYear && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: '#e0e7ff', borderRadius: 99, padding: '3px 10px',
                }}>
                    <span style={{ fontSize: 9, fontWeight: 900, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Aktif: {activeYear}
                    </span>
                </div>
            )}
        </div>
    )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent = '#0f172a', isLoading }) {
    return (
        <div style={{ flex: 1, padding: '16px 24px', borderRight: '1px solid #f1f5f9' }}>
            <p style={{
                margin: '0 0 4px', fontSize: 10, fontWeight: 800,
                color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase'
            }}>
                {label}
            </p>
            {isLoading ? (
                <div style={{ height: 28, width: 80, background: '#f1f5f9', borderRadius: 8 }} />
            ) : (
                <p style={{ margin: 0, fontSize: 24, fontWeight: 900, color: accent, fontVariantNumeric: 'tabular-nums' }}>
                    {value}
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginLeft: 6 }}>{sub}</span>
                </p>
            )}
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProgressLineChart() {
    const { data: globalData, isLoading, mutate } = useDashboardData()

    const data       = globalData?.yearly || []
    const activeYear = globalData?.tahun_ajaran || ''

    const peakData = data.length
        ? data.reduce((max, d) => d.pendaftar > max.pendaftar ? d : max, data[0])
        : { pendaftar: 0, year: '' }
    const peak     = peakData.pendaftar
    const peakYear = peakData.year

    const activeData = data.find(d => d.year === activeYear)
    const latest     = activeData ? activeData.pendaftar : 0
    const latestYear = activeYear || (data.at(-1)?.year ?? '')
    const trend      = calcTrend(data)

    return (
        <div style={{
            background: '#fff',
            borderRadius: 20,
            border: '1px solid #f1f5f9',
            boxShadow: '0 1px 6px rgba(99,102,241,0.06)',
            overflow: 'hidden',
        }}>

            {/* ── Header ── */}
            <div style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                padding: '20px 24px 16px', borderBottom: '1px solid #f8fafc'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: 12,
                        background: 'linear-gradient(135deg, #e0e7ff, #ede9fe)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Activity size={18} color="#6366f1" />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                            Trend Pendaftar Tahunan
                        </h3>
                        <p style={{ margin: 0, fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>
                            {isLoading ? 'Memuat data...' : `${data.length} tahun ajaran · Real-time`}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => mutate()}
                    title="Refresh"
                    style={{
                        width: 32, height: 32, borderRadius: 10, border: 'none',
                        background: 'transparent', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#94a3b8', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.color = '#6366f1' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' }}
                >
                    <RefreshCw size={14} />
                </button>
            </div>

            {/* ── KPI Strip ── */}
            <div style={{ display: 'flex', borderBottom: '1px solid #f8fafc' }}>
                <StatCard label="Tahun Aktif"      value={latest} sub={latestYear ? `siswa (${latestYear})` : 'siswa'} accent="#4f46e5" isLoading={isLoading} />
                <StatCard label="Puncak Tertinggi" value={peak}   sub={peakYear  ? `siswa (${peakYear})`   : 'siswa'} accent="#0f172a" isLoading={isLoading} />
                <StatCard label="Total Tahun"      value={data.length} sub="tahun ajaran"                              accent="#0f172a" isLoading={isLoading} />
            </div>

            {/* ── Chart ── */}
            <div style={{ padding: '20px 8px 8px' }}>
                {isLoading ? (
                    <div style={{ height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                        <RefreshCw size={20} color="#c7d2fe" style={{ animation: 'spin 1s linear infinite' }} />
                        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Memuat grafik...</span>
                    </div>
                ) : data.length === 0 ? (
                    <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Belum ada data tahunan</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={data} margin={{ top: 16, right: 20, left: -12, bottom: 0 }}>

                            <defs>
                                {/* Gradient isi gelombang utama */}
                                <linearGradient id={GRAD_WAVE} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%"   stopColor={COLOR_WAVE} stopOpacity={0.25} />
                                    <stop offset="50%"  stopColor={COLOR_WAVE} stopOpacity={0.1}  />
                                    <stop offset="100%" stopColor={COLOR_WAVE} stopOpacity={0}    />
                                </linearGradient>

                                {/* Gradient lapisan glow di bawah */}
                                <linearGradient id={GRAD_GLOW} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%"   stopColor={COLOR_GLOW} stopOpacity={0.15} />
                                    <stop offset="100%" stopColor={COLOR_GLOW} stopOpacity={0}    />
                                </linearGradient>

                                {/* Filter glow pada garis */}
                                <filter id="lineGlow">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="4 4"
                                stroke="#f1f5f9"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="year"
                                axisLine={false}
                                tickLine={false}
                                tick={(props) => <CustomXTick {...props} activeYear={activeYear} />}
                                height={30}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 600 }}
                                width={36}
                                tickCount={5}
                            />

                            <Tooltip
                                content={<CustomTooltip activeYear={activeYear} />}
                                cursor={{ stroke: '#c7d2fe', strokeWidth: 1.5, strokeDasharray: '5 4' }}
                            />

                            {/* Garis puncak */}
                            {peak > 0 && (
                                <ReferenceLine
                                    y={peak}
                                    stroke={COLOR_WAVE}
                                    strokeDasharray="6 3"
                                    strokeOpacity={0.3}
                                    label={{
                                        value: `Maks ${peak}`,
                                        position: 'insideTopRight',
                                        fontSize: 9,
                                        fill: COLOR_WAVE,
                                        fontWeight: 700,
                                        opacity: 0.7,
                                    }}
                                />
                            )}

                            {/* Layer glow bawah (gelombang latar) */}
                            <Area
                                type="monotone"
                                dataKey="pendaftar"
                                stroke="none"
                                fill={`url(#${GRAD_GLOW})`}
                                dot={false}
                                activeDot={false}
                                legendType="none"
                                isAnimationActive={true}
                                animationDuration={1200}
                            />

                            {/* Gelombang utama */}
                            <Area
                                type="monotone"
                                dataKey="pendaftar"
                                stroke={COLOR_WAVE}
                                strokeWidth={2.5}
                                fill={`url(#${GRAD_WAVE})`}
                                dot={<InactiveDot />}
                                activeDot={<ActiveDot />}
                                name="Pendaftar"
                                isAnimationActive={true}
                                animationDuration={900}
                                animationEasing="ease-out"
                            />

                            <Legend content={<CustomLegend trend={trend} activeYear={activeYear} />} />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}