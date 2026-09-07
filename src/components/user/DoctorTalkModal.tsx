import React from 'react';
import { X, Stethoscope, PhoneCall, MessageCircle, HeartPulse, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AppSettings } from '../../types';
import { dataService } from '../../services/dataService';
import { triggerHaptic } from '../../utils/telegram';

interface DoctorTalkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorTalkModal: React.FC<DoctorTalkModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const appSettings: AppSettings = dataService.getAppSettings();

  const handleOpenTelegramDoctor = () => {
    triggerHaptic('medium');
    const handle = appSettings.doctor_contact_info.replace('@', '');
    window.open(`https://t.me/${handle}`, '_blank');
  };

  return (
    <div id="doctor-talk-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
        <button
          id="close-doctor-modal"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Doctor Profile Banner */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative inline-block">
            <img
              src={appSettings.doctor_avatar_url}
              alt={appSettings.doctor_name}
              className="w-24 h-24 rounded-3xl object-cover mx-auto shadow-md border-2 border-emerald-500"
            />
            <span className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-full shadow">
              <Stethoscope className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{appSettings.doctor_name}</h3>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{appSettings.doctor_specialty}</p>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            {appSettings.doctor_bio}
          </p>
        </div>

        {/* Clinical Educational Pillars */}
        <div className="mt-5 space-y-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700 text-xs">
          <span className="font-semibold text-slate-800 dark:text-slate-200 block">Focus Areas & Consultation Support:</span>
          <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Reversing pre-diabetes & optimizing insulin sensitivity</span>
          </div>
          <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Cardiovascular longevity, blood pressure & arterial elasticity</span>
          </div>
          <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Metabolic weight balance without extreme starvation diets</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2.5">
          <button
            id="doctor-contact-telegram"
            onClick={handleOpenTelegramDoctor}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Direct Telegram Message ({appSettings.doctor_contact_info})</span>
          </button>

          {/* Emergency Crisis Support Banner */}
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-rose-950 dark:text-rose-200 block">Emergency Crisis Line</span>
                <span className="text-[11px] text-rose-700 dark:text-rose-400">Toll-free immediate medical hotline</span>
              </div>
            </div>
            <a
              href={`tel:${appSettings.emergency_crisis_phone}`}
              className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{appSettings.emergency_crisis_phone}</span>
            </a>
          </div>

          <p className="text-[11px] text-slate-400 text-center pt-2 leading-tight">
            Medical Disclaimer: Tena Holistic provides evidence-informed health education. It is not an emergency room service.
          </p>
        </div>
      </div>
    </div>
  );
};
