'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client' 
import { type User } from '@supabase/supabase-js'

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)

  
  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
      }
    } catch (error) {
      alert('Erro ao carregar dados do investidor!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  
  async function updateProfile({
    username,
    website,
  }: {
    username: string | null
    fullname: string | null
    website: string | null
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Perfil de investidor atualizado!')
    } catch (error) {
      alert('Erro ao atualizar os dados!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-slate-900 rounded-xl border border-slate-800 text-white">
      <h2 className="text-2xl font-bold mb-6">Perfil do Analista</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400">E-mail</label>
          <input className="w-full p-2 rounded bg-slate-800 border-none text-slate-500" type="text" value={user?.email} disabled />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400">Nome Completo</label>
          <input 
            className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none" 
            type="text" 
            value={fullname || ''} 
            onChange={(e) => setFullname(e.target.value)} 
          />
        </div>
        <button
          onClick={() => updateProfile({ fullname, username, website })}
          disabled={loading}
          className="w-full bg-blue-600 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Processando...' : 'Atualizar Perfil'}
        </button>
        
        
        <form action="/auth/signout" method="post">
          <button className="w-full border border-red-500/50 text-red-500 py-2 rounded font-bold hover:bg-red-500/10 transition-colors" type="submit">
            Sair da Plataforma
          </button>
        </form>
      </div>
    </div>
  )
}