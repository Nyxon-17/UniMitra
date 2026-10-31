import { useState, useEffect } from 'react';
import { 
  BuildingLibraryIcon, 
  CheckCircleIcon, 
  SparklesIcon, 
  ShieldCheckIcon,
  ClockIcon
} from '../../components/common/Icons';

export const DashboardFeedback = ({ currentLang = 'en', studentInfo }) => {
  const [feedbackType, setFeedbackType] = useState('Accuracy & Citations');
  const [university, setUniversity] = useState('Gauhati University (GU)');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [submittedAlert, setSubmittedAlert] = useState(false);

  // Initial feedback submissions demo list
  const initialSubmissions = [
    {
      id: 'FB-901',
      type: 'Outdated Regulation',
      university: 'Dibrugarh University (DU)',
      rating: 4,
      comments: 'The syllabus reference for 3rd semester CBCS was accurate, but please update the 2024 revised attendance condonation circular.',
      submittedAt: 'Yesterday',
      status: 'Reviewed & Resolved'
    },
    {
      id: 'FB-902',
      type: 'Assamese Translation',
      university: 'Gauhati University (GU)',
      rating: 5,
      comments: 'Assamese query understanding was fast and exact for the DHE scholarship eligibility rule. Very helpful.',
      submittedAt: '3 days ago',
      status: 'Acknowledged'
    }
  ];

  const [submissions, setSubmissions] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('unimitra_feedback_submissions');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // fallback
        }
      }
    }
    return initialSubmissions;
  });

  useEffect(() => {
    localStorage.setItem('unimitra_feedback_submissions', JSON.stringify(submissions));
  }, [submissions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comments.trim()) return;

    const newFeedback = {
      id: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
      user: studentInfo?.name || 'Academic Scholar',
      role: studentInfo?.role || 'Student',
      type: feedbackType,
      university,
      rating,
      comments,
      submittedAt: 'Just now',
      status: 'Pending Admin Review'
    };

    const updated = [newFeedback, ...submissions];
    setSubmissions(updated);
    setComments('');
    setSubmittedAlert(true);
    setTimeout(() => setSubmittedAlert(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-2">
          <span className="text-xs font-black tracking-wider uppercase text-[#6D28D9] dark:text-[#FAF8FF]">
            {currentLang === 'as' ? 'প্ৰণালীৰ মানোন্নয়ন আৰু মতামত' : 'User Quality Assurance & Feedback'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#FAF8FF] tracking-tight">
            {currentLang === 'as' ? 'মতামত আৰু প্ৰতিক্ৰিয়া প্ৰেৰণ কৰক' : 'Submit Institutional AI Feedback'}
          </h1>
          <p className="text-xs sm:text-sm text-[#555375] dark:text-[#C4B5FD] leading-relaxed">
            {currentLang === 'as'
              ? 'AI ৰ উত্তৰৰ নিৰ্ভুলতা, কোনো অধিসূচনাৰ অভাৱ বা অসমীয়া অনুবাদ সম্পৰ্কে প্ৰশাসনক পোনপটীয়াকৈ জনাওক।'
              : 'Help eliminate hallucinations and improve university document indexing. Your feedback is sent directly to administrators for review.'}
          </p>
        </div>
      </div>

      {submittedAlert && (
        <div className="p-4 rounded-2xl bg-[#E0D4FD]/40 border-2 border-[#6D28D9] text-[#0F172A] dark:text-[#FAF8FF] font-black text-xs sm:text-sm flex items-center space-x-2">
          <CheckCircleIcon className="w-5 h-5 text-[#6D28D9]" />
          <span>Thank you! Your feedback has been forwarded to the University Ingestion Team.</span>
        </div>
      )}

      {/* Submission Form */}
      <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                Feedback Focus / Category
              </label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0F172A] text-xs font-bold text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
              >
                <option>Accuracy & Citations</option>
                <option>Outdated Regulation</option>
                <option>Missing University Document</option>
                <option>Assamese Translation</option>
                <option>General Suggestion</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
                University Context
              </label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0F172A] text-xs font-bold text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
              >
                <option>Gauhati University (GU)</option>
                <option>Dibrugarh University (DU)</option>
                <option>Tezpur University (TU)</option>
                <option>Assam University (Silchar)</option>
                <option>Directorate of Higher Education (DHE)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
              Satisfaction Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center cursor-pointer transition-all ${
                    rating >= star
                      ? 'bg-[#C4B5FD] dark:bg-[#FAF8FF] text-[#0F172A]'
                      : 'bg-[#FAF8FF] dark:bg-[#0F172A] text-[#555375] border border-[#E0D4FD] dark:border-[#3B2868]'
                  }`}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#0F172A] dark:text-[#FAF8FF] mb-1">
              Your Feedback or Reported Issue *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe your feedback, specify any missing ordinance or citation discrepancy..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-[#E0D4FD] dark:border-[#3B2868] bg-[#FAF8FF] dark:bg-[#0F172A] text-xs sm:text-sm text-[#0F172A] dark:text-[#FAF8FF] outline-none focus:border-[#6D28D9]"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm text-white bg-[#6D28D9] hover:bg-[#3B2868] transition-all cursor-pointer shadow-sm"
          >
            Submit Feedback to University Admin
          </button>
        </form>
      </div>

      {/* Previous Submissions Log */}
      <div className="bg-white dark:bg-[#150F2C] border-2 border-[#E0D4FD] dark:border-[#3B2868] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-black text-[#0F172A] dark:text-[#FAF8FF]">
          My Submitted Feedback History
        </h2>

        <div className="space-y-3">
          {submissions.map((item) => (
            <div 
              key={item.id} 
              className="p-4 bg-[#FAF8FF] dark:bg-[#0F172A] border border-[#E0D4FD]/60 dark:border-[#3B2868] rounded-2xl space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#DDD6FE] dark:bg-[#3B2868] text-[#0F172A] dark:text-[#FAF8FF]">
                    {item.type}
                  </span>
                  <span className="text-xs font-bold text-[#555375] dark:text-[#C4B5FD]">
                    {item.university}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-[#6D28D9] dark:text-[#FAF8FF]">
                  Status: {item.status}
                </span>
              </div>
              <p className="text-xs text-[#0F172A] dark:text-[#FAF8FF]">{item.comments}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

