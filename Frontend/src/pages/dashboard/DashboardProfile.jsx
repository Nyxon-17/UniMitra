import { useState } from 'react';
import { 
  UserIcon, 
  BuildingLibraryIcon, 
  EnvelopeIcon, 
  CheckCircleIcon, 
  ShieldCheckIcon,
  LanguageIcon,
  BellIcon,
  UserGroupIcon
} from '../../components/common/Icons';

export const DashboardProfile = ({ 
  currentLang = 'en',
  studentInfo = { 
    name: 'Academic Member', 
    email: 'member@university.ac.in',
    role: 'Student',
    department: 'Higher Education Studies'
  },
  onUpdateStudentInfo
}) => {
  const [formData, setFormData] = useState({
    name: studentInfo.name || 'Academic Member',
    email: studentInfo.email || 'member@university.ac.in',
    role: studentInfo.role || 'Student',
    department: studentInfo.department || 'Higher Education Studies',
    memberId: studentInfo.memberId || '',
    designation: studentInfo.designation || '',
    facultyId: studentInfo.facultyId || '',
    phone: '+91 98640 12345',
    preferredLang: currentLang === 'as' ? 'as' : 'en',
    notifyRegulations: true,
    notifyExams: true,
    notifyScholarships: true,
    notifyAdmissions: false
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdateStudentInfo) {
      onUpdateStudentInfo({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* 3D Profile Header Card */}
      <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md dark:shadow-[0_0_15px_rgba(176,38,255,0.25)] card-3d">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* 3D Avatar */}
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#6D28D9] to-[#E0D4FD] p-1 shadow-lg shrink-0">
            <div className="w-full h-full bg-[#FFE9A9]/20 dark:bg-[#13005A] rounded-[22px] flex items-center justify-center">
              <span className="text-3xl font-black text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF]">
                {formData.name.charAt(0)}
              </span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-black bg-[#E0D4FD]/40 text-[#000000] dark:bg-[#13005A] dark:text-[#FFFFFF] border border-[#6D28D9]/40 flex items-center space-x-1">
                <CheckCircleIcon className="w-3.5 h-3.5 text-[#FF933E] dark:text-[#03C988]" />
                <span>Verified Institutional User</span>
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-black bg-[#FFE9A9] dark:bg-[#3B2868] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
                Role: {formData.role}
              </span>
              {formData.memberId && (
                <span className="px-3 py-1 rounded-xl text-xs font-black bg-white dark:bg-[#13005A] text-[#000000] dark:text-[#FFFFFF] border border-[#6D28D9] font-mono">
                  Member ID: {formData.memberId}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF]">
              {formData.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80">
              {formData.designation ? `${formData.designation} • ` : ''}{formData.department} • <span className="font-bold text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF]">Universal Multi-University Access</span>
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#E0D4FD]/40 border-2 border-[#6D28D9] text-[#000000] dark:text-[#FFFFFF] text-xs sm:text-sm font-black flex items-center space-x-2">
          <CheckCircleIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988]" />
          <span>{currentLang === 'as' ? 'প্ৰফাইল তথ্য সফলতাৰে সংৰক্ষণ কৰা হ’ল!' : 'Institutional profile details successfully updated!'}</span>
        </div>
      )}

      {/* Editable Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Personal & Institutional Details Section */}
        <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#FFFFFF] border-b border-[#73A5CA]/40/50 dark:border-[#1C82AD]/40 pb-3 flex items-center space-x-2">
            <UserGroupIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988]" />
            <span>Institutional Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs sm:text-sm font-bold text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#6D28D9]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                Institutional Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs sm:text-sm font-bold text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#6D28D9]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                Institutional Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs sm:text-sm font-bold text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#6D28D9]"
              >
                <option>Student</option>
                <option>Research Scholar</option>
                <option>Faculty Member</option>
                <option>Administrative Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                Department / Discipline Focus
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#13005A] text-xs sm:text-sm font-bold text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#6D28D9]"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Language Preferences */}
        <div className="bg-white dark:bg-[#00337C] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#FFFFFF] border-b border-[#73A5CA]/40/50 dark:border-[#1C82AD]/40 pb-3 flex items-center space-x-2">
            <BellIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988]" />
            <span>Institutional Circular Alerts</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifyRegulations}
                onChange={(e) => setFormData({ ...formData, notifyRegulations: e.target.checked })}
                className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] rounded border-[#73A5CA]/40"
              />
              <span className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                Notify me when new university regulations or academic council ordinances are gazetted
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifyExams}
                onChange={(e) => setFormData({ ...formData, notifyExams: e.target.checked })}
                className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] rounded border-[#73A5CA]/40"
              />
              <span className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                Alert me for examination evaluation deadlines and re-evaluation circulars
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifyScholarships}
                onChange={(e) => setFormData({ ...formData, notifyScholarships: e.target.checked })}
                className="w-4 h-4 text-[#FF933E] dark:text-[#03C988] rounded border-[#73A5CA]/40"
              />
              <span className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                Alert me for state and central scholarship scheme application deadlines
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-xs hover:shadow-md text-xs sm:text-sm"
          >
            Save Profile Updates
          </button>
        </div>

      </form>

    </div>
  );
};
