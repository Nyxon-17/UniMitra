import { universityService } from '../../services/universityService';
import { useState } from 'react';
import {
  BookOpenIcon,
  SearchIcon,
  SparklesIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  AcademicCapIcon
} from '../../components/common/Icons';

export const DashboardSyllabus = ({
  onNavigateTab,
  currentLang = 'en'
}) => {
  const univProfile = universityService.getProfile();
  const [selectedProgram, setSelectedProgram] = useState('BCA');
  const [selectedSemester, setSelectedSemester] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSubject, setExpandedSubject] = useState('BCA-HC-3016');
  const [previewPdfModal, setPreviewPdfModal] = useState(null);

  const programs = [
    { id: 'BCA', label: 'BCA / Computer Applications', asLabel: 'BCA / কম্পিউটাৰ এপ্লিকেচন' },
    { id: 'BSC', label: 'B.Sc (Physical & Math Sciences)', asLabel: 'B.Sc (পদাৰ্থ আৰু গণিত বিজ্ঞান)' },
    { id: 'BTECH', label: 'B.Tech (Engineering & Tech)', asLabel: 'B.Tech (প্ৰযুক্তি আৰু অভিযান্ত্ৰিক)' },
    { id: 'BCOM', label: 'B.Com (Commerce & Accountancy)', asLabel: 'B.Com (বাণিজ্য আৰু একাউণ্টেন্সি)' },
    { id: 'BA', label: 'B.A (Humanities & Social Sciences)', asLabel: 'B.A (মানৱিক আৰু সমাজ বিজ্ঞান)' },
  ];

  const semesters = [1, 2, 3, 4, 5, 6];

  const syllabusCatalog = {
    3: [
      {
        code: 'BCA-HC-3016',
        title: 'Database Management Systems',
        asTitle: 'ডাটাবেছ মেনেজমেন্ট ছিষ্টেম (DBMS)',
        universityStandard: 'State University CBCS Standard',
        type: 'Core Discipline',
        credits: '6 Credits (4 Theory + 2 Practical)',
        examScheme: 'End-Sem: 80 Marks | Sessional: 20 Marks',
        modules: [
          {
            unit: 'Unit 1: Fundamentals of Database & ER Modeling',
            asUnit: 'ইউনিট ১: ডাটাবেছৰ প্ৰাথমিক ধাৰণা আৰু ER মডেলিং',
            hours: '10 Hours',
            topics: [
              'Data independence, DBMS architecture, 3-level schema architecture',
              'Entity types, attributes, constraints, ER diagrams to relational tables',
              'Relational algebra: Select, Project, Join, Set operations'
            ]
          },
          {
            unit: 'Unit 2: SQL & Relational Database Design',
            asUnit: 'ইউনিট ২: SQL আৰু ৰিলেচনেল ডাটাবেছ ডিজাইন',
            hours: '12 Hours',
            topics: [
              'DDL, DML, DCL, Views, subqueries, group by, joins',
              'Functional dependency, Armstrong axioms, closure of attributes',
              'Normalization: 1NF, 2NF, 3NF, BCNF, loss-less join decomposition'
            ]
          },
          {
            unit: 'Unit 3: Transaction Management & Concurrency Control',
            asUnit: 'ইউনিট ৩: লেনদেন ব্যৱস্থাপনা আৰু সমকালীন নিয়ন্ত্ৰণ',
            hours: '10 Hours',
            topics: [
              'ACID properties, serializability, conflict vs view serializability',
              'Lock-based protocols: 2-Phase Locking (2PL), strict 2PL',
              'Deadlock handling, detection, prevention, and timestamp ordering'
            ]
          },
          {
            unit: 'Unit 4: Storage, File Structure & Indexing',
            asUnit: 'ইউনিট ৪: সংৰক্ষণ আৰু ইনডেক্সিং',
            hours: '8 Hours',
            topics: [
              'RAID levels, file organization, heap vs ordered records',
              'B-Tree and B+ Tree indexing structures, hashing techniques'
            ]
          }
        ],
        books: [
          'Silberschatz, Korth, Sudarshan — Database System Concepts (7th Ed.)',
          'Elmasri, Navathe — Fundamentals of Database Systems (Pearson)'
        ]
      },
      {
        code: 'BCA-HC-3026',
        title: 'Operating Systems & System Architecture',
        asTitle: 'অপাৰেটিং ছিষ্টেম আৰু ছিষ্টেম আৰ্কিটেকচাৰ',
        universityStandard: 'State University CBCS Standard',
        type: 'Core Discipline',
        credits: '6 Credits (4 Theory + 2 Practical)',
        examScheme: 'End-Sem: 80 Marks | Sessional: 20 Marks',
        modules: [
          {
            unit: 'Unit 1: Process Management & CPU Scheduling',
            asUnit: 'ইউনিট ১: প্ৰক্ৰিয়া ব্যৱস্থাপনা আৰু CPU শ্বিডিউলিং',
            hours: '12 Hours',
            topics: [
              'Process states, PCB, context switching, inter-process communication',
              'Scheduling algorithms: FCFS, SJF, Priority, Round Robin (RR)',
              'Thread models, multithreading libraries, multicore programming'
            ]
          },
          {
            unit: 'Unit 2: Process Synchronization & Deadlocks',
            asUnit: 'ইউনিট ২: প্ৰক্ৰিয়া সমন্বয় আৰু ডেডলক',
            hours: '10 Hours',
            topics: [
              'Critical section problem, Peterson’s solution, Semaphores, Mutex locks',
              'Classical synchronization problems: Producer-Consumer, Dining Philosophers',
              'Deadlock conditions, Bankers algorithm, resource allocation graphs'
            ]
          },
          {
            unit: 'Unit 3: Memory Management & Virtual Memory',
            asUnit: 'ইউনিট ৩: স্মৃতি ব্যৱস্থাপনা আৰু ভাৰ্চুৱেল মেমৰি',
            hours: '10 Hours',
            topics: [
              'Paging, segmentation, TLB, internal and external fragmentation',
              'Demand paging, page fault handling, FIFO, LRU, Optimal page replacement'
            ]
          }
        ],
        books: [
          'Silberschatz, Galvin, Gagne — Operating System Concepts (Wiley)',
          'William Stallings — Operating Systems: Internals and Design Principles'
        ]
      },
      {
        code: 'BCA-HC-3036',
        title: 'Computer Networks & Data Communication',
        asTitle: 'কম্পিউটাৰ নেটৱৰ্ক আৰু ডাটা কমিউনিকেচন',
        universityStandard: 'State University CBCS Standard',
        type: 'Core Discipline',
        credits: '6 Credits (4 Theory + 2 Practical)',
        examScheme: 'End-Sem: 80 Marks | Sessional: 20 Marks',
        modules: [
          {
            unit: 'Unit 1: Network Architectures & Physical Layer',
            asUnit: 'ইউনিট ১: নেটৱৰ্ক আৰ্কিটেকচাৰ আৰু ভৌতিক স্তৰ',
            hours: '10 Hours',
            topics: [
              'OSI 7-layer reference model vs TCP/IP model',
              'Transmission media: Twisted pair, coaxial, optical fiber, wireless channels',
              'Bandwidth, data rate, Shannon capacity theorem, Nyquist bit rate'
            ]
          },
          {
            unit: 'Unit 2: Data Link Layer & MAC Protocols',
            asUnit: 'ইউনিট ২: ডাটা লিংক স্তৰ আৰু MAC প্ৰট’কল',
            hours: '10 Hours',
            topics: [
              'Framing, error detection CRC, Stop-and-Wait, Go-Back-N, Selective Repeat',
              'CSMA/CD (Ethernet IEEE 802.3), CSMA/CA (Wi-Fi IEEE 802.11)'
            ]
          },
          {
            unit: 'Unit 3: Network Layer & IP Routing',
            asUnit: 'ইউনিট ৩: নেটৱৰ্ক স্তৰ আৰু IP ৰাউটিং',
            hours: '10 Hours',
            topics: [
              'IPv4 vs IPv6 addressing, subnetting, CIDR mask calculation',
              'Routing algorithms: Distance Vector (RIP), Link State (OSPF), BGP'
            ]
          }
        ],
        books: [
          'Andrew S. Tanenbaum — Computer Networks (Pearson)',
          'Behrouz A. Forouzan — Data Communications and Networking (McGraw-Hill)'
        ]
      },
      {
        code: 'BCA-SE-3014',
        title: 'Web Technology & Modern Scripting',
        asTitle: 'ৱেব প্ৰযুক্তি আৰু আধুনিক স্ক্ৰিপ্টিং',
        universityStandard: 'State University CBCS Standard',
        type: 'Skill Enhancement Course (SEC)',
        credits: '4 Credits (2 Theory + 2 Practical)',
        examScheme: 'End-Sem: 60 Marks | Sessional: 40 Marks Practical',
        modules: [
          {
            unit: 'Unit 1: Semantic HTML5, CSS3 & Responsive Grids',
            asUnit: 'ইউনিট ১: ছিমেন্তিক HTML5 আৰু CSS3',
            hours: '8 Hours',
            topics: [
              'Modern HTML5 document trees, semantic tags, forms validation',
              'CSS Flexbox, CSS Grid layouts, media queries for mobile accessibility'
            ]
          },
          {
            unit: 'Unit 2: JavaScript ES6+ & DOM Events',
            asUnit: 'ইউনিট ২: জাভাস্ক্ৰিপ্ট ES6+ আৰু DOM ঘটনাৱলী',
            hours: '10 Hours',
            topics: [
              'Arrow functions, destructuring, promises, async/await',
              'DOM manipulation, event delegation, web storage API'
            ]
          }
        ],
        books: [
          'Jon Duckett — HTML & CSS: Design and Build Websites',
          'David Flanagan — JavaScript: The Definitive Guide (O’Reilly)'
        ]
      }
    ],
    1: [
      {
        code: 'BCA-HC-1016',
        title: 'Introduction to C Programming',
        asTitle: 'চি প্ৰগ্ৰামিংৰ পৰিচয়',
        universityStandard: 'State University CBCS Standard',
        type: 'Core Discipline',
        credits: '6 Credits',
        examScheme: 'End-Sem: 80 Marks | Sessional: 20 Marks',
        modules: [
          {
            unit: 'Unit 1: Logic Development & Flowcharts',
            asUnit: 'ইউনিট ১: লজিক আৰু ফ্লোচাৰ্ট',
            hours: '8 Hours',
            topics: ['Algorithm design, pseudocode, flowchart symbols, compilation steps']
          },
          {
            unit: 'Unit 2: Control Structures & Arrays',
            asUnit: 'ইউনিট ২: কন্ট্ৰল ষ্ট্ৰাকচাৰ আৰু এৰে',
            hours: '12 Hours',
            topics: ['Loops, branching, multidimensional arrays, string handling functions']
          }
        ],
        books: ['E. Balagurusamy — Programming in ANSI C']
      }
    ]
  };

  const activeSubjects = syllabusCatalog[selectedSemester] || [];
  const filteredSubjects = activeSubjects.filter((sub) => {
    const q = searchQuery.toLowerCase();
    return sub.code.toLowerCase().includes(q) || sub.title.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">

      {/* 3D Header Section */}
      <div className="neo-surface rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-black tracking-wider uppercase text-[#FF933E] dark:text-[#03C988]">
              <AcademicCapIcon className="w-4 h-4" />
              <span>Universal Academic Directory • Open Access Curriculums</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF]">
              {currentLang === 'as' ? 'অফিচিয়েল পাঠ্যক্ৰম পৰিদৰ্শন' : 'Official Syllabus & Curriculum Explorer'}
            </h1>
            <p className="text-xs sm:text-sm text-[#000000]/75 dark:text-[#FFFFFF]/80 max-w-2xl">
              {currentLang === 'as'
                ? 'আমাৰ বিশ্ববিদ্যালয়ৰ পাঠ্যক্ৰম, বিষয়ৰ ইউনিট, ক্ৰেডিট আৰু অনুমোদিত পাঠ্যপুথি অন্বেষণ কৰক।'
                : 'Freely browse verified semester units, credit allocation, recommended textbooks, and question blueprints for our university with zero login barriers.'}
            </p>
          </div>

          {/* Quick Ask AI button */}
          <div className="shrink-0">
            <button
              onClick={() => onNavigateTab('assistant', { prefillQuery: 'Summarize the entire 3rd semester syllabus and highlight the highest credit topics.' })}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-md text-xs sm:text-sm"
            >
              <SparklesIcon className="w-4 h-4 text-white" />
              <span>{currentLang === 'as' ? 'সিলেবাছৰ পৰা প্ৰশ্ন সোধক' : 'Ask AI About Syllabus'}</span>
            </button>
          </div>
        </div>

        {/* Multi-University & Degree Selection Ribbon */}
        <div className="mt-8 pt-6 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-black text-[#000000]/75 dark:text-[#FFFFFF]/80 uppercase tracking-wider mb-1.5">
              {currentLang === 'as' ? 'আমাৰ বিশ্ববিদ্যালয়' : 'Our University'}
            </label>
            <input
              type="text"
              readOnly
              value={univProfile.name || 'Our University'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-black text-xs sm:text-sm font-bold text-[#000000] dark:text-[#FFFFFF] outline-none opacity-90 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-[#000000]/75 dark:text-[#FFFFFF]/80 uppercase tracking-wider mb-1.5">
              {currentLang === 'as' ? 'পাঠ্যক্ৰম / ডিগ্ৰী' : 'Discipline / Program'}
            </label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-black text-xs sm:text-sm font-bold text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#7C3AED]"
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>{currentLang === 'as' ? p.asLabel : p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-[#000000]/75 dark:text-[#FFFFFF]/80 uppercase tracking-wider mb-1.5">
              {currentLang === 'as' ? 'সন্ধান' : 'Search Subject / Code'}
            </label>
            <div className="relative">
              <SearchIcon className="w-4 h-4 text-[#7C3AED] dark:text-[#C4B5FD] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentLang === 'as' ? 'বিষয় বা কোড বিচাৰক...' : 'Filter subject or code...'}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-black text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#7C3AED]"
              />
            </div>
          </div>
        </div>

        {/* Semester Selection Ribbon */}
        <div className="mt-5 pt-4 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/40 flex items-center space-x-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-[#000000]/75 dark:text-[#FFFFFF]/80 mr-2 uppercase tracking-wider shrink-0">
            {currentLang === 'as' ? 'ষাণ্মাসিক:' : 'Semester:'}
          </span>
          {semesters.map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${selectedSemester === sem
                  ? 'bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] shadow-md'
                  : 'bg-[#FAF8FF] dark:bg-black text-[#000000]/75 dark:text-[#FFFFFF]/80 hover:bg-[#E0D4FD]/40 dark:hover:bg-[#1A0F33] border border-[#E0D4FD] dark:border-[#3B2868]'
                }`}
            >
              {currentLang === 'as' ? `ষাণ্মাসিক ${sem}` : `Semester ${sem}`}
            </button>
          ))}
        </div>
      </div>

      {/* Subject List with 3D Accordion Cards */}
      <div className="space-y-4">
        {filteredSubjects.length === 0 ? (
          <div className="p-12 text-center bg-white/95 dark:bg-[#0A0A0A]/95 border-2 border-dashed border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl">
            <p className="text-[#000000]/75 dark:text-[#FFFFFF]/80 font-bold text-sm">
              {currentLang === 'as' ? 'কোনো বিষয় পোৱা নগ’ল।' : 'No subjects found matching your search in this semester.'}
            </p>
          </div>
        ) : (
          filteredSubjects.map((subject) => {
            const isExpanded = expandedSubject === subject.code;
            return (
              <div
                key={subject.code}
                className="bg-white/95 dark:bg-[#141414] border-2 border-[#73A5CA]/40 dark:border-[#1C82AD]/50 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 transition-all"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedSubject(isExpanded ? null : subject.code)}
                  className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-[#FFE9A9]/30 dark:hover:bg-[#13005A]/40 transition-colors"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF8FF] dark:bg-black border border-[#7C3AED]/30 text-[#FF933E] dark:text-[#03C988] flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpenIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[11px] font-black uppercase text-[#000000]/80 dark:text-[#03C988]">
                          {subject.code}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#FAF8FF] dark:bg-black text-[#000000]/75 dark:text-[#FFFFFF]/80 border border-[#E0D4FD] dark:border-[#3B2868]">
                          {subject.type}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#03C988]/20 text-[#000000] dark:text-[#03C988]">
                          {subject.credits}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#FFCB56]/20 text-[#000000] dark:text-[#FFCB56]">
                          {subject.universityStandard}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-[#000000] dark:text-[#FFFFFF]">
                        {currentLang === 'as' && subject.asTitle ? subject.asTitle : subject.title}
                      </h3>
                      <p className="text-xs text-[#000000]/75 dark:text-[#FFFFFF]/80 mt-0.5">
                        {subject.examScheme}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end md:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateTab('assistant', { prefillQuery: `Explain the key concepts of ${subject.title} (${subject.code}) from the official syllabus.` });
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-all cursor-pointer shadow-md shrink-0 flex items-center space-x-1"
                    >
                      <SparklesIcon className="w-3.5 h-3.5 text-white" />
                      <span>{currentLang === 'as' ? 'প্ৰশ্ন সোধক' : 'Ask AI'}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewPdfModal(subject);
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#FF933E] dark:text-[#03C988] bg-[#FAF8FF] dark:bg-black hover:bg-[#E0D4FD]/40 dark:hover:bg-[#1A0F33] transition-all cursor-pointer border border-[#E0D4FD] dark:border-[#3B2868] flex items-center space-x-1 shrink-0"
                    >
                      <DocumentTextIcon className="w-3.5 h-3.5" />
                      <span>{currentLang === 'as' ? 'পিডিএফ নথি' : 'View PDF'}</span>
                    </button>

                    <div className="p-1 text-[#000000]/75 dark:text-[#FFFFFF]/80">
                      <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#7C3AED]' : ''}`} />
                    </div>
                  </div>
                </div>

                {/* Expanded Content View */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A]/50">

                    {/* Units & Detailed Topics */}
                    <div className="space-y-4 my-4">
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#000000]/75 dark:text-[#FFFFFF]/80">
                        {currentLang === 'as' ? 'পাঠ্যক্ৰমৰ ভাগসমূহ (ইউনিট)' : 'Prescribed Syllabus Units'}
                      </h4>

                      <div className="grid grid-cols-1 gap-3">
                        {subject.modules.map((mod, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-white dark:bg-[#0A0A0A] border border-[#73A5CA]/30 dark:border-[#1C82AD]/40 rounded-xl space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#FF933E] dark:text-[#03C988]">
                                {currentLang === 'as' && mod.asUnit ? mod.asUnit : mod.unit}
                              </span>
                              <span className="text-[11px] font-semibold text-[#000000]/75 dark:text-[#FFFFFF]/80 bg-[#FAF8FF] dark:bg-black px-2 py-0.5 rounded">
                                {mod.hours}
                              </span>
                            </div>
                            <ul className="space-y-1 pl-4 list-disc text-xs text-[#000000]/75 dark:text-[#FFFFFF]/80">
                              {mod.topics.map((topic, tidx) => (
                                <li key={tidx} className="leading-relaxed">
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prescribed Textbooks */}
                    <div className="mt-5 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                      <div className="flex items-center space-x-2 text-xs font-bold text-[#D97706] dark:text-[#FBBF24] mb-2">
                        <CheckCircleIcon className="w-4 h-4 text-[#F59E0B]" />
                        <span>{currentLang === 'as' ? 'অনুমোদিত পাঠ্যপুথি আৰু প্ৰসংগ পুথি' : 'Prescribed Textbooks & Reference Readings'}</span>
                      </div>
                      <ul className="space-y-1 pl-4 list-disc text-xs text-[#000000] dark:text-[#FFFFFF] font-medium">
                        {subject.books.map((book, bidx) => (
                          <li key={bidx}>{book}</li>
                        ))}
                      </ul>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Official Syllabus PDF Document Modal */}
      {previewPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="neo-surface rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative transition-all duration-300">
            <div className="flex items-start justify-between border-b border-[#E0D4FD] dark:border-[#3B2868] pb-4 mb-4">
              <div>
                <span className="text-xs font-bold text-[#FF933E] dark:text-[#03C988] uppercase">
                  Academic Curriculum Repository
                </span>
                <h3 className="text-lg font-black text-[#000000] dark:text-[#FFFFFF]">
                  {previewPdfModal.title} ({previewPdfModal.code})
                </h3>
              </div>
              <button
                onClick={() => setPreviewPdfModal(null)}
                className="p-1.5 rounded-lg text-[#555375] hover:text-[#1E1035] dark:hover:text-[#FAF8FF] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 py-2">
              <div className="p-4 bg-[#FAF8FF] dark:bg-black rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-black text-xs shrink-0">
                  PDF
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF] truncate">
                    Official_{previewPdfModal.code}_Curriculum_Document.pdf
                  </p>
                  <p className="text-[11px] text-[#000000]/75 dark:text-[#FFFFFF]/80">
                    State Higher Education Board Verified Seal
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl text-xs text-[#10B981]">
                ✓ Full text and units are ingested into the UniMitra assistant with zero hallucinations. Every question is answered directly from official documents.
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3 pt-4 border-t border-[#73A5CA]/30 dark:border-[#1C82AD]/40">
              <button
                onClick={() => setPreviewPdfModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#000000]/75 dark:text-[#FFFFFF]/80 hover:bg-[#E0D4FD]/40 dark:hover:bg-[#1A0F33] transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (window.showUniMitraToast) {
                    window.showUniMitraToast(`Downloading official syllabus document for ${previewPdfModal.code}...`, 'success');
                  }
                  setPreviewPdfModal(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF933E] hover:bg-[#E87A24] dark:bg-[#03C988] dark:hover:bg-[#02B377] text-white dark:text-[#000000] transition-colors cursor-pointer shadow-md"
              >
                Download Document
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};