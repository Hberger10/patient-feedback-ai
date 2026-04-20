'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Activity,
  ArrowRight,
  Calendar,
  Download,
  Filter,
  Frown,
  MessageSquare,
  Smile,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';



export default function DashboardClient({ profile, feedbacks, metrics }: any) {
  const [statusMap, setStatusMap] = useState<Record<string, boolean>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});

  const toggleStatus = (id: string, v: boolean) =>
    setStatusMap((m) => ({ ...m, [id]: v }));
  const updateNote = (id: string, v: string) =>
    setNotesMap((m) => ({ ...m, [id]: v }));

  const npsColor =
    metrics.npsScore >= 75 ? 'text-green-700' : metrics.npsScore >= 50 ? 'text-amber-600' : 'text-red-600';

  
  const sparklineVals = [62, 64, 66, 68, 72, 74, 76, 78];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header managerName={profile?.name || 'Gestor'} clinicName="Favarato Odontologia" />

      <main className="mx-auto max-w-[1440px] px-8 py-7 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Painel NPS
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Panorama da satisfação real dos pacientes.
            </p>
          </div>
        </div>

       
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="NPS Geral"
            icon={<Activity className="h-[18px] w-[18px] text-slate-400" strokeWidth={1.6} />}
            value={metrics.npsScore}
            valueClassName={npsColor}
            sublabel="Métrica Calculada"
          >
            <div className="mt-auto pt-2.5">
              <Sparkline values={sparklineVals} color="#2D7A2D" width={220} height={36} />
            </div>
          </MetricCard>

          <MetricCard
            label="Total de avaliações"
            icon={<MessageSquare className="h-[18px] w-[18px] text-slate-400" strokeWidth={1.6} />}
            value={metrics.total}
            sublabel="Respostas integradas"
          />

          <MetricCard
            label="Promotores"
            icon={<Smile className="h-[18px] w-[18px] text-slate-400" strokeWidth={1.6} />}
            value={metrics.promotores}
            valueClassName="text-green-700"
            sublabel="Notas 9–10"
          />

          <MetricCard
            label="Detratores"
            icon={<Frown className="h-[18px] w-[18px] text-slate-400" strokeWidth={1.6} />}
            value={metrics.detratores}
            valueClassName="text-red-600"
            sublabel="Notas 0–6"
          />
        </div>

       
        <div className="mt-7">
          <FeedbackTable
            rows={feedbacks}
            statusMap={statusMap}
            notesMap={notesMap}
            onToggleStatus={toggleStatus}
            onUpdateNote={updateNote}
          />
        </div>
      </main>
    </div>
  );
}



function Header({
  managerName,
  clinicName,
}: {
  managerName?: string;
  clinicName?: string;
}) {
  return (
    <header className="flex items-center justify-between border-b border-slate-100 bg-white px-8 py-[18px]">
      <div className="flex items-center gap-4">
        <div className="text-[22px] font-extrabold tracking-[2px] text-[#1A3C6E]">
          FAVA<span className="text-[#E8732A]">RATO</span>
        </div>
        <div className="h-[22px] w-px bg-slate-200" />
        <div className="flex flex-col gap-0.5 leading-tight">
          <div className="whitespace-nowrap text-[13px] font-semibold text-slate-900">
            {clinicName}
          </div>
          <div className="whitespace-nowrap text-[11px] text-slate-500">
            Painel do Gestor
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-2.5 pl-2">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2F7] text-[13px] font-bold text-[#1A3C6E]">
            {managerName?.charAt(0) || 'G'}
          </div>
          <div className="whitespace-nowrap text-[13px] leading-tight text-slate-700">
            Olá, <b className="text-slate-900">{managerName}</b>
          </div>
        </div>
      </div>
    </header>
  );
}

function MetricCard({
  label,
  icon,
  value,
  sublabel,
  valueClassName,
  children,
}: {
  label: string;
  icon?: ReactNode;
  value: ReactNode;
  sublabel?: string;
  valueClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex min-h-[138px] flex-col gap-1.5 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
          {label}
        </div>
        {icon}
      </div>
      <div className="mt-1.5 flex items-baseline gap-2.5">
        <div
          className={`font-extrabold text-[40px] leading-none tracking-[-0.02em] tabular-nums ${
            valueClassName ?? 'text-slate-900'
          }`}
        >
          {value}
        </div>
      </div>
      {sublabel && <div className="text-xs text-slate-500">{sublabel}</div>}
      {children}
    </div>
  );
}

function Sparkline({
  values,
  color = '#1A3C6E',
  width = 120,
  height = 36,
}: {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  if (!values?.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const pts = values.map<[number, number]>((v, i) => [
    i * step,
    height - ((v - min) / range) * (height - 4) - 2,
  ]);
  const d = pts
    .map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`))
    .join(' ');
  const areaD =
    `M0,${height} ` +
    pts.map((p) => `L${p[0]},${p[1]}`).join(' ') +
    ` L${width},${height} Z`;
  const gradId = `spk-${color.replace('#', '')}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <path
        d={d}
        stroke={color}
        strokeWidth={1.75}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ScoreBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' }) {
  const tier = score >= 9 ? 'promoter' : score >= 7 ? 'passive' : 'detractor';
  const classes = {
    promoter: 'bg-green-100 text-green-700',
    passive: 'bg-amber-100 text-amber-700',
    detractor: 'bg-red-100 text-red-700',
  }[tier];
  const dims = size === 'sm' ? 'h-[22px] min-w-[28px] px-2 text-[11px]' : 'h-[26px] min-w-[36px] px-2.5 text-[13px]';
  return (
    <span className={`inline-flex items-center justify-center rounded-full font-bold leading-none tabular-nums ${dims} ${classes}`}>
      {score}
    </span>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full border-0 p-0 transition-colors ${
        checked ? 'bg-green-700' : 'bg-slate-300'
      }`}
    >
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-[left] ${checked ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
  );
}

function NotesPopover({ value, onChange, treated }: { value: string; onChange: (v: string) => void; treated: boolean }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value || '');
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => { setDraft(value || ''); }, [value]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onChange(draft);
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open, draft, onChange]);

  const hasNote = !!value && value.trim().length > 0;

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className={`relative inline-flex h-[26px] w-[26px] items-center justify-center rounded-md border ${
          hasNote ? 'border-slate-200 bg-[#EEF2F7] text-[#1A3C6E]' : 'border-slate-200 bg-white text-slate-400'
        }`}
      >
        <MessageSquare className="h-[13px] w-[13px]" strokeWidth={1.7} />
        {hasNote && <span className="absolute -right-0.5 -top-0.5 h-[7px] w-[7px] rounded-full border-[1.5px] border-white bg-[#E8732A]" />}
      </button>

      {open && (
        <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-[calc(100%+6px)] z-20 w-[280px] rounded-[10px] border border-slate-200 bg-white p-3 shadow-xl">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Notas internas</div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ex.: Liguei e agendamos uma nova limpeza…"
            className="box-border min-h-[64px] w-full resize-y rounded-lg border border-slate-200 bg-white px-2.5 py-2 font-sans text-xs text-slate-700 outline-none focus:border-[#1A3C6E]"
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="text-[10px] text-slate-400">{treated ? 'Paciente já contatado' : 'Somente visível ao gestor'}</div>
            <div className="flex gap-1.5">
              <button onClick={() => { setDraft(''); onChange(''); setOpen(false); }} className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-500 hover:bg-slate-50">Limpar</button>
              <button onClick={() => { onChange(draft); setOpen(false); }} className="rounded-md border border-[#1A3C6E] bg-[#1A3C6E] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#16335e]">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeedbackTable({ rows, statusMap, notesMap, onToggleStatus, onUpdateNote }: any) {
  const pending = useMemo(() => rows.filter((r: any) => !statusMap[r.id]).length, [rows, statusMap]);

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center justify-between px-5 pb-3.5 pt-[18px]">
        <div>
          <div className="text-base font-semibold text-slate-900">Feedbacks recentes</div>
          <div className="mt-0.5 text-xs text-slate-500">
            Últimas avaliações registradas
            {pending > 0 && <> · <b className="font-semibold text-[#E8732A]">{pending} pendentes de retorno</b></>}
          </div>
        </div>
      </div>
      <table className="w-full table-fixed border-collapse text-[13px]">
        <colgroup>
          <col style={{ width: '20%' }} />
          <col style={{ width: '13%' }} />
          <col style={{ width: '7%' }} />
          <col style={{ width: '28%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '22%' }} />
        </colgroup>
        <thead>
          <tr>
            {['Paciente', 'Serviço', 'Nota', 'Comentário', 'Data', 'Status'].map((h) => (
              <th key={h} className="border-y border-slate-100 bg-slate-50 px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any) => {
            const treated = !!statusMap[r.id];
            const note = notesMap[r.id] || '';
            return (
              <tr key={r.id} className={`transition-opacity ${treated ? 'bg-slate-50 opacity-60' : 'opacity-100'}`}>
                <td className="relative border-b border-slate-100 px-4 py-3.5">
                  {treated && <span aria-hidden className="absolute left-0 top-1/2 h-[60%] w-[3px] -translate-y-1/2 rounded-r-sm bg-green-700" />}
                  <div className="flex items-center gap-2.5">
                    <div className="font-medium text-slate-900">{r.paciente}</div>
                  </div>
                </td>
                <td className="border-b border-slate-100 px-4 py-3.5 text-slate-600">{r.servico}</td>
                <td className="border-b border-slate-100 px-4 py-3.5"><ScoreBadge score={r.nota} size="sm" /></td>
                <td className="max-w-0 overflow-hidden text-ellipsis whitespace-nowrap border-b border-slate-100 px-4 py-3.5 text-slate-600" title={r.comentario}>{r.comentario || '—'}</td>
                <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3.5 text-xs text-slate-400">{r.data}</td>
                <td className="border-b border-slate-100 px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Switch checked={treated} onChange={(v) => onToggleStatus(r.id, v)} />
                    <span className={`whitespace-nowrap text-xs font-medium ${treated ? 'text-green-700' : 'text-slate-500'}`}>{treated ? 'Retornado' : 'Pendente'}</span>
                    <div className="ml-auto"><NotesPopover value={note} onChange={(v) => onUpdateNote(r.id, v)} treated={treated} /></div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}