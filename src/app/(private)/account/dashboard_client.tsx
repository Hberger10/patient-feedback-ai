'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DateRangeFilter } from './date-range-filter';
import type { ReactNode } from 'react';
import {atualizarFeedback} from './actions';
import {
  Activity,
  ArrowRight,
  Calendar,
  Download,
  Eye,
  Filter,
  Frown,
  Mail,
  MessageSquare,
  Phone,
  Smile,
  Star,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';

const handleToggleStatus = (id: string, statusAtual: boolean) =>
  atualizarFeedback(id, { tratado: !statusAtual });

const handleSalvarNota = (id: string, novaNota: string) =>
  atualizarFeedback(id, { observacoes: novaNota });



export default function DashboardClient({ profile, feedbacks, metrics, dateRange }: any) {
  const router = useRouter();
  const [statusMap, setStatusMap] = useState<Record<string, boolean>>(
    () => Object.fromEntries(feedbacks.map((f: any) => [f.id, !!f.tratado]))
  );
  const [notesMap, setNotesMap] = useState<Record<string, string>>(
    () => Object.fromEntries(feedbacks.map((f: any) => [f.id, f.observacoes || '']))
  );
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);

  
  useEffect(() => {
    setStatusMap(Object.fromEntries(feedbacks.map((f: any) => [f.id, !!f.tratado])));
    setNotesMap(Object.fromEntries(feedbacks.map((f: any) => [f.id, f.observacoes || ''])));
  }, [feedbacks]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') router.refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [router]);

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
          <Suspense fallback={null}>
            <DateRangeFilter defaultFrom={dateRange.from} defaultTo={dateRange.to} />
          </Suspense>
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
            label="satisfeitos"
            icon={<Smile className="h-[18px] w-[18px] text-slate-400" strokeWidth={1.6} />}
            value={metrics.satisfeitos}
            valueClassName="text-green-700"
            sublabel="Notas 9–10"
          />

          <MetricCard
            label="Criticos"
            icon={<Frown className="h-[18px] w-[18px] text-slate-400" strokeWidth={1.6} />}
            value={metrics.criticos}
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
            onView={setSelectedFeedback}
          />
        </div>
      </main>

      {selectedFeedback && (
        <DetailModal feedback={selectedFeedback} onClose={() => setSelectedFeedback(null)} />
      )}
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
  const tier = score >= 9 ? 'satisfeitos' : score >= 7 ? 'passive' : 'criticos';
  const classes = {
    satisfeitos: 'bg-green-100 text-green-700',
    passive: 'bg-amber-100 text-amber-700',
    criticos: 'bg-red-100 text-red-700',
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

function NotesPopover({
  value,
  onChange,
  onSave,
  treated,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: (v: string) => Promise<{ success: boolean; error?: string }>;
  treated: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value || '');
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => { setDraft(value || ''); }, [value]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const save = async (text: string) => {
    setSaving(true);
    const result = await onSave(text);
    setSaving(false);
    if (result.success) {
      onChange(text);
      setOpen(false);
    } else {
      console.error('Erro ao salvar nota:', result.error);
      alert('Erro ao salvar nota. Tente novamente.');
    }
  };

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
              <button
                disabled={saving}
                onClick={() => save('')}
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-500 hover:bg-slate-50 disabled:opacity-50"
              >
                Limpar
              </button>
              <button
                disabled={saving}
                onClick={() => save(draft)}
                className="rounded-md border border-[#1A3C6E] bg-[#1A3C6E] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#16335e] disabled:opacity-50"
              >
                {saving ? 'Salvando…' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StarRating({ value, max = 5 }: { value: number | null; max?: number }) {
  if (value === null || value === undefined) return <span className="text-xs text-slate-400">—</span>;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < value ? 'text-amber-400' : 'text-slate-200'}`}
          fill={i < value ? 'currentColor' : 'none'}
          strokeWidth={1.5}
        />
      ))}
      <span className="ml-1 text-xs text-slate-500">{value}/{max}</span>
    </div>
  );
}

function DetailModal({ feedback: r, onClose }: { feedback: any; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const aspects = [
    { label: 'Qualidade', value: r.avaliacao_qualidade },
    { label: 'Tempo de espera', value: r.avaliacao_espera },
    { label: 'Suporte', value: r.avaliacao_suporte },
    { label: 'Atendimento', value: r.avaliacao_atendimento },
    { label: 'Experiência geral', value: r.avaliacao_experiencia },
  ];

  const voltairaLabel =
    r.voltaria === true || r.voltaria === 'true' || r.voltaria === 'Sim' ? 'Sim'
    : r.voltaria === false || r.voltaria === 'false' || r.voltaria === 'Não' ? 'Não'
    : r.voltaria ?? '—';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400">Ficha do paciente</div>
            <div className="mt-0.5 text-xl font-bold text-slate-900">{r.paciente}</div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {r.email && (
                <a href={`mailto:${r.email}`} className="flex items-center gap-1.5 text-[13px] text-[#1A3C6E] hover:underline">
                  <Mail className="h-3.5 w-3.5" strokeWidth={1.7} />
                  {r.email}
                </a>
              )}
              {r.telefone && (
                <a href={`tel:${r.telefone}`} className="flex items-center gap-1.5 text-[13px] text-[#1A3C6E] hover:underline">
                  <Phone className="h-3.5 w-3.5" strokeWidth={1.7} />
                  {r.telefone}
                </a>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-5">
          
          <div className="flex items-center gap-3 flex-wrap">
            <ScoreBadge score={r.nota} />
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[12px] font-medium text-slate-600">{r.servico}</span>
            <span className="text-xs text-slate-400">{r.data}</span>
          </div>

          
          <div>
            <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400">Avaliações dos aspectos</div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {aspects.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <span className="text-[12px] font-medium text-slate-600">{label}</span>
                  <StarRating value={value} />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400">Voltaria?</div>
              <div className={`mt-0.5 text-sm font-semibold ${voltairaLabel === 'Sim' ? 'text-green-700' : voltairaLabel === 'Não' ? 'text-red-600' : 'text-slate-600'}`}>
                {voltairaLabel}
              </div>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400">Como conheceu</div>
              <div className="mt-0.5 text-sm text-slate-700">{r.conheceu || '—'}</div>
            </div>
          </div>

          
          {(r.gostou || r.melhorar) && (
            <div>
              <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400">Comentários</div>
              {r.gostou && (
                <div className="mb-2 rounded-lg border border-green-100 bg-green-50 px-3 py-2.5">
                  <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-green-600">O que gostou</div>
                  <p className="text-[13px] text-slate-700">{r.gostou}</p>
                </div>
              )}
              {r.melhorar && (
                <div className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5">
                  <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-amber-600">O que melhorar</div>
                  <p className="text-[13px] text-slate-700">{r.melhorar}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FeedbackTable({ rows, statusMap, notesMap, onToggleStatus, onUpdateNote, onView }: any) {
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
          <col style={{ width: '18%' }} />
          <col style={{ width: '13%' }} />
          <col style={{ width: '7%' }} />
          <col style={{ width: '26%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '22%' }} />
          <col style={{ width: '4%' }} />
        </colgroup>
        <thead>
          <tr>
            {['Paciente', 'Serviço', 'Nota', 'Comentário', 'Data', 'Status', ''].map((h, i) => (
              <th key={i} className="border-y border-slate-100 bg-slate-50 px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">{h}</th>
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
                    <Switch
                      checked={treated}
                      onChange={async (v) => {
                        onToggleStatus(r.id, v);
                        const result = await handleToggleStatus(r.id, treated);
                        if (!result.success) console.error('Erro ao atualizar status:', result.error);
                      }}
                    />
                    <span className={`whitespace-nowrap text-xs font-medium ${treated ? 'text-green-700' : 'text-slate-500'}`}>{treated ? 'Retornado' : 'Pendente'}</span>
                    <div className="ml-auto">
                      <NotesPopover
                        value={note}
                        onChange={(v) => onUpdateNote(r.id, v)}
                        onSave={(v) => handleSalvarNota(r.id, v)}
                        treated={treated}
                      />
                    </div>
                  </div>
                </td>
                <td className="border-b border-slate-100 px-2 py-3.5">
                  <button
                    type="button"
                    onClick={() => onView(r)}
                    title="Ver ficha completa"
                    className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#1A3C6E] hover:text-[#1A3C6E] transition-colors"
                  >
                    <Eye className="h-[13px] w-[13px]" strokeWidth={1.7} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}