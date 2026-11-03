import { prisma } from '../../config/prisma.js';
import { ApiError } from '../../utils/apiError.js';
import { logger } from '../../config/logger.js';

const STATUTORY_KNOWLEDGE_BLOCKS = {
  regulations: [
    {
      id: 'REG-01',
      title: 'Statutory Regulations on Class Attendance & Medical Condonation',
      asTitle: 'শ্ৰেণী উপস্থিতি আৰু চিকিৎসা ৰেহাইৰ বিধিবদ্ধ নিয়মাৱলী',
      category: 'Attendance & Ordinances',
      ordinanceNo: 'ORD/2024/09',
      summary: 'Mandatory 75% class attendance required in each semester. Medical condonation up to 10% (permitting 65% attendance) allowed upon recommendation of the Head of the Department with genuine hospital certificates.',
      asSummary: 'প্ৰতি ষাণ্মাসিকত নূন্যতম ৭৫% শ্ৰেণী উপস্থিতি বাধ্যতামূলক। প্ৰমাণিত চিকিৎসাজনিত কাৰণত বিভাগীয় মুৰব্বীৰ অনুমোদন সাপেক্ষে ৬৫% লৈকে ১০% উপস্থিতি ৰেহাই (Condonation) প্ৰদান কৰা হয়।',
      citation: 'Statutory Regulations 2024, Section 4.3, Page 9',
    },
    {
      id: 'REG-02',
      title: 'Four-Year Undergraduate Programme (FYUGP) NEP Ordinance',
      asTitle: 'চাৰি বছৰীয়া স্নাতক পাঠ্যক্ৰম (FYUGP) ৰাষ্ট্ৰীয় শিক্ষানীতি অধিনিয়ম',
      category: 'Curriculum & Degree Framework',
      ordinanceNo: 'NEP/ORD/2023/14',
      summary: 'Governs multiple entry and exit pathways: Certificate (1 Year), Diploma (2 Years), Bachelor Degree (3 Years), and Bachelor Degree with Honours/Research (4 Years) with minimum 160 credits.',
      asSummary: 'একাধিক প্ৰৱেশ আৰু প্ৰস্থানৰ সুবিধা: ১ বছৰত চাৰ্টিফিকেট, ২ বছৰত ডিপ্লমা, ৩ বছৰত স্নাতক ডিগ্ৰী, আৰু ৪ বছৰত গৱেষণাসহ অনাৰ্ছ ডিগ্ৰী (নূন্যতম ১৬০ ক্ৰেডিট)।',
      citation: 'FYUGP NEP Ordinance 2023, Clause 6.1, Page 15',
    },
    {
      id: 'REG-03',
      title: 'Anti-Ragging and Student Code of Conduct Bylaws',
      asTitle: 'ৰেগিং বিৰোধী আৰু ছাত্ৰ আচৰণ বিধি নিৰ্দেশনাৱলী',
      category: 'Student Welfare & Discipline',
      ordinanceNo: 'SW/ANTI-RAG/2024/02',
      summary: 'Zero tolerance policy towards ragging in campus, departments, and hostels. Violations attract immediate rustication, police FIR under Assam Prohibition of Ragging Act, and permanent degree forfeiture.',
      asSummary: 'বিশ্ববিদ্যালয় চৌহদ, বিভাগ আৰু হোষ্টেলত ৰেগিং কঠোৰভাৱে নিষিদ্ধ। নিয়ম উলংঘন কৰিলে তৎকালীন নিলম্বন, আৰক্ষীৰ এজাহাৰ আৰু স্থায়ী বহিষ্কাৰ কৰা হ’ব।',
      citation: 'Anti-Ragging Statutory Guidelines 2024, Clause 3, Page 5',
    },
  ],
  examinations: [
    {
      id: 'EXAM-01',
      title: 'Undergraduate Semester Minimum Passing Criteria & Credit Norms',
      asTitle: 'স্নাতক ষাণ্মাসিক পৰীক্ষাৰ নূন্যতম উত্তীৰ্ণ নম্বৰ আৰু নিয়ম',
      category: 'Passing Criteria',
      rules: 'Candidates must secure a minimum of 40% marks separately in both Continuous Assessment (In-Semester) and End-Semester Theory/Practical examinations.',
      asRules: 'পৰীক্ষাৰ্থীয়ে অন্তৰ্ৱৰ্তী মূল্যায়ন (In-Semester) আৰু অন্তিম ষাণ্মাসিক পৰীক্ষা (End-Semester) দুয়োটাতে সুকীয়াকৈ নূন্যতম ৪০% নম্বৰ লাভ কৰিব লাগিব।',
      citation: 'Examination Ordinances, Clause 8.2, Page 14',
    },
    {
      id: 'EXAM-02',
      title: 'Answer Script Re-Evaluation & Scrutiny Procedure',
      asTitle: 'উত্তৰবহী পুনৰীক্ষণ (Re-evaluation) আৰু মাচুল নিৰ্দেশনা',
      category: 'Re-evaluation',
      rules: 'Students can apply for re-evaluation within 20 days of declaration of results upon paying the statutory fee of INR 350 per course paper. Maximum 3 papers per semester.',
      asRules: 'ফলাফল ঘোষণাৰ ২০ দিনৰ ভিতৰত প্ৰতিখন পত্ৰত ৩৫০ টকা মাচুল পৰিশোধ কৰি সৰ্বাধিক ৩ খন পত্ৰ পুনৰীক্ষণৰ বাবে আবেদন কৰিব পাৰি।',
      citation: 'Examination Evaluation Bylaws, Section 12, Page 22',
    },
  ],
  scholarships: [
    {
      id: 'SCHOL-01',
      name: 'Ishan Uday Special Scholarship for North Eastern Region (NER)',
      asName: 'উত্তৰ-পূৰ্বাঞ্চলৰ বাবে ঈশান উদয় বিশেষ ছাত্ৰবৃত্তি',
      agency: 'University Grants Commission (UGC)',
      amount: 'INR 5,400 to 7,800 per month for complete programme duration',
      asAmount: 'মাহে ৫,৪০০ ৰ পৰা ৭,৮০০ টকা (সম্পূৰ্ণ পাঠ্যক্ৰমৰ বাবে)',
      eligibility: 'General Degree / Professional Degree students of NER domicile whose parental annual income does not exceed INR 4.5 Lakhs.',
      asEligibility: 'উত্তৰ-পূৰ্বাঞ্চলৰ বাসিন্দা আৰু বাৰ্ষিক পাৰিবাৰিক আয় ৪.৫ লাখ টকাৰ কম হোৱা স্নাতক প্ৰথম বৰ্ষৰ শিক্ষাৰ্থী।',
      citation: 'UGC Ishan Uday Guidelines 2024, Clause 3, Page 4',
    },
    {
      id: 'SCHOL-02',
      name: 'Assam State Combined Merit Scholarship (DHE)',
      asName: 'অসম চৰকাৰৰ উচ্চ শিক্ষা সঞ্চালকালয় (DHE) মেধা ছাত্ৰবৃত্তি',
      agency: 'Directorate of Higher Education, Assam',
      amount: 'INR 1,000 per month (UG) / INR 1,200 per month (PG)',
      asAmount: 'মাহে ১,০০০ টকা (স্নাতক) / ১,২০০ টকা (স্নাতকোত্তৰ)',
      eligibility: 'Permanent residents of Assam securing 60% or above marks in previous qualifying board or degree examination.',
      asEligibility: 'পূৰ্বৱৰ্তী পৰীক্ষাত নূন্যতম ৬০% নম্বৰ লাভ কৰা অসমৰ স্থায়ী ছাত্ৰ-ছাত্ৰী।',
      citation: 'DHE Assam Merit Scholarship Notification, Page 2',
    },
  ],
  facilities: [
    {
      id: 'FACIL-01',
      name: 'Central Library & Digital Knowledge Consortium',
      asName: 'কেন্দ্ৰীয় গ্ৰন্থাগাৰ আৰু ডিজিটেল সমল কেন্দ্ৰ',
      timings: '08:30 AM to 08:30 PM (Reading Room open 24x7 during exams)',
      collection: '250,000+ Print Volumes, 15,000+ E-Journals, Shodhganga ETD repository access',
      asTimings: 'পুৱা ৮:৩০ বজাৰ পৰা নিশা ৮:৩০ বজালৈ (পৰীক্ষাৰ সময়ত ২৪ ঘণ্টা খোলা)',
    },
    {
      id: 'FACIL-02',
      name: 'University Student Hostels & Residential Accommodations',
      asName: 'ছাত্ৰ-ছাত্ৰীৰ আৱাসিক হোষ্টেল সুবিধা',
      criteria: 'Allotment is strictly merit-cum-distance based (permanent home address must be located > 35 km away from university campus).',
      asCriteria: 'মেধা আৰু দূৰত্বৰ ভিত্তিত আৱণ্টন (ঘৰ বিশ্ববিদ্যালয়ৰ চৌহদৰ পৰা ৩৫ কিলোমিটাৰতকৈ অধিক দূৰত হ’ব লাগিব)।',
    },
  ],
};

const DEFAULT_UNIVERSITIES = [
  {
    id: 'UNIV-DU',
    code: 'DU',
    name: 'Nivoraya University',
    asName: 'নিভৰয়া বিশ্ববিদ্যালয়',
    abbreviation: 'DU',
    location: 'Dibrugarh, Assam - 786004',
    website: 'https://nivoraya.ac.in',
    isDefault: true,
    description: 'Premier university of Upper Assam established under Nivoraya University Act 1965.',
    documentsCount: 14,
    noticesCount: 8,
  },
  {
    id: 'UNIV-GU',
    code: 'GU',
    name: 'Gauhati University',
    asName: 'গুৱাহাটী বিশ্ববিদ্যালয়',
    abbreviation: 'GU',
    location: 'Jalukbari, Guwahati, Assam - 781014',
    website: 'https://gauhati.ac.in',
    isDefault: false,
    description: 'First university in North-East India established in 1948.',
    documentsCount: 12,
    noticesCount: 6,
  },
  {
    id: 'UNIV-TU',
    code: 'TU',
    name: 'Tezpur University',
    asName: 'তেজপুৰ বিশ্ববিদ্যালয়',
    abbreviation: 'TU',
    location: 'Napaam, Tezpur, Sonitpur, Assam - 784028',
    website: 'http://www.tezu.ernet.in',
    isDefault: false,
    description: 'Central University established in 1994 by an Act of Parliament.',
    documentsCount: 9,
    noticesCount: 4,
  },
  {
    id: 'UNIV-AU',
    code: 'AU',
    name: 'Assam University',
    asName: 'অসম বিশ্ববিদ্যালয়',
    abbreviation: 'AU',
    location: 'Silchar, Assam - 788011',
    website: 'http://www.aus.ac.in',
    isDefault: false,
    description: 'Central University established in 1994 in Barak Valley.',
    documentsCount: 7,
    noticesCount: 3,
  },
  {
    id: 'UNIV-CU',
    code: 'CU',
    name: 'Cotton University',
    asName: 'কটন বিশ্ববিদ্যালয়',
    abbreviation: 'CU',
    location: 'Panbazar, Guwahati, Assam - 781001',
    website: 'https://cottonuniversity.ac.in',
    isDefault: false,
    description: 'Historic institution founded in 1901, upgraded to State University.',
    documentsCount: 8,
    noticesCount: 5,
  },
  {
    id: 'UNIV-BU',
    code: 'BU',
    name: 'Bodoland University',
    asName: 'বড়োলেণ্ড বিশ্ববিদ্যালয়',
    abbreviation: 'BU',
    location: 'Deborgaon, Kokrajhar, BTR, Assam - 783370',
    website: 'https://bodolanduniversity.ac.in',
    isDefault: false,
    description: 'State university catering to the Bodoland Territorial Region.',
    documentsCount: 6,
    noticesCount: 2,
  },
];

/**
 * 1. Get All Universities
 */
export const getAllUniversities = async () => {
  try {
    const universities = await prisma.university.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            documents: true,
            notices: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    if (universities.length > 0) {
      return universities.map((u) => ({
        id: u.id,
        code: u.code,
        name: u.name,
        asName: u.asName || u.name,
        abbreviation: u.abbreviation,
        location: u.location,
        website: u.website,
        isDefault: u.code === 'DU',
        description: u.campusType || 'Recognized Higher Educational Institution',
        documentsCount: u._count.documents,
        noticesCount: u._count.notices,
      }));
    }
    return DEFAULT_UNIVERSITIES;
  } catch (err) {
    logger.warn({ err: err.message }, 'Database notice in getAllUniversities; returning defaults');
    return DEFAULT_UNIVERSITIES;
  }
};

/**
 * 2. Get Single University with Full Knowledge Sections
 */
export const getUniversityByCode = async (code) => {
  const university = await prisma.university.findFirst({
    where: {
      OR: [
        { code: { equals: code, mode: 'insensitive' } },
        { abbreviation: { equals: code, mode: 'insensitive' } },
      ],
    },
    include: {
      documents: {
        where: {
          status: 'Indexed',
          approvalStatus: 'approved',
          availableToChatbot: true,
        },
        include: { category: true },
        take: 10,
      },
      notices: {
        where: { isActive: true },
        take: 10,
        orderBy: { publishedAt: 'desc' },
      },
    },
  });

  if (!university) {
    const foundDefault = DEFAULT_UNIVERSITIES.find(u => u.code.toLowerCase() === code.toLowerCase());
    if (foundDefault) {
      return {
        profile: foundDefault,
        regulations: STATUTORY_KNOWLEDGE_BLOCKS.regulations,
        examinations: STATUTORY_KNOWLEDGE_BLOCKS.examinations,
        scholarships: STATUTORY_KNOWLEDGE_BLOCKS.scholarships,
        facilities: STATUTORY_KNOWLEDGE_BLOCKS.facilities,
        indexedDocuments: [],
        recentNotices: [],
      };
    }
    throw ApiError.notFound(`University with code '${code}' not found.`);
  }

  return {
    profile: {
      id: university.id,
      code: university.code,
      name: university.name,
      asName: university.asName,
      abbreviation: university.abbreviation,
      location: university.location,
      website: university.website,
      isDefault: university.code === 'DU',
      chancellor: university.chancellor || 'Hon’ble Governor of Assam',
      campusType: university.campusType || 'Recognized State/Central University',
    },
    regulations: STATUTORY_KNOWLEDGE_BLOCKS.regulations,
    examinations: STATUTORY_KNOWLEDGE_BLOCKS.examinations,
    scholarships: STATUTORY_KNOWLEDGE_BLOCKS.scholarships,
    facilities: STATUTORY_KNOWLEDGE_BLOCKS.facilities,
    indexedDocuments: university.documents.map((d) => ({
      id: d.customId || d.id,
      title: d.title,
      asTitle: d.asTitle,
      category: d.category?.name || 'General',
      citation: d.citation,
    })),
    recentNotices: university.notices.map((n) => ({
      id: n.id,
      title: n.title,
      asTitle: n.asTitle,
      date: n.publishedAt,
    })),
  };
};

/**
 * 3. Compare Two Universities Side-by-Side
 */
export const compareUniversities = async (codeA, codeB) => {
  const [univA, univB] = await Promise.all([
    getUniversityByCode(codeA),
    getUniversityByCode(codeB),
  ]);

  return {
    universityA: univA,
    universityB: univB,
    comparison: {
      attendancePassingCriteria: {
        parameter: 'Attendance & Passing Threshold',
        uniA: '75% attendance with up to 10% medical condonation; 40% separate internal & end-sem passing',
        uniB: '75% attendance mandatory; 40% passing standard under NEP FYUGP framework',
      },
      degreeFramework: {
        parameter: 'Undergraduate Degree Framework',
        uniA: 'NEP 2020 FYUGP (Certificate 1-yr, Diploma 2-yr, Degree 3-yr, Honours/Research 4-yr)',
        uniB: 'NEP 2020 FYUGP with multiple entry & exit pathways and Academic Bank of Credits (ABC)',
      },
      hostelEligibility: {
        parameter: 'Hostel Distance & Allocation Rules',
        uniA: 'Strictly merit-cum-distance (> 35 km away from main campus required)',
        uniB: 'Merit-based hostel allotment with priority reservation for remote areas (> 40 km)',
      },
    },
  };
};
