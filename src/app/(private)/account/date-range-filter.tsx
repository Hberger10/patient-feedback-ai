'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Calendar } from 'lucide-react';
import { useState } from 'react';

interface DateRangeFilterProps {
  defaultFrom: string;
  defaultTo: string;
}

export function DateRangeFilter({ defaultFrom, defaultTo }: DateRangeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  
  const [from, setFrom] = useState(searchParams.get('from') || defaultFrom);
  const [to, setTo] = useState(searchParams.get('to') || defaultTo);

  const temFiltroAtivo = searchParams.has('from') || searchParams.has('to');

  function handleFilter() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('from', from);
    params.set('to', to);
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleClear() {
    
    setFrom(defaultFrom);
    setTo(defaultTo);
    router.push(pathname);
  }

  return (
    
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-slate-400 shrink-0" strokeWidth={1.6} />
      
      <input
        type="date"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        className="rounded border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
      />
      
      <span className="text-sm text-slate-400">até</span>
      
      <input
        type="date"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="rounded border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
      />
      
      <button
        type="button" 
        onClick={handleFilter}
        className="rounded bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
      >
        Filtrar
      </button>

      {temFiltroAtivo && (
        <button
          type="button"
          onClick={handleClear}
          className="rounded border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          Limpar
        </button>
      )}
    </div>
  );
}