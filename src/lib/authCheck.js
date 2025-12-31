// lib/authCheck.js
export async function checkAuthStatus() {
  try {
    const res = await fetch('/api/debug', {
      credentials: 'include' // Include cookies
    });
    const data = await res.json();
    
    return {
      isAuthenticated: data.hasCookie,
      user: data.decoded,
      hasToken: !!data.token
    };
  } catch (err) {
    return {
      isAuthenticated: false,
      user: null,
      hasToken: false
    };
  }
}

// Usage example:
// const auth = await checkAuthStatus();
// console.log('Authenticated:', auth.isAuthenticated);
// console.log('User:', auth.user);