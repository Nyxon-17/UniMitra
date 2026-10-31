import { useState } from 'react';
import { ChevronDownIcon, SearchIcon, EnvelopeIcon } from '../../components/common/Icons';

export const Faq = ({ onNavigate, onOpenAuth, currentLang = 'en' }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const faqData = [
    {
      category: 'General',
      q: 'What is UniMitra and how does it help students in Assam?',
      asQ: 'UniMitra কি আৰু ই অসমৰ ছাত্ৰ-ছাত্ৰীক কেনেদৰে সহায় কৰে?',
      a: 'UniMitra is an academic assistant designed for higher education students across Assam. It indexes authorized university syllabuses, departmental course structures, and examination regulations, allowing you to get instant, accurate answers in Assamese or English with exact page numbers.',
      asA: 'UniMitra হৈছে অসমৰ বিশ্ববিদ্যালয়সমূহৰ শৈক্ষিক সহায়ক মঞ্চ। ই বিশ্ববিদ্যালয়ৰ অফিচিয়েল পাঠ্যক্ৰম, নিয়ম আৰু প্ৰশ্নকাকতসমূহ সংগ্ৰহ কৰি ৰাখে, যাৰ দ্বাৰা আপুনি নিজৰ অসমীয়া বা ইংৰাজী ভাষাত সঠিক পৃষ্ঠা নম্বৰসহ তৎক্ষণাত উত্তৰ পাব পাৰে।'
    },
    {
      category: 'General',
      q: 'Is UniMitra free to use for college and university students?',
      asQ: 'UniMitra ব্যৱহাৰ কৰাটো কলেজ আৰু বিশ্ববিদ্যালয়ৰ ছাত্ৰ-ছাত্ৰীৰ বাবে বিনামূলীয়ানে?',
      a: 'Yes, UniMitra is 100% free for all students, scholars, and teachers across all recognized universities and affiliated colleges in Assam.',
      asA: 'হয়, অসমৰ সকলো স্বীকৃত বিশ্ববিদ্যালয় আৰু মহাবিদ্যালয়ৰ ছাত্ৰ-ছাত্ৰী আৰু শিক্ষকসকলৰ বাবে UniMitra সম্পূৰ্ণৰূপে বিনামূলীয়া।'
    },
    {
      category: 'Language',
      q: 'Can I ask questions in Assamese script or Romanized Assamese?',
      asQ: 'মই অসমীয়া লিপি বা ৰোমানাইজড (ইংৰাজী আখৰত) অসমীয়াত প্ৰশ্ন সুধিব পাৰোনে?',
      a: 'Yes! UniMitra seamlessly understands original Assamese script (e.g., "গুৱাহাটী বিশ্ববিদ্যালয়ৰ ৩য় ষাণ্মাসিকৰ সিলেবাছ দিয়ক") as well as phonetic Romanized typing (e.g., "3rd semester r syllabus ase ne?"). Answers can be generated in Assamese or English based on your preference.',
      asA: 'হয়! UniMitra-ই মূল অসমীয়া লিপি আৰু সাধাৰণ ইংৰাজী আখৰেৰে টাইপ কৰা অসমীয়া ভাষা দুয়োটাই স্পষ্টকৈ বুজি পায়। আপোনাৰ সুবিধা অনুসৰি উত্তৰসমূহ অসমীয়া বা ইংৰাজীত প্ৰকাশ কৰা হয়।'
    },
    {
      category: 'Language',
      q: 'Will the assistant translate English university regulations into Assamese?',
      asQ: 'সহায়কে ইংৰাজী বিশ্ববিদ্যালয়ৰ নিয়মসমূহ অসমীয়ালৈ অনুবাদ কৰি বুজাই দিবনে?',
      a: 'Yes. Most official university notifications are published in English. UniMitra translates and breaks down complex examination clauses, credit calculations, and attendance rules into clear, simple Assamese.',
      asA: 'হয়। বিশ্ববিদ্যালয়ৰ বেছিভাগ অধিসূচনা ইংৰাজীত থাকে। UniMitra-ই সেই জটিল নিয়ম, পৰীক্ষাৰ নম্বৰ আৰু উপস্থিতিৰ চৰ্তসমূহ সহজ অসমীয়া ভাষাত বুজাই দিয়ে।'
    },
    {
      category: 'Accuracy',
      q: 'How does UniMitra guarantee that answers are not fake or made up?',
      asQ: 'UniMitra-ই দিয়া উত্তৰবোৰ ভুল বা মনগঢ়া নহয় বুলি কেনেকৈ নিশ্চিত কৰা হয়?',
      a: 'UniMitra strictly quotes from authorized syllabus PDF documents uploaded for each respective university. If an answer cannot be verified in the official document, the system explicitly informs you rather than guessing or fabricating details.',
      asA: 'UniMitra-ই কেৱল বিশ্ববিদ্যালয়সমূহে প্ৰকাশ কৰা প্ৰকৃত নথিপত্ৰৰ পৰাহে তথ্য উদ্ধৃত কৰে। যদি কোনো তথ্য নথিত পোৱা নাযায়, সহায়কে মনৰ পৰা উত্তৰ নিদি স্পষ্টকৈ জনায় যে তথ্য উপলব্ধ নহয়।'
    },
    {
      category: 'Accuracy',
      q: 'Can I view and download the original official university PDF?',
      asQ: 'মই মূল অফিচিয়েল বিশ্ববিদ্যালয়ৰ PDF চাব আৰু ডাউনলোড কৰিব পাৰোনে?',
      a: 'Yes! Every response includes the title of the official syllabus document and the exact page number. You can click to open or download the document directly in the portal.',
      asA: 'হয়! প্ৰতিটো উত্তৰৰ তলতে নথিপত্ৰৰ নাম আৰু সঠিক পৃষ্ঠা নম্বৰ সংলগ্ন থাকে, য’ত ক্লিক কৰি আপুনি সম্পূৰ্ণ PDF চাব আৰু সংৰক্ষণ কৰিব পাৰে।'
    },
    {
      category: 'Curriculums',
      q: 'Which universities and curriculums in Assam are currently supported?',
      asQ: 'বৰ্তমান অসমৰ কোনবোৰ বিশ্ববিদ্যালয় আৰু পাঠ্যক্ৰম অন্তৰ্ভুক্ত কৰা হৈছে?',
      a: 'UniMitra covers major university curriculums including Gauhati University (GU), Dibrugarh University (DU), Tezpur Central University (TU), Assam University (Silchar), Cotton University (CU), Bodoland University (BU), ASTU, and AAU, with catalogs continuously expanding.',
      asA: 'UniMitra-ত গুৱাহাটী বিশ্ববিদ্যালয়, ডিব্ৰুগড় বিশ্ববিদ্যালয়, তেজপুৰ বিশ্ববিদ্যালয়, অসম বিশ্ববিদ্যালয়, কটন বিশ্ববিদ্যালয়, বড়োলেণ্ড বিশ্ববিদ্যালয়কে ধৰি অসমৰ সকলো অগ্ৰণী বিশ্ববিদ্যালয়ৰ পাঠ্যক্ৰম অন্তৰ্ভুক্ত কৰা হৈছে।'
    },
    {
      category: 'Curriculums',
      q: 'What if my college or specific department syllabus is missing?',
      asQ: 'যদি মোৰ মহাবিদ্যালয় বা নিৰ্দিষ্ট বিভাগৰ পাঠ্যক্ৰম উপলব্ধ নহয়, মই কি কৰিব পাৰো?',
      a: 'You can submit a syllabus request through our Contact page or upload the PDF if you are a departmental administrator. Our academic desk typically reviews and indexes new course materials within 24–48 hours.',
      asA: 'আপুনি আমাৰ Contact পৃষ্ঠাৰ জৰিয়তে পাঠ্যক্ৰম সংযোগৰ অনুৰোধ জনাব পাৰে। আমাৰ শৈক্ষিক দলে ২৪ ৰ পৰা ৪৮ ঘণ্টাৰ ভিতৰত সেই নথিসমূহ পৰীক্ষা কৰি অন্তৰ্ভুক্ত কৰে।'
    },
    {
      category: 'Account',
      q: 'Do I need an account to search for syllabuses?',
      asQ: 'পাঠ্যক্ৰম বিচাৰিবলৈ একাউণ্টৰ প্ৰয়োজন আছেনে?',
      a: 'No. Basic search and syllabus inquiries can be made as a guest. However, creating a free student account lets you bookmark courses, save exam questions, and receive semester notification alerts.',
      asA: 'নাই। সাধাৰণ সন্ধানৰ বাবে একাউণ্টৰ প্ৰয়োজন নাই। কিন্তু ছাত্ৰ একাউণ্ট খুলিলে আপুনি বিষয় সংৰক্ষণ (Bookmark) কৰিব পাৰিব আৰু প্ৰয়োজনীয় প্ৰশ্ন সংগ্ৰহ কৰি ৰাখিব পাৰিব।'
    }
  ];

  const categories = ['All', 'General', 'Language', 'Accuracy', 'Curriculums', 'Account'];

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
    <div className="bg-[#FAFAFC] dark:bg-[#0B1320] min-h-screen text-[#073B4C] dark:text-slate-100 py-16 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#073B4C] dark:text-white">
            {currentLang === 'as' ? 'সঘনাই সোধা প্ৰশ্নসমূহ (FAQ)' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentLang === 'as'
              ? 'UniMitra ব্যৱহাৰ, পাঠ্যক্ৰম অনুসন্ধান আৰু ভাষা সমৰ্থন সম্পৰ্কে ছাত্ৰ-ছাত্ৰী আৰু শিক্ষকৰ সাধাৰণ প্ৰশ্নোত্তৰ।'
              : 'Clear answers on how UniMitra works, language options, syllabus reliability, and university coverage in Assam.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10">
          <div className="bg-white dark:bg-[#111C2E] p-2.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-sm flex items-center px-4">
            <SearchIcon className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <input
              type="text"
              placeholder={currentLang === 'as' ? 'প্ৰশ্ন বা শব্দ বিচাৰক (e.g. syllabus, assamese, account)...' : 'Search question or topic (e.g. syllabus, assamese, accuracy)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 bg-transparent text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white ml-2 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#118AB2] text-white shadow-sm'
                  : 'bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat === 'All' ? (currentLang === 'as' ? 'সকলো প্ৰশ্ন (All)' : 'All Topics') : cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-16">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center space-y-2">
              <p className="text-base font-bold text-slate-800 dark:text-white">No questions found matching your search.</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Try different search terms or select "All Topics".</p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pr-4">
                      {currentLang === 'as' ? faq.asQ : faq.q}
                    </span>
                    <ChevronDownIcon
                      className={`w-5 h-5 text-slate-400 shrink-0 transform transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#118AB2] dark:text-[#FFD166]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                      {currentLang === 'as' ? faq.asA : faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Help Desk Card */}
        <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8 sm:p-10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Still have questions?</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Can't find the answer you’re looking for? Reach out to our student helpdesk anytime.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate && onNavigate('contact')}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-white bg-[#118AB2] hover:bg-[#0E7497] transition-all cursor-pointer shadow-md text-xs sm:text-sm"
            >
              <EnvelopeIcon className="w-4 h-4" />
              <span>Contact Academic Helpdesk</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

