import React, {useState} from 'react'
import api from '../lib/api'

export default function ReconcileModal({ onReconciled }) {
  const [open, setOpen] = useState(false)
  const [running, setRunning] = useState(false)
  const run = async () => {
    setRunning(true)
    try {
      // admin endpoint triggers reconciliation job
      await api.post('/admin/reconcile/run')
      alert('Reconcile job enqueued')
      onReconciled && onReconciled()
      setOpen(false)
    } catch (e) {
      alert('Failed to start reconcile: ' + (e.response?.data?.error || e.message))
    } finally { setRunning(false) }
  }
  return (
    <>
      <button onClick={()=>setOpen(true)} className="px-3 py-2 bg-rose-600 rounded">Reconcile</button>
      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setOpen(false)} />
          <div className="relative z-10 bg-slate-900 p-6 rounded border border-slate-700 w-full max-w-md">
            <h3 className="text-lg font-bold mb-3">Run Reconciliation</h3>
            <p className="text-sm text-slate-400 mb-4">This will run the reserve reconciliation job (snapshot & compare ledger).</p>
            <div className="flex gap-2">
              <button onClick={run} disabled={running} className="px-4 py-2 bg-emerald-600 rounded">{running ? 'Running...' : 'Start'}</button>
              <button onClick={()=>setOpen(false)} className="px-4 py-2 bg-slate-700 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
