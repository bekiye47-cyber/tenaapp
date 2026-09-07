import React, { useState } from 'react';
import { CreditCard, CheckCircle2, XCircle, Eye, AlertCircle, Clock, Check, X, ShieldAlert } from 'lucide-react';
import { Deposit } from '../../types';
import { dataService } from '../../services/dataService';

interface AdminDepositsTabProps {
  adminEmail: string;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const AdminDepositsTab: React.FC<AdminDepositsTabProps> = ({ adminEmail, onShowToast }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [rejectingDepositId, setRejectingDepositId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Payment reference does not match official bank record');

  const deposits = dataService.getDeposits();

  const filteredDeposits = deposits.filter((d) => {
    if (filterStatus === 'all') return true;
    return d.status === filterStatus;
  });

  const handleApprove = (deposit: Deposit) => {
    const res = dataService.reviewDeposit(deposit.id, 'approved', adminEmail);
    if (res.success) {
      onShowToast('success', 'Deposit Approved', `Credited +${deposit.amount} ETB to ${deposit.user?.first_name || 'User'}'s wallet.`);
    } else {
      onShowToast('error', 'Action Failed', res.message);
    }
  };

  const handleConfirmReject = () => {
    if (!rejectingDepositId) return;
    const res = dataService.reviewDeposit(rejectingDepositId, 'rejected', adminEmail, rejectReason);
    setRejectingDepositId(null);
    if (res.success) {
      onShowToast('info', 'Deposit Rejected', 'The deposit has been marked as rejected.');
    } else {
      onShowToast('error', 'Action Failed', res.message);
    }
  };

  return (
    <div id="admin-deposits-tab" className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Deposit Verification Queue</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Verify manual Telebirr and CBE Birr transaction receipts and approve wallet balances
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterStatus === s
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Deposits Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">User Details</th>
                <th className="p-4">Method & Reference</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Receipt</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No deposits matching this status filter.
                  </td>
                </tr>
              ) : (
                filteredDeposits.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-750 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={d.user?.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                          alt={d.user?.first_name || 'User'}
                          className="w-10 h-10 rounded-2xl object-cover"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {d.user?.first_name || 'User'} {d.user?.last_name || ''}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            @{d.user?.username || 'user'} • ID: {d.user?.telegram_id || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{d.payment_method}</div>
                      <span className="font-mono text-[11px] text-slate-500 uppercase">{d.transaction_reference}</span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(d.submitted_at).toLocaleDateString()} {new Date(d.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        {d.amount} ETB
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => setSelectedReceipt(d.receipt_url)}
                        className="group relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 block"
                        title="View Full Receipt"
                      >
                        <img
                          src={d.receipt_url}
                          alt="Receipt Preview"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                          <Eye className="w-4 h-4" />
                        </div>
                      </button>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                          d.status === 'pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : d.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {d.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                        {d.status}
                      </span>
                      {d.rejection_reason && (
                        <div className="text-[10px] text-rose-600 mt-1 max-w-xs">{d.rejection_reason}</div>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      {d.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(d)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => setRejectingDepositId(d.id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1 border border-rose-200 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full-Size Receipt Modal Viewer */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-xl w-full p-4 relative flex flex-col items-center">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-white hover:text-slate-300 p-2 rounded-full bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-white font-bold text-sm mb-3">Deposit Payment Receipt Proof</h3>
            <div className="max-h-[75vh] overflow-auto rounded-2xl border border-slate-800">
              <img src={selectedReceipt} alt="Receipt Full Proof" className="w-full h-auto object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingDepositId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Reject Deposit Submission</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Please specify the rejection reason. The user will be notified in their transaction overview.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingDepositId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
