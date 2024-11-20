import { api } from "../constants/api";
import { useAuthStore } from "../stores/auth";

let isRefreshing = false; // Флаг для предотвращения одновременных запросов на обновление токена
let refreshSubscribers = []; // Очередь для запросов, ожидающих обновления токена

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

export async function authFetch(input, init = {}) {
  const authStore = useAuthStore();

  const accessToken = authStore.accessToken;
  const headers = new Headers(init.headers || {});
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const fetchInit = { ...init, headers };

  try {
    let response = await fetch(input, fetchInit);

    if (response.status === 401) {
      console.warn("Ошибка 401: выполняется обновление токена...");

      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        isRefreshing = false;

        if (newToken) {
          onTokenRefreshed(newToken);
          authStore.setTokens({ accessToken: newToken });
        } else {
          console.error("Не удалось обновить токен.");
          authStore.logout(); // Очистить состояние авторизации
          throw new Error("Требуется повторный вход.");
        }
      }

      // Ждём завершения обновления токена и повторяем запрос
      return new Promise((resolve) => {
        subscribeTokenRefresh(async (newToken) => {
          headers.set("Authorization", `Bearer ${newToken}`);
          fetchInit.headers = headers;
          resolve(await fetch(input, fetchInit));
        });
      });
    }

    return response;
  } catch (error) {
    console.error("Ошибка запроса:", error);
    throw error;
  }
}

export async function refreshAccessToken() {
  const authStore = useAuthStore();
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    console.warn("Рефреш токен отсутствует.");
    return null;
  }

  try {
    const response = await fetch(`${api}token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Токен успешно обновлён:", data);

      return data.access;
    } else {
      console.error("Не удалось обновить токен:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Ошибка обновления токена:", error);
    return null;
  }
}
