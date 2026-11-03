import { universityService } from '../../services/universityService';
import { useState, useEffect } from 'react';
import { 
  BuildingLibraryIcon, 
  CheckCircleIcon, 
  SparklesIcon, 
  ShieldCheckIcon,
  ClockIcon
} from '../../components/common/Icons';

export const DashboardFeedback = ({ currentLang = 'en', studentInfo }) => {
  const univProfile = universityService.getProfile();
  const [feedbackType, setFeedbackType] = useState('Accuracy & Citations');
  const [university, setUniversity] = useState(univProfile.name || 'Our University');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [submittedAlert, setSubmittedAlert] = useState(false);

  // Initial feedback submissions demo list
  const initialSubmissions = [
    {
      id: 'FB-901',
      user: 'Academic Scholar',
      role: 'Student',
      type: 'Outdated Regulation',
      university: 'Nivoraya University (DU)',
      rating: 4,
      query: 'What is the attendance condonation limit for 2024?',
      comments: 'The syllabus reference for 3rd semester CBCS was accurate, but please update the 2024 revised attendance condonation circular.',
      submittedAt: 'Yesterday',
      status: 'Reviewed & Resolved'
    },
    {
      id: 'FB-902',
      user: 'Academic Scholar',
      role: 'Student',
      type: 'Assamese Translation',
      university: 'Gauhati University (GU)',
      rating: 5,
      query: 'ডিএইচই জলপানিৰ বাবে যোগ্যতাৰ চৰ্ত কি?',
      comments: 'Assamese query understanding was fast and exact for the DHE scholarship eligibility rule. Very helpful.',
      submittedAt: '3 days ago',
      status: 'Reviewed & Resolved'
    }
  ];

  const loadSubmissions = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('unimitra_feedback_submissions');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch {
          // fallback
        }
      }
    }
    return initialSubmissions;
  };

  const [submissions, setSubmissions] = useState(() => loadSubmissions());

  useEffect(() => {
    // If not set yet, store initial list
    if (typeof window !== 'undefined' && !localStorage.getItem('unimitra_feedback_submissions')) {
      localStorage.setItem('unimitra_feedback_submissions', JSON.stringify(submissions));
    }

    const handleFeedbackChanged = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setSubmissions(e.detail);
      } else {
        setSubmissions(loadSubmissions());
      }
    };

    window.addEventListener('unimitra_feedback_changed', handleFeedbackChanged);
    return () => window.removeEventListener('unimitra_feedback_changed', handleFeedbackChanged);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comments.trim()) return;

    const newFeedback = {
      id: `FB-${Date.now()}`,
      user: studentInfo?.name || 'Academic Scholar',
      role: studentInfo?.role || 'Student',
      type: feedbackType,
      university: university || univProfile.name || 'Nivoraya University',
      rating,
      query: 'Student Portal Quality & Academic Feedback',
      comments: comments.trim(),
      submittedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Pending Review'
    };

    const updated = [newFeedback, ...submissions.filter(s => s.id !== newFeedback.id)];
    setSubmissions(updated);

    try {
      localStorage.setItem('unimitra_feedback_submissions', JSON.stringify(updated));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('unimitra_feedback_changed', { detail: updated }));
      }
    } catch {}

    // Send to backend API asynchronously
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('unimitra_auth_token') : null;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      fetch('/api/chat/feedback', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          queryText: newFeedback.query,
          answerSnippet: newFeedback.comments,
          rating: newFeedback.rating,
          type: newFeedback.type,
          comments: newFeedback.comments,
          university: newFeedback.university
        })
      }).catch(() => {});
    } catch {}

    setComments('');
    setSubmittedAlert(true);
    setTimeout(() => setSubmittedAlert(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="neo-surface rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-2">
          <span className="text-xs font-black tracking-wider uppercase text-[#FF933E] dark:text-[#03C988] dark:text-[#FFFFFF]">
            {currentLang === 'as' ? 'প্ৰণালীৰ মানোন্নয়ন আৰু মতামত' : 'User Quality Assurance & Feedback'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#000000] dark:text-[#FFFFFF] tracking-tight">
            {currentLang === 'as' ? 'মতামত আৰু প্ৰতিক্ৰিয়া প্ৰেৰণ কৰক' : 'Submit Institutional AI Feedback'}
          </h1>
          <p className="text-xs sm:text-sm text-[#000000]/70 dark:text-[#FFFFFF]/80 leading-relaxed">
            {currentLang === 'as'
              ? 'AI ৰ উত্তৰৰ নিৰ্ভুলতা, কোনো অধিসূচনাৰ অভাৱ বা অসমীয়া অনুবাদ সম্পৰ্কে প্ৰশাসনক পোনপটীয়াকৈ জনাওক।'
              : 'Help eliminate hallucinations and improve university document indexing. Your feedback is sent directly to administrators for review.'}
          </p>
        </div>
      </div>

      {submittedAlert && (
        <div className="p-4 rounded-2xl bg-[#E0D4FD]/40 border-2 border-[#FF933E]/50 dark:border-[#03C988]/50 text-[#000000] dark:text-[#FFFFFF] font-black text-xs sm:text-sm flex items-center space-x-2">
          <CheckCircleIcon className="w-5 h-5 text-[#FF933E] dark:text-[#03C988]" />
          <span>Thank you! Your feedback has been forwarded to the University Ingestion Team.</span>
        </div>
      )}

      {/* Submission Form */}
      <div className="neo-surface rounded-3xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                Feedback Focus / Category
              </label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E]/50 dark:border-[#03C988]/50"
              >
                <option>Accuracy & Citations</option>
                <option>Outdated Regulation</option>
                <option>Missing University Document</option>
                <option>Assamese Translation</option>
                <option>General Suggestion</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
                Our University
              </label>
              <input
                type="text"
                readOnly
                value={univProfile.name || 'Our University'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs font-bold text-[#000000] dark:text-[#FFFFFF] outline-none opacity-90 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
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
                      ? 'bg-[#C4B5FD] dark:bg-[#FFE9A9]/20 text-[#000000]'
                      : 'bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-[#000000]/70 border border-[#73A5CA]/40 dark:border-[#1C82AD]/40'
                  }`}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#000000] dark:text-[#FFFFFF] mb-1">
              Your Feedback or Reported Issue *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe your feedback, specify any missing ordinance or citation discrepancy..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] text-xs sm:text-sm text-[#000000] dark:text-[#FFFFFF] outline-none focus:border-[#FF933E]/50 dark:border-[#03C988]/50"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm text-white bg-[#FF933E] dark:bg-[#03C988] text-white dark:text-[#000000] hover:bg-[#3B2868] transition-all cursor-pointer shadow-sm"
          >
            Submit Feedback to University Admin
          </button>
        </form>
      </div>

      {/* Previous Submissions Log */}
      <div className="neo-surface rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[#000000] dark:text-[#FFFFFF]">
            My Submitted Feedback History
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#FFE9A9] dark:bg-[#0A0A0A] border border-[#FFCB56] dark:border-[#03C988] text-[#000000] dark:text-[#FFFFFF]">
            {submissions.length} Submissions
          </span>
        </div>

        {submissions.length === 0 ? (
          <div className="p-8 text-center bg-[#FFE9A9]/10 dark:bg-[#0A0A0A] rounded-2xl border border-dashed border-[#73A5CA]/40">
            <SparklesIcon className="w-8 h-8 mx-auto text-[#FF933E] dark:text-[#03C988] mb-2" />
            <h4 className="text-sm font-black text-[#000000] dark:text-[#FFFFFF]">No Feedback Records Found</h4>
            <p className="text-xs text-[#000000]/60 dark:text-[#FFFFFF]/60 mt-1">
              Any feedback you submit via this form or the AI Assistant will appear here with live resolution status.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((item) => (
              <div 
                key={item.id} 
                className="p-4 bg-[#FFE9A9]/20 dark:bg-[#0A0A0A] border border-[#73A5CA]/40 dark:border-[#1C82AD]/40 rounded-2xl space-y-2.5 transition-all hover:border-[#FF933E]/50 dark:hover:border-[#03C988]/50"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/70 dark:bg-white/10 text-[#000000]/80 dark:text-[#FFFFFF]/80 border border-[#73A5CA]/30">
                      {item.type || 'General'}
                    </span>
                    <span className="text-xs font-bold text-[#000000]/70 dark:text-[#FFFFFF]/80">
                      {item.university || univProfile.name}
                    </span>
                    {item.rating && (
                      <span className="text-xs font-mono font-black text-[#FF933E] dark:text-[#03C988]">
                        ★ {item.rating}/5
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.submittedAt && (
                      <span className="text-[11px] text-[#000000]/60 dark:text-[#FFFFFF]/60">
                        {item.submittedAt}
                      </span>
                    )}
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded ${
                      item.status === 'Reviewed & Resolved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300'
                    }`}>
                      {item.status || 'Pending Review'}
                    </span>
                  </div>
                </div>

                {item.query && item.query !== 'Student Portal Quality & Academic Feedback' && (
                  <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/5 border border-[#73A5CA]/30 dark:border-[#1C82AD]/30 text-xs">
                    <span className="font-black text-[#FF933E] dark:text-[#03C988] uppercase text-[10px] block mb-0.5">
                      Referenced AI Prompt / Query:
                    </span>
                    <p className="font-semibold text-[#000000] dark:text-[#FFFFFF] italic">
                      "{item.query}"
                    </p>
                  </div>
                )}

                <p className="text-xs text-[#000000] dark:text-[#FFFFFF] leading-relaxed">{item.comments}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

