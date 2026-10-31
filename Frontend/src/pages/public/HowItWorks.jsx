import { 
  DocumentTextIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  LanguageIcon, 
  BrainIcon, 
  ShieldCheckIcon,
  ArrowRightIcon,
  AcademicCapIcon
} from '../../components/common/Icons';

export const HowItWorks = ({ onNavigate, onOpenAuth, currentLang = 'en' }) => {
  const steps = [
    {
      step: '01',
      title: 'Official Document Ingestion',
      asTitle: 'অফিচিয়েল নথিপত্ৰ সংগ্ৰহ আৰু প্ৰস্তুতি',
      color: 'from-[#118AB2] to-[#0E7292]',
      borderColor: 'border-[#118AB2]/30',
      tagColor: 'bg-[#118AB2]/10 text-[#118AB2]',
      icon: DocumentTextIcon,
      desc: 'Authorized university syllabus PDFs, semester exam blueprints, and course guidelines from across Assam are collected and parsed with high-accuracy text extractors and OCR for scanned documents.',
      asDesc: 'গুৱাহাটী, ডিব্ৰুগড়, তেজপুৰকে ধৰি অসমৰ সকলো বিশ্ববিদ্যালয়ৰ অফিচিয়েল পাঠ্যক্ৰম, নিয়ম আৰু ব্লুপ্ৰিণ্ট সংগ্ৰহ কৰি উন্নত প্ৰযুক্তিয়ে পৰীক্ষা কৰে।',
      features: [
        'Centralized knowledge base',
        'Preserved page numbers & metadata',
        'Automated update detection'
      ],
      asFeatures: [
        'কেন্দ্ৰীয় তথ্যভঁৰাল',
        'পৃষ্ঠা নম্বৰ আৰু মেটাডাটা সংৰক্ষণ',
        'স্বয়ংক্ৰিয় নবীকৰণ পৰীক্ষা'
      ]
    },
    {
      step: '02',
      title: 'Bilingual Semantic Indexing',
      asTitle: 'দ্বিভাষিক অৰ্থপূৰ্ণ ইনডেক্সিং',
      color: 'from-[#06D6A0] to-[#04A77D]',
      borderColor: 'border-[#06D6A0]/30',
      tagColor: 'bg-[#06D6A0]/10 text-[#06D6A0]',
      icon: BrainIcon,
      desc: 'Text chunks are converted into multilingual semantic vectors using advanced Multilingual E5 models that accurately capture Assamese vocabulary, idioms, and university academic terminology.',
      asDesc: 'অসমীয়া আৰু ইংৰাজী দুয়োটা ভাষাৰ শৈক্ষিক শব্দাৱলী স্পষ্টকৈ বুজিব পৰাকৈ আধুনিক দ্বিভাষিক মডেলৰ জৰিয়তে তথ্যসমূহ সংৰক্ষিত কৰা হয়।',
      features: [
        'Native Assamese & English embeddings',
        'Centralized vector database indexing',
        'Context-aware paragraph chunking'
      ],
      asFeatures: [
        'অসমীয়া আৰু ইংৰাজীৰ গভীৰ বোধগম্যতা',
        'দ্ৰুত ভেক্টৰ সন্ধান ব্যৱস্থা',
        'বিষয়বস্তুভিত্তিক অনুচ্ছেদ বিভাজন'
      ]
    },
    {
      step: '03',
      title: 'Student Academic Query',
      asTitle: 'ছাত্ৰ-ছাত্ৰীৰ প্ৰশ্ন সোধা ব্যৱস্থা',
      color: 'from-[#FFD166] to-[#E5BC5C]',
      borderColor: 'border-[#FFD166]/40',
      tagColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
      icon: LanguageIcon,
      desc: 'Students can type questions in standard Assamese script, phonetic Romanized Assamese, or English. The query searches across all university curriculums with zero university restriction barriers.',
      asDesc: 'ছাত্ৰ-ছাত্ৰীয়ে মূল অসমীয়া লিপি বা ইংৰাজী আখৰেৰে টাইপ কৰি যিকোনো বিশ্ববিদ্যালয়ৰ পাঠ্যক্ৰমৰ প্ৰশ্ন কোনো বাধা নোহোৱাকৈ সুধিব পাৰে।',
      features: [
        'Assamese script & Romanized typing',
        'Multi-university cross-curriculum search',
        'Zero mandatory login required'
      ],
      asFeatures: [
        'অসমীয়া লিপি আৰু ৰোমানাইজড সমৰ্থন',
        'সকলো বিশ্ববিদ্যালয়ৰ পাঠ্যক্ৰম সন্ধান',
        'বিনামূলীয়া প্ৰৱেশাধিকাৰ'
      ]
    },
    {
      step: '04',
      title: 'Grounded Answer with Page Citations',
      asTitle: 'পৃষ্ঠা নম্বৰসহ সঠিক উত্তৰ লাভ',
      color: 'from-[#FF7F50] to-[#E86B3D]',
      borderColor: 'border-[#FF7F50]/30',
      tagColor: 'bg-[#FF7F50]/10 text-[#FF7F50]',
      icon: ShieldCheckIcon,
      desc: 'The assistant retrieves exact clauses from verified documents and presents the answer with the official document title, unit number, and page citation. Zero hallucinations.',
      asDesc: 'সহায়কে প্ৰকৃত নথিপত্ৰৰ পৰা তথ্য সংগ্ৰহ কৰি নথিৰ নাম আৰু নিৰ্দিষ্ট পৃষ্ঠা নম্বৰসহ বিশ্বাসযোগ্য উত্তৰ প্ৰদান কৰে। কোনো মনগঢ়া তথ্য দিয়া নহয়।',
      features: [
        'Exact PDF page citations',
        'Clear notice if information is missing',
        'One-click official document preview'
      ],
      asFeatures: [
        'সঠিক PDF পৃষ্ঠা নম্বৰ উল্লেখ',
        'তথ্য নথকাৰ স্পষ্ট সতৰ্কবাৰ্তা',
        'মূল নথিপত্ৰ পৰিদৰ্শনৰ সুবিধা'
      ]
    }
  ];

  return (
    <div className="bg-[#FAFAFC] dark:bg-[#0B1320] min-h-screen text-[#073B4C] dark:text-slate-100 transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200 dark:border-slate-800 bg-grid-pattern">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#118AB2]/10 via-[#06D6A0]/10 to-[#FF7F50]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 shadow-sm">
            <SparklesIcon className="w-4 h-4 text-[#FF7F50]" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
              {currentLang === 'as' ? 'বিজ্ঞানসন্মত আৰু তথ্যভিত্তিক প্ৰণালী' : 'Centralized Academic Architecture'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-[#073B4C] dark:text-white max-w-4xl mx-auto">
            {currentLang === 'as' ? (
              <>
                অফিচিয়েল নথিৰ পৰা সঠিক উত্তৰলৈ: <span className="text-[#118AB2] dark:text-[#06D6A0]">UniMitra কিদৰে কাম কৰে</span>
              </>
            ) : (
              <>
                From Official Syllabus to Verified Answer: <span className="text-[#118AB2] dark:text-[#06D6A0]">How UniMitra Works</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {currentLang === 'as'
              ? 'অসমৰ বিশ্ববিদ্যালয়সমূহৰ অফিচিয়েল পাঠ্যক্ৰম, নিয়ম আৰু প্ৰশ্নকাকতক কেনেদৰে দ্বিভাষিকভাৱে প্ৰক্ৰিয়াকৰণ কৰি পৃষ্ঠা নম্বৰসহ সঠিক উত্তৰ যোগান ধৰা হয় চাওক।'
              : 'Discover how UniMitra ingests authorized university documents, extracts semantic knowledge in Assamese and English, and generates verifiable answers with exact page citations.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate && onNavigate('dashboard')}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl font-black text-white bg-[#118AB2] hover:bg-[#0E7292] transition-all cursor-pointer shadow-elevated-cerulean text-sm"
            >
              <span>{currentLang === 'as' ? 'পাঠ্যক্ৰম অন্বেষণ কৰক' : 'Explore Curriculums Live'}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate && onNavigate('faq')}
              className="px-6 py-3.5 rounded-2xl font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer text-sm"
            >
              {currentLang === 'as' ? 'সঘনাই সোধা প্ৰশ্ন (FAQ)' : 'Read FAQ'}
            </button>
          </div>
        </div>
      </section>

      {/* 4-Step Interactive Architecture Cards */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black tracking-wider uppercase text-[#118AB2] dark:text-[#FFD166]">
              {currentLang === 'as' ? 'চাৰিটা মূল পদক্ষেপ' : 'Four Core Processing Stages'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#073B4C] dark:text-white">
              {currentLang === 'as' ? 'বিশ্বস্ত তথ্যৰ নিশ্চয়তা' : 'Engineered for Zero Hallucination'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {currentLang === 'as' 
                ? 'প্ৰতিটো পদক্ষেপ বিশ্ববিদ্যালয়ৰ অফিচিয়েল নথিপত্ৰৰ প্ৰতি সততা ৰক্ষা কৰি নিৰ্মাণ কৰা হৈছে।'
                : 'Every phase is designed to preserve source provenance and maintain strict academic integrity.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <div 
                  key={st.step}
                  className={`bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm card-3d flex flex-col justify-between space-y-6 hover:${st.borderColor} transition-all`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#118AB2] to-[#06D6A0] text-white flex items-center justify-center font-black text-sm shadow-md">
                        <Icon className="w-6 h-6 text-[#FFD166]" />
                      </div>
                      <span className="text-2xl sm:text-3xl font-black font-mono text-slate-300 dark:text-slate-700">
                        {st.step}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                        {currentLang === 'as' ? st.asTitle : st.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {currentLang === 'as' ? st.asDesc : st.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    {(currentLang === 'as' ? st.asFeatures : st.features).map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <CheckCircleIcon className="w-4 h-4 text-[#06D6A0] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Comparison Section: Generic AI vs UniMitra */}
      <section className="py-16 bg-white dark:bg-[#0E1726] border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black tracking-wider uppercase text-[#FF7F50]">
              {currentLang === 'as' ? 'প্ৰাৰ্থক্য আৰু বিশিষ্টতা' : 'Why UniMitra is Different'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#073B4C] dark:text-white">
              {currentLang === 'as' ? 'সাধাৰণ AI আৰু UniMitra ৰ তুলনা' : 'Generic AI Chatbots vs UniMitra'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Generic AI Card */}
            <div className="p-6 sm:p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111C2E]/50 space-y-4">
              <h4 className="text-base font-black text-rose-600 dark:text-rose-400">
                ✕ Generic Internet AI Models
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span>Hallucinates exam pass marks and fake syllabus units.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span>Provides no verified PDF document citations or page numbers.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span>Weak understanding of local Assam university regulations and regional scripts.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span>Cannot verify if a course module is from the latest academic syllabus revision.</span>
                </li>
              </ul>
            </div>

            {/* UniMitra Card */}
            <div className="p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-4 card-3d shadow-sm">
              <h4 className="text-base font-black text-emerald-700 dark:text-emerald-400">
                ✓ UniMitra Academic Intelligence
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>100% grounded in official university documents with zero hallucination.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Displays exact PDF title, module unit, and page numbers for every answer.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Native bilingual support: Assamese script, Romanized Assamese, and English.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Free open access to compare curriculums across all Assam universities.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* Call to Action Ribbon */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#118AB2] via-[#073B4C] to-[#0B1320] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl card-3d">
            <div className="space-y-3 text-center md:text-left max-w-xl">
              <span className="text-xs font-black uppercase tracking-wider text-[#FFD166]">
                {currentLang === 'as' ? 'অধ্যয়ন আৰম্ভ কৰক' : 'Ready to Experience It?'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                {currentLang === 'as' ? 'সকলো বিশ্ববিদ্যালয়ৰ পাঠ্যক্ৰম এতিয়া আপোনাৰ হাতৰ মুঠিত' : 'Explore All University Syllabuses Instantly'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentLang === 'as'
                  ? 'কোনো বাধ্যতামূলক পঞ্জীয়ন নোহোৱাকৈ যিকোনো পাঠ্যক্ৰম পৰীক্ষা কৰক আৰু অসমীয়া ভাষাত প্ৰশ্ন সুধক।'
                  : 'Start searching course modules, credit structures, and official guidelines freely across all Assam universities.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={() => onNavigate && onNavigate('dashboard')}
                className="px-6 py-3.5 rounded-xl font-bold text-slate-900 bg-[#FFD166] hover:bg-[#F2C353] transition-all cursor-pointer shadow-md text-xs sm:text-sm text-center"
              >
                {currentLang === 'as' ? 'পাঠ্যক্ৰম হাব খোলক ➔' : 'Open Curriculum Hub ➔'}
              </button>
              <button
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="px-6 py-3.5 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer text-xs sm:text-sm text-center"
              >
                {currentLang === 'as' ? 'ছাত্ৰ প্ৰফাইল লগ-ইন' : 'Student Sign In'}
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

