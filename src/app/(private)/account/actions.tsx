'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from "next/cache";

export async function atualizarFeedback(id_resposta: string, dadosAtualizados: { tratado?: boolean; observacoes?: string }) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('respostas_nps')
    .update(dadosAtualizados)
    .eq('id', id_resposta)

  if (error) {
    console.error('Erro ao atualizar no Supabase:', error)
    return { success: false, error: error.message }
  }
  revalidatePath('/account') 
  return { success: true }
}