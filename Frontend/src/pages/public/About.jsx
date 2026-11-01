import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, BuildingLibraryIcon, ShieldCheckIcon, LanguageIcon, UserGroupIcon } from '../../components/common/Icons';
import { universityService } from '../../services/universityService';

export const About = ({ onNavigate, onOpenAuth, currentLang = 'en', isLoggedIn = false }) => {
  const navigate = useNavigate();
  const [univProfile, setUnivProfile] = useState(() => universityService.getProfile());

  useEffect(() => {
    const handleUpdate = () => setUnivProfile(universityService.getProfile());
    window.addEventListener('unimitra_university_changed', handleUpdate);
    return () => window.removeEventListener('unimitra_university_changed', handleUpdate);
  }, []);

  const univName = univProfile?.name || 'My University';

  const platformFeatures = [
    {
      title: 'Institutional Natural Language Interface',
      capability: 'Fast, responsive bilingual interaction',
      desc: `Engineered so students, faculty, and administrative staff across ${univName} can query complex institutional rules effortlessly on mobile or desktop.`,
      badge: 'User First'
    },
    {
      title: 'Centralized Knowledge Base',
      capability: 'University document metadata',
      desc: `Maintains verified regulations, circulars, and notices for ${univName} in one unified repository.`,
      badge: 'Unified Access'
    },
    {
      title: 'Official Gazette & Circular Verification',
      capability: 'Direct PDF grounding & citations',
      desc: 'Extracts exact sections, clause numbers, and page references from authorized university publications to eliminate misinformation.',
      badge: 'Zero Guesswork'
    },
    {
      title: 'Native Assamese & English Understanding',
      capability: 'Multilingual semantic retrieval',
      desc: 'Seamlessly understands Assamese script, Romanized Assamese phonetic queries, and standard English academic phrasing.',
      badge: 'Bilingual AI'
    }
  ];

  const targetAudiences = [
    {
      role: 'Students & Scholars',
      focus: 'Instant answers to examination passing marks, re-evaluation dates, scholarship eligibility, admission requirements, and hostel facilities.',
      tag: 'Academic Clarity'
    },
    {
      role: 'Faculty Members',
      focus: 'Quick reference to academic council ordinances, evaluation rubrics, course credit guidelines, and departmental committee notifications.',
      tag: 'Teaching & Research'
    },
    {
      role: 'Administrative Staff',
      focus: 'Effortless lookup of state circulars, statutory regulations, fee structures, and document verification protocols.',
      tag: 'Governance Support'
    }
  ];

  const handlePortalAccess = () => {
    if (isLoggedIn) {
      if (onNavigate) onNavigate('dashboard');
      else navigate('/dashboard/overview');
    } else {
      if (onOpenAuth) onOpenAuth('login', 'student');
    }
  };

  return (
    <div className="bg-transparent relative z-10 min-h-screen text-[#000000] dark:text-[#FFFFFF] py-16 transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#000000] dark:text-[#FFFFFF]">
            {currentLang === 'as' 
              ? 'অসমৰ উচ্চ শিক্ষাৰ বাবে স্মাৰ্ট বিশ্ববিদ্যালয় সহায়ক' 
              : 'Smart Institutional Assistance for Higher Education in Assam'}
          </h1>

          <p className="text-sm sm:text-base text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
            {currentLang === 'as'
              ? 'UniMitra হৈছে এক বহুমুখী শৈক্ষিক আৰু প্ৰশাসনিক মঞ্চ, যাৰ লক্ষ্য অসমৰ বিশ্ববিদ্যালয়সমূহৰ নিয়ম, পৰীক্ষা, ভৰ্তি আৰু ছাত্ৰবৃত্তিৰ তথ্য ছাত্ৰ-ছাত্ৰী আৰু শিক্ষকসকলৰ বাবে সহজলভ্য কৰি তোলা।'
              : 'UniMitra eliminates confusion surrounding university regulations, exam ordinances, and admissions across Assam by providing grounded, cited answers in both Assamese and English.'}
          </p>
        </div>

        {/* The Institutional Challenge & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          
          <div className="neo-surface rounded-3xl p-8 shadow-sm">
            <h2 className="text-lg sm:text-xl font-black text-[#000000] dark:text-[#FFFFFF] mb-3">
              The Institutional Information Challenge
            </h2>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
              University students, teachers, and staff at {univName} often struggle to locate updated examination ordinances, re-evaluation timelines, hostel allotment guidelines, and scholarship circulars. Generic search engines regularly serve outdated notices or fabricate answers.
            </p>
          </div>

          <div className="bg-white dark:bg-[#141414] border-2 border-[#FF933E]/50 dark:border-[#03C988]/50 rounded-3xl p-8 shadow-elevated-sage dark:shadow-elevated-gold">
            <div className="flex items-center space-x-2 text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF] mb-3">
              <CheckCircleIcon className="w-6 h-6 text-[#10B981]" />
              <h2 className="text-lg sm:text-xl font-black text-[#000000] dark:text-[#FFFFFF]">
                The UniMitra Solution
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
              UniMitra applies verified AI answers strictly grounded in official university documents. When you ask in Assamese or English, it references the exact gazette, section, and page number — ensuring authentic, trustworthy institutional guidance.
            </p>
          </div>

        </div>

        {/* Audiences Supported */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF]">
              Serving the Entire Academic Community
            </h2>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-2">
              Tailored assistance across all university stakeholders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {targetAudiences.map((aud, i) => (
              <div key={i} className="neo-surface rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300">
                <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
                  {aud.tag}
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#FFFFFF] mt-3 mb-2">
                  {aud.role}
                </h3>
                <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
                  {aud.focus}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {platformFeatures.map((f, idx) => (
            <div key={idx} className="neo-surface rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300">
              <span className="text-[10px] font-black text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF] uppercase tracking-wider">
                {f.badge}
              </span>
              <h4 className="text-base font-black text-[#000000] dark:text-[#FFFFFF] mt-2 mb-1">
                {f.title}
              </h4>
              <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Portal Entry */}
        <div className="text-center">
          <button
            onClick={handlePortalAccess}
            className="px-8 py-3.5 rounded-2xl font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-elevated-sage text-sm"
          >
            Access University Portal ➔
          </button>
        </div>

      </div>
    </div>
  );
};
