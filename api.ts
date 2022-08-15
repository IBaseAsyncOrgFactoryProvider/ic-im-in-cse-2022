export async function getAuthenticationStatus(): Promise<{
  email: string
} | null> {
  const res = await fetch('/api/authenticated-session', {
    credentials: 'include',
    headers: {
      'X-No-CSRF': 'yes',
    },
  })

  if (!res.ok) return null

  return await res.json()
}

/* eslint-disable no-unused-vars */
export enum PresentCodeResult {
  Success,
  Failed,
  RateLimited,
  GenericError,
}
/* eslint-enable no-unused-vars */

export async function presentCode(
  email: string,
  code: string,
): Promise<PresentCodeResult> {
  try {
    const res = await fetch('/api/authenticated-session', {
      method: 'POST',
      body: JSON.stringify({
        email,
        code,
      }),
      headers: {
        'X-No-CSRF': 'yes',
      },
    })
    if (res.status === 401) return PresentCodeResult.Failed
    if (res.status === 429) return PresentCodeResult.RateLimited
    const j: any = await res.json()
    if (j.success) return PresentCodeResult.Success
  } catch (e) {
    console.error(e)
  }
  return PresentCodeResult.GenericError
}

export async function deleteSession() {
  await fetch('/api/authenticated-session', {
    credentials: 'include',
    method: 'DELETE',
    headers: {
      'X-No-CSRF': 'yes',
    },
  })
}

export async function checkSignupInfoFormat(info) {
  let res = await fetch('/api/check-signup-info-format', {
    method: 'POST',
    headers: {
      'X-No-CSRF': 'yes',
    },
    body: JSON.stringify(info),
  })

  if (res.ok) return { success: true }
  if (res.status === 400) {
    return await res.json();
  }
  throw new Error('status not okay')
}

export async function signup(info) {
  let res = await fetch('/api/signup', {
    credentials: 'include',
    method: 'POST',
    headers: {
      'X-No-CSRF': 'yes',
    },
    body: JSON.stringify(info),
  })

  if (res.ok) return await res.json()
  throw new Error('status not okay')
}

// returns DBSignupInfo | null
export async function getSignup() {
  let res = await fetch('/api/signup', {
    credentials: 'include',
    headers: {
      'X-No-CSRF': 'yes',
    },
  })

  if (res.ok) return await res.json()
  throw new Error('status not okay')
}

export async function cancelSignup() {
  let res = await fetch('/api/signup', {
    credentials: 'include',
    method: 'DELETE',
    headers: {
      'X-No-CSRF': 'yes',
    },
  })

  if (res.ok) return { success: true }
  throw new Error('status not okay')
}
