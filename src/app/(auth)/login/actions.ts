'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'



export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    let customMessage =error.message.toLowerCase();
    if (customMessage.includes('invalid login credentials')) {
      customMessage = 'Email ou senha inválidos. Por favor, tente novamente.';
    }
    redirect(`/login?error=${encodeURIComponent(customMessage)}`)
  }
  revalidatePath('/', 'layout')
  redirect('/account')
}
export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  
  const { error } = await supabase.auth.signUp(data)
  
  if (error) {
    let customMessage = error.message;
    
    
    if (error.message.includes('already registered')) {
      customMessage = 'Este email já está registrado. Por favor, faça login ou use outro email.';
    }
    
    redirect(`/login?error=${encodeURIComponent(customMessage)}`)
  }
  
  
  const successMessage = 'Cadastro realizado! Sua conta está em análise pelo administrador.';
  redirect(`/login?message=${encodeURIComponent(successMessage)}`);
}