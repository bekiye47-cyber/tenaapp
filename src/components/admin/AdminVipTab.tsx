import React, { useState } from 'react';
import { Crown, Plus, Edit2, Trash2, Stethoscope, Lightbulb, Dumbbell, BookOpen, Check, X, ShieldAlert } from 'lucide-react';
import { VipContent, VipContentType, AppSettings } from '../../types';
import { dataService } from '../../services/dataService';

interface AdminVipTabProps {
  adminEmail: string;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const AdminVipTab: React.FC<AdminVipTabProps> = ({ adminEmail, onShowToast }) => {
  const [isEditingContent, setIsEditingContent] = useState<boolean>(false);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);

  // VIP Content Form State
  const [title, setTitle] = useState<string>('');
  const [contentType, setContentType] = useState<VipContentType>('trick');
  const [description, setDescription] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  // Doctor & App Settings State
  const appSettings = dataService.getAppSettings();
  const [doctorName, setDoctorName] = useState<string>(appSettings.doctor_name);
  const [doctorSpecialty, setDoctorSpecialty] = useState<string>(appSettings.doctor_specialty);
  const [doctorBio, setDoctorBio] = useState<string>(appSettings.doctor_bio);
  const [doctorAvatarUrl, setDoctorAvatarUrl] = useState<string>(appSettings.doctor_avatar_url);
  const [doctorContactInfo, setDoctorContactInfo] = useState<string>(appSettings.doctor_contact_info);
  const [crisisPhone, setCrisisPhone] = useState<string>(appSettings.emergency_crisis_phone);

  const vipList = dataService.getVipContent();

  const handleOpenCreateContent = () => {
    setEditingContentId(null);
    setTitle('');
    setContentType('trick');
    setDescription('');
    setContent('');
    setImageUrl('https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80');
    setIsEditingContent(true);
  };

  const handleOpenEditContent = (item: VipContent) => {
    setEditingContentId(item.id);
    setTitle(item.title);
    setContentType(item.content_type);
    setDescription(item.description);
    setContent(item.content);
    setImageUrl(item.image_url);
    setIsEditingContent(true);
  };

  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast('error', 'Validation Error', 'Title is required');
      return;
    }

    const payload: Partial<VipContent> = {
      title,
      content_type: contentType,
      description,
      content,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      is_active: true
    };

    if (editingContentId) {
      dataService.updateVipContent(editingContentId, payload, adminEmail);
      onShowToast('success', 'VIP Content Updated', `"${title}" has been updated.`);
    } else {
      dataService.createVipContent(payload as Omit<VipContent, 'id' | 'created_at'>, adminEmail);
      onShowToast('success', 'VIP Content Published', `"${title}" is now live for VIP members.`);
    }

    setIsEditingContent(false);
  };

  const handleSaveDoctorSettings = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.updateAppSettings(
      {
        doctor_name: doctorName,
        doctor_specialty: doctorSpecialty,
        doctor_bio: doctorBio,
        doctor_avatar_url: doctorAvatarUrl,
        doctor_contact_info: doctorContactInfo,
        emergency_crisis_phone: crisisPhone
      },
      adminEmail
    );
    onShowToast('success', 'Settings Saved', 'Doctor profile and emergency hotline updated.');
  };

  return (
    <div id="admin-vip-tab" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">VIP Club & Clinical Guidance</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Curate exclusive VIP protocols, biohacks, tips, and maintain the Doctor profile
          </p>
        </div>

        <button
          onClick={handleOpenCreateContent}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add VIP Content</span>
        </button>
      </div>

      {/* Doctor & Clinic Configuration Form */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
          <Stethoscope className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            "Talk to Doctor" & Clinical Contact Configuration
          </h3>
        </div>

        <form onSubmit={handleSaveDoctorSettings} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Doctor Full Name</label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Clinical Specialty</label>
              <input
                type="text"
                value={doctorSpecialty}
                onChange={(e) => setDoctorSpecialty(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Doctor Bio & Credentials</label>
            <textarea
              rows={2}
              value={doctorBio}
              onChange={(e) => setDoctorBio(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Doctor Telegram Handle</label>
              <input
                type="text"
                value={doctorContactInfo}
                onChange={(e) => setDoctorContactInfo(e.target.value)}
                placeholder="@DrAster_Tena"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Emergency Crisis Hotline</label>
              <input
                type="text"
                value={crisisPhone}
                onChange={(e) => setCrisisPhone(e.target.value)}
                placeholder="8000"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Doctor Photo URL</label>
              <input
                type="url"
                value={doctorAvatarUrl}
                onChange={(e) => setDoctorAvatarUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Update Doctor & Clinic Info
            </button>
          </div>
        </form>
      </div>

      {/* VIP Content Items Grid */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Exclusive VIP Content Library ({vipList.length} items)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vipList.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-32 w-full bg-slate-100 dark:bg-slate-700">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-black uppercase">
                    {item.content_type.replace('_', ' ')}
                  </span>
                </div>
                <div className="p-4 space-y-1.5">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700/60 mt-2">
                <button
                  onClick={() => handleOpenEditContent(item)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VIP Content Modal Form */}
      {isEditingContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingContentId ? 'Edit VIP Content' : 'Add Exclusive VIP Content'}
              </h3>
              <button onClick={() => setIsEditingContent(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContent} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 7-Day Ketone Jumpstart Protocol"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Content Type</label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as VipContentType)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="trick">VIP Trick / Biohack</option>
                    <option value="book">VIP Book</option>
                    <option value="challenge">VIP Challenge</option>
                    <option value="tip">VIP Daily Tip</option>
                    <option value="doctor_talk">Doctor Q&A / Protocol</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Summary Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief preview shown on the VIP card..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Protocol & Instructions</label>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detailed guidelines, dosages, timing, and clinical rationale..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingContent(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {editingContentId ? 'Save VIP Protocol' : 'Publish to VIP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
