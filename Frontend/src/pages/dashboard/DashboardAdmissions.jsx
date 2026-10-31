import { useState } from 'react';
import { 
  IdentificationIcon, 
  SearchIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  ArrowRightIcon,
  BuildingLibraryIcon 
} from '../../components/common/Icons';

export const DashboardAdmissions = ({ onNavigateTab, currentLang = 'en' }) => {
  const [selectedUniv, setSelectedUniv] = useState('All Universities');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const universities = [
    'All Universities',
    'Gauhati University (GU)',
    'Dibrugarh University (DU)',
    'Tezpur University (TU)',
    'Cotton University (CU)',
    'Assam University (Silchar)',
    'Bodoland University (BU)'
  ];

  const levels = ['All', 'Undergraduate (UG)', 'Postgraduate (PG)', 'Doctoral (Ph.D.)'];

  const programsData = [
    {
      id: 'ADM-GU-PG-01',
      university: 'Gauhati University (GU)',
      program: 'M.Sc in Information Technology & Computer Science',
      level: 'Postgraduate (PG)',
      duration: '2 Years (4 Semesters)',
      intake: '45 Seats',
      eligibility: 'B.Sc with Major/Honours in Computer Science / BCA / B.Sc with Mathematics securing minimum 50% aggregate marks (45% for SC/ST).',
      admissionProcess: 'Admission via GUEE (Gauhati University Entrance Examination). 80% seats reserved for GU graduates; 20% open for other recognized universities.',
      keyDates: 'Application window: May 15 – June 20 | Entrance Exam: July 1st week',
      gazetteSource: 'GU_PG_Admission_Brochure_2024.pdf (Page 34)'
    },
    {
      id: 'ADM-DU-UG-02',
      university: 'Dibrugarh University (DU)',
      program: 'Bachelor of Computer Applications (FYUGP NEP)',
      level: 'Undergraduate (UG)',
      duration: '4 Years (8 Semesters)',
      intake: '60 Seats',
      eligibility: 'Higher Secondary (10+2) examination passed in Science/Arts/Commerce stream with Mathematics/Statistics/Commercial Arithmetic as one of the subjects with minimum 45% marks.',
      admissionProcess: 'Centralized admission conducted through Assam Samarth e-Gov portal based on 10+2 merit scores and subject weightage.',
      keyDates: 'Samarth Portal Registration: June 01 – June 28 | Merit Publication: July 5',
      gazetteSource: 'DU_FYUGP_NEP_Admission_Ordinance.pdf (Page 18)'
    },
    {
      id: 'ADM-TU-PHD-03',
      university: 'Tezpur University (TU)',
      program: 'Ph.D. in Computer Science & Engineering',
      level: 'Doctoral (Ph.D.)',
      duration: '3 to 5 Years',
      intake: '12 Research Vacancies',
      eligibility: 'Master’s degree in Engineering/Technology with minimum 60% marks or equivalent CGPA. Valid UGC-NET / GATE / JRF score provides written test exemption.',
      admissionProcess: 'Written test (TUEE Research) followed by in-person research proposal presentation and viva-voce before departmental research committee.',
      keyDates: 'Autumn Semester Call: March 20 – April 30 | Research Viva: June 15-20',
      gazetteSource: 'TU_Autumn_Research_Notification_2024.pdf (Page 11)'
    }
  ];

  const filteredPrograms = programsData.filter((p) => {
    const matchUniv = selectedUniv === 'All Universities' || p.university.includes(selectedUniv.split(' ')[0]);
    const matchLevel = selectedLevel === 'All' || p.level === selectedLevel;
    const matchSearch = !searchQuery.trim() || 
      p.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
    return matchUniv && matchLevel && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md dark:shadow-[0_0_15px_rgba(176,38,255,0.25)] card-3d">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#6D28D9] dark:text-[#FAF8FF]">
              <IdentificationIcon className="w-4 h-4" />
              <span>Academic Programs & Admission Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E1035] dark:text-[#FAF8FF]">
              {currentLang === 'as' ? 'শৈক্ষিক পাঠ্যক্ৰম আৰু নামভৰ্তি' : 'Academic Programs & Admission Procedures'}
            </h1>
            <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] max-w-2xl leading-relaxed">
              {currentLang === 'as'
                ? 'অসমৰ বিশ্ববিদ্যালয়সমূহৰ ডিগ্ৰী পাঠ্যক্ৰম, ভৰ্তিৰ অৰ্হতা, আসন সংখ্যা আৰু নিৰ্বাচন প্ৰক্ৰিয়াৰ সঠিক বিৱৰণ লাভ কৰক।'
                : 'Inspect program structures, degree eligibility criteria, entrance test rules, and Samarth admission timelines with official gazette citations.'}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('assistant', { prefillQuery: 'Compare PG admission eligibility and entrance test dates between Gauhati University and Tezpur University.' })}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-white bg-[#4C1D95] hover:bg-[#8F00FF] transition-all cursor-pointer shadow-xs hover:shadow-md text-xs sm:text-sm shrink-0"
          >
            <SparklesIcon className="w-4 h-4 text-[#FAF8FF]" />
            <span>{currentLang === 'as' ? 'সহায়কক সোধক' : 'Ask AI Admission Desk'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-black text-[#1E1035] dark:text-[#FAF8FF] mb-1">
              Select University
            </label>
            <select
              value={selectedUniv}
              onChange={(e) => setSelectedUniv(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-xs font-bold text-[#1E1035] dark:text-[#FAF8FF] outline-none"
            >
              {universities.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-[#1E1035] dark:text-[#FAF8FF] mb-1">
              Degree Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-xs font-bold text-[#1E1035] dark:text-[#FAF8FF] outline-none"
            >
              {levels.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-[#1E1035] dark:text-[#FAF8FF] mb-1">
              Search Programs
            </label>
            <div className="relative">
              <SearchIcon className="w-4 h-4 text-[#6D28D9] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Computer Science, MBA, Ph.D..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-xs font-bold text-[#1E1035] dark:text-[#FAF8FF] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Programs List */}
      <div className="space-y-4">
        {filteredPrograms.map((prog) => (
          <div
            key={prog.id}
            className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E0D4FD]/50 dark:border-[#3B2868] pb-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#4C1D95] text-white">
                    {prog.university}
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#DDD6FE] dark:bg-[#0A0718] text-[#1E1035] dark:text-[#FAF8FF] border border-[#E0D4FD] dark:border-[#3B2868]">
                    {prog.level}
                  </span>
                  <span className="text-xs font-bold text-[#555375] dark:text-[#C4B5FD]">
                    {prog.duration} • {prog.intake}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#1E1035] dark:text-[#FAF8FF] pt-1">
                  {prog.program}
                </h3>
              </div>

              <button
                onClick={() => onNavigateTab('assistant', { prefillQuery: `What are the full admission details and eligibility for ${prog.program} at ${prog.university}?` })}
                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#4C1D95] hover:bg-[#8F00FF] transition-all cursor-pointer shadow-xs self-start sm:self-auto shrink-0 flex items-center space-x-1.5"
              >
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>Ask AI Details</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FAF8FF] dark:bg-[#0A0718] border border-[#E0D4FD] dark:border-[#3B2868] space-y-1">
                <strong className="text-[#1E1035] dark:text-[#FAF8FF] block uppercase tracking-wider text-[10px]">
                  Academic Eligibility Criteria
                </strong>
                <p className="text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
                  {prog.eligibility}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8FF] dark:bg-[#0A0718] border border-[#E0D4FD] dark:border-[#3B2868] space-y-1">
                <strong className="text-[#1E1035] dark:text-[#FAF8FF] block uppercase tracking-wider text-[10px]">
                  Selection & Application Protocol
                </strong>
                <p className="text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
                  {prog.admissionProcess}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[#555375] dark:text-[#C4B5FD]">
              <div className="flex items-center space-x-2">
                <DocumentTextIcon className="w-4 h-4 text-[#6D28D9]" />
                <span className="font-bold">Official Document: {prog.gazetteSource}</span>
              </div>
              <span className="text-[11px] font-semibold text-[#6D28D9] dark:text-[#FAF8FF]">
                {prog.keyDates}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

