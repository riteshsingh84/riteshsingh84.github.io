// Expected client: POST JSON { email: string } to the Worker root URL.
// Example client endpoint: https://collect-emails.YOUR_DOMAIN.workers.dev/
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })
  try {
    const body = await request.json()
    const email = body.email
    if (!email) return new Response('Bad Request', { status: 400 })

    // GitHub repository dispatch
    const owner = 'riteshsingh84'
    const repo = 'riteshsingh84.github.io'
    const url = `https://api.github.com/repos/${owner}/${repo}/dispatches`

    const payload = {
      event_type: 'collect_email',
      client_payload: { email }
    }

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_TOKEN}` // Set as Worker secret
      },
      body: JSON.stringify(payload)
    })

    if (resp.status === 204) {
      return new Response('Subscribed', { status: 200 })
    } else {
      const text = await resp.text()
      return new Response('GitHub error: ' + text, { status: 500 })
    }
  } catch (err) {
    return new Response('Server error', { status: 500 })
  }
}
