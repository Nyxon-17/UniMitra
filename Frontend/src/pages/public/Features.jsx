import { 
  BuildingLibraryIcon, 
  BrainIcon, 
  ShieldCheckIcon, 
  LanguageIcon, 
  DocumentTextIcon, 
  ClipboardDocumentCheckIcon, 
  BanknotesIcon, 
  BuildingOfficeIcon, 
  IdentificationIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  UserGroupIcon,
  ClockIcon
} from '../../components/common/Icons';

export const Features = ({ onNavigate, onOpenAuth, currentLang = 'en', isLoggedIn = false }) => {
  const mainFeatures = [
    {
      icon: LanguageIcon,
      title: 'Interactive Bilingual Chatbot',
      asTitle: 'দ্বিভাষিক ইন্টাৰেক্টিভ AI চেটবট',
      desc: 'Ask complex institutional and academic questions in Assamese script, Romanized Assamese, or English. Understands regional academic terminology seamlessly.',
      badge: 'Assamese + English',
    },
    {
      icon: BuildingLibraryIcon,
      title: 'University Regulations & Ordinances',
      asTitle: 'বিশ্ববিদ্যালয় নিয়মাৱলী আৰু অধিসূচনা',
      desc: 'Instant clarity on academic council policies, university statutes, codes of conduct, attendance clauses, and official gazettes.',
      badge: 'Institutional Governance',
    },
    {
      icon: ClipboardDocumentCheckIcon,
      title: 'Examinations & Evaluation Rules',
      asTitle: 'পৰীক্ষাৰ নিয়ম আৰু ফলাফল মূল্যায়ন',
      desc: 'Verified answers on end-semester examinations, in-semester sessionals, passing criteria, grade point calculations, and re-evaluation policies.',
      badge: 'Academic Verification',
    },
    {
      icon: IdentificationIcon,
      title: 'Academic Programs & Degrees',
      asTitle: 'শৈক্ষিক পাঠ্যক্ৰম আৰু ডিগ্ৰী',
      desc: 'Explore undergraduate, postgraduate, diploma, and doctoral program structures, eligibility criteria, and academic credit weightage.',
      badge: 'Programs & Eligibility',
    },
    {
      icon: BanknotesIcon,
      title: 'Scholarships & Financial Grants',
      asTitle: 'ছাত্ৰবৃত্তি আৰু আৰ্থিক অনুদান',
      desc: 'Centralized information on Assam Directorate of Higher Education scholarships, Ishan Uday, merit awards, eligibility calculators, and deadlines.',
      badge: 'Student Support',
    },
    {
      icon: DocumentTextIcon,
      title: 'Admission Procedures & Cut-Offs',
      asTitle: 'ভৰ্তি প্ৰক্ৰিয়া আৰু অধিসূচনা',
      desc: 'Step-by-step guidance on admission forms, entrance exams, reservation quotas, fee breakdowns, and required document checklists.',
      badge: 'Admission Desk',
    },
    {
      icon: BuildingOfficeIcon,
      title: 'Campus Facilities & Services',
      asTitle: 'চৌহদৰ সুবিধা আৰু ছাত্ৰ কল্যাণ',
      desc: 'Clear guidance on hostel allotment rules, central libraries, health centers, student grievance redressal, and laboratory protocols.',
      badge: 'Campus Living',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Grounded Answers with Page Citations',
      asTitle: 'পোনপটীয়া পৃষ্ঠা প্ৰমাণীকৰণ',
      desc: 'Every AI-generated response cites the official university circular, document title, and page number with zero guessing or fake citations.',
      badge: 'Zero Hallucinations',
    },
    {
      icon: UserGroupIcon,
      title: 'Multi-Role Institutional Access',
      asTitle: 'সকলো শৈক্ষিক সদস্যৰ বাবে উপযোগী',
      desc: 'Tailored interfaces and relevant query resolution for students, faculty members, and administrative staff across institutions.',
      badge: 'Students, Faculty & Staff',
    }
  ];

  const workflowSteps = [
    {
      num: '01',
      title: 'Sign In to University Portal',
      asTitle: 'প’ৰ্টেলত প্ৰৱেশ কৰক',
      desc: 'Access the centralized university portal with your student, faculty, or staff profile.'
    },
    {
      num: '02',
      title: 'Ask in Assamese or English',
      asTitle: 'আপোনাৰ প্ৰশ্ন সোধক',
      desc: 'Query any regulation, exam ordinance, admission criterion, scholarship, or facility in natural language.'
    },
    {
      num: '03',
      title: 'Receive Grounded Institutional Answers',
      asTitle: 'সঠিক পৃষ্ঠা নম্বৰসহ উত্তৰ লাভ কৰক',
      desc: 'Get immediate, verified explanations cited directly from official university circulars and gazettes.'
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
    <div className="bg-transparent relative z-10 min-h-screen text-[#000000] dark:text-[#FFFFFF] py-16 transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#000000] dark:text-[#FFFFFF]">
            {currentLang === 'as' 
              ? 'UniMitra-ৰ শৈক্ষিক আৰু প্ৰশাসনিক সেৱাসমূহ' 
              : 'Institutional Assistance Built for University Life'}
          </h1>
          <p className="text-sm sm:text-base text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
            {currentLang === 'as'
              ? 'অসমৰ বিশ্ববিদ্যালয়সমূহৰ অফিচিয়েল নিয়মাৱলী, পৰীক্ষাৰ নিয়ম, ভৰ্তি আৰু ছাত্ৰবৃত্তি সহজে বুজি পাবলৈ আধুনিক আৰু বিশ্বস্ত সঁজুলিসমূহ।'
              : 'Explore the full spectrum of capabilities engineered to help students, faculty members, and administrative staff navigate higher education with complete clarity.'}
          </p>
        </div>

        {/* 9 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {mainFeatures.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={index}
                className="neo-surface rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFE9A9]/40 dark:bg-[#0A0A0A] border border-[#FF933E]/50 dark:border-[#03C988]/50/40 flex items-center justify-center text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#FFFFFF] mb-2">
                    {currentLang === 'as' ? feat.asTitle : feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#73A5CA]/40/50 dark:border-[#1C82AD]/40 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF]">Verified Grounded Access</span>
                  <span className="text-[#FF933E] dark:text-[#03C988]">➔</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3-Step Workflow Section */}
        <div className="neo-surface rounded-3xl p-8 sm:p-12 mb-20 shadow-elevated-sage dark:shadow-elevated-gold">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF]">
              {currentLang === 'as' ? 'কাৰ্যপ্ৰণালী – তিনিটা সহজ পদক্ষেপ' : 'How Students & Staff Use UniMitra'}
            </h2>
            <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 mt-2">
              Fast, transparent, and accurate assistance in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workflowSteps.map((s) => (
              <div key={s.num} className="relative bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] p-6 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 space-y-3">
                <span className="text-3xl font-black text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF]">
                  {s.num}
                </span>
                <h4 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
                  {currentLang === 'as' ? s.asTitle : s.title}
                </h4>
                <p className="text-xs text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Callout */}
        <div className="text-center">
          <button
            onClick={handlePortalAccess}
            className="px-8 py-3.5 rounded-2xl font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-elevated-sage text-sm"
          >
            Enter University Assistance Portal ➔
          </button>
        </div>

      </div>
    </div>
  );
};
