import React, { useState } from 'react';
import { X, Upload, CheckCircle2, ShieldCheck, AlertCircle, Copy, Check } from 'lucide-react';
import { UserProfile, PaymentSettings, PaymentMethod } from '../../types';
import { compressImage } from '../../utils/imageCompression';
import { dataService } from '../../services/dataService';
import { triggerHaptic } from '../../utils/telegram';

interface DepositModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ user, isOpen, onClose, onSuccess }) => {
  const [method, setMethod] = useState<PaymentMethod>('Telebirr');
  const [amount, setAmount] = useState<string>('250');
  const [reference, setReference] = useState<string>('');
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptSizeKb, setReceiptSizeKb] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const paymentSettings: PaymentSettings = dataService.getPaymentSettings();

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    triggerHaptic('light');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsCompressing(true);
    try {
      const result = await compressImage(file, 1200, 1200, 0.82);
      setReceiptPreview(result.dataUrl);
      setReceiptSizeKb(result.sizeKb);
      triggerHaptic('light');
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not process image.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }
    if (!reference.trim()) {
      setErrorMsg('Please enter the transaction reference / SMS code.');
      return;
    }
    if (!receiptPreview) {
      setErrorMsg('Please attach your payment receipt photo or screenshot.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      dataService.submitDeposit({
        user_id: user.id,
        amount: numAmount,
        payment_method: method,
        transaction_reference: reference.trim(),
        receipt_url: receiptPreview,
        user: {
          telegram_id: user?.telegram_id || 68492011,
          first_name: user?.first_name || 'User',
          last_name: user?.last_name || '',
          username: user?.username || '',
          photo_url: user?.photo_url || ''
        }
      });

      triggerHaptic('success');
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Deposit submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTelebirr = method === 'Telebirr';
  const accountName = isTelebirr ? paymentSettings.telebirr_account_name : paymentSettings.cbe_account_name;
  const accountNumber = isTelebirr ? paymentSettings.telebirr_account_number : paymentSettings.cbe_account_number;
  const instructions = isTelebirr ? paymentSettings.telebirr_instructions : paymentSettings.cbe_instructions;

  return (
    <div id="deposit-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div id="deposit-modal" className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 dark:border-slate-800 p-6 relative">
        <button
          id="close-deposit-modal"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Deposit Submitted!</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              Your deposit of <span className="font-semibold text-slate-900 dark:text-white">{amount} ETB</span> is waiting for admin verification. Once verified, your wallet balance will be credited automatically.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-medium rounded-full border border-amber-200 dark:border-amber-900">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Status: PENDING
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Deposit to Wallet</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Add funds via Telebirr or CBE Birr</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4">
              <button
                type="button"
                id="select-telebirr"
                onClick={() => {
                  setMethod('Telebirr');
                  triggerHaptic('light');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  method === 'Telebirr'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Telebirr
              </button>
              <button
                type="button"
                id="select-cbe"
                onClick={() => {
                  setMethod('CBE Birr');
                  triggerHaptic('light');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  method === 'CBE Birr'
                    ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                CBE Birr
              </button>
            </div>

            {/* Account Details Box */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700 mb-5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Account Name:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{accountName}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Account Number:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{accountNumber}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(accountNumber, 'acc')}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 transition-colors"
                    title="Copy Account Number"
                  >
                    {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="pt-2 text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-line border-t border-slate-200/60 dark:border-slate-700">
                {instructions}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Amount in ETB
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {['100', '250', '500', '1000'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                        amount === preset
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {preset} ETB
                    </button>
                  ))}
                </div>
                <input
                  id="deposit-amount-input"
                  type="number"
                  min="10"
                  step="5"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Transaction / Reference Code
                </label>
                <input
                  id="deposit-reference-input"
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. TEL-8947291 or CBE-394821"
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white uppercase"
                  required
                />
              </div>

              {/* Receipt Upload with compression & preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Payment Receipt (Screenshot/Photo)
                </label>
                {receiptPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 p-2">
                    <img
                      src={receiptPreview}
                      alt="Receipt Preview"
                      className="w-full h-44 object-cover rounded-xl"
                    />
                    <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                      <span>Compressed: {receiptSizeKb} KB</span>
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptPreview(null);
                          setReceiptSizeKb(0);
                        }}
                        className="text-rose-600 hover:underline"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-5 cursor-pointer bg-slate-50 dark:bg-slate-800/40 transition-colors">
                    <Upload className="w-7 h-7 text-slate-400 mb-2" />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {isCompressing ? 'Compressing receipt...' : 'Tap to upload payment receipt'}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Auto-compressed for fast upload</span>
                    <input
                      id="receipt-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs rounded-xl border border-rose-200 dark:border-rose-900">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                id="submit-deposit-button"
                type="submit"
                disabled={isSubmitting || isCompressing}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-2xl shadow-sm shadow-emerald-600/30 transition-all text-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Deposit for Verification'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
