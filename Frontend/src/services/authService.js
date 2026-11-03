// Centralized Authentication & Authorization Service
// Connects React Frontend to UniMitra Node.js Backend Gateway & Supabase PostgreSQL

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/auth`
  : 'http://localhost:5000/api/v1/auth';

const TOKEN_KEY = 'unimitra_auth_token';
const USER_KEY = 'unimitra_student_info';
const LOGGED_IN_KEY = 'unimitra_auth_logged_in';

/**
 * Standard HTTP fetch wrapper with authorization headers & error handling
 */
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
    credentials: 'include', // Include HTTP-only cookies
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();

    if (!res.ok || data.success === false) {
      const errMsg = data?.error?.message || data?.message || 'Authentication request failed.';
      const err = new Error(errMsg);
      err.code = data?.error?.code || 'AUTH_ERROR';
      err.details = data?.error?.details || null;
      throw err;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to the UniMitra backend server. Please verify the backend is running on port 5000.');
    }
    throw error;
  }
}

export const authService = {
  /**
   * 0. Google Authentication (Exclusively for Students)
   */
  async loginWithGoogle({ credential }) {
    const res = await apiRequest('/google', {
      method: 'POST',
      body: JSON.stringify({ credential, role: 'student' }),
    });

    if (res.data?.token) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
      localStorage.setItem(LOGGED_IN_KEY, 'true');
    }

    if (res.data?.user) {
      const mappedUser = {
        id: res.data.user.id,
        name: res.data.user.fullName,
        fullName: res.data.user.fullName,
        email: res.data.user.email,
        role: 'Student',
        department: res.data.user.department || 'Undergraduate / Postgraduate Studies',
        designation: '',
        memberId: '',
        preferredLanguage: res.data.user.preferredLanguage || 'en',
      };
      localStorage.setItem(USER_KEY, JSON.stringify(mappedUser));
      return {
        ...res.data,
        user: mappedUser,
      };
    }

    return res.data;
  },

  /**
   * 1. Student Registration
   */
  async registerStudent({ fullName, email, password, preferredLanguage = 'en' }) {
    const res = await apiRequest('/student/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password, preferredLanguage }),
    });

    if (res.data?.token) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
      localStorage.setItem(LOGGED_IN_KEY, 'true');
    }

    if (res.data?.user) {
      const mappedUser = {
        id: res.data.user.id,
        name: res.data.user.fullName,
        email: res.data.user.email,
        role: 'Student',
        department: res.data.user.department || 'Undergraduate / Postgraduate Studies',
        preferredLanguage: res.data.user.preferredLanguage || preferredLanguage,
      };
      localStorage.setItem(USER_KEY, JSON.stringify(mappedUser));
    }

    return res.data;
  },

  /**
   * 1b. Verify Student OTP
   */
  async verifyStudentOtp({ identifier, otp }) {
    const res = await apiRequest('/student/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier, otp }),
    });

    if (res.data?.token) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
      localStorage.setItem(LOGGED_IN_KEY, 'true');
    }

    if (res.data?.user) {
      const mappedUser = {
        id: res.data.user.id,
        name: res.data.user.fullName,
        email: res.data.user.email,
        role: 'Student',
        department: res.data.user.department || 'Undergraduate / Postgraduate Studies',
        preferredLanguage: res.data.user.preferredLanguage || 'en',
      };
      localStorage.setItem(USER_KEY, JSON.stringify(mappedUser));
    }

    return res.data;
  },

  /**
   * 2. Student Login
   */
  async loginStudent({ email, password, rememberMe = true }) {
    const res = await apiRequest('/student/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberMe }),
    });

    if (res.data?.token) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
      localStorage.setItem(LOGGED_IN_KEY, 'true');
    }

    if (res.data?.user) {
      const mappedUser = {
        id: res.data.user.id,
        name: res.data.user.fullName,
        email: res.data.user.email,
        role: 'Student',
        department: res.data.user.department || 'Higher Education Studies',
        preferredLanguage: res.data.user.preferredLanguage || 'en',
      };
      localStorage.setItem(USER_KEY, JSON.stringify(mappedUser));
    }

    return res.data;
  },

  /**
   * 3. Faculty Member Registration (Generates Member ID: UM-FAC-XXXX)
   */
  async registerFaculty({
    fullName,
    officialEmail,
    memberEmail,
    facultyId,
    department,
    designation,
    password,
    preferredLanguage = 'en',
  }) {
    const res = await apiRequest('/faculty/register', {
      method: 'POST',
      body: JSON.stringify({
        fullName,
        officialEmail,
    memberEmail,
        facultyId,
        department,
        designation,
        password,
        preferredLanguage,
      }),
    });

    return res.data;
  },

  /**
   * 4. Faculty Login (Step 1: Credentials -> Triggers OTP)
   */
  async loginFacultyCredentials({ memberId, password }) {
    const res = await apiRequest('/faculty/login', {
      method: 'POST',
      body: JSON.stringify({ memberId, password }),
    });

    return res.data;
  },

  /**
   * 5. Faculty OTP Verification (Step 2: OTP -> Issues Token)
   */
  async verifyFacultyOtp({ identifier, otp }) {
    const res = await apiRequest('/faculty/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier, otp }),
    });

    if (res.data?.token) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
      localStorage.setItem(LOGGED_IN_KEY, 'true');
    }

    if (res.data?.user) {
      const mappedUser = {
        id: res.data.user.id,
        name: res.data.user.fullName,
        email: res.data.user.email,
        role: 'Faculty Member',
        department: res.data.user.department || 'Academic Department',
        designation: res.data.user.designation || 'Faculty Member',
        memberId: res.data.user.memberId,
        preferredLanguage: res.data.user.preferredLanguage || 'en',
      };
      localStorage.setItem(USER_KEY, JSON.stringify(mappedUser));
    }

    return res.data;
  },

  /**
   * 6. Admin Login (Step 1: Credentials -> Triggers OTP)
   */
  async loginAdminCredentials({ email, password }) {
    const res = await apiRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    return res.data;
  },

  /**
   * 7. Admin OTP Verification (Step 2: OTP -> Issues Token)
   */
  async verifyAdminOtp({ identifier, otp }) {
    const res = await apiRequest('/admin/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier, otp }),
    });

    if (res.data?.token) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
      localStorage.setItem(LOGGED_IN_KEY, 'true');
    }

    if (res.data?.user) {
      const mappedUser = {
        id: res.data.user.id,
        name: res.data.user.fullName,
        email: res.data.user.email,
        role: 'Admin',
        department: res.data.user.department || 'Institutional Governance',
        designation: res.data.user.designation || 'Chief Administrator',
      };
      localStorage.setItem(USER_KEY, JSON.stringify(mappedUser));
    }

    return res.data;
  },

  /**
   * 8. Resend OTP
   */
  async resendOtp({ identifier, role }) {
    const res = await apiRequest('/otp/resend', {
      method: 'POST',
      body: JSON.stringify({ identifier, role }),
    });
    return res.data;
  },

  /**
   * 9. Get Current Authenticated Profile from Server
   */
  async getMe() {
    try {
      const res = await apiRequest('/me');
      if (res.data?.user) {
        const role = res.data.user.role === 'admin' || res.data.user.role === 'super_admin'
          ? 'Admin'
          : (res.data.user.role === 'faculty' ? 'Faculty Member' : 'Student');

        const mappedUser = {
          id: res.data.user.id,
          name: res.data.user.fullName,
          email: res.data.user.email,
          role,
          department: res.data.user.department,
          designation: res.data.user.designation,
          memberId: res.data.user.memberId,
          preferredLanguage: res.data.user.preferredLanguage,
        };

        localStorage.setItem(USER_KEY, JSON.stringify(mappedUser));
        localStorage.setItem(LOGGED_IN_KEY, 'true');
        return mappedUser;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * 9b. Update Current User Profile
   */
  async updateProfile(profileData) {
    const res = await apiRequest('/me', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
    return res.data;
  },

  /**
   * 10. Logout: Invalidate local token & notify backend
   */
  async logout() {
    try {
      await apiRequest('/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(LOGGED_IN_KEY);
      localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new CustomEvent('unimitra_auth_state_changed', { detail: { isLoggedIn: false } }));
    }
  },

  /**
   * Helper state checks
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return localStorage.getItem(LOGGED_IN_KEY) === 'true' && Boolean(localStorage.getItem(TOKEN_KEY));
  },

  getStoredUser() {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
};
