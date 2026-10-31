import { CheckCircleIcon, BuildingLibraryIcon, ShieldCheckIcon, LanguageIcon, UserGroupIcon } from '../../components/common/Icons';

export const About = ({ onNavigate, onOpenAuth, currentLang = 'en', isLoggedIn = false }) => {
  const platformFeatures = [
    {
      title: 'Institutional Natural Language Interface',
      capability: 'Fast, responsive bilingual interaction',
      desc: 'Engineered so students, faculty, and administrative staff across Assam can query complex institutional rules effortlessly on mobile or desktop.',
      badge: 'User First'
    },
    {
      title: 'Centralized Knowledge Base',
      capability: 'Multi-university document metadata',
      desc: 'Maintains verified regulations, circulars, and notices from all Assam universities in one unified repository with zero forced university selection.',
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
      focus: 'Effortless lookup of state government circulars, statutory regulations, fee structures, and document verification protocols.',
      tag: 'Governance Support'
    }
  ];

  const handlePortalAccess = () => {
    if (isLoggedIn) {
      if (onNavigate) onNavigate('dashboard');
    } else {
      if (onOpenAuth) onOpenAuth('login');
    }
  };

  return (
    <div className="bg-transparent relative z-10 min-h-screen text-[#0F172A] dark:text-[#FAF8FF] py-16 transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0F172A] dark:text-[#FAF8FF]">
            {currentLang === 'as' 
              ? 'অসমৰ উচ্চ শিক্ষাৰ বাবে স্মাৰ্ট বিশ্ববিদ্যালয় সহায়ক' 
              : 'Smart Institutional Assistance for Higher Education in Assam'}
          </h1>

          <p className="text-sm sm:text-base text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
            {currentLang === 'as'
              ? 'UniMitra হৈছে এক বহুমুখী শৈক্ষিক আৰু প্ৰশাসনিক মঞ্চ, যাৰ লক্ষ্য অসমৰ বিশ্ববিদ্যালয়সমূহৰ নিয়ম, পৰীক্ষা, ভৰ্তি আৰু ছাত্ৰবৃত্তিৰ তথ্য ছাত্ৰ-ছাত্ৰী আৰু শিক্ষকসকলৰ বাবে সহজলভ্য কৰি তোলা।'
              : 'UniMitra eliminates confusion surrounding university regulations, exam ordinances, and admissions across Assam by providing grounded, cited answers in both Assamese and English.'}
          </p>
        </div>

        {/* The Institutional Challenge & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          
          <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-8 shadow-sm">
            <h2 className="text-lg sm:text-xl font-black text-[#0F172A] dark:text-[#FAF8FF] mb-3">
              The Institutional Information Challenge
            </h2>
            <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
              University students, teachers, and staff across Gauhati University, Dibrugarh University, Tezpur University, and regional colleges often struggle to locate updated examination ordinances, re-evaluation timelines, hostel allotment guidelines, and scholarship circulars. Generic search engines regularly serve outdated notices or fabricate answers.
            </p>
          </div>

          <div className="bg-white dark:bg-[#150F2C] border-2 border-[#6D28D9] rounded-3xl p-8 shadow-elevated-sage dark:shadow-elevated-gold">
            <div className="flex items-center space-x-2 text-[#6D28D9] dark:text-[#FAF8FF] mb-3">
              <CheckCircleIcon className="w-6 h-6 text-[#10B981]" />
              <h2 className="text-lg sm:text-xl font-black text-[#0F172A] dark:text-[#FAF8FF]">
                The UniMitra Solution
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
              UniMitra applies Retrieval-Augmented Generation (RAG) strictly grounded in official university documents. When you ask in Assamese or English, it references the exact gazette, section, and page number — ensuring authentic, trustworthy institutional guidance.
            </p>
          </div>

        </div>

        {/* Audiences Supported */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#FAF8FF]">
              Serving the Entire Academic Community
            </h2>
            <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] mt-2">
              Tailored assistance across all university stakeholders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {targetAudiences.map((aud, i) => (
              <div key={i} className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 shadow-sm hover:border-[#6D28D9] transition-all card-3d">
                <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-[#DDD6FE] dark:bg-[#0A0718] text-[#0F172A] dark:text-[#FAF8FF] border border-[#E0D4FD] dark:border-[#3B2868]">
                  {aud.tag}
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-[#FAF8FF] mt-3 mb-2">
                  {aud.role}
                </h3>
                <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
                  {aud.focus}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {platformFeatures.map((f, idx) => (
            <div key={idx} className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 shadow-sm card-3d">
              <span className="text-[10px] font-black text-[#6D28D9] dark:text-[#FAF8FF] uppercase tracking-wider">
                {f.badge}
              </span>
              <h4 className="text-base font-black text-[#0F172A] dark:text-[#FAF8FF] mt-2 mb-1">
                {f.title}
              </h4>
              <p className="text-xs text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Portal Entry */}
        <div className="text-center">
          <button
            onClick={handlePortalAccess}
            className="px-8 py-3.5 rounded-2xl font-black text-white bg-[#4C1D95] hover:bg-[#8F00FF] transition-all cursor-pointer shadow-elevated-sage text-sm"
          >
            Access University Portal ➔
          </button>
        </div>

      </div>
    </div>
  );
};
