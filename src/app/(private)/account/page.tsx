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

  console.log("ERRO SUPABASE:", profileError);
  console.log("DADOS DO PERFIL:", profile);

  if (!profile) return <div>Perfil não encontrado.</div>;

  
  const { data: respostas } = await supabase
    .from('respostas_nps')
    .select(`
      id,
      nota,
      gostou,
      melhorar,
      created_at,
      pacientes!inner ( nome, id_clinica ),
      servicos ( tipo_servico )
    `)
    .eq('pacientes.id_clinica', profile.id_clinica)
    .order('created_at', { ascending: false });

  
  const feedbacks = respostas?.map((r: any) => ({
    id: r.id,
    paciente: r.pacientes?.name || 'Anônimo',
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