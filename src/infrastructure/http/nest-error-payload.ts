export function nestErrorPayload(error: string, message: string, statusCode: number) {
  return { error, message, statusCode };
}
