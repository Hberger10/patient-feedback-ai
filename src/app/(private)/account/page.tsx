import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './dashboard_client';

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
          created_at,
          pacientes ( nome ),
          servicos ( tipo_servico )
        `)
        .in('id_paciente', pacienteIds)
        .order('created_at', { ascending: false })
    : { data: [] };

  
  const feedbacks = respostas?.map((r: any) => ({
    id: r.id,
    paciente: r.pacientes?.nome || 'Anônimo',
    servico: r.servicos?.tipo_servico || 'Não informado',
    nota: r.nota,
    comentario: r.gostou || r.melhorar || '',
    data: new Date(r.created_at).toLocaleDateString('pt-BR')
  })) || [];

  
  return (
    <DashboardClient 
      profile={profile}
      feedbacks={feedbacks}
      metrics={{
        npsScore: 0,
        total: feedbacks.length, 
        promotores: 0,
        detratores: 0
      }}
    />
  );
}