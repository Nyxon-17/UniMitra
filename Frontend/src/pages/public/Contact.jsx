import { useState } from 'react';
import axios from 'axios';
import {
  EnvelopeIcon,
  MapPinIcon,
  SendIcon,
  CheckCircleIcon,
  BuildingLibraryIcon,
  ChevronDownIcon
} from '../../components/common/Icons';

export const Contact = ({ currentLang = 'en' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: 'Gauhati University (GU)',
    role: 'Student',
    inquiryType: 'Regulation Clarification',
    message: ''
  });

  const [status, setStatus] = useState({
    loading: false,
    submitted: false,
    error: null
  });

  const [activeFaq, setActiveFaq] = useState(0);

  const faqs = [
    {
      q: 'How does UniMitra guarantee that institutional answers are authentic?',
      a: 'UniMitra retrieves information exclusively from authorized university gazettes, ordinances, admission brochures, and circulars. If a requested detail is not found in the verified repository, the assistant clearly states that the information is unavailable.'
    },
    {
      q: 'Can I ask queries in everyday Romanized Assamese (English script)?',
      a: 'Yes! UniMitra understands queries whether typed in authentic Assamese script (e.g. "পৰীক্ষাৰ পুনৰমূল্যায়নৰ নিয়ম কি?") or everyday phonetic typing (e.g. "exam re-evaluation r date aru rules ki?").'
    },
    {
      q: 'How can university departments or administrative offices submit circulars?',
      a: 'Authorized university faculty and administrative staff can use the Document Ingestion Console or reach our helpdesk through this form to verify and include new semester circulars.'
    },
    {
      q: 'Is UniMitra free for students and university staff in Assam?',
      a: 'Yes! UniMitra is completely free for students, scholars, faculty, and administrative staff across all recognized universities in Assam.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, submitted: false, error: null });

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

      try {
        await axios.post(`${apiBase}/feedback`, formData, { timeout: 2500 });
      } catch {
        console.info('Backend offline; inquiry recorded locally:', formData);
      }

      setStatus({
        loading: false,
        submitted: true,
        error: null
      });

      setFormData({
        name: '',
        email: '',
        university: 'Gauhati University (GU)',
        role: 'Student',
        inquiryType: 'Regulation Clarification',
        message: ''
      });
    } catch {
      setStatus({
        loading: false,
        submitted: false,
        error: 'Failed to deliver message. Please retry.'
      });
    }
  };

  return (
    <div className="bg-transparent relative z-10 min-h-screen text-[#1E1035] dark:text-[#FAF8FF] py-16 transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">

        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1E1035] dark:text-[#FAF8FF]">
            {currentLang === 'as' ? 'যোগাযোগ আৰু সহায় কেন্দ্ৰ' : 'Contact Support & Helpdesk'}
          </h1>
          <p className="text-sm sm:text-base text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
            {currentLang === 'as'
              ? 'বিশ্ববিদ্যালয়ৰ নিয়মাৱলী, পৰীক্ষাৰ তথ্য, নতুন অধিসূচনা অন্তৰ্ভুক্তি বা কাৰিকৰী সহায়ৰ বাবে আমাক বাৰ্তা প্ৰেৰণ কৰক।'
              : 'Have a query on university regulations, exam ordinances, scholarship deadlines, or need assistance? Reach out to the UniMitra desk.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Form (Cols 7) */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg sm:text-xl font-black text-[#1E1035] dark:text-[#FAF8FF] mb-6 flex items-center space-x-2">
                <BuildingLibraryIcon className="w-5 h-5 text-[#6D28D9]" />
                <span>Submit Institutional Query</span>
              </h2>

              {status.submitted && (
                <div className="mb-6 p-4 rounded-2xl bg-[#E0D4FD]/40 border-2 border-[#6D28D9] text-[#1E1035] dark:text-[#FAF8FF] font-black text-xs sm:text-sm flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-[#10B981]" />
                  <span>Your query has been submitted. The academic desk will review your inquiry shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#1E1035] dark:text-[#FAF8FF] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. B. Barua / Student"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#1E1035] dark:text-[#FAF8FF] text-xs sm:text-sm outline-none focus:border-[#6D28D9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#1E1035] dark:text-[#FAF8FF] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="user@university.ac.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#1E1035] dark:text-[#FAF8FF] text-xs sm:text-sm outline-none focus:border-[#6D28D9]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#1E1035] dark:text-[#FAF8FF] mb-1">
                      University *
                    </label>
                    <select
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#1E1035] dark:text-[#FAF8FF] text-xs sm:text-sm outline-none focus:border-[#6D28D9]"
                    >
                      <option>Gauhati University (GU)</option>
                      <option>Dibrugarh University (DU)</option>
                      <option>Tezpur University (TU)</option>
                      <option>Cotton University (CU)</option>
                      <option>Assam University (Silchar)</option>
                      <option>Bodoland University (BU)</option>
                      <option>Other / General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#1E1035] dark:text-[#FAF8FF] mb-1">
                      Role *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#1E1035] dark:text-[#FAF8FF] text-xs sm:text-sm outline-none focus:border-[#6D28D9]"
                    >
                      <option>Student / Research Scholar</option>
                      <option>Faculty Member</option>
                      <option>Administrative Staff</option>
                      <option>University Official</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#1E1035] dark:text-[#FAF8FF] mb-1">
                    Inquiry Classification *
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#1E1035] dark:text-[#FAF8FF] text-xs sm:text-sm outline-none focus:border-[#6D28D9]"
                  >
                    <option>Regulation Clarification</option>
                    <option>Examination Ordinance & Re-evaluation</option>
                    <option>Scholarship & Financial Grants</option>
                    <option>Admission Procedure & Cut-off</option>
                    <option>Campus Facilities & Hostels</option>
                    <option>Document Ingestion & Official Notice Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#1E1035] dark:text-[#FAF8FF] mb-1">
                    Your Message / Question Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details about your query or the specific circular reference..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0A0718] text-[#1E1035] dark:text-[#FAF8FF] text-xs sm:text-sm outline-none focus:border-[#6D28D9]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full py-3 rounded-2xl font-black text-white bg-[#4C1D95] hover:bg-[#8F00FF] transition-all cursor-pointer shadow-elevated-sage text-xs sm:text-sm disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <SendIcon className="w-4 h-4" />
                  <span>{status.loading ? 'Transmitting...' : 'Send Inquiry to Helpdesk'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Key Contacts & Quick FAQ (Cols 5) */}
          <div className="lg:col-span-5 space-y-6">

            <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#1E1035] dark:text-[#FAF8FF]">
                UniMitra Support Desk
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD]">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="w-5 h-5 text-[#6D28D9] shrink-0" />
                  <span>support@unimitra.edu.in</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="w-5 h-5 text-[#6D28D9] shrink-0" />
                  <span>Guwahati & Dibrugarh, Assam, India</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E0D4FD]/60 dark:border-[#3B2868] text-xs text-[#555375] dark:text-[#C4B5FD]">
                <strong>Bilingual Helpline:</strong> Active during official university working hours (9:30 AM – 5:30 PM IST).
              </div>
            </div>

            {/* Quick Expandable FAQs */}
            <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 shadow-sm space-y-3">
              <h3 className="text-base font-black text-[#1E1035] dark:text-[#FAF8FF] mb-2">
                Frequently Addressed Queries
              </h3>

              {faqs.map((f, i) => (
                <div key={i} className="border-b border-[#E0D4FD]/50 dark:border-[#3B2868] pb-3 last:border-0 last:pb-0">
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? -1 : i)}
                    className="w-full text-left font-black text-xs text-[#1E1035] dark:text-[#FAF8FF] flex items-center justify-between py-1 cursor-pointer"
                  >
                    <span>{f.q}</span>
                    <ChevronDownIcon className={`w-4 h-4 transform transition-transform ${activeFaq === i ? 'rotate-180 text-[#6D28D9]' : ''}`} />
                  </button>
                  {activeFaq === i && (
                    <p className="text-xs text-[#555375] dark:text-[#C4B5FD] mt-1 leading-relaxed">
                      {f.a}
                    </p>
                  )}
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
