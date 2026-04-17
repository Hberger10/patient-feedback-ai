'use client'

import { useState } from 'react'

import { login, signup } from './actions' 

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 font-sans text-slate-200">
      <div className="relative w-full max-w-[768px] min-h-[480px] bg-slate-900 rounded-[30px] shadow-2xl overflow-hidden transition-all duration-700 ease-in-out">
        
        {/* Formulário de Cadastro */}
        <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-1/2 opacity-0 z-[1] ${isSignUp ? 'translate-x-full opacity-100 z-[5] animate-move' : ''}`}>
          {/* 2. Adiciona a action de signup no form */}
          <form action={signup} className="bg-slate-900 flex items-center justify-center flex-col px-10 h-full">
            <h1 className="text-white text-3xl font-bold mb-4">Create Account</h1>
            <span className="text-slate-400 text-xs mb-4 uppercase tracking-wider">Use your email to create an account</span>
            
            <div className="flex items-center bg-slate-800/50 w-full mb-3 p-3.5 rounded-xl border border-slate-700/50 focus-within:border-blue-500/50 transition-all">
              <svg className="w-5 h-5 mr-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              {/* Adicionado name="name" */}
              <input type="text" name="name" id="signUpName" placeholder="Name" className="bg-transparent outline-none w-full text-sm placeholder:text-slate-600 text-slate-300" required/>
            </div>

            <div className="flex items-center bg-slate-800/50 w-full mb-3 p-3.5 rounded-xl border border-slate-700/50 focus-within:border-blue-500/50 transition-all">
              <svg className="w-5 h-5 mr-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              {/* Adicionado name="email" */}
              <input type="email" name="email" id="signUpEmail" placeholder="Email" className="bg-transparent outline-none w-full text-sm placeholder:text-slate-600 text-slate-300" required/>
            </div>

            <div className="flex items-center bg-slate-800/50 w-full mb-3 p-3.5 rounded-xl border border-slate-700/50 focus-within:border-blue-500/50 transition-all">
              <svg className="w-5 h-5 mr-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              {/* Adicionado name="password" */}
              <input type="password" name="password" id="signUpPassword" placeholder="Senha" className="bg-transparent outline-none w-full text-sm placeholder:text-slate-600 text-slate-300" required />
            </div>

            <button type="submit" className="mt-4 bg-blue-600 text-white text-xs py-3 px-11 rounded-lg font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">
              Cadastrar
            </button>
          </form>
        </div>

        {/* Formulário de Login */}
        <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-1/2 z-[2] ${isSignUp ? 'translate-x-full opacity-0' : ''}`}>
          {/* 3. Adiciona a action de login no form */}
          <form action={login} className="bg-slate-900 flex items-center justify-center flex-col px-10 h-full">
            <h1 className="text-white text-3xl font-bold mb-8">Entrar</h1>
            
            <div className="flex items-center bg-slate-800/50 w-full mb-3 p-3.5 rounded-xl border border-slate-700/50 focus-within:border-blue-500/50 transition-all">
              <svg className="w-5 h-5 mr-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              {/* Adicionado name="email" */}
              <input type="email" name="email" placeholder="Email" className="bg-transparent outline-none w-full text-sm placeholder:text-slate-600 text-slate-300" required />
            </div>

            <div className="flex items-center bg-slate-800/50 w-full mb-3 p-3.5 rounded-xl border border-slate-700/50 focus-within:border-blue-500/50 transition-all">
              <svg className="w-5 h-5 mr-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              {/* Adicionado name="password" */}
              <input type="password" name="password" placeholder="Senha" className="bg-transparent outline-none w-full text-sm placeholder:text-slate-600 text-slate-300" required />
            </div>

            <a href="#" className="text-slate-500 text-xs mt-3 hover:text-blue-400 transition-all border-b border-transparent hover:border-blue-400">Esqueceu sua senha?</a>
            <button type="submit" className="mt-6 bg-blue-600 text-white text-xs py-3 px-11 rounded-lg font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">
              Acessar
            </button>
          </form>
        </div>

        {/* Overlay (A parte azul que desliza) - Mantido igual */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out z-[100] ${isSignUp ? '-translate-x-full rounded-r-[150px]' : 'rounded-l-[150px]'}`}>
          <div className={`bg-gradient-to-r from-blue-700 to-indigo-900 text-white relative -left-full h-full w-[200%] transition-all duration-700 ease-in-out ${isSignUp ? 'translate-x-1/2' : 'translate-x-0'}`}>
            
            <div className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-10 text-center top-0 transition-all duration-700 ease-in-out ${isSignUp ? 'translate-x-0' : '-translate-x-[200%]'}`}>
              <h1 className="text-3xl font-bold mb-4">Bem-vindo!</h1>
              <p className="text-sm leading-relaxed mb-8 text-blue-100">Já possui uma conta? Entre agora para gerenciar seus ativos.</p>
              <button type="button" onClick={() => setIsSignUp(false)} className="border-2 border-white/50 py-2 px-10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-blue-900 transition-all">
                Entrar
              </button>
            </div>

            <div className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-10 text-center top-0 right-0 transition-all duration-700 ease-in-out ${isSignUp ? 'translate-x-[200%]' : 'translate-x-0'}`}>
              <h1 className="text-3xl font-bold mb-4">Olá, Amigo!</h1>
              <p className="text-sm leading-relaxed mb-8 text-blue-100">Ainda não tem conta? Cadastre-se e comece sua jornada.</p>
              <button type="button" onClick={() => setIsSignUp(true)} className="border-2 border-white/50 py-2 px-10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-blue-900 transition-all">
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}