import { useState } from 'react';
import { 
  BanknotesIcon, 
  SearchIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon 
} from '../../components/common/Icons';

export const DashboardScholarships = ({ onNavigateTab, currentLang = 'en' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'State Government (DHE)', 'Central UGC / NER', 'Reserved Category', 'Gender & Merit'];

  const scholarships = [
    {
      id: 'SCH-DHE-01',
      title: 'Combined Merit Scholarship (Degree & PG Levels)',
      asTitle: 'উচ্চ শিক্ষা সঞ্চালকালয়ৰ সংযুক্ত মেধা ছাত্ৰবৃত্তি',
      authority: 'Directorate of Higher Education (DHE), Assam',
      category: 'State Government (DHE)',
      amount: 'INR 1,000 / month (Degree) | INR 1,200 / month (PG)',
      deadline: '30 November 2024',
      incomeCeiling: 'No ceiling for merit quota; minimum 60% in qualifying exam',
      eligibility: 'Must be a permanent resident of Assam studying regular full-time courses in recognized universities or affiliated colleges in Assam. Minimum 60% in 10+2 / B.A/B.Sc/B.Com.',
      documents: [
        'Permanent Resident Certificate (PRC) of Assam',
        'Mark sheet of qualifying examination',
        'Head of Institution Certificate & Admission Receipt',
        'Aadhaar seeded bank account passbook copy'
      ],
      citation: 'Assam_DHE_Scholarship_Notice_2024.pdf (Pages 2-5)'
    },
    {
      id: 'SCH-UGC-02',
      title: 'Ishan Uday Special Scholarship Scheme for NER',
      asTitle: 'উত্তৰ-পূৰ্বাঞ্চলৰ ছাত্ৰ-ছাত্ৰীৰ বাবে ঈশান উদয় বিশেষ ছাত্ৰবৃত্তি',
      authority: 'University Grants Commission (UGC) / Ministry of Education',
      category: 'Central UGC / NER',
      amount: 'INR 5,400 / month (General) | INR 7,800 / month (Technical)',
      deadline: '31 December 2024',
      incomeCeiling: 'Family income must not exceed INR 4.50 Lakhs per annum',
      eligibility: 'Open to permanent residents of North Eastern States admitted to 1st year of general degree, technical, or professional degree courses. 10,000 fresh slots awarded annually.',
      documents: [
        'Domicile / PRC certificate issued by competent authority',
        'Annual family income certificate issued by Circle Officer / DC',
        '10+2 mark sheet and course admission proof',
        'National Scholarship Portal (NSP) biometric verification'
      ],
      citation: 'UGC_Ishan_Uday_Guidelines_Gazette.pdf (Pages 4-12)'
    },
    {
      id: 'SCH-GOV-03',
      title: 'Post-Matric Scholarship for SC / ST / OBC / MOBC Scholars',
      asTitle: 'অনুসূচীত জাতি/জনজাতি আৰু অন্যান্য অনগ্ৰসৰ শ্ৰেণীৰ প’ষ্ট-মেট্ৰিক ছাত্ৰবৃত্তি',
      authority: 'Department of Social Justice & Empowerment, Govt of Assam',
      category: 'Reserved Category',
      amount: 'Full Course Tuition Reimbursement + Monthly Maintenance Allowance',
      deadline: '15 November 2024',
      incomeCeiling: 'INR 2.50 Lakhs per annum (SC/ST) | INR 1.50 Lakhs (OBC/MOBC)',
      eligibility: 'Enrolled in post-matriculation or post-secondary degree programs. Valid caste certificate issued by Assam competent authority required.',
      documents: [
        'Caste Certificate verified through Mission Basundhara',
        'Income certificate and self-declaration',
        'Tuition fee receipts and hostel fee proof',
        'Institution verification on OASIS / NSP portal'
      ],
      citation: 'Assam_PostMatric_Scholarship_Gazette_2024.pdf (Pages 8-16)'
    }
  ];

  const filtered = scholarships.filter((s) => {
    const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchSearch = !searchQuery.trim() ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 sm:p-8 shadow-elevated-sage dark:shadow-elevated-gold card-3d">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#84A282] dark:text-[#FFF2B4]">
              <BanknotesIcon className="w-4 h-4" />
              <span>Institutional & State Financial Aid Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#15370D] dark:text-[#FFF2B4]">
              {currentLang === 'as' ? 'ছাত্ৰবৃত্তি আৰু আৰ্থিক অনুদান' : 'Scholarships & Financial Grants'}
            </h1>
            <p className="text-xs sm:text-sm text-[#4F6D4B] dark:text-[#E5CD82] max-w-2xl leading-relaxed">
              {currentLang === 'as'
                ? 'অসম চৰকাৰৰ উচ্চ শিক্ষা সঞ্চালকালয়, UGC ঈশান উদয় আৰু সংৰক্ষিত শ্ৰেণীৰ ছাত্ৰবৃত্তিৰ চৰ্ত, বাৰ্ষিক আয় আৰু আবেদনৰ নিয়ম চাওক।'
                : 'Access verified state and central scholarship circulars, family income ceilings, document checklists, and application guidelines.'}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('assistant', { prefillQuery: 'What are the required documents and income limits for Ishan Uday and DHE combined merit scholarships?' })}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-white bg-[#84A282] hover:bg-[#6F8E6D] transition-all cursor-pointer shadow-elevated-sage text-xs sm:text-sm shrink-0"
          >
            <SparklesIcon className="w-4 h-4 text-[#FFF2B4]" />
            <span>{currentLang === 'as' ? 'সহায়কক সোধক' : 'Check Eligibility with AI'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#84A282] text-white shadow-xs'
                    : 'bg-[#FEFAF3] dark:bg-[#15370D] text-[#15370D] dark:text-[#FFF2B4] border border-[#B8CFB3] dark:border-[#728E6D] hover:bg-[#B8CFB3]/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <SearchIcon className="w-4 h-4 text-[#84A282] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search scheme name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#B8CFB3] dark:border-[#728E6D] bg-[#FEFAF3] dark:bg-[#15370D] text-xs font-bold text-[#15370D] dark:text-[#FFF2B4] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Scholarship Cards */}
      <div className="space-y-4">
        {filtered.map((sch) => (
          <div
            key={sch.id}
            className="bg-white dark:bg-[#1C4412] border-2 border-[#B8CFB3] dark:border-[#728E6D] rounded-3xl p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#B8CFB3]/50 dark:border-[#728E6D] pb-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#84A282] text-white">
                    {sch.category}
                  </span>
                  <span className="text-xs font-black text-[#84A282] dark:text-[#FFF2B4]">
                    Deadline: {sch.deadline}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#15370D] dark:text-[#FFF2B4] pt-1">
                  {currentLang === 'as' ? sch.asTitle : sch.title}
                </h3>
                <p className="text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
                  Issuing Authority: {sch.authority}
                </p>
              </div>

              <div className="bg-[#F6E2E9] dark:bg-[#15370D] px-3.5 py-2 rounded-2xl border border-[#B8CFB3] dark:border-[#728E6D] text-center self-start sm:self-auto shrink-0">
                <span className="text-[10px] font-black uppercase block text-[#4F6D4B] dark:text-[#E5CD82]">Benefit Value</span>
                <span className="text-xs font-black text-[#15370D] dark:text-[#FFF2B4]">{sch.amount}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FEFAF3] dark:bg-[#15370D] border border-[#B8CFB3] dark:border-[#728E6D] space-y-1.5">
                <strong className="text-[#15370D] dark:text-[#FFF2B4] block uppercase tracking-wider text-[10px]">
                  Eligibility & Income Ceiling
                </strong>
                <p className="text-[#4F6D4B] dark:text-[#E5CD82] leading-relaxed">
                  {sch.eligibility}
                </p>
                <div className="text-[11px] font-black text-[#84A282] dark:text-[#FFF2B4] pt-1">
                  Income Limit: {sch.incomeCeiling}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FEFAF3] dark:bg-[#15370D] border border-[#B8CFB3] dark:border-[#728E6D] space-y-1.5">
                <strong className="text-[#15370D] dark:text-[#FFF2B4] block uppercase tracking-wider text-[10px]">
                  Mandatory Document Checklist
                </strong>
                <ul className="space-y-1 text-[#4F6D4B] dark:text-[#E5CD82]">
                  {sch.documents.map((doc, d) => (
                    <li key={d} className="flex items-center space-x-1.5">
                      <CheckCircleIcon className="w-3.5 h-3.5 text-[#84A282] shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[#4F6D4B] dark:text-[#E5CD82]">
              <div className="flex items-center space-x-2">
                <DocumentTextIcon className="w-4 h-4 text-[#84A282]" />
                <span className="font-bold">Official Circular: {sch.citation}</span>
              </div>
              <button
                onClick={() => onNavigateTab('assistant', { prefillQuery: `Guide me on the step-by-step application procedure for ${sch.title}.` })}
                className="text-xs font-black text-[#84A282] dark:text-[#FFF2B4] hover:underline cursor-pointer"
              >
                Ask Assistant Application Steps ➔
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

