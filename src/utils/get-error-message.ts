const defaultErrorMessage = 'Произошла ошибка. Попробуйте ещё раз';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }

  return defaultErrorMessage;
};
