'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache';

const ID_CLINICA_FIXA = "131127ed-c9b0-44fa-84ef-252399dbe1d2"; 

export async function salvarPesquisaCompleta(payload: any) {
  const supabase = await createClient()

  try {
    
    const { data: paciente, error: erroPaciente } = await supabase
      .from('pacientes')
      .insert([{ 
        nome: payload.nome, 
        email: payload.email, 
        telefone: payload.telefone,
        id_clinica: ID_CLINICA_FIXA 
      }])
      .select('id')
      .single()

    if (erroPaciente) throw new Error(`Erro ao criar paciente: ${erroPaciente.message}`)

    
    const { data: servico, error: erroServico } = await supabase
      .from('servicos')
      .insert([{ 
        tipo_servico: payload.produto, 
        id_clinica: ID_CLINICA_FIXA 
      }])
      .select('id')
      .single()

    if (erroServico) throw new Error(`Erro ao criar serviço: ${erroServico.message}`)

    
    const { error: erroNps } = await supabase
      .from('respostas_nps')
      .insert([{
        id_paciente: paciente.id,
        id_servico: servico.id,
        nota: payload.notaNPS,
        avaliacao_qualidade: payload.starRatings.qualidade,
        avaliacao_espera: payload.starRatings.espera,
        avaliacao_suporte: payload.starRatings.suporte,
        avaliacao_atendimento: payload.starRatings.atendimento,
        avaliacao_experiencia: payload.starRatings.experiencia,
        gostou: payload.gostou,
        melhorar: payload.melhorar,
        voltaria: payload.voltaria,
        conheceu: payload.conheceu
      }])

    if (erroNps) throw new Error(`Erro ao salvar NPS: ${erroNps.message}`)

    
    revalidatePath('/account'); 

    return { success: true }

  } catch (error: any) {
    console.error("Falha na transação:", error)
    return { success: false, error: error.message }
  }
}