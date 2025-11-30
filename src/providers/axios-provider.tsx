/* eslint-disable no-console */
import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { toast } from "sonner";

import { isSessionExpired } from "@/lib";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 60000, // 60 segundos para dar tiempo a Render Free Tier de despertar (cold starts)
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async config => {
    // Try to get the session only on the client side
    if (typeof window !== "undefined") {
      const session = await getSession();
      const token = session?.accessToken;

      // If there is a session, check if it's expired
      if (session && isSessionExpired(session)) {
        toast.error(
          "Tu sesión ha expirado. Por favor, inicia sesión de nuevo."
        );
        await signOut({ redirect: false });
        return Promise.reject(new Error("Token expired"));
      }

      // If there is an active session, always add the authorization token
      if (token) {
        config.headers = config.headers ?? {};
        (config.headers as Record<string, string>)["Authorization"] =
          `Bearer ${token}`;
      }
    }

    // Logging detallado de la petición
    console.group("🚀 Axios Request");
    console.log("Method:", config.method?.toUpperCase());
    console.log("URL:", config.url);
    console.log("Full URL:", `${config.baseURL}${config.url}`);
    console.log("Headers:", config.headers);
    console.log("With Credentials:", config.withCredentials);
    console.log("Data:", config.data);
    console.groupEnd();

    return config;
  },
  error => {
    console.error("❌ Axios Request Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    // Logging detallado de la respuesta
    console.group("✅ Axios Response");
    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);
    console.log("URL:", response.config.url);
    console.log("Headers:", response.headers);
    console.log(
      "Access-Control-Allow-Origin:",
      response.headers["access-control-allow-origin"]
    );
    console.log(
      "Access-Control-Allow-Credentials:",
      response.headers["access-control-allow-credentials"]
    );
    console.log("Data:", response.data);
    console.groupEnd();

    return response;
  },
  async error => {
    // Logging detallado del error
    console.group("❌ Axios Error");
    console.error("Error Message:", error.message);
    console.error("Error Code:", error.code);
    console.error("Request URL:", error.config?.url);
    console.error("Request Method:", error.config?.method?.toUpperCase());
    console.error("Request Headers:", error.config?.headers);

    // Detectar timeout específicamente
    const isTimeout =
      error.code === "ECONNABORTED" ||
      error.message?.includes("timeout") ||
      error.message?.includes("exceeded");

    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error("Response Status:", error.response.status);
      console.error("Response Headers:", error.response.headers);
      console.error("Response Data:", error.response.data);
      console.error("CORS Headers:", {
        "access-control-allow-origin":
          error.response.headers["access-control-allow-origin"],
        "access-control-allow-credentials":
          error.response.headers["access-control-allow-credentials"],
        "access-control-allow-methods":
          error.response.headers["access-control-allow-methods"],
        "access-control-allow-headers":
          error.response.headers["access-control-allow-headers"],
      });
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error("No response received");
      console.error("Request:", error.request);
      if (isTimeout) {
        console.error(
          "⚠️ Timeout detected - Server may be waking up (cold start)"
        );
      } else {
        console.error("This might be a CORS preflight failure");
      }
    } else {
      // Algo pasó al configurar la petición
      console.error("Error setting up request:", error.message);
    }

    // Verificar específicamente errores de CORS
    if (
      !isTimeout &&
      (error.code === "ERR_NETWORK" ||
        error.message?.includes("CORS") ||
        error.message?.includes("Network Error") ||
        (error.request && !error.response))
    ) {
      console.error("⚠️ Possible CORS Error Detected");
      console.error("Check if preflight (OPTIONS) request is being blocked");
    }

    console.groupEnd();

    // Retry automático para timeouts (cold starts)
    if (isTimeout && error.config) {
      const retryCount = error.config.__retryCount || 0;
      const maxRetries = 2;

      if (retryCount < maxRetries) {
        error.config.__retryCount = retryCount + 1;

        // Mostrar mensaje al usuario solo en el primer intento
        if (retryCount === 0) {
          toast.info(
            "El servidor está iniciando. Por favor, espera unos segundos...",
            { duration: 5000 }
          );
        }

        console.log(
          `🔄 Retrying request (attempt ${retryCount + 1}/${maxRetries}) after 3 seconds...`
        );

        // Esperar 3 segundos antes de reintentar
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Reintentar la petición
        return axiosInstance(error.config);
      } else {
        // Si ya se agotaron los reintentos, mostrar error final
        toast.error(
          "El servidor está tardando en responder. Por favor, intenta nuevamente en unos momentos."
        );
      }
    }

    return Promise.reject(error);
  }
);
