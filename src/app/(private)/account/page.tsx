import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './dashboard_client';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
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

  const { data: respostas } = pacienteIds.length > 0
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
          pacientes ( nome, email, telefone ),
          servicos ( tipo_servico )
        `)
        .in('id_paciente', pacienteIds)
        .order('created_at', { ascending: false })
    : { data: [] };

  const feedbacks = respostas?.map((r: any) => ({
    id: r.id,
    paciente: r.pacientes?.nome || 'Anônimo',
    email: r.pacientes?.email || '',
    telefone: r.pacientes?.telefone || '',
    servico: r.servicos?.tipo_servico || 'Não informado',
    nota: Number(r.nota),
    comentario: r.gostou || r.melhorar || '',
    gostou: r.gostou || '',
    melhorar: r.melhorar || '',
    data: new Date(r.created_at).toLocaleDateString('pt-BR'),
    avaliacao_qualidade: r.avaliacao_qualidade ?? null,
    avaliacao_espera: r.avaliacao_espera ?? null,
    avaliacao_suporte: r.avaliacao_suporte ?? null,
    avaliacao_atendimento: r.avaliacao_atendimento ?? null,
    avaliacao_experiencia: r.avaliacao_experiencia ?? null,
    voltaria: r.voltaria ?? null,
    conheceu: r.conheceu || '',
  })) || [];

  const satisfeitos = feedbacks.filter(f => f.nota >= 9).length;
  const criticos = feedbacks.filter(f => f.nota <= 6).length;
  const total = feedbacks.length;
  const npsScore = total > 0 ? Math.round(((satisfeitos - criticos) / total) * 100) : 0;

  return (
    <DashboardClient
      profile={profile}
      feedbacks={feedbacks}
      metrics={{
        npsScore,
        total,
        satisfeitos,
        criticos
      }}
    />
  );
}