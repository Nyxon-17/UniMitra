import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { logger } from '../config/logger.js';

export async function runSeed() {
  logger.info('Starting UniMitra Database Seeding...');

  // 1. Seed Universities
  const universities = [
    {
      code: 'DU',
      abbreviation: 'DU',
      name: 'Dibrugarh University',
      asName: 'ডিব্ৰুগড় বিশ্ববিদ্যালয়',
      location: 'Dibrugarh, Assam - 786004',
      website: 'https://dibru.ac.in',
      campusType: 'State University (UGC Recognized, NAAC A Grade)',
      asCampusType: 'ৰাজ্যিক বিশ্ববিদ্যালয় (UGC স্বীকৃত, NAAC A মানপ্ৰাপ্ত)',
      chancellor: 'Hon’ble Governor of Assam',
      viceChancellor: 'Prof. Jiten Hazarika',
      registrar: 'Dr. Paramananda Sonowal',
      email: 'registrar@dibru.ac.in',
      helpline: '+91-373-2370000',
      isActive: true,
    },
    {
      code: 'GU',
      abbreviation: 'GU',
      name: 'Gauhati University',
      asName: 'গুৱাহাটী বিশ্ববিদ্যালয়',
      location: 'Jalukbari, Guwahati, Assam - 781014',
      website: 'https://gauhati.ac.in',
      campusType: 'State University (First university in North-East India)',
      asCampusType: 'উত্তৰ-পূৰ্বাঞ্চলৰ প্ৰথমখন বিশ্ববিদ্যালয়',
      chancellor: 'Hon’ble Governor of Assam',
      email: 'registrar@gauhati.ac.in',
      isActive: true,
    },
    {
      code: 'TU',
      abbreviation: 'TU',
      name: 'Tezpur University',
      asName: 'তেজপুৰ বিশ্ববিদ্যালয়',
      location: 'Napaam, Tezpur, Sonitpur, Assam - 784028',
      website: 'http://www.tezu.ernet.in',
      campusType: 'Central University (NAAC A+ Grade)',
      asCampusType: 'কেন্দ্ৰীয় বিশ্ববিদ্যালয়',
      chancellor: 'Hon’ble President of India',
      email: 'registrar@tezu.ernet.in',
      isActive: true,
    },
    {
      code: 'AU',
      abbreviation: 'AU',
      name: 'Assam University',
      asName: 'অসম বিশ্ববিদ্যালয়',
      location: 'Silchar, Assam - 788011',
      website: 'http://www.aus.ac.in',
      campusType: 'Central University',
      asCampusType: 'কেন্দ্ৰীয় বিশ্ববিদ্যালয়',
      chancellor: 'Hon’ble President of India',
      email: 'registrar@aus.ac.in',
      isActive: true,
    },
    {
      code: 'CU',
      abbreviation: 'CU',
      name: 'Cotton University',
      asName: 'কটন বিশ্ববিদ্যালয়',
      location: 'Panbazar, Guwahati, Assam - 781001',
      website: 'https://cottonuniversity.ac.in',
      campusType: 'State University (Founded 1901)',
      asCampusType: 'ৰাজ্যিক বিশ্ববিদ্যালয়',
      chancellor: 'Hon’ble Governor of Assam',
      email: 'registrar@cottonuniversity.ac.in',
      isActive: true,
    },
    {
      code: 'BU',
      abbreviation: 'BU',
      name: 'Bodoland University',
      asName: 'বড়োলেণ্ড বিশ্ববিদ্যালয়',
      location: 'Deborgaon, Kokrajhar, BTR, Assam - 783370',
      website: 'https://bodolanduniversity.ac.in',
      campusType: 'State University',
      asCampusType: 'ৰাজ্যিক বিশ্ববিদ্যালয়',
      chancellor: 'Hon’ble Governor of Assam',
      email: 'registrar@bodolanduniversity.ac.in',
      isActive: true,
    },
  ];

  for (const u of universities) {
    await prisma.university.upsert({
      where: { code: u.code },
      update: {
        name: u.name,
        asName: u.asName,
        abbreviation: u.abbreviation,
        location: u.location,
        website: u.website,
        campusType: u.campusType,
        asCampusType: u.asCampusType,
        chancellor: u.chancellor,
        email: u.email,
        isActive: u.isActive,
      },
      create: u,
    });
  }
  logger.info(`Seeded ${universities.length} Universities.`);

  // 2. Seed Document Categories
  const categories = [
    {
      code: 'REG-ORD',
      name: 'University Regulations & Ordinances',
      asName: 'বিশ্ববিদ্যালয়ৰ অধিনিয়ম আৰু বিধি',
      description: 'Statutory university regulations, NEP guidelines, ordinances, and academic frameworks.',
    },
    {
      code: 'EXAM-EVAL',
      name: 'Examination & Evaluation Codes',
      asName: 'পৰীক্ষা আৰু মূল্যায়ন নীতিমালা',
      description: 'End semester exam rules, grading schemes, backlog policies, and re-evaluation standards.',
    },
    {
      code: 'SYLL-CURR',
      name: 'Syllabus & Curriculum Frameworks',
      asName: 'পাঠ্যক্ৰম আৰু শৈক্ষিক ৰূপৰেখা',
      description: 'Detailed credit structures, syllabus outlines, core courses, and elective choices.',
    },
    {
      code: 'FAC-CAS',
      name: 'CAS Promotion & Faculty API Norms',
      asName: 'অধ্যাপক পদোন্নতি আৰু চি.এ.এছ. বিধি',
      description: 'Career Advancement Scheme guidelines, PBAS methodology, and API scoring norms.',
    },
    {
      code: 'RES-PHD',
      name: 'Research & Doctoral Supervision',
      asName: 'গৱেষণা আৰু পিএইচ.ডি. নিৰ্দেশনা',
      description: 'PhD scholar supervision quotas, course work credits, and defense procedures.',
    },
    {
      code: 'SCHOL-AID',
      name: 'Scholarships & Financial Aid',
      asName: 'ছাত্ৰবৃত্তি আৰু আৰ্থিক অনুদান',
      description: 'State merit scholarships, Ishan Uday, fee waivers, and minority fellowships.',
    },
    {
      code: 'ADM-CRIT',
      name: 'Admissions & Eligibility Criteria',
      asName: 'ভৰ্তি প্ৰক্ৰিয়া আৰু যোগ্যতা',
      description: 'Programme eligibility, intake capacity, reservation policies, entrance dates, and fees.',
    },
    {
      code: 'CAMP-HOST',
      name: 'Campus Facilities & Hostel Bylaws',
      asName: 'চৌহদ সুবিধা আৰু হোষ্টেল বিধি',
      description: 'Central library, hostel accommodation rules, healthcare, and sports facilities.',
    },
  ];

  for (const c of categories) {
    await prisma.documentCategory.upsert({
      where: { code: c.code },
      update: {
        name: c.name,
        asName: c.asName,
        description: c.description,
      },
      create: c,
    });
  }
  logger.info(`Seeded ${categories.length} Document Categories.`);

  // 3. Seed Default Super Admin
  const adminPasswordHash = await bcrypt.hash('admin@unimitra', 10);
  const defaultAdmin = await prisma.profile.upsert({
    where: { email: 'admin@unimitra.edu.in' },
    update: {
      passwordHash: adminPasswordHash,
      role: 'super_admin',
      isActive: true,
    },
    create: {
      email: 'admin@unimitra.edu.in',
      fullName: 'System Administrator',
      passwordHash: adminPasswordHash,
      role: 'super_admin',
      department: 'Institutional Governance',
      designation: 'Chief Administrator',
      isActive: true,
      preferredLang: 'en',
    },
  });
  logger.info(`Seeded Super Admin: ${defaultAdmin.email}`);

  // 4. Seed Default System Settings
  const settings = [
    { key: 'ALLOW_PUBLIC_CHAT', value: 'true', description: 'Enable public guests to ask basic questions.' },
    { key: 'MAX_DOCUMENT_SIZE_MB', value: '50', description: 'Maximum file size per uploaded PDF document.' },
    { key: 'AI_TEMPERATURE', value: '0.2', description: 'Gemini model temperature for grounded academic answers.' },
    { key: 'DEFAULT_LANGUAGE', value: 'en', description: 'Default system fallback language.' },
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: s,
    });
  }
  logger.info(`Seeded ${settings.length} System Settings.`);

  logger.info('Database seeding completed successfully.');
}

// Allow direct CLI execution: node src/scripts/seed.js
if (process.argv[1]?.includes('seed.js')) {
  runSeed()
    .catch((err) => {
      logger.error({ err }, 'Error during database seed execution');
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
