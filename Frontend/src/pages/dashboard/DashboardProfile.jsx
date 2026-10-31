import { useState } from 'react';
import { 
  UserIcon, 
  AcademicCapIcon, 
  EnvelopeIcon, 
  CheckCircleIcon, 
  ShieldCheckIcon,
  LanguageIcon,
  BellIcon,
  LockClosedIcon
} from '../../components/common/Icons';

export const DashboardProfile = ({ 
  currentLang = 'en',
  studentInfo = { 
    name: 'Student Scholar', 
    email: 'scholar@unimitra.edu',
    course: 'Computer Science & Higher Education',
    semester: 'Semester 3'
  },
  onUpdateStudentInfo
}) => {
  const [formData, setFormData] = useState({
    name: studentInfo.name || 'Student Scholar',
    email: studentInfo.email || 'scholar@unimitra.edu',
    course: studentInfo.course || 'Computer Science & Higher Education',
    semester: studentInfo.semester || 'Semester 3',
    phone: '+91 98640 12345',
    preferredLang: currentLang === 'as' ? 'as' : 'en',
    notifyExam: true,
    notifySyllabus: true,
    notifyResults: false
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdateStudentInfo) {
      onUpdateStudentInfo({
        name: formData.name,
        email: formData.email,
        course: formData.course,
        semester: formData.semester
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* 3D Profile Header Card */}
      <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-elevated-cerulean card-3d">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* 3D Avatar */}
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#118AB2] via-[#06D6A0] to-[#FFD166] p-1 shadow-lg shrink-0">
            <div className="w-full h-full bg-white dark:bg-[#111C2E] rounded-[22px] flex items-center justify-center">
              <span className="text-3xl font-black text-[#118AB2] dark:text-[#FFD166]">
                {formData.name.charAt(0)}
              </span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                <CheckCircleIcon className="w-3.5 h-3.5" />
                <span>UniMitra Academic Scholar</span>
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#118AB2]/10 text-[#118AB2] dark:text-sky-300">
                {formData.semester}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#073B4C] dark:text-white">
              {formData.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {formData.course} • <span className="font-bold text-[#118AB2] dark:text-[#FFD166]">Universal Curriculum Access</span>
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center space-x-2">
          <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
          <span>{currentLang === 'as' ? 'প্ৰফাইল তথ্য সফলতাৰে সংৰক্ষণ কৰা হ’ল!' : 'Student profile details successfully updated!'}</span>
        </div>
      )}

      {/* Editable Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Personal & Academic Details Section */}
        <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm card-3d space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#E7F3F7] dark:bg-slate-800 text-[#118AB2] flex items-center justify-center">
              <AcademicCapIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {currentLang === 'as' ? 'শৈক্ষিক তথ্য' : 'Academic Credentials'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentLang === 'as' ? 'আপোনাৰ শৈক্ষিক তথ্যসমূহ পৰীক্ষা কৰক।' : 'Your student profile and degree mapping.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {currentLang === 'as' ? 'সম্পূৰ্ণ নাম' : 'Full Name'}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs sm:text-sm font-medium outline-none focus:border-[#118AB2]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {currentLang === 'as' ? 'ইমেইল ঠিকনা' : 'Email Address'}
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs sm:text-sm font-medium cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Verified via OTP during account creation</span>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {currentLang === 'as' ? 'ডিগ্ৰী আৰু পাঠ্যক্ৰম' : 'Degree & Major Course'}
              </label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs sm:text-sm font-medium outline-none focus:border-[#118AB2]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {currentLang === 'as' ? 'বৰ্তমান ষাণ্মাসিক' : 'Current Semester'}
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs sm:text-sm font-medium outline-none focus:border-[#118AB2]"
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {currentLang === 'as' ? 'মোবাইল নম্বৰ' : 'Mobile Number'}
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs sm:text-sm font-medium outline-none focus:border-[#118AB2]"
              />
            </div>
          </div>
        </div>

        {/* Preferences & Notifications */}
        <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm card-3d space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <BellIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {currentLang === 'as' ? 'অধ্যয়ন আৰু জাননী অগ্ৰাধিকাৰ' : 'Study & Notification Preferences'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentLang === 'as' ? 'আপোনাৰ পছন্দ অনুসৰি AI ভাষা আৰু জাননী বাছক।' : 'Configure default AI interaction language and exam notifications.'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentLang === 'as' ? 'পৰীক্ষাৰ জাননী আৰু সময়সূচী' : 'Exam Schedule & Blueprint Alerts'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Receive notifications when revised date sheets or blueprints are published.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.notifyExam}
                onChange={(e) => setFormData({ ...formData, notifyExam: e.target.checked })}
                className="w-5 h-5 accent-[#118AB2] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentLang === 'as' ? 'পাঠ্যক্ৰম সংযোজন জাননী' : 'New Syllabus & Document Ingestion'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Notify when a new university textbook or question bank is added.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.notifySyllabus}
                onChange={(e) => setFormData({ ...formData, notifySyllabus: e.target.checked })}
                className="w-5 h-5 accent-[#118AB2] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Security & Password Card */}
        <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm card-3d space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Account Security & Password
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Protected with end-to-end encrypted sessions and OTP verification.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
              Password last changed 15 days ago
            </span>
            <button
              type="button"
              onClick={() => alert("Password reset link will be sent to your verified email.")}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#118AB2] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl font-black text-white bg-[#118AB2] hover:bg-[#0E7292] transition-all cursor-pointer shadow-elevated-cerulean text-sm"
          >
            {currentLang === 'as' ? 'প্ৰফাইল সংৰক্ষণ কৰক' : 'Save Changes'}
          </button>
        </div>

      </form>

    </div>
  );
};

