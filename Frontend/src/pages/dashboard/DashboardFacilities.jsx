import { useState } from 'react';
import { 
  BuildingOfficeIcon, 
  SearchIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  BuildingLibraryIcon,
  ShieldCheckIcon 
} from '../../components/common/Icons';

export const DashboardFacilities = ({ onNavigateTab, currentLang = 'en' }) => {
  const [selectedUniv, setSelectedUniv] = useState('All Universities');
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

  const facilities = [
    {
      id: 'FAC-GU-01',
      university: 'Gauhati University (GU)',
      title: 'Postgraduate & Research Scholar Hostels',
      asTitle: 'স্নাতকোত্তৰ আৰু গৱেষক ছাত্ৰাবাসসমূহ',
      category: 'Residential Hostels',
      rules: 'Allotment is conducted based on a composite score: 60% weightage on qualifying examination merit and 40% on permanent home distance from the Jalukbari campus. Mandatory local guardian verification and anti-ragging affidavit required.',
      amenities: ['Wi-Fi Enabled', 'Common Mess Facilities', '24/7 Power Backup', 'Reading Rooms'],
      timings: 'In-time: 7:30 PM (Girls Hostels) / 8:30 PM (Boys Hostels)',
      citation: 'GU_Hostel_Board_Regulations_2024.pdf (Pages 4-14)'
    },
    {
      id: 'FAC-DU-02',
      university: 'Dibrugarh University (DU)',
      title: 'Lakshminath Bezbaroa Central Library',
      asTitle: 'লক্ষ্মীনাথ বেজবৰুৱা কেন্দ্ৰীয় গ্ৰন্থাগাৰ',
      category: 'Academic Knowledge Centers',
      rules: 'Access granted to enrolled university students, research scholars, and faculty with biometric smart cards. 5 books loaned simultaneously for UG/PG; 10 books for Ph.D. scholars with 30-day renewal periods.',
      amenities: ['National Digital Library Access', 'e-ShodhSindhu Consortium', 'Air-Conditioned Reading Halls', 'Photocopy Unit'],
      timings: 'Monday - Saturday: 8:00 AM to 10:00 PM | Sunday: 10:00 AM to 5:00 PM',
      citation: 'DU_Central_Library_Rules_Manual.pdf (Pages 2-8)'
    },
    {
      id: 'FAC-TU-03',
      university: 'Tezpur University (TU)',
      title: 'Campus Health Center & Emergency Medical Care',
      asTitle: 'বিশ্ববিদ্যালয় স্বাস্থ্য কেন্দ্ৰ আৰু জৰুৰীকালীন চিকিৎসা সেৱা',
      category: 'Healthcare & Student Welfare',
      rules: 'Free general outpatient medical consultations and basic diagnostics available for all campus scholars and staff. 24x7 ambulance support for emergency transfers to Tezpur Medical College Hospital (TMCH).',
      amenities: ['24/7 Ambulance Dispatch', 'Resident Medical Officer on Duty', 'Basic Pharmacy Supplies', 'Observation Ward'],
      timings: 'OPD: 9:00 AM - 6:00 PM | Emergency: 24 Hours Active',
      citation: 'TU_Health_Center_Norms_Circular.pdf (Pages 1-4)'
    }
  ];

  const filtered = facilities.filter((f) => {
    const matchUniv = selectedUniv === 'All Universities' || f.university.includes(selectedUniv.split(' ')[0]);
    const matchSearch = !searchQuery.trim() ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.rules.toLowerCase().includes(searchQuery.toLowerCase());
    return matchUniv && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md dark:shadow-[0_0_15px_rgba(176,38,255,0.25)] card-3d">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#6D28D9] dark:text-[#FAF8FF]">
              <BuildingOfficeIcon className="w-4 h-4" />
              <span>Campus Amenities & Student Services</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#FAF8FF]">
              {currentLang === 'as' ? 'চৌহদৰ সুবিধা আৰু হোষ্টেল' : 'Campus Facilities & Services'}
            </h1>
            <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] max-w-2xl leading-relaxed">
              {currentLang === 'as'
                ? 'হোষ্টেল আসন আবণ্টনৰ নিয়ম, গ্ৰন্থাগাৰ সময়সূচী, স্বাস্থ্য কেন্দ্ৰ আৰু ছাত্ৰ কল্যাণ সেৱাৰ অধিসূচনা চাওক।'
                : 'Access verified regulations on hostel seat allocations, library timings, emergency health care, and campus amenity guidelines.'}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('assistant', { prefillQuery: 'What are the hostel allotment rules and fee structure across Gauhati and Dibrugarh University?' })}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-white bg-[#4C1D95] hover:bg-[#8F00FF] transition-all cursor-pointer shadow-xs hover:shadow-md text-xs sm:text-sm shrink-0"
          >
            <SparklesIcon className="w-4 h-4 text-[#FAF8FF]" />
            <span>{currentLang === 'as' ? 'সহায়কক সোধক' : 'Ask AI on Facilities'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-72">
          <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
            University
          </label>
          <select
            value={selectedUniv}
            onChange={(e) => setSelectedUniv(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0F172A] text-xs font-bold text-[#0F172A] dark:text-[#FAF8FF] outline-none"
          >
            {universities.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-72">
          <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
            Search Amenities
          </label>
          <div className="relative">
            <SearchIcon className="w-4 h-4 text-[#6D28D9] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Hostel, library, ambulance..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0F172A] text-xs font-bold text-[#0F172A] dark:text-[#FAF8FF] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Facilities Cards */}
      <div className="space-y-4">
        {filtered.map((fac) => (
          <div
            key={fac.id}
            className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E0D4FD]/50 dark:border-[#3B2868] pb-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#4C1D95] text-white">
                    {fac.university}
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#DDD6FE] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#FAF8FF] border border-[#E0D4FD] dark:border-[#3B2868]">
                    {fac.category}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-[#FAF8FF] pt-1">
                  {currentLang === 'as' ? fac.asTitle : fac.title}
                </h3>
              </div>

              <span className="text-xs font-bold text-[#6D28D9] dark:text-[#FAF8FF] self-start sm:self-auto">
                {fac.timings}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8FF] dark:bg-[#0F172A] border border-[#E0D4FD] dark:border-[#3B2868] space-y-2 text-xs">
              <strong className="text-[#0F172A] dark:text-[#FAF8FF] block uppercase tracking-wider text-[10px]">
                Statutory Guidelines & Access Rules
              </strong>
              <p className="text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
                {fac.rules}
              </p>
              
              <div className="pt-2 flex flex-wrap gap-2">
                {fac.amenities.map((am, a) => (
                  <span key={a} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-[#150F2C] text-[#0F172A] dark:text-[#FAF8FF] border border-[#E0D4FD] dark:border-[#3B2868]">
                    ✓ {am}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[#555375] dark:text-[#C4B5FD]">
              <div className="flex items-center space-x-2">
                <DocumentTextIcon className="w-4 h-4 text-[#6D28D9]" />
                <span className="font-bold">Citation: {fac.citation}</span>
              </div>
              <button
                onClick={() => onNavigateTab('assistant', { prefillQuery: `What are the full details and application process for ${fac.title} at ${fac.university}?` })}
                className="text-xs font-black text-[#6D28D9] dark:text-[#FAF8FF] hover:underline cursor-pointer"
              >
                Inquire with AI Assistant ➔
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

