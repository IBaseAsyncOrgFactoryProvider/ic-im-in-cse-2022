import { Env, SignupInfo } from '../lib/types'
import { makeErrorResponse } from '../lib/utils'

export const onRequestPost: PagesFunction<Env> = async ({ request }) => {
  try {
    let res = await request.json()
    let result = SignupInfo.safeParse(res);
    if (result.success) {
      return new Response(
        JSON.stringify(result.data),
        {
          headers: {
            'content-type': 'application/json',
          },
          status: 200,
        }
      )
    } else {
      return makeErrorResponse('format_error', 400, result.error);
    }
  } catch (e) {
    return makeErrorResponse('unexpected_parsing_error', 500);
  }
}
