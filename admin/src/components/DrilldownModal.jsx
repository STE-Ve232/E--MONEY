import React from 'react'
import { Dialog } from '@radix-ui/react-dialog'

export default function DrilldownModal({ row, onClose }) {
  if(!row) return null
  return (
    <Dialog open onOpenChange={(open)=> { if(!open) onClose() }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-black/60 absolute inset-0" />
        <div className="relative z-10 bg-slate-900 p-6 rounded-lg max-w-xl w-full border border-slate-700">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold">Transaction {row.tx_ref}</h3>
            <button onClick={onClose} className="text-slate-400">Close</button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div><strong>Account:</strong> {row.account_id}</div>
            <div><strong>Amount:</strong> {parseFloat(row.amount).toFixed(2)} {row.currency}</div>
            <div className="col-span-2"><strong>Type:</strong> {row.entry_type}</div>
            <div className="col-span-2"><strong>Description:</strong> {row.description || '—'}</div>
            <div className="col-span-2"><strong>Metadata:</strong>
              <pre className="text-xs mt-2 bg-slate-800 p-2 rounded max-h-48 overflow-auto">{JSON.stringify(row.metadata || {}, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
