import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('authToken') || null,
  }),
  actions: {
    setToken(newToken) {
      this.token = newToken;
      localStorage.setItem('authToken', newToken);
    },
    clearToken() {
      this.token = null;
      localStorage.removeItem('authToken');
    },
  },
});
