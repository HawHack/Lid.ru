export const handleApiError = (error: unknown, fallbackMessage: string) => {
  console.error(fallbackMessage, error);
};