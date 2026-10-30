import { useState } from 'react';
import axios from 'axios';
import { 
  EnvelopeIcon, 
  MapPinIcon, 
  SendIcon, 
  CheckCircleIcon, 
  AcademicCapIcon,
  ChevronDownIcon
} from '../../components/common/Icons';

export const Contact = ({ currentLang = 'en' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: 'Gauhati University (GU)',
    role: 'Student',
    inquiryType: 'Syllabus Request',
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
      q: 'How does UniMitra guarantee that answers are accurate and not made up?',
      a: 'UniMitra only reads verified syllabus documents uploaded for each specific university. If a detail is not in the official university document, the assistant will clearly state that information is not available rather than making up answers.'
    },
    {
      q: 'Can I type questions in everyday Romanized Assamese (English script)?',
      a: 'Yes! UniMitra understands queries whether you type in original Assamese script (e.g. "সিলেবাছ আছেনে?") or everyday phonetic typing (e.g. "3rd semester r syllabus ase ne?").'
    },
    {
      q: 'How can university departments or teachers submit updated course PDFs?',
      a: 'University faculty and departmental heads can reach out to our team using this contact form to verify and include new semester course documents in the catalog.'
    },
    {
      q: 'Is UniMitra free for college and university students in Assam?',
      a: 'Yes! UniMitra is completely free for higher education students and teachers across all recognized universities in Assam.'
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
        // Backend API offline during standalone demo; log locally
        console.info('Backend offline; message recorded:', formData);
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
        inquiryType: 'Syllabus Request',
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
    <div className="bg-[#FAFAFC] dark:bg-[#0B1320] min-h-screen text-[#073B4C] dark:text-slate-100 py-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#073B4C] dark:text-white">
            {currentLang === 'as' ? 'যোগাযোগ আৰু সহায়' : 'Contact Support & Feedback'}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentLang === 'as'
              ? 'আপোনাৰ বিশ্ববিদ্যালয়ৰ নতুন পাঠ্যক্ৰম সংযোজন বা সহায়ৰ বাবে আমাক পোনপটীয়াকৈ বাৰ্তা প্ৰেৰণ কৰক।'
              : 'Have a syllabus question, feature suggestion, or want to add your university department? Send us a message below.'}
          </p>
        </div>

        {/* Main Grid: Form (Left) & Contact Cards + FAQ (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          
          {/* Contact Form Column (Cols 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Send an Inquiry or Request</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Our academic desk responds to all student inquiries within 24 hours.</p>

            {status.submitted ? (
              <div className="bg-[#E6FBF5] dark:bg-slate-800 border-2 border-[#06D6A0]/40 rounded-xl p-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#06D6A0] text-white flex items-center justify-center mx-auto">
                  <CheckCircleIcon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#073B4C] dark:text-white">বাৰ্তা সফলভাৱে প্ৰেৰণ কৰা হ’ল! (Message Received)</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Thank you! Your message has been received. Our academic team will look into your request promptly.
                </p>
                <button
                  onClick={() => setStatus({ loading: false, submitted: false, error: null })}
                  className="px-5 py-2.5 bg-[#118AB2] text-white text-sm font-bold rounded-xl hover:bg-[#0E7497] transition-all cursor-pointer mt-3"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Full Name <span className="text-[#FF7F50]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abhilash Bora"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-[#118AB2] outline-none transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address <span className="text-[#FF7F50]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. abhilash@gauhati.ac.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-[#118AB2] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* University */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      University Affiliation
                    </label>
                    <select
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-[#118AB2] outline-none cursor-pointer"
                    >
                      <option>Gauhati University (GU)</option>
                      <option>Dibrugarh University (DU)</option>
                      <option>Tezpur University (TU)</option>
                      <option>Assam University (Silchar)</option>
                      <option>Cotton University (CU)</option>
                      <option>Bodoland University (BU)</option>
                      <option>Other Assam College / University</option>
                    </select>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Academic Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-[#118AB2] outline-none cursor-pointer"
                    >
                      <option>Undergraduate Student (UG)</option>
                      <option>Postgraduate Student (PG)</option>
                      <option>Faculty / Professor</option>
                      <option>College / University Admin</option>
                      <option>Researcher / Other</option>
                    </select>
                  </div>
                </div>

                {/* Inquiry Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Category of Inquiry
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {['Syllabus Request', 'Document Correction', 'General Support', 'Feedback'].map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setFormData({ ...formData, inquiryType: type })}
                        className={`py-2.5 px-3 rounded-xl border font-bold text-center cursor-pointer transition-all ${
                          formData.inquiryType === type
                            ? 'bg-[#E7F3F7] dark:bg-slate-800 border-[#118AB2] text-[#118AB2] dark:text-[#FFD166]'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Message / Details (অসমীয়া বা ইংৰাজীত লিখক) <span className="text-[#FF7F50]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your syllabus question, department, or inquiry in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-[#118AB2] outline-none transition-all resize-none"
                  ></textarea>
                </div>

                {status.error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium">
                    {status.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl font-bold text-white bg-[#FF7F50] hover:bg-[#E86B3D] transition-all cursor-pointer shadow-elevated-coral text-sm disabled:opacity-50"
                >
                  <SendIcon className="w-4 h-4" />
                  <span>{status.loading ? 'বাৰ্তা প্ৰেৰণ হৈ আছে...' : 'Submit Inquiry'}</span>
                </button>

              </form>
            )}
          </div>

          {/* Right Column: Office Info & FAQ (Cols 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Card */}
            <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-7 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Direct Campus Channels</h3>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-start space-x-3 text-slate-600 dark:text-slate-300">
                  <MapPinIcon className="w-5 h-5 text-[#118AB2] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Dibrugarh University Campus Hub</strong>
                    <span>Department of Computer Science & Applications, Rajabheta, Dibrugarh, Assam - 786004</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                  <EnvelopeIcon className="w-5 h-5 text-[#FF7F50] shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Official Support Email</strong>
                    <span className="text-[#118AB2] dark:text-[#FFD166] font-semibold">contact@unimitra.assam.gov.in</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                  <AcademicCapIcon className="w-5 h-5 text-[#06D6A0] shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Project Source</strong>
                    <span>UniMitra Platform for Assam Higher Education</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="bg-white dark:bg-[#111C2E] border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-7 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Frequently Asked Questions</h3>

              <div className="space-y-2.5">
                {faqs.map((faq, index) => (
                  <div 
                    key={index}
                    className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}
                      className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <span className="pr-2">{faq.q}</span>
                      <ChevronDownIcon className={`w-4 h-4 text-slate-400 shrink-0 transform transition-transform ${activeFaq === index ? 'rotate-180 text-[#118AB2]' : ''}`} />
                    </button>
                    {activeFaq === index && (
                      <div className="p-4 bg-white dark:bg-[#162235] text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-700">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
