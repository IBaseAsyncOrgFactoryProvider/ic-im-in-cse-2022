export const SessionCookieKey = 'iiic-session';

export function makeErrorResponse(
  message: string,
  status: number = 400,
  data: any = false
) {
  const resp: { error: string; data?: any } = { error: message };
  if (data) {
    resp.data = data;
  }
  return new Response(JSON.stringify(resp), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
