export const ENV = {
  API_URL: (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, ""),
  APP_NAME: "Лид.ру",
  ENABLE_MSW: import.meta.env.VITE_ENABLE_MSW === "true",
};
