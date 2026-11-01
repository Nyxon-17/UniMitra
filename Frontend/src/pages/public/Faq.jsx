import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, SearchIcon, EnvelopeIcon, BuildingLibraryIcon } from '../../components/common/Icons';

export const Faq = ({ onNavigate, onOpenAuth, currentLang = 'en', isLoggedIn = false }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const faqData = [
    {
      category: 'Regulations',
      q: 'What is UniMitra and how does it assist universities in Assam?',
      asQ: 'UniMitra কি আৰু ই অসমৰ বিশ্ববিদ্যালয়সমূহত কেনেদৰে সহায় কৰে?',
      a: 'UniMitra is an AI-powered smart university assistance platform designed for students, faculty members, and administrative staff across Assam. It centralizes authorized university regulations, examination ordinances, admission guidelines, and scholarship circulars to deliver grounded answers in Assamese and English with exact page citations.',
      asA: 'UniMitra হৈছে অসমৰ ছাত্ৰ-ছাত্ৰী, অধ্যাপক আৰু কৰ্মচাৰীসকলৰ বাবে এক AI চালিত বিশ্ববিদ্যালয় সহায়ক মঞ্চ। ই চৰকাৰী আৰু বিশ্ববিদ্যালয়ৰ নিয়মাৱলী, পৰীক্ষাৰ জাননী, ভৰ্তি আৰু ছাত্ৰবৃত্তিৰ তথ্য একত্ৰিত কৰি সঠিক পৃষ্ঠা নম্বৰসহ অসমীয়া আৰু ইংৰাজীত উত্তৰ প্ৰদান কৰে।'
    },
    {
      category: 'Regulations',
      q: 'What are the general attendance rules and condonation limits across universities?',
      asQ: 'বিশ্ববিদ্যালয়সমূহত উপস্থিতিৰ সাধাৰণ নিয়ম আৰু বিশেষ ৰেহাইৰ পৰিসৰ কিমান?',
      a: 'Most state universities in Assam (e.g. Gauhati University and Dibrugarh University) mandate a minimum of 75% attendance in theory and practical sessions. Special condonation up to 10% (permitting students with 65%-74% attendance) is granted strictly on medical grounds upon recommendation of the Departmental Head.',
      asA: 'অসমৰ বেছিভাগ বিশ্ববিদ্যালয়ত (যেনে গুৱাহাটী আৰু ডিব্ৰুগড় বিশ্ববিদ্যালয়) পৰীক্ষাত বহিবলৈ নূন্যতম ৭৫% উপস্থিতি বাধ্যতামূলক। শাৰীৰিক অসুস্থতাৰ বাবে বিভাগীয় প্ৰধানৰ অনুমোদন সাপেক্ষে ৬৫% লৈকে উপস্থিতি ৰেহাই (Condonation) দিয়াৰ ব্যৱস্থা আছে।'
    },
    {
      category: 'Examinations',
      q: 'How does the examination re-evaluation and script scrutiny process work?',
      asQ: 'পৰীক্ষাৰ পুনৰমূল্যায়ন (Re-evaluation) আৰু উত্তৰবহী পৰিদৰ্শনৰ প্ৰক্ৰিয়া কি?',
      a: 'Students unsatisfied with their end-semester marks can apply for re-evaluation within 15–20 days from the date of online mark sheet declaration. An application fee per paper is required through the university examination portal. Script scrutiny or photocopy request can also be filed according to institutional ordinances.',
      asA: 'অনলাইন ফলাফল ঘোষণাৰ ১৫–২০ দিনৰ ভিতৰত ছাত্ৰ-ছাত্ৰীয়ে নিৰ্ধাৰিত মাচুল জমা দি পৰীক্ষা প’ৰ্টেলৰ জৰিয়তে পুনৰমূল্যায়নৰ আবেদন কৰিব পাৰে। উত্তৰবহীৰ প্ৰতিলিপি বিচাৰি স্ক্ৰুটিনিৰ বাবেও আবেদন কৰিব পাৰি।'
    },
    {
      category: 'Examinations',
      q: 'What are the passing criteria and back-paper clearance rules under CBCS / NEP?',
      asQ: 'CBCS / NEP নিয়মৰ অধীনত পৰীক্ষাত উত্তীৰ্ণ হোৱাৰ নূন্যতম নম্বৰ কিমান?',
      a: 'Under standard CBCS and FYUGP NEP frameworks, a candidate must obtain at least 40% marks in In-Semester (Sessional) and End-Semester examinations separately to be declared passed in each paper. Back papers must be cleared within the maximum allowable degree duration (ordinarily N+2 years).',
      asA: 'CBCS আৰু NEP নিয়ম অনুসৰি ছাত্ৰ-ছাত্ৰীয়ে ছেচনেল আৰু অন্তিম ষাণ্মাসিক পৰীক্ষাত পৃথকে পৃথকে ন্যূনতম ৪০% নম্বৰ লাভ কৰিলেহে উত্তীৰ্ণ ঘোষণা কৰা হয়। ডিগ্ৰীৰ নিৰ্ধাৰিত সৰ্বোচ্চ সময়সীমাৰ (N+2 বছৰ) ভিতৰত বেক পেপাৰ ক্লিয়াৰ কৰিব লাগিব।'
    },
    {
      category: 'Scholarships',
      q: 'Which state and central scholarships are accessible through this platform?',
      asQ: 'এই মঞ্চৰ জৰিয়তে কোনবোৰ ৰাজ্যিক আৰু কেন্দ্ৰীয় ছাত্ৰবৃত্তিৰ তথ্য পোৱা যায়?',
      a: 'UniMitra indexes official circulars for the Assam Post-Matric Scholarship, Ishan Uday Special Scholarship for NER, Combined Merit Scholarship (DHE Assam), PG Indira Gandhi Scholarship for Single Girl Child, and institutional fee-waiver policies.',
      asA: 'UniMitra-ত অসম চৰকাৰৰ উচ্চ শিক্ষা সঞ্চালকালয়ৰ কম্বাইনড মেধা বৃত্তি, ঈশান উদয় স্কলাৰশ্বিপ, প’ষ্ট-মেট্ৰিক ছাত্ৰবৃত্তি আৰু বিশ্ববিদ্যালয়ৰ মাচুল ৰেহাইৰ অধিসূচনাসমূহৰ তথ্য সংলগ্ন আছে।'
    },
    {
      category: 'Admissions',
      q: 'How can candidates find admission dates, cut-offs, and reservation norms?',
      asQ: 'ভৰ্তিৰ অন্তিম তাৰিখ, কাট-অফ আৰু সংৰক্ষণৰ নিয়ম কেনেকৈ জানিব পাৰি?',
      a: 'Admission notifications for UG, PG, and Ph.D. programs—including entrance exam criteria, Samarth portal integration details, OBC/MOBC/ST/SC/EWS quotas, and seat allocation rules—are fully queryable in UniMitra with direct gazette citations.',
      asA: 'UG, PG আৰু গৱেষণা পাঠ্যক্ৰমত নামভৰ্তিৰ নিয়ম, সমৰ্থ প’ৰ্টেলৰ আবেদন, সংৰক্ষণৰ অনুপাত আৰু প্ৰৱেশ পৰীক্ষাৰ বিৱৰণ UniMitra-ত পোনপটীয়াকৈ সুধিব পাৰি।'
    },
    {
      category: 'Facilities',
      q: 'What are the norms for university hostel allotment and campus amenities?',
      asQ: 'বিশ্ববিদ্যালয়ৰ হোষ্টেল আবণ্টন আৰু চৌহদৰ সুবিধাসমূহৰ চৰ্ত কি?',
      a: 'Hostel allotment is regulated strictly by merit score in the qualifying examination and the permanent home distance from the campus. Students can also query central library digital access hours, campus medical center facilities, and anti-ragging helpline contacts.',
      asA: 'মেধা তালিকা আৰু ঘৰৰ পৰা বিশ্ববিদ্যালয়ৰ দূৰত্বৰ ভিত্তিত হোষ্টেলৰ আসন আবণ্টন দিয়া হয়। ইয়াৰ উপৰিও কেন্দ্ৰীয় গ্ৰন্থাগাৰ, স্বাস্থ্য কেন্দ্ৰ আৰু এণ্টি-ৰেগিং হেল্পলাইনৰ নিয়মসমূহো উপলব্ধ।'
    },
    {
      category: 'Bilingual',
      q: 'Can queries be entered in everyday Romanized Assamese typing?',
      asQ: 'সাধাৰণ ইংৰাজী আখৰত লিখা অসমীয়া ভাষাত (ৰোমানাইজড) প্ৰশ্ন সুধিব পাৰিনে?',
      a: 'Yes! UniMitra is trained on both traditional Assamese script (অসমীয়া লিপি) and colloquial Romanized Assamese phonetic queries (e.g. "exam fee aru re-eval form submit korar date ki?"). The AI responds accurately in your preferred language.',
      asA: 'হয়! UniMitra-ই মূল অসমীয়া লিপি আৰু সাধাৰণ ইংৰাজী কিব’ৰ্ডেৰে লিখা অসমীয়া বাক্য দুয়োটাই বুজি পায় আৰু সঠিক উত্তৰ প্ৰদান কৰে।'
    }
  ];

  const categories = ['All', 'Regulations', 'Examinations', 'Admissions', 'Scholarships', 'Facilities', 'Bilingual'];

  const filteredFaqs = faqData.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCat;
    return (
      matchesCat &&
      (item.q.toLowerCase().includes(query) ||
        item.a.toLowerCase().includes(query) ||
        item.asQ.includes(query) ||
        item.asA.includes(query))
    );
  });

  return (
    <div className="bg-transparent relative z-10 min-h-screen text-[#000000] dark:text-[#FFFFFF] py-16 transition-colors duration-200">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#000000] dark:text-[#FFFFFF]">
            {currentLang === 'as' ? 'সঘনাই সোধা প্ৰশ্নসমূহ (FAQ)' : 'Frequently Asked Institutional Questions'}
          </h1>
          <p className="text-sm sm:text-base text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
            {currentLang === 'as'
              ? 'বিশ্ববিদ্যালয়ৰ শৈক্ষিক নিয়ম, পৰীক্ষা, ভৰ্তি, ছাত্ৰবৃত্তি আৰু মঞ্চ ব্যৱহাৰৰ বিষয়ে প্ৰয়োজনীয় উত্তৰসমূহ।'
              : 'Find quick, verified answers regarding university statutes, examination evaluation, admissions, scholarships, and bilingual AI assistance.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <SearchIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={currentLang === 'as' ? 'প্ৰশ্ন বা শব্দ বিচাৰক...' : 'Search questions, regulations, exams, admissions...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-white dark:bg-[#141414] text-[#000000] dark:text-[#FFFFFF] placeholder-[#555375]/70 dark:placeholder-[#C4B5FD]/60 focus:outline-none focus:border-[#FF933E]/50 dark:border-[#03C988]/50 text-xs sm:text-sm font-semibold shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${activeCategory === cat
                  ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] text-white shadow-xs'
                  : 'bg-white dark:bg-[#141414] text-[#000000] dark:text-[#FFFFFF] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 hover:bg-[#FFE9A9]/40'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-16">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#141414] rounded-3xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80">
              No queries match your search keyword. Try searching for "attendance", "scholarship", or "exam".
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="neo-surface rounded-3xl overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#E0D4FD]/10"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#FFE9A9] dark:bg-[#0A0A0A] text-[#000000] dark:text-[#FFFFFF]">
                        {faq.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-[#000000] dark:text-[#FFFFFF] pt-1">
                        {currentLang === 'as' ? faq.asQ : faq.q}
                      </h3>
                    </div>
                    <div className={`w-8 h-8 rounded-xl bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 flex items-center justify-center shrink-0 text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF] transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDownIcon className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#73A5CA]/40/40 dark:border-[#1C82AD]/40 text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed font-semibold">
                      <p>{currentLang === 'as' ? faq.asA : faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Need Help Box */}
        <div className="bg-[#FFE9A9]/40 dark:bg-[#141414] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-3xl p-8 text-center space-y-3">
          <h3 className="text-lg font-black text-[#000000] dark:text-[#FFFFFF]">
            Have an unlisted university circular or ordinance query?
          </h3>
          <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 max-w-xl mx-auto">
            Our academic ingestion desk reviews newly issued university notices and circulars every 24 hours.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                if (onNavigate) onNavigate('contact');
                navigate('/contact');
              }}
              className="px-6 py-2.5 rounded-xl font-black text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] text-xs transition-all cursor-pointer shadow-xs"
            >
              Contact University Desk ➔
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
