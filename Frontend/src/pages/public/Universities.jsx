import { useState } from 'react';
import { SearchIcon, AcademicCapIcon, ArrowRightIcon, MapPinIcon } from '../../components/common/Icons';

export const Universities = ({ onNavigate, onOpenAuth, currentLang = 'en' }) => {
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const allAssamUniversities = [
    // Central Universities
    {
      name: 'Tezpur University',
      asName: 'তেজপুৰ বিশ্ববিদ্যালয়',
      code: 'TU',
      type: 'Central University',
      location: 'Napaam, Tezpur, Sonitpur',
      established: 1994,
      programs: '85+ Programs (B.Tech, M.Tech, M.Sc, MA, PhD)',
      accent: '#06D6A0',
    },
    {
      name: 'Assam University',
      asName: 'অসম বিশ্ববিদ্যালয়',
      code: 'AUS',
      type: 'Central University',
      location: 'Dorgakona, Silchar, Cachar',
      established: 1994,
      programs: '95+ Programs (BA, B.Sc, MA, M.Sc, MBA)',
      accent: '#118AB2',
    },
    // State Universities
    {
      name: 'Gauhati University',
      asName: 'গুৱাহাটী বিশ্ববিদ্যালয়',
      code: 'GU',
      type: 'State University',
      location: 'Jalukbari, Guwahati, Kamrup (M)',
      established: 1948,
      programs: '150+ Courses & 350+ Affiliated Colleges',
      accent: '#FF7F50',
    },
    {
      name: 'Dibrugarh University',
      asName: 'ডিব্ৰুগড় বিশ্ববিদ্যালয়',
      code: 'DU',
      type: 'State University',
      location: 'Rajabheta, Dibrugarh',
      established: 1965,
      programs: '120+ Courses & 175+ Affiliated Colleges',
      accent: '#118AB2',
    },
    {
      name: 'Cotton University',
      asName: 'কটন বিশ্ববিদ্যালয়',
      code: 'CU',
      type: 'State University',
      location: 'Panbazar, Guwahati',
      established: 2017,
      programs: '60+ UG & PG Arts, Science, Computer Sc.',
      accent: '#FFD166',
    },
    {
      name: 'Bodoland University',
      asName: 'বড়োলেণ্ড বিশ্ববিদ্যালয়',
      code: 'BU',
      type: 'State University',
      location: 'Debargaon, Kokrajhar (BTR)',
      established: 2009,
      programs: '50+ Degree Programs in Lower Assam',
      accent: '#06D6A0',
    },
    {
      name: 'Assam Agricultural University',
      asName: 'অসম কৃষি বিশ্ববিদ্যালয়',
      code: 'AAU',
      type: 'State University',
      location: 'Barbheta, Jorhat',
      established: 1969,
      programs: 'Agri, Veterinary, Fishery & Home Science',
      accent: '#06D6A0',
    },
    {
      name: 'Assam Science and Technology University',
      asName: 'অসম বিজ্ঞান আৰু প্ৰযুক্তিবিদ্যা বিশ্ববিদ্যালয়',
      code: 'ASTU',
      type: 'State Technical University',
      location: 'Jalukbari, Guwahati',
      established: 2010,
      programs: 'State-wide Engineering & Technology Curriculum',
      accent: '#118AB2',
    },
    {
      name: 'Srimanta Sankaradeva University of Health Sciences',
      asName: 'শ্ৰীমন্ত শংকৰদেৱ স্বাস্থ্য বিজ্ঞান বিশ্ববিদ্যালয়',
      code: 'SSUHS',
      type: 'Health Sciences University',
      location: 'Narakasur Hilltop, Bhangagarh, Guwahati',
      established: 2009,
      programs: 'MBBS, BDS, B.Pharm, Nursing, AYUSH in Assam',
      accent: '#FF7F50',
    },
    {
      name: 'Krishna Kanta Handiqui State Open University',
      asName: 'কৃষ্ণকান্ত সন্দিকৈ ৰাজ্যিক মুক্ত বিশ্ববিদ্যালয়',
      code: 'KKHSOU',
      type: 'Open University',
      location: 'Resham Nagar, Khanapara, Guwahati',
      established: 2006,
      programs: 'Distance & Open Learning Programs across Assam',
      accent: '#FFD166',
    },
    {
      name: 'Kumar Bhaskar Varma Sanskrit & Ancient Studies University',
      asName: 'কুমাৰ ভাস্কৰ বৰ্মা সংস্কৃত আৰু প্ৰাচীন অধ্যয়ন বিশ্ববিদ্যালয়',
      code: 'KBVSASU',
      type: 'State University',
      location: 'Namati, Nalbari',
      established: 2011,
      programs: 'Sanskrit, Humanities, Education & Philosophy',
      accent: '#118AB2',
    },
    {
      name: 'Majuli University of Culture',
      asName: 'মাজুলী সাংস্কৃতিক বিশ্ববিদ্যালয়',
      code: 'MUC',
      type: 'State Culture University',
      location: 'Garumur, Majuli River Island',
      established: 2017,
      programs: 'Assamese Heritage, Performing Arts & Culture',
      accent: '#FF7F50',
    },
    {
      name: 'Bhattadev University',
      asName: 'ভট্টদেৱ বিশ্ববিদ্যালয়',
      code: 'BDU',
      type: 'State University',
      location: 'Pathsala, Bajali District',
      established: 2019,
      programs: 'Undergraduate & Postgraduate Degree Courses',
      accent: '#06D6A0',
    },
    {
      name: 'Madhabdev University',
      asName: 'মাধৱদেৱ বিশ্ববিদ্যালয়',
      code: 'MDU',
      type: 'State University',
      location: 'Narayanpur, Lakhimpur District',
      established: 2018,
      programs: 'Arts, Science & Interdisciplinary Studies',
      accent: '#FFD166',
    },
    {
      name: 'Rabindranath Tagore University',
      asName: 'ৰবীন্দ্ৰনাথ ঠাকুৰ বিশ্ববিদ্যালয়',
      code: 'RTU',
      type: 'State University',
      location: 'Hojai District',
      established: 2019,
      programs: 'Degree Programs in Central Assam',
      accent: '#118AB2',
    },
    {
      name: 'Birangana Sati Sadhani Rajyik Vishwavidyalaya',
      asName: 'বীৰাংগনা সতী সাধনী ৰাজ্যিক বিশ্ববিদ্যালয়',
      code: 'BSSR',
      type: 'State University',
      location: 'Golaghat District',
      established: 2020,
      programs: 'Higher Education Programs in Upper Assam',
      accent: '#FF7F50',
    },
    {
      name: 'Assam Rajiv Gandhi University of Cooperative Management',
      asName: 'অসম ৰাজীৱ গান্ধী সমবায় ব্যৱস্থাপনা বিশ্ববিদ্যালয়',
      code: 'ARGUCOM',
      type: 'State University',
      location: 'Gadadhar Nagar, Sivasagar',
      established: 2010,
      programs: 'MBA, Law & Cooperative Management Studies',
      accent: '#06D6A0',
    },
    {
      name: 'National Law University and Judicial Academy',
      asName: 'ৰাষ্ট্ৰীয় আইন বিশ্ববিদ্যালয় আৰু ন্যায়িক একাডেমি',
      code: 'NLUJA',
      type: 'Law University',
      location: 'Amingaon, Guwahati',
      established: 2009,
      programs: 'BA LLB (Hons), LLM & Specialized Legal Studies',
      accent: '#118AB2',
    },
    {
      name: 'Assam Women’s University',
      asName: 'অসম মহিলা বিশ্ববিদ্যালয়',
      code: 'AWU',
      type: 'State University',
      location: 'Rowriah, Jorhat',
      established: 2013,
      programs: 'Specialized UG & PG Programs for Women',
      accent: '#FF7F50',
    },
    // Premier National Institutes
    {
      name: 'Indian Institute of Technology Guwahati',
      asName: 'আই.আই.টি. গুৱাহাটী',
      code: 'IITG',
      type: 'Premier National Institute',
      location: 'Amingaon, North Guwahati',
      established: 1994,
      programs: 'B.Tech, B.Des, M.Tech, M.Des, MSc, PhD',
      accent: '#06D6A0',
    },
    {
      name: 'National Institute of Technology Silchar',
      asName: 'এন.আই.টি. শিলচৰ',
      code: 'NITS',
      type: 'Premier National Institute',
      location: 'Silchar, Cachar',
      established: 1967,
      programs: 'Engineering, Computing, Science & Management',
      accent: '#118AB2',
    },
    {
      name: 'Indian Institute of Information Technology Guwahati',
      asName: 'আই.আই.আই.টি. গুৱাহাটী',
      code: 'IIITG',
      type: 'Premier National Institute',
      location: 'Bongora, Guwahati',
      established: 2013,
      programs: 'Computer Science, Electronics & IT Programs',
      accent: '#FFD166',
    },
    // Private Universities
    {
      name: 'The Assam Kaziranga University',
      asName: 'কাজিৰঙা বিশ্ববিদ্যালয়',
      code: 'KU',
      type: 'Private University',
      location: 'Koraikhowa, Jorhat',
      established: 2012,
      programs: 'Engineering, Management, Pharmacy & Allied Health',
      accent: '#FF7F50',
    },
    {
      name: 'The Assam Royal Global University',
      asName: 'ৰয়েল গ্ল’বেল বিশ্ববিদ্যালয়',
      code: 'RGU',
      type: 'Private University',
      location: 'Betkuchi, NH-37, Guwahati',
      established: 2013,
      programs: '100+ Courses across Humanities, Tech & Sciences',
      accent: '#118AB2',
    },
    {
      name: 'Assam Don Bosco University',
      asName: 'অসম ডন বস্কো বিশ্ববিদ্যালয়',
      code: 'ADBU',
      type: 'Private University',
      location: 'Tapesia Gardens, Sonapur / Azara, Guwahati',
      established: 2008,
      programs: 'Technology, Management, Humanities & Sciences',
      accent: '#06D6A0',
    },
    {
      name: 'Assam Down Town University',
      asName: 'অসম ডাউন টাউন বিশ্ববিদ্যালয়',
      code: 'ADTU',
      type: 'Private University',
      location: 'Panikhaiti, Guwahati',
      established: 2010,
      programs: 'Pharmacy, Nursing, Health Sciences & Engineering',
      accent: '#FFD166',
    }
  ];

  const filterTabs = ['All', 'State Universities', 'Central Universities', 'Premier National Institute', 'Private University'];

  const filteredUniversities = allAssamUniversities.filter((univ) => {
    const matchesType = 
      filterType === 'All' 
        ? true 
        : filterType === 'State Universities'
        ? univ.type.includes('State') || univ.type.includes('Health') || univ.type.includes('Open') || univ.type.includes('Law')
        : univ.type === filterType;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesType;

    return (
      matchesType &&
      (univ.name.toLowerCase().includes(query) ||
        univ.asName.includes(query) ||
        univ.code.toLowerCase().includes(query) ||
        univ.location.toLowerCase().includes(query) ||
        univ.programs.toLowerCase().includes(query))
    );
  });

  return (
    <div className="bg-[#FAFAFC] dark:bg-[#0B1320] min-h-screen text-[#073B4C] dark:text-slate-100 py-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#073B4C] dark:text-white">
            {currentLang === 'as' ? 'অসমৰ বিশ্ববিদ্যালয়সমূহ' : 'Universities in Assam'}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentLang === 'as'
              ? 'অসমৰ সকলো চৰকাৰী, কেন্দ্ৰীয়, কাৰিকৰী আৰু স্বীকৃত বিশ্ববিদ্যালয়ৰ সম্পূৰ্ণ তালিকা আৰু পাঠ্যক্ৰম সংগ্ৰহ।'
              : 'Explore the complete directory of higher education universities across Assam. Find department course syllabuses and examination guidelines.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white dark:bg-[#111C2E] p-3 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-sm flex items-center px-4">
            <SearchIcon className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <input
              type="text"
              placeholder={currentLang === 'as' ? 'বিশ্ববিদ্যালয় বা জিলা বিচাৰক (e.g. Gauhati, Dibrugarh, Jorhat)...' : 'Search university, city or code (e.g. Gauhati, Dibrugarh, Silchar)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
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

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filterType === tab
                  ? 'bg-[#118AB2] text-white shadow-sm'
                  : 'bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab === 'All' ? (currentLang === 'as' ? 'সকলো বিশ্ববিদ্যালয় (All)' : 'All Universities') : tab}
            </button>
          ))}
        </div>

        {/* University Count Counter */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-500 dark:text-slate-400">
          <span>Showing {filteredUniversities.length} Universities in Assam</span>
          <span className="text-[#06D6A0]">100% Verified Syllabuses</span>
        </div>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredUniversities.map((univ) => (
            <div
              key={univ.code}
              className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:border-[#118AB2] hover:shadow-elevated-card transition-all flex flex-col justify-between card-3d"
            >
              <div>
                {/* Card Top Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-xs text-[#073B4C] dark:text-[#FFD166] border border-slate-200 dark:border-slate-700 font-mono">
                    {univ.code}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Est. {univ.established}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {currentLang === 'as' ? univ.asName : univ.name}
                </h3>
                <span className="text-xs font-semibold text-[#118AB2] dark:text-[#FFD166] block mb-3">
                  {univ.type}
                </span>

                <div className="flex items-start space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <MapPinIcon className="w-4 h-4 text-[#FF7F50] shrink-0 mt-0.5" />
                  <span>{univ.location}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 leading-relaxed">
                  {univ.programs}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => alert(`Opening syllabus index for ${univ.name}. Academic catalog will load in Dashboard.`)}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold text-white bg-[#118AB2] hover:bg-[#0E7497] transition-all cursor-pointer shadow-sm"
                >
                  <AcademicCapIcon className="w-4 h-4" />
                  <span>Explore Courses & Syllabuses</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Suggest University Section */}
        <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8 sm:p-12 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Is your college syllabus missing?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Any affiliated college or department head can request their course catalog or syllabus PDFs to be indexed into UniMitra.
            </p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('contact')}
            className="px-6 py-3 rounded-xl font-bold text-white bg-[#FF7F50] hover:bg-[#E86B3D] transition-all cursor-pointer shadow-elevated-coral text-sm shrink-0"
          >
            Submit Syllabus Request ➔
          </button>
        </div>

      </div>
    </div>
  );
};

