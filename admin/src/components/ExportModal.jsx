import React, {useState} from 'react'
import { saveAs } from 'file-saver'

export default function ExportModal({ rows = [] }) {
  const [open, setOpen] = useState(false)
  const exportCSV = (filteredRows) => {
    const headers = ["tx_ref","account_id","amount","currency","entry_type","created_at"]
    const csv = [
      headers.join(","),
      ...filteredRows.map(r => headers.map(h => `"${(r[h]||'').toString().replace(/"/g,'""')}"`).join(","))
    ].join("\n")
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `transactions_export_${Date.now()}.csv`)
  }
  return (
    <div>
      <button onClick={()=>setOpen(true)} className="px-3 py-2 bg-amber-600 rounded">Export</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setOpen(false)} />
          <div className="relative z-10 bg-slate-900 p-6 rounded-lg border border-slate-700 max-w-lg w-full">
            <h3 className="text-lg font-bold mb-3">Export Transactions</h3>
            <p className="text-sm text-slate-400 mb-3">You can export the currently loaded transaction rows as CSV.</p>
            <div className="flex gap-2">
              <button onClick={()=>{ exportCSV(rows); setOpen(false) }} className="px-4 py-2 bg-emerald-600 rounded">Export All</button>
              <button onClick={()=>{ exportCSV(rows.filter(r=>r.entry_type==='transfer')); setOpen(false) }} className="px-4 py-2 bg-indigo-600 rounded">Export Transfers</button>
              <button onClick={()=>setOpen(false)} className="px-4 py-2 bg-slate-700 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
