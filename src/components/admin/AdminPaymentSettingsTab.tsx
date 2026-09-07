import React, { useState } from 'react';
import { CreditCard, Save, CheckCircle2, RefreshCw } from 'lucide-react';
import { PaymentSettings } from '../../types';
import { dataService } from '../../services/dataService';

interface AdminPaymentSettingsTabProps {
  adminEmail: string;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const AdminPaymentSettingsTab: React.FC<AdminPaymentSettingsTabProps> = ({
  adminEmail,
  onShowToast
}) => {
  const currentSettings = dataService.getPaymentSettings();

  const [telebirrName, setTelebirrName] = useState<string>(currentSettings.telebirr_account_name);
  const [telebirrNumber, setTelebirrNumber] = useState<string>(currentSettings.telebirr_account_number);
  const [telebirrInstructions, setTelebirrInstructions] = useState<string>(currentSettings.telebirr_instructions);

  const [cbeName, setCbeName] = useState<string>(currentSettings.cbe_account_name);
  const [cbeNumber, setCbeNumber] = useState<string>(currentSettings.cbe_account_number);
  const [cbeInstructions, setCbeInstructions] = useState<string>(currentSettings.cbe_instructions);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Partial<PaymentSettings> = {
      telebirr_account_name: telebirrName,
      telebirr_account_number: telebirrNumber,
      telebirr_instructions: telebirrInstructions,
      cbe_account_name: cbeName,
      cbe_account_number: cbeNumber,
      cbe_instructions: cbeInstructions
    };

    dataService.updatePaymentSettings(updated, adminEmail);
    onShowToast('success', 'Payment Accounts Saved', 'Changes immediately apply to the user deposit screen.');
  };

  return (
    <div id="admin-payments-tab" className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ethiopian Payment Channel Setup</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure official bank accounts and Telebirr merchant details displayed on the user deposit screen
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Telebirr Channel */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-700">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Telebirr Account Configuration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Account / Merchant Name</label>
              <input
                type="text"
                required
                value={telebirrName}
                onChange={(e) => setTelebirrName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Telebirr Phone / Account Number</label>
              <input
                type="text"
                required
                value={telebirrNumber}
                onChange={(e) => setTelebirrNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">User Instructions & Memo</label>
            <textarea
              rows={2}
              value={telebirrInstructions}
              onChange={(e) => setTelebirrInstructions(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* CBE Birr Channel */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-700">
            <span className="w-3 h-3 rounded-full bg-purple-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Commercial Bank of Ethiopia (CBE)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Account Holder Name</label>
              <input
                type="text"
                required
                value={cbeName}
                onChange={(e) => setCbeName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">CBE Account Number</label>
              <input
                type="text"
                required
                value={cbeNumber}
                onChange={(e) => setCbeNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">User Instructions & Memo</label>
            <textarea
              rows={2}
              value={cbeInstructions}
              onChange={(e) => setCbeInstructions(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply Payment Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
