import React, { useState } from 'react';
import { X, Crown, Sparkles, BookOpen, Dumbbell, Lightbulb, Stethoscope, Lock, CheckCircle2 } from 'lucide-react';
import { UserProfile, VipContent, VipContentType } from '../../types';
import { dataService } from '../../services/dataService';
import { triggerHaptic } from '../../utils/telegram';

interface VipSectionModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenDoctorTalk: () => void;
}

export const VipSectionModal: React.FC<VipSectionModalProps> = ({ user, isOpen, onClose, onOpenDoctorTalk }) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedContentId, setExpandedContentId] = useState<string | null>(null);

  if (!isOpen) return null;

  const vipItems: VipContent[] = dataService.getActiveVipContent();
  const isVip = user.vip;

  const filterTabs: { id: string; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'All VIP', icon: Sparkles },
    { id: 'trick', label: 'Tricks', icon: Lightbulb },
    { id: 'book', label: 'Books', icon: BookOpen },
    { id: 'tip', label: 'Tips', icon: Dumbbell },
    { id: 'doctor_talk', label: 'Doctor Q&A', icon: Stethoscope },
  ];

  const filteredItems = selectedType === 'all'
    ? vipItems
    : vipItems.filter((item) => item.content_type === selectedType);

  return (
    <div id="vip-section-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-amber-200 dark:border-amber-900/60 overflow-hidden">
        {/* VIP Header Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 p-5 text-white relative shrink-0">
          <button
            id="close-vip-modal"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-6 h-6 text-amber-100 fill-amber-100" />
            <h2 className="text-xl font-black tracking-wide">TENA HOLISTIC VIP</h2>
          </div>
          <p className="text-xs text-amber-100/90 leading-relaxed max-w-sm">
            Exclusive health protocols, metabolic hacks, and direct guidance from our medical specialists.
          </p>

          <div className="mt-3 flex items-center gap-2 text-[11px] font-medium">
            <span
              className={`px-2.5 py-0.5 rounded-full border ${
                isVip
                  ? 'bg-emerald-500/30 border-emerald-300 text-white'
                  : 'bg-white/20 border-white/40 text-amber-50'
              }`}
            >
              {isVip ? '✓ Active VIP Member' : 'Standard Access'}
            </span>
            <button
              onClick={() => {
                triggerHaptic('light');
                onOpenDoctorTalk();
              }}
              className="ml-auto underline text-white hover:text-amber-200 transition-colors"
            >
              Doctor Info →
            </button>
          </div>
        </div>

        {/* Not VIP Member Lock Notice */}
        {!isVip ? (
          <div className="p-6 text-center space-y-4 my-auto">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/60 rounded-3xl flex items-center justify-center mx-auto text-amber-600 border border-amber-200 dark:border-amber-900">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">VIP Membership Required</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                This content is curated exclusively for Tena Holistic VIP members.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 text-left border border-slate-200 dark:border-slate-700 text-xs space-y-2.5">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">VIP Privileges Include:</span>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>📚 Free medical books & complete PDF guides</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>💡 Free clinical metabolic tricks & biohacks</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>🏃 Free structured challenges & habit masterclasses</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>🥗 Daily health tips from clinical nutritionists</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>👨‍⚕️ Direct contact instructions & educational Q&A</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Note: In Version 1, VIP status is granted by administrators. Contact our support or clinic to request VIP enrollment.
            </p>
          </div>
        ) : (
          /* VIP Unlocked Feed */
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {filterTabs.map((tab) => {
                const Icon = tab.icon;
                const active = selectedType === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedType(tab.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      active
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No VIP items found for this category.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item) => {
                  const isExpanded = expandedContentId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all"
                    >
                      <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                          {item.content_type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{item.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {item.description}
                        </p>

                        {isExpanded ? (
                          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 bg-amber-50/50 dark:bg-slate-900/40 p-3 rounded-xl">
                            <span className="font-semibold text-amber-800 dark:text-amber-400 block">VIP Full Guide:</span>
                            <p>{item.content}</p>
                            <button
                              onClick={() => setExpandedContentId(null)}
                              className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 underline pt-1 block"
                            >
                              Show Less
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              triggerHaptic('light');
                              setExpandedContentId(item.id);
                            }}
                            className="mt-3 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1"
                          >
                            <span>Read Full Protocol</span>
                            <span>→</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
