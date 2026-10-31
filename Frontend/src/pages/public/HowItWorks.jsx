import { 
  DocumentTextIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  LanguageIcon, 
  BrainIcon, 
  ShieldCheckIcon,
  ArrowRightIcon,
  BuildingLibraryIcon,
  CpuChipIcon
} from '../../components/common/Icons';

export const HowItWorks = ({ onNavigate, onOpenAuth, currentLang = 'en', isLoggedIn = false }) => {
  const steps = [
    {
      step: '01',
      title: 'Institutional Document Ingestion & OCR',
      asTitle: 'অফিচিয়েল নথিপত্ৰ সংগ্ৰহ আৰু প্ৰস্তুতি',
      tagColor: 'bg-[#E0D4FD]/40 text-[#0F172A] dark:bg-[#3B2868] dark:text-[#FAF8FF]',
      icon: DocumentTextIcon,
      desc: 'Authorized university regulations, examination ordinances, admission brochures, circulars, and scholarship gazettes are parsed using high-accuracy PDF extractors and specialized OCR for scanned Assamese & English documents.',
      asDesc: 'গুৱাহাটী, ডিব্ৰুগড়, তেজপুৰকে ধৰি অসমৰ সকলো বিশ্ববিদ্যালয়ৰ অফিচিয়েল নিয়মাৱলী, পৰীক্ষাৰ জাননী আৰু অধিসূচনা সংগ্ৰহ কৰি উন্নত OCR প্ৰযুক্তিয়ে নিৰীক্ষণ কৰে।',
      features: [
        'Centralized knowledge base for all Assam universities',
        'Preserved page numbers, gazette references & metadata',
        'Automated detection of revised university circulars'
      ],
      asFeatures: [
        'সকলো বিশ্ববিদ্যালয়ৰ কেন্দ্ৰীয় তথ্যভঁৰাল',
        'পৃষ্ঠা নম্বৰ আৰু অধিসূচনাৰ মেটাডাটা সংৰক্ষণ',
        'স্বয়ংক্ৰিয় নবীকৰণ পৰীক্ষা'
      ]
    },
    {
      step: '02',
      title: 'Bilingual Semantic Indexing (Multilingual E5)',
      asTitle: 'দ্বিভাষিক অৰ্থপূৰ্ণ ইনডেক্সিং',
      tagColor: 'bg-[#DDD6FE] text-[#0F172A] dark:bg-[#3B2868] dark:text-[#FAF8FF]',
      icon: BrainIcon,
      desc: 'Document text chunks are converted into dense multilingual semantic vectors using Multilingual E5 embedding models trained to capture Assamese academic vocabulary, regional idioms, and English ordinances.',
      asDesc: 'অসমীয়া আৰু ইংৰাজী দুয়োটা ভাষাৰ শৈক্ষিক আৰু আইনী শব্দাৱলী স্পষ্টকৈ বুজিব পৰাকৈ আধুনিক দ্বিভাষিক ভেক্টৰ মডেলৰ জৰিয়তে তথ্যসমূহ ইনডেক্স কৰা হয়।',
      features: [
        'Native Assamese script & Romanized understanding',
        'High-dimensional vector indexing in MongoDB Atlas',
        'Context-aware clause and section chunking'
      ],
      asFeatures: [
        'অসমীয়া লিপি আৰু ৰোমানাইজড সমৰ্থন',
        'MongoDB Atlas Vector Search ইনডেক্সিং',
        'আইনী ধাৰাভিত্তিক অনুচ্ছেদ বিভাজন'
      ]
    },
    {
      step: '03',
      title: 'Natural Language Query Processing',
      asTitle: 'প্ৰাকৃতিক ভাষাৰ প্ৰশ্ন বিশ্লেষণ',
      tagColor: 'bg-[#E0D4FD]/40 text-[#0F172A] dark:bg-[#3B2868] dark:text-[#FAF8FF]',
      icon: LanguageIcon,
      desc: 'Students, faculty members, and staff can submit natural queries in Assamese or English. The query understanding module detects user intent across regulations, exams, admissions, or scholarships.',
      asDesc: 'ছাত্ৰ-ছাত্ৰী আৰু শিক্ষকসকলে মূল অসমীয়া লিপি বা ইংৰাজীত প্ৰশ্ন সুধিব পাৰে। সহায়কে উদ্দেশ্য নিৰূপণ কৰি নিৰ্দিষ্ট দিশ বাছি লয়।',
      features: [
        'Multi-dialect Assamese & English processing',
        'Cross-university institutional comparison',
        'Role-specific intent classification'
      ],
      asFeatures: [
        'অসমীয়া আৰু ইংৰাজীৰ স্পষ্ট বোধগম্যতা',
        'আন্তঃ-বিশ্ববিদ্যালয় তথ্য সন্ধান',
        'ভূমিকাভিত্তিক প্ৰশ্ন বিশ্লেষণ'
      ]
    },
    {
      step: '04',
      title: 'Grounded Answer Generation & Hallucination Reduction',
      asTitle: 'ভুলহীন প্ৰমাণিত উত্তৰ লাভ',
      tagColor: 'bg-[#DDD6FE] text-[#0F172A] dark:bg-[#3B2868] dark:text-[#FAF8FF]',
      icon: ShieldCheckIcon,
      desc: 'The RAG pipeline retrieves relevant clauses from verified documents and synthesizes an accurate answer citing the exact university name, document title, ordinance section, and page number. If information is missing, it explicitly informs the user.',
      asDesc: 'সহায়কে প্ৰকৃত নথিপত্ৰৰ পৰা তথ্য সংগ্ৰহ কৰি বিশ্ববিদ্যালয়ৰ নাম, অধিসূচনা আৰু নিৰ্দিষ্ট পৃষ্ঠা নম্বৰসহ বিশ্বাসযোগ্য উত্তৰ দিয়ে। কোনো মনগঢ়া তথ্য দিয়া নহয়।',
      features: [
        'Verifiable PDF page and clause citations',
        'Strict hallucination reduction safeguards',
        'Explicit notification when information is unavailable'
      ],
      asFeatures: [
        'সঠিক PDF পৃষ্ঠা আৰু ধাৰা উল্লেখ',
        'মনগঢ়া উত্তৰ ৰোধ কৰাৰ ব্যৱস্থা',
        'তথ্য নথকাৰ স্পষ্ট সতৰ্কবাৰ্তা'
      ]
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
              ? 'UniMitra RAG প্ৰযুক্তি কেনেদৰে কাৰ্যকৰী হয়?' 
              : 'How the Bilingual University RAG Engine Works'}
          </h1>
          <p className="text-sm sm:text-base text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
            {currentLang === 'as'
              ? 'অসমীয়া আৰু ইংৰাজী ভাষাত বিশ্ববিদ্যালয়ৰ শৈক্ষিক আৰু আইনী তথ্য নিখুঁতভাৱে প্ৰদান কৰিবলৈ আধুনিক জেনেৰেটিভ AI আৰু ভেক্টৰ ছাৰ্চৰ সমন্বয়।'
              : 'Solving the Gen AI challenge: Bilingual Retrieval-Augmented Generation, Assamese-language query understanding, multilingual semantic search, and strict hallucination reduction.'}
          </p>
        </div>

        {/* 4 Technical Step Cards */}
        <div className="space-y-8 mb-20">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step}
                className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 sm:p-8 shadow-sm hover:border-[#6D28D9] transition-all card-3d"
              >
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                  
                  {/* Left Column */}
                  <div className="flex items-start space-x-4 max-w-2xl">
                    <div className="w-12 h-12 rounded-2xl bg-[#6D28D9] text-white flex items-center justify-center shrink-0 font-black text-lg shadow-xs">
                      {item.step}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg border border-[#E0D4FD] dark:border-[#3B2868] ${item.tagColor}`}>
                          Step {item.step}
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-[#0F172A] dark:text-[#FAF8FF]">
                          {currentLang === 'as' ? item.asTitle : item.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
                        {currentLang === 'as' ? item.asDesc : item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Features Checklist */}
                  <div className="bg-[#FAF8FF] dark:bg-[#0A0718] p-4 rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] w-full lg:w-80 shrink-0 space-y-2 text-xs">
                    <span className="font-black text-[#0F172A] dark:text-[#FAF8FF] block uppercase tracking-wider text-[10px]">
                      Engineering Highlights
                    </span>
                    {(currentLang === 'as' ? item.asFeatures : item.features).map((feat, fidx) => (
                      <div key={fidx} className="flex items-center space-x-2 text-[#555375] dark:text-[#C4B5FD]">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Gen AI Safeguards Box */}
        <div className="bg-white dark:bg-[#150F2C] border-2 border-[#6D28D9] rounded-3xl p-8 sm:p-10 shadow-elevated-sage dark:shadow-elevated-gold mb-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center space-x-2 text-[#6D28D9] dark:text-[#FAF8FF] font-black text-xs uppercase tracking-wider">
              <ShieldCheckIcon className="w-5 h-5 text-[#6D28D9]" />
              <span>Anti-Hallucination Framework</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#FAF8FF]">
              Never Guessing. Always Citing.
            </h2>
            <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
              When a student, professor, or clerk asks about an examination ordinance or scholarship criteria, UniMitra evaluates document relevance scores. If the answer does not exist in authorized university files, the system transparently reports: <em>"This information is currently not found in the verified university repository."</em>
            </p>
            <div className="pt-2">
              <button
                onClick={handlePortalAccess}
                className="px-6 py-3 rounded-2xl font-black text-white bg-[#4C1D95] hover:bg-[#8F00FF] transition-all cursor-pointer shadow-xs text-xs sm:text-sm"
              >
                Test in University Portal ➔
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
