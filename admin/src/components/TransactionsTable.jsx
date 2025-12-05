import React, {useState} from 'react'
import DrilldownModal from './DrilldownModal'

export default function TransactionsTable({ rows = [], onRefresh }) {
  const [selected, setSelected] = useState(null)
  const [q, setQ] = useState('')

  const filtered = rows.filter(r => {
    if (!q) return true
    const s = q.toLowerCase()
    return (String(r.tx_ref).toLowerCase().includes(s) ||
            String(r.description || '').toLowerCase().includes(s) ||
            String(r.entry_type || '').toLowerCase().includes(s))
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search txref, desc, type" className="p-2 bg-slate-900 rounded w-full" />
        <button onClick={onRefresh} className="px-3 py-2 bg-indigo-600 rounded">Refresh</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-300">
            <tr>
              <th className="p-2">TX</th>
              <th className="p-2">Account</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Currency</th>
              <th className="p-2">Type</th>
              <th className="p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="border-t border-slate-700 hover:bg-slate-850/40 cursor-pointer" onClick={()=>setSelected(r)}>
                <td className="p-2 font-mono text-xs">{r.tx_ref}</td>
                <td className="p-2">{r.account_id}</td>
                <td className="p-2">{parseFloat(r.amount).toFixed(2)}</td>
                <td className="p-2">{r.currency}</td>
                <td className="p-2">{r.entry_type}</td>
                <td className="p-2">{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="6" className="p-4 text-slate-400">No transactions found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && <DrilldownModal row={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
