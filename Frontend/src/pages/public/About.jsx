import { CheckCircleIcon } from '../../components/common/Icons';

export const About = ({ onNavigate, onOpenAuth, currentLang = 'en' }) => {
  const platformFeatures = [
    {
      title: 'Intuitive Student Interface',
      capability: 'Fast, clean mobile & desktop design',
      desc: 'Built so every student in Assam can navigate university syllabuses and academic rules effortlessly on any device.',
      badge: 'Student First'
    },
    {
      title: 'Reliable University Database',
      capability: 'Separate storage for each university',
      desc: 'Maintains independent course catalogs, semesters, and guidelines so university information never gets mixed up.',
      badge: 'Accurate Data'
    },
    {
      title: 'Official Document Processing',
      capability: 'Direct PDF verification',
      desc: 'Reads authorized university curriculum documents to extract exact page references, subjects, and examination criteria.',
      badge: 'Zero Guesswork'
    },
    {
      title: 'Bilingual Language Answering',
      capability: 'Assamese & English understanding',
      desc: 'Answers questions naturally whether you ask in Assamese script, Romanized Assamese, or English.',
      badge: 'Bilingual'
    }
  ];

  const teamRoles = [
    {
      role: 'Developer 1',
      title: 'Data & Academic Intelligence',
      focus: 'Responsible for document processing, university database design, and verified question answering logic.',
      color: '#118AB2'
    },
    {
      role: 'Developer 2',
      title: 'User Interface & Student Access',
      focus: 'Responsible for clean website layout, responsive navigation, dark/light design system, and user sign-in.',
      color: '#FF7F50'
    },
    {
      role: 'Developer 3',
      title: 'Student Dashboard & Study Tools',
      focus: 'Responsible for interactive course browser, syllabus viewer, chat experience, and document management.',
      color: '#06D6A0'
    }
  ];

  return (
    <div className="bg-[#FAFAFC] dark:bg-[#0B1320] min-h-screen text-[#073B4C] dark:text-slate-100 py-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#073B4C] dark:text-white">
            {currentLang === 'as' 
              ? 'অসমৰ শৈক্ষিক ক্ষেত্ৰত বিশ্বস্ত ডিজিটেল সহায়ক' 
              : 'Empowering Assam Higher Education with UniMitra'}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentLang === 'as'
              ? 'UniMitra হৈছে এক বহুমুখী শৈক্ষিক মঞ্চ, যাৰ লক্ষ্য অসমৰ বিশ্ববিদ্যালয়সমূহৰ পাঠ্যক্ৰম, শৈক্ষিক নিয়ম আৰু নথিপত্ৰসমূহ ছাত্ৰ-ছাত্ৰীৰ বাবে সহজলভ্য কৰি তোলা।'
              : 'UniMitra was created to eliminate confusion around university syllabuses and academic rules across Assam, providing verified answers in both Assamese and English.'}
          </p>
        </div>

        {/* The Problem & The Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          
          <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">The Academic Challenge in Assam</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              University students across Gauhati University, Dibrugarh University, Tezpur University, and regional colleges often struggle to locate updated syllabuses, exam regulations, and course requirements. Standard search engines frequently deliver outdated or inaccurate information that misleads students before exams.
            </p>
          </div>

          <div className="bg-white dark:bg-[#111C2E] border-2 border-[#06D6A0]/40 dark:border-[#06D6A0]/30 rounded-2xl p-8 shadow-elevated-mint">
            <div className="flex items-center space-x-2 text-[#06D6A0] mb-3">
              <CheckCircleIcon className="w-6 h-6" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">The UniMitra Solution</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              UniMitra strictly verifies information against official university PDFs. When you ask a question in Assamese or English, it pinpoints the exact document and page reference, ensuring students get only authentic academic guidance.
            </p>
          </div>

        </div>

        {/* Platform Core Capabilities */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-[#073B4C] dark:text-white">
              Built for Speed, Accuracy, and Ease
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Four key pillars that keep student learning efficient and reliable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformFeatures.map((feat, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-elevated-card transition-all flex flex-col justify-between card-3d"
              >
                <div>
                  <span className="text-xs font-bold text-[#118AB2] dark:text-[#FFD166] block mb-2">
                    {feat.badge}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                  <div className="text-xs font-semibold text-[#FF7F50] mb-3">{feat.capability}</div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{feat.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-[#06D6A0]">
                  Verified for Students
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Three Developer Team Division */}
        <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8 mb-20 shadow-sm">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#073B4C] dark:text-white">Team Collaboration</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Developed by a team of three contributors focused on student accessibility across Assam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamRoles.map((dev, i) => (
              <div 
                key={i} 
                className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-3"
              >
                <span className="text-xs font-extrabold text-[#118AB2] dark:text-[#FFD166]">{dev.role}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{dev.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{dev.focus}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Contact CTA */}
        <div className="bg-gradient-to-r from-[#118AB2] to-[#073B4C] rounded-2xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">Want to connect with the team?</h3>
            <p className="text-sm text-slate-200 max-w-xl">
              We welcome suggestions from college principals, department heads, and students across Assam.
            </p>
          </div>
          <button
            onClick={() => onOpenAuth ? onOpenAuth('register') : onNavigate && onNavigate('contact')}
            className="px-7 py-3.5 rounded-xl font-bold text-slate-900 bg-[#FFD166] hover:bg-[#F2C353] transition-all cursor-pointer shadow-md text-sm shrink-0"
          >
            Create Free Account ➔
          </button>
        </div>

      </div>
    </div>
  );
};
