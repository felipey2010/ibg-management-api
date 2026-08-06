export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
};

export const successResponse = <T>(message: string, data?: T): ApiResponse<T> => ({
  success: true,
  message,
  data,
});

export const errorResponse = (
  message: string,
  errors?: Array<{ field?: string; message: string }>,
): ApiResponse => ({
  success: false,
  message,
  errors,
});
