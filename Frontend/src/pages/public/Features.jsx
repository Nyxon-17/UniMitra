import { 
  AcademicCapIcon, 
  BrainIcon, 
  ShieldCheckIcon, 
  LanguageIcon, 
  BookOpenIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '../../components/common/Icons';

export const Features = ({ onNavigate, onOpenAuth, currentLang = 'en' }) => {
  const mainFeatures = [
    {
      icon: BookOpenIcon,
      title: 'Instant Syllabus Navigator',
      asTitle: 'তৎক্ষণাত পাঠ্যক্ৰম অনুসন্ধান',
      desc: 'Browse department-wise syllabuses, course credits, recommended textbooks, and lab practical lists without digging through broken PDF links.',
      color: '#118AB2',
      bgLight: '#E7F3F7',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Page-Verified Citations',
      asTitle: 'পোনপটীয়া পৃষ্ঠা প্ৰমাণীকৰণ',
      desc: 'Every answer references the exact official university document and page number. Zero fabricated or assumed guidelines.',
      color: '#06D6A0',
      bgLight: '#E6FBF5',
    },
    {
      icon: LanguageIcon,
      title: 'Bilingual Assamese & English',
      asTitle: 'অসমীয়া আৰু ইংৰাজী দুয়োটা ভাষাত',
      desc: 'Type your questions in traditional Assamese script or phonetic Romanized spelling. The assistant reads and responds accurately in both.',
      color: '#FF7F50',
      bgLight: '#FFF0EB',
    },
    {
      icon: AcademicCapIcon,
      title: 'Multi-University Segregation',
      asTitle: 'পৃথক বিশ্ববিদ্যালয় জ্ঞানভাণ্ডাৰ',
      desc: 'Gauhati University syllabus is strictly isolated from Dibrugarh University or Tezpur University, guaranteeing university-specific accuracy.',
      color: '#FFD166',
      bgLight: '#FFF9E6',
    },
    {
      icon: DocumentTextIcon,
      title: 'Official Question Paper Vault',
      asTitle: 'পূৰ্ববৰ্তী প্ৰশ্নকাকত আৰু নম্বৰ বিভাজন',
      desc: 'Inspect previous examination papers, module-wise weightage, and evaluation patterns across undergraduate and postgraduate degrees.',
      color: '#118AB2',
      bgLight: '#E7F3F7',
    },
    {
      icon: BrainIcon,
      title: 'Smart Examination Blueprint',
      asTitle: 'পৰীক্ষাৰ নিয়ম আৰু ফলাফল মূল্যায়ন',
      desc: 'Instant clarity on in-semester internal assessments, end-semester passing marks, back paper guidelines, and degree credit structures.',
      color: '#06D6A0',
      bgLight: '#E6FBF5',
    }
  ];

  const workflowSteps = [
    {
      num: '01',
      title: 'Choose Your University & Degree',
      asTitle: 'বিশ্ববিদ্যালয় আৰু পাঠ্যক্ৰম বাছক',
      desc: 'Select your university (GU, DU, TU, Cotton, etc.), department, and current semester.'
    },
    {
      num: '02',
      title: 'Ask in Assamese or English',
      asTitle: 'আপোনাৰ প্ৰশ্ন সোধক',
      desc: 'Ask about any module, subject passing marks, prescribed authors, or assignment topics.'
    },
    {
      num: '03',
      title: 'Receive Page-Cited Answers',
      asTitle: 'সঠিক পৃষ্ঠা নম্বৰসহ উত্তৰ লাভ কৰক',
      desc: 'Get an immediate, verified explanation along with the original university PDF page reference.'
    }
  ];

  return (
    <div className="bg-[#FAFAFC] dark:bg-[#0B1320] min-h-screen text-[#073B4C] dark:text-slate-100 py-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#073B4C] dark:text-white">
            {currentLang === 'as' 
              ? 'UniMitra-ৰ শৈক্ষিক সুবিধাসমূহ' 
              : 'Everything You Need for Exam & Study Success'}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentLang === 'as'
              ? 'অসমৰ বিশ্ববিদ্যালয়সমূহৰ অফিচিয়েল পাঠ্যক্ৰম, নিয়ম আৰু প্ৰশ্নকাকত সহজে বুজি পাবলৈ আধুনিক আৰু বিশ্বস্ত সঁজুলিসমূহ।'
              : 'Explore the specialized capabilities engineered to help university scholars across Assam learn faster and prepare confidently.'}
          </p>
        </div>

        {/* 6 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {mainFeatures.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i}
                className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-7 shadow-sm hover:shadow-elevated-card transition-all card-3d flex flex-col justify-between"
              >
                <div>
                  <div 
                    className="w-13 h-13 rounded-2xl flex items-center justify-center mb-6 shadow-xs border border-slate-200 dark:border-slate-700"
                    style={{ backgroundColor: feat.bgLight }}
                  >
                    <Icon className="w-7 h-7" style={{ color: feat.color }} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {currentLang === 'as' ? feat.asTitle : feat.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                  <span className="text-[#06D6A0] flex items-center space-x-1.5">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Official University Data</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3-Step Simple Workflow */}
        <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8 sm:p-12 mb-20 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-[#073B4C] dark:text-white">
              {currentLang === 'as' ? 'UniMitra ব্যৱহাৰ কৰাৰ তিনিটা সহজ স্তৰ' : 'Three Simple Steps to Instant Answers'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              No complicated setups. Search directly as a guest or sign in to save bookmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workflowSteps.map((step, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 relative space-y-3"
              >
                <span className="text-3xl font-black text-[#118AB2] dark:text-[#FFD166] block">
                  {step.num}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {currentLang === 'as' ? step.asTitle : step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Comparison Banner */}
        <div className="bg-gradient-to-r from-[#118AB2] to-[#073B4C] rounded-2xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black">Ready to explore your university syllabus?</h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              Create a free student profile to bookmark courses, save exam questions, and download verified syllabus PDFs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={onOpenAuth}
              className="px-7 py-3.5 rounded-xl font-bold text-slate-900 bg-[#FFD166] hover:bg-[#F2C353] transition-all cursor-pointer shadow-md text-sm text-center"
            >
              Sign In Free ➔
            </button>
            <button
              onClick={() => onNavigate && onNavigate('dashboard')}
              className="px-7 py-3.5 rounded-xl font-bold text-white bg-transparent border-2 border-white/50 hover:border-white transition-all cursor-pointer text-sm text-center"
            >
              Open Curriculums Hub
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

