import { z } from 'zod'
import { DB } from '../lib/db'
import { DBSignupInfo, Env, SignupInfo } from '../lib/types'
import { makeErrorResponse } from '../lib/utils'
import { getAuthenticatedSubject } from './authenticated-session'

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let email = await getAuthenticatedSubject(request, env.JWT_SECRET)
  if (!email) {
    return makeErrorResponse('auth_problem', 401)
  }

  let req: z.infer<typeof SignupInfo>
  try {
    let raw = await request.json()
    req = SignupInfo.parse(raw)
  } catch (e) {
    console.error(e)
    return makeErrorResponse('cannot_parse_request', 400, e)
  }
  let db = new DB(
    env.FIREBASE_RTDB_URL,
    JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_CREDENTIALS)
  )

  try {
    let signups = await db.getSignupsForTarget(email)
    if (Object.values(signups).some((signup) => !signup.cancelationTime)) {
      return makeErrorResponse('already_signed_up', 400)
    }
  } catch (e) {
    console.error(e)
    return makeErrorResponse('cannot_enforce_database_consistency', 500)
  }

  let dbInfo: DBSignupInfo = {
    personalInfo: {
      ...req.personalInfo,
      dobYear: Number(req.personalInfo.dobYear),
      dobMonth: Number(req.personalInfo.dobMonth),
      dobDay: Number(req.personalInfo.dobDay),
    },
    emergencyContactInfo: req.emergencyContactInfo,
  }

  try {
    await db.insertSignupForTarget(request, email, dbInfo)
  } catch (e) {
    console.error(e)
    return makeErrorResponse('cannot_write_to_database', 500)
  }

  return new Response(
    JSON.stringify({
      success: true,
    }),
    {
      status: 201,
      headers: {
        'content-type': 'application/json',
      },
    }
  )
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  let email = await getAuthenticatedSubject(request, env.JWT_SECRET)
  if (!email) {
    return makeErrorResponse('auth_problem', 401)
  }

  let db = new DB(
    env.FIREBASE_RTDB_URL,
    JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_CREDENTIALS)
  )

  try {
    let signups = await db.getSignupsForTarget(email)
    let info =
      Object.values(signups).find((signup) => !signup.cancelationTime)?.info ??
      null

    return new Response(JSON.stringify(info), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    })
  } catch (e) {
    console.error(e)
    return makeErrorResponse('cannot_read_from_database', 500)
  }
}

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  let email = await getAuthenticatedSubject(request, env.JWT_SECRET)
  if (!email) {
    return makeErrorResponse('auth_problem', 401)
  }

  let db = new DB(
    env.FIREBASE_RTDB_URL,
    JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_CREDENTIALS)
  )

  try {
    await db.cancelSignupsForTarget(email)
  } catch (e) {
    console.error(e)
    return makeErrorResponse('database_problem', 500)
  }

  return new Response(null, {
    status: 204,
  })
}
