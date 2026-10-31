import { useState } from 'react';
import { 
  ScaleIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  BookOpenIcon, 
  DocumentTextIcon, 
  ArrowRightIcon,
  AcademicCapIcon 
} from '../../components/common/Icons';

export const DashboardCompare = ({ onNavigateTab, currentLang = 'en' }) => {
  const [univA, setUnivA] = useState('Gauhati University (GU)');
  const [univB, setUnivB] = useState('Dibrugarh University (DU)');
  const [selectedDiscipline, setSelectedDiscipline] = useState('BCA-DBMS');
  const [selectedSemester, setSelectedSemester] = useState(3);

  const universities = [
    'Gauhati University (GU)',
    'Dibrugarh University (DU)',
    'Tezpur University (TU)',
    'Cotton University (CU)',
    'Assam University (Silchar)',
    'Bodoland University (BU)'
  ];

  const comparisonData = {
    'BCA-DBMS': {
      title: 'Database Management Systems (DBMS)',
      asTitle: 'ডাটাবেছ মেনেজমেন্ট ছিষ্টেম (DBMS)',
      overlapPercent: '88% Standardized Match',
      asOverlap: '৮৮% পাঠ্যক্ৰম সাদৃশ্য (State CBCS)',
      univAData: {
        code: 'BCA-HC-3016',
        credits: '6 Credits (4 Theory + 2 Practical)',
        examScheme: 'End-Sem: 80 Marks | Sessional: 20 Marks',
        labHours: '4 Hours/Week',
        units: [
          { name: 'Unit 1: ER Modeling & Relational Algebra', hours: '10 Hours', emphasis: 'High' },
          { name: 'Unit 2: Advanced SQL & Normalization (1NF-BCNF)', hours: '12 Hours', emphasis: 'Very High' },
          { name: 'Unit 3: Transaction Processing & Concurrency (2PL)', hours: '10 Hours', emphasis: 'High' },
          { name: 'Unit 4: File Structure, RAID & B+ Tree Indexing', hours: '8 Hours', emphasis: 'Medium' }
        ],
        textbooks: [
          'Silberschatz, Korth, Sudarshan — Database System Concepts (7th Ed.)',
          'Elmasri, Navathe — Fundamentals of Database Systems'
        ],
        docSource: 'GU_BCA_CBCS_Syllabus.pdf (Page 42)'
      },
      univBData: {
        code: 'BCA-CC-301',
        credits: '6 Credits (4 Theory + 2 Practical)',
        examScheme: 'End-Sem: 75 Marks | In-Sem: 25 Marks',
        labHours: '3 Hours/Week',
        units: [
          { name: 'Unit 1: Database Architecture & Extended ER Model', hours: '10 Hours', emphasis: 'High' },
          { name: 'Unit 2: Relational Calculus, SQL & Normal Forms', hours: '14 Hours', emphasis: 'Very High' },
          { name: 'Unit 3: ACID, Serialization & Strict 2PL Protocol', hours: '8 Hours', emphasis: 'High' },
          { name: 'Unit 4: Storage Engines, Hashing & Query Optimization', hours: '8 Hours', emphasis: 'Medium' }
        ],
        textbooks: [
          'Elmasri & Navathe — Fundamentals of Database Systems',
          'Raghu Ramakrishnan — Database Management Systems'
        ],
        docSource: 'DU_BCA_Regulation_Syllabus.pdf (Page 29)'
      }
    }
  };

  const activeCompare = comparisonData[selectedDiscipline];

  return (
    <div className="space-y-6">
      
      {/* 3D Header Section */}
      <div className="bg-white/95 dark:bg-[#120B24]/95 border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 sm:p-8 shadow-lg shadow-purple-500/10 card-3d">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black tracking-wider uppercase text-[#7C3AED] dark:text-[#FBBF24]">
              <ScaleIcon className="w-4 h-4 text-[#F59E0B]" />
              <span>Multi-University Curriculum Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E1035] dark:text-[#FAF8FF]">
              {currentLang === 'as' ? 'বিশ্ববিদ্যালয় পাঠ্যক্ৰম তুলনা' : 'Cross-University Curriculum Comparison'}
            </h1>
            <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] max-w-2xl leading-relaxed">
              {currentLang === 'as'
                ? 'অসমৰ বিভিন্ন বিশ্ববিদ্যালয়ৰ একে বিষয়ৰ পাঠ্যক্ৰম, ক্ৰেডিট, ইউনিট বিভাজন আৰু পৰীক্ষাৰ নম্বৰ পদ্ধতি একলগে তুলনা কৰক।'
                : 'Compare syllabus depth, credit weightage, module overlap, and recommended textbooks across universities side-by-side.'}
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => onNavigateTab('assistant', { prefillQuery: `Compare the 3rd Semester DBMS curriculum between ${univA} and ${univB}. Highlight credit differences and common units.` })}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-white bg-[#F59E0B] hover:bg-[#D97706] transition-all cursor-pointer shadow-md text-xs sm:text-sm"
            >
              <SparklesIcon className="w-4 h-4 text-white" />
              <span>{currentLang === 'as' ? 'AI সহায়কক তুলনা কৰিবলৈ কওক' : 'Ask AI to Contrast'}</span>
            </button>
          </div>
        </div>

        {/* Dual University Pickers */}
        <div className="mt-8 pt-6 border-t border-[#E0D4FD] dark:border-[#3B2868] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-black text-[#555375] dark:text-[#C4B5FD] uppercase tracking-wider mb-1.5">
              {currentLang === 'as' ? 'প্ৰথম বিশ্ববিদ্যালয়' : 'University A (Source)'}
            </label>
            <select
              value={univA}
              onChange={(e) => setUnivA(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-xs sm:text-sm font-bold text-[#1E1035] dark:text-[#FAF8FF] outline-none focus:border-[#7C3AED]"
            >
              {universities.map((u) => (
                <option key={u} value={u} disabled={u === univB}>{u}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-[#555375] dark:text-[#C4B5FD] uppercase tracking-wider mb-1.5">
              {currentLang === 'as' ? 'দ্বিতীয় বিশ্ববিদ্যালয়' : 'University B (Comparison)'}
            </label>
            <select
              value={univB}
              onChange={(e) => setUnivB(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-xs sm:text-sm font-bold text-[#1E1035] dark:text-[#FAF8FF] outline-none focus:border-[#7C3AED]"
            >
              {universities.map((u) => (
                <option key={u} value={u} disabled={u === univA}>{u}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-[#555375] dark:text-[#C4B5FD] uppercase tracking-wider mb-1.5">
              {currentLang === 'as' ? 'বিষয়' : 'Subject'}
            </label>
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-xs sm:text-sm font-bold text-[#1E1035] dark:text-[#FAF8FF] outline-none focus:border-[#7C3AED]"
            >
              <option value="BCA-DBMS">DBMS (BCA Sem 3)</option>
              <option value="BCA-DBMS">Operating Systems (BCA Sem 3)</option>
              <option value="BCA-DBMS">Computer Networks (BCA Sem 3)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-[#555375] dark:text-[#C4B5FD] uppercase tracking-wider mb-1.5">
              {currentLang === 'as' ? 'ষাণ্মাসিক' : 'Semester'}
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-xs sm:text-sm font-bold text-[#1E1035] dark:text-[#FAF8FF] outline-none focus:border-[#7C3AED]"
            >
              <option value={1}>Semester 1</option>
              <option value={2}>Semester 2</option>
              <option value={3}>Semester 3</option>
              <option value={4}>Semester 4</option>
              <option value={5}>Semester 5</option>
              <option value={6}>Semester 6</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alignment Summary Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#10B981]/10 border-2 border-[#10B981]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-3d">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center font-black shrink-0">
            ✓
          </div>
          <div>
            <h4 className="text-sm font-black text-[#1E1035] dark:text-[#FAF8FF]">
              {currentLang === 'as' ? activeCompare.asOverlap : activeCompare.overlapPercent}
            </h4>
            <p className="text-xs text-[#555375] dark:text-[#C4B5FD]">
              Both universities adopt the state higher education CBCS structure with shared Core Discipline papers.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('assistant', { prefillQuery: `Show me the exact syllabus overlap between ${univA} and ${univB} for ${activeCompare.title}` })}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors cursor-pointer shrink-0"
        >
          Detailed AI Analysis ➔
        </button>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* University A Column */}
        <div className="bg-white/95 dark:bg-[#120B24]/95 border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 shadow-sm card-3d space-y-6">
          <div className="pb-4 border-b border-[#E0D4FD] dark:border-[#3B2868] flex items-start justify-between">
            <div>
              <span className="text-[11px] font-black text-[#7C3AED] uppercase tracking-wider">
                {univA}
              </span>
              <h3 className="text-lg font-black text-[#1E1035] dark:text-[#FAF8FF] mt-1">
                {activeCompare.univAData.code}
              </h3>
              <p className="text-xs text-[#555375] dark:text-[#C4B5FD]">{activeCompare.title}</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#7C3AED]/15 text-[#7C3AED] dark:text-[#C4B5FD]">
              {activeCompare.univAData.credits}
            </span>
          </div>

          {/* Scheme & Hours */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#FAF8FF] dark:bg-[#0A0718] rounded-xl border border-[#E0D4FD] dark:border-[#3B2868]">
              <span className="text-[#6D28D9] dark:text-[#C4B5FD] font-bold block text-[10px]">EXAMINATION SCHEME</span>
              <span className="font-bold text-[#1E1035] dark:text-[#FAF8FF]">{activeCompare.univAData.examScheme}</span>
            </div>
            <div className="p-3 bg-[#FAF8FF] dark:bg-[#0A0718] rounded-xl border border-[#E0D4FD] dark:border-[#3B2868]">
              <span className="text-[#6D28D9] dark:text-[#C4B5FD] font-bold block text-[10px]">LAB PRACTICAL</span>
              <span className="font-bold text-[#1E1035] dark:text-[#FAF8FF]">{activeCompare.univAData.labHours}</span>
            </div>
          </div>

          {/* Units Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-[#6D28D9] dark:text-[#C4B5FD]">Prescribed Units</h4>
            <div className="space-y-2">
              {activeCompare.univAData.units.map((u, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#FAF8FF] dark:bg-[#0A0718] border border-[#E0D4FD] dark:border-[#3B2868] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1E1035] dark:text-[#FAF8FF]">{u.name}</span>
                  <span className="text-[#555375] dark:text-[#C4B5FD] text-[11px] shrink-0 ml-2">{u.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Textbooks */}
          <div className="pt-2 border-t border-[#E0D4FD] dark:border-[#3B2868] space-y-2">
            <span className="text-[11px] font-black uppercase text-[#6D28D9] dark:text-[#C4B5FD]">Prescribed Readings</span>
            <ul className="text-xs text-[#555375] dark:text-[#C4B5FD] list-disc pl-4 space-y-1">
              {activeCompare.univAData.textbooks.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>

          {/* Source Citation */}
          <div className="pt-2 text-[11px] text-[#555375] dark:text-[#C4B5FD] flex items-center space-x-1">
            <DocumentTextIcon className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Source: {activeCompare.univAData.docSource}</span>
          </div>
        </div>

        {/* University B Column */}
        <div className="bg-white/95 dark:bg-[#120B24]/95 border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 shadow-sm card-3d space-y-6">
          <div className="pb-4 border-b border-[#E0D4FD] dark:border-[#3B2868] flex items-start justify-between">
            <div>
              <span className="text-[11px] font-black text-[#10B981] uppercase tracking-wider">
                {univB}
              </span>
              <h3 className="text-lg font-black text-[#1E1035] dark:text-[#FAF8FF] mt-1">
                {activeCompare.univBData.code}
              </h3>
              <p className="text-xs text-[#555375] dark:text-[#C4B5FD]">{activeCompare.title}</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#10B981]/15 text-[#10B981]">
              {activeCompare.univBData.credits}
            </span>
          </div>

          {/* Scheme & Hours */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#FAF8FF] dark:bg-[#0A0718] rounded-xl border border-[#E0D4FD] dark:border-[#3B2868]">
              <span className="text-[#6D28D9] dark:text-[#C4B5FD] font-bold block text-[10px]">EXAMINATION SCHEME</span>
              <span className="font-bold text-[#1E1035] dark:text-[#FAF8FF]">{activeCompare.univBData.examScheme}</span>
            </div>
            <div className="p-3 bg-[#FAF8FF] dark:bg-[#0A0718] rounded-xl border border-[#E0D4FD] dark:border-[#3B2868]">
              <span className="text-[#6D28D9] dark:text-[#C4B5FD] font-bold block text-[10px]">LAB PRACTICAL</span>
              <span className="font-bold text-[#1E1035] dark:text-[#FAF8FF]">{activeCompare.univBData.labHours}</span>
            </div>
          </div>

          {/* Units Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-[#6D28D9] dark:text-[#C4B5FD]">Prescribed Units</h4>
            <div className="space-y-2">
              {activeCompare.univBData.units.map((u, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#FAF8FF] dark:bg-[#0A0718] border border-[#E0D4FD] dark:border-[#3B2868] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1E1035] dark:text-[#FAF8FF]">{u.name}</span>
                  <span className="text-[#555375] dark:text-[#C4B5FD] text-[11px] shrink-0 ml-2">{u.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Textbooks */}
          <div className="pt-2 border-t border-[#E0D4FD] dark:border-[#3B2868] space-y-2">
            <span className="text-[11px] font-black uppercase text-[#6D28D9] dark:text-[#C4B5FD]">Prescribed Readings</span>
            <ul className="text-xs text-[#555375] dark:text-[#C4B5FD] list-disc pl-4 space-y-1">
              {activeCompare.univBData.textbooks.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>

          {/* Source Citation */}
          <div className="pt-2 text-[11px] text-[#555375] dark:text-[#C4B5FD] flex items-center space-x-1">
            <DocumentTextIcon className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Source: {activeCompare.univBData.docSource}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
