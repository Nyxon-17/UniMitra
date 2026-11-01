import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { logger } from '../config/logger.js';

export async function runSeed() {
  logger.info('Starting UniMitra Database Seeding...');

  // 1. Seed Universities
  const universities = [
    {
      code: 'DU',
      slug: 'dibrugarh-university',
      name_en: 'Dibrugarh University',
      name_as: 'ডিব্ৰুগড় বিশ্ববিদ্যালয়',
      location: 'Dibrugarh, Assam - 786004',
      website: 'https://dibru.ac.in',
      is_default: true,
      description: 'Premier university of Upper Assam established under Dibrugarh University Act 1965.',
    },
    {
      code: 'GU',
      slug: 'gauhati-university',
      name_en: 'Gauhati University',
      name_as: 'গুৱাহাটী বিশ্ববিদ্যালয়',
      location: 'Jalukbari, Guwahati, Assam - 781014',
      website: 'https://gauhati.ac.in',
      is_default: false,
      description: 'First university in North-East India established in 1948.',
    },
    {
      code: 'TU',
      slug: 'tezpur-university',
      name_en: 'Tezpur University',
      name_as: 'তেজপুৰ বিশ্ববিদ্যালয়',
      location: 'Napaam, Tezpur, Sonitpur, Assam - 784028',
      website: 'http://www.tezu.ernet.in',
      is_default: false,
      description: 'Central University established in 1994 by an Act of Parliament.',
    },
    {
      code: 'AU',
      slug: 'assam-university',
      name_en: 'Assam University',
      name_as: 'অসম বিশ্ববিদ্যালয়',
      location: 'Silchar, Assam - 788011',
      website: 'http://www.aus.ac.in',
      is_default: false,
      description: 'Central University established in 1994 in Barak Valley.',
    },
    {
      code: 'CU',
      slug: 'cotton-university',
      name_en: 'Cotton University',
      name_as: 'কটন বিশ্ববিদ্যালয়',
      location: 'Panbazar, Guwahati, Assam - 781001',
      website: 'https://cottonuniversity.ac.in',
      is_default: false,
      description: 'Historic institution founded in 1901, upgraded to State University.',
    },
    {
      code: 'BU',
      slug: 'bodoland-university',
      name_en: 'Bodoland University',
      name_as: 'বড়োলেণ্ড বিশ্ববিদ্যালয়',
      location: 'Deborgaon, Kokrajhar, BTR, Assam - 783370',
      website: 'https://bodolanduniversity.ac.in',
      is_default: false,
      description: 'State university catering to the Bodoland Territorial Region.',
    },
  ];

  const universityMap = new Map();

  for (const u of universities) {
    const record = await prisma.university.upsert({
      where: { code: u.code },
      update: {
        name_en: u.name_en,
        name_as: u.name_as,
        location: u.location,
        website: u.website,
        is_default: u.is_default,
        description: u.description,
      },
      create: u,
    });
    universityMap.set(u.code, record.id);
  }
  logger.info(`Seeded ${universities.length} Universities.`);

  // 2. Seed Document Categories
  const categories = [
    {
      code: 'REG-ORD',
      name_en: 'Regulations & Ordinances',
      name_as: 'নিয়মাৱলী আৰু অধ্যাদেশ',
      description: 'Statutory university regulations, NEP guidelines, ordinances, and academic frameworks.',
    },
    {
      code: 'EXAM-EVAL',
      name_en: 'Examinations & Evaluation Guidelines',
      name_as: 'পৰীক্ষা আৰু মূল্যায়ন নিৰ্দেশনা',
      description: 'End semester exam rules, grading schemes, backlog policies, and re-evaluation standards.',
    },
    {
      code: 'ADM-ELIG',
      name_en: 'Admission Procedures & Eligibility Criteria',
      name_as: 'নামভৰ্তি প্ৰক্ৰিয়া আৰু যোগ্যতা',
      description: 'Programme eligibility, intake capacity, reservation policies, entrance dates, and fees.',
    },
    {
      code: 'CURR-SYLL',
      name_en: 'Curricula, Syllabus & Course Frameworks',
      name_as: 'পাঠ্যক্ৰম আৰু পাঠ্যসূচী',
      description: 'Detailed credit structures, syllabus outlines, core courses, and elective choices.',
    },
    {
      code: 'SCHOL-AID',
      name_en: 'Scholarships, Grants & Financial Aid',
      name_as: 'বৃত্তি আৰু আৰ্থিক সাহায্য',
      description: 'State merit scholarships, Ishan Uday, fee waivers, and minority fellowships.',
    },
    {
      code: 'CAMP-FACIL',
      name_en: 'Campus Facilities & Student Services',
      name_as: 'চৌহদৰ সা-সুবিধা আৰু ছাত্ৰ সেৱা',
      description: 'Central library, hostel accommodation, healthcare, transport, sports, and grievance cell.',
    },
    {
      code: 'ACAD-CAL',
      name_en: 'Academic Calendars & Timelines',
      name_as: 'শৈক্ষিক বৰ্ষপঞ্জী আৰু সময়সূচী',
      description: 'Semester dates, teaching days, examination schedules, holidays, and recess periods.',
    },
    {
      code: 'POL-PROC',
      name_en: 'Institutional Policies & Procedures',
      name_as: 'প্ৰাতিষ্ঠানিক নীতি আৰু পদ্ধতি',
      description: 'Faculty CAS promotions, anti-ragging policies, leave rules, and code of conduct.',
    },
  ];

  const categoryMap = new Map();
  for (const c of categories) {
    const record = await prisma.documentCategory.upsert({
      where: { code: c.code },
      update: {
        name_en: c.name_en,
        name_as: c.name_as,
        description: c.description,
      },
      create: c,
    });
    categoryMap.set(c.code, record.id);
  }
  logger.info(`Seeded ${categories.length} Document Categories.`);

  // 3. Seed Default Super Admin
  const adminPasswordHash = await bcrypt.hash('admin@unimitra', 10);
  const defaultAdmin = await prisma.profile.upsert({
    where: { email: 'admin@unimitra.edu.in' },
    update: {
      password_hash: adminPasswordHash,
      role: 'super_admin',
      is_active: true,
    },
    create: {
      email: 'admin@unimitra.edu.in',
      full_name: 'System Administrator',
      password_hash: adminPasswordHash,
      role: 'super_admin',
      department: 'Institutional Governance',
      designation: 'Chief Administrator',
      is_active: true,
      preferred_language: 'en',
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
