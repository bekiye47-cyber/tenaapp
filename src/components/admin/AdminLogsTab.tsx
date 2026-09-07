import React, { useState } from 'react';
import { FileText, Search, ShieldCheck, Clock, UserCheck, Trash2 } from 'lucide-react';
import { dataService } from '../../services/dataService';

export const AdminLogsTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const logs = dataService.getActivityLogs();

  const filteredLogs = logs.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      l.action.toLowerCase().includes(q) ||
      l.admin_email.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q)
    );
  });

  return (
    <div id="admin-logs-tab" className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Audit & Activity Trail</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Immutable log of all deposit approvals, publications, VIP grants, and clinical updates
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail..."
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">Action</th>
                <th className="p-4">Admin</th>
                <th className="p-4">Details</th>
                <th className="p-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400 font-sans">
                    No activity logs recorded yet.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-750 transition-colors">
                    <td className="p-4 font-sans">
                      <span className="font-bold text-slate-900 dark:text-white block">{log.action}</span>
                    </td>

                    <td className="p-4 text-emerald-600 dark:text-emerald-400">
                      {log.admin_email}
                    </td>

                    <td className="p-4 font-sans text-xs max-w-sm truncate text-slate-600 dark:text-slate-300">
                      {log.details}
                    </td>

                    <td className="p-4 text-right text-slate-400 text-[11px]">
                      {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
