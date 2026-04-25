import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './dashboard_client';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ from?: string; to?: string }>;

function getMonthRange() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();
  return {
    from: `${y}-${m}-01`,
    to: `${y}-${m}-${String(lastDay).padStart(2, '0')}`,
  };
}

export default async function DashboardPage(props: { searchParams: SearchParams }) {
  const { from: rawFrom, to: rawTo } = await props.searchParams;
  const defaults = getMonthRange();
  const from = rawFrom ?? defaults.from;
  const to = rawTo ?? defaults.to;

  const fromISO = `${from}T00:00:00.000Z`;
  const toISO = `${to}T23:59:59.999Z`;

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id_clinica, name, cargo') 
    .eq('id', user.id)
    .single();

  if (!profile) return <div>Perfil não encontrado.</div>;

  const { data: pacientesDaClinica } = await supabase
    .from('pacientes')
    .select('id')
    .eq('id_clinica', profile.id_clinica);

  const pacienteIds = pacientesDaClinica?.map((p: any) => p.id) ?? [];

  
  const { data: respostas, error: errorRespostas } = pacienteIds.length > 0
    ? await supabase
        .from('respostas_nps')
        .select(`
          id,
          nota,
          gostou,
          melhorar,
          avaliacao_qualidade,
          avaliacao_espera,
          avaliacao_suporte,
          avaliacao_atendimento,
          avaliacao_experiencia,
          voltaria,
          conheceu,
          created_at,
          tratado,
          observacoes,
          servico_digitado,
          pacientes (nome, email, telefone),
          servicos (tipo_servico)
        `)
        .in('id_paciente', pacienteIds)
        .gte('created_at', fromISO)
        .lte('created_at', toISO)
        .order('created_at', { ascending: false })
    : { data: [], error: null };

  if (errorRespostas) console.error('Erro na query respostas_nps:', errorRespostas);

  const feedbacks = respostas?.map((r: any) => ({
    id: r.id,
    paciente: r.pacientes?.nome || 'Anônimo',
    email: r.pacientes?.email || '',
    telefone: r.pacientes?.telefone || '',
    
    servico: r.servicos?.tipo_servico === 'Outros' && r.servico_digitado 
              ? `Outros (${r.servico_digitado})` 
              : r.servicos?.tipo_servico || 'Não informado', 
    nota: Number(r.nota),
    comentario: r.gostou || r.melhorar || '',
    gostou: r.gostou || '',
    melhorar: r.melhorar || '',
    tratado: r.tratado || false,
    observacoes: r.observacoes || '',
    data: new Date(r.created_at).toLocaleDateString('pt-BR'), 
    avaliacao_qualidade: r.avaliacao_qualidade ?? null,
    avaliacao_espera: r.avaliacao_espera ?? null,
    avaliacao_suporte: r.avaliacao_suporte ?? null,
    avaliacao_atendimento: r.avaliacao_atendimento ?? null,
    avaliacao_experiencia: r.avaliacao_experiencia ?? null,
    voltaria: r.voltaria ?? null,
    conheceu: r.conheceu || '',
  })) || [];

  const satisfeitos = feedbacks.filter((f: any) => f.nota >= 9).length;
  const criticos = feedbacks.filter((f: any) => f.nota <= 6).length;
  const total = feedbacks.length;
  const npsScore = total > 0 ? Math.round(((satisfeitos - criticos) / total) * 100) : 0;

  return (
    
    <Suspense fallback={<div className="p-8 text-center text-slate-500 animate-pulse">Carregando métricas...</div>}>
      <DashboardClient
        profile={profile}
        feedbacks={feedbacks}
        metrics={{ npsScore, total, satisfeitos, criticos }}
        dateRange={{ from, to }}
      />
    </Suspense>
  );
}