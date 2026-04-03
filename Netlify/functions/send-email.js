const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = ‘Quiniela ITAM [quiniela@resend.dev](mailto:quiniela@resend.dev)’;

exports.handler = async (event) => {
// Only allow POST
if (event.httpMethod !== ‘POST’) {
return { statusCode: 405, body: ‘Method not allowed’ };
}

// CORS headers
const headers = {
‘Access-Control-Allow-Origin’: ‘*’,
‘Access-Control-Allow-Headers’: ‘Content-Type’,
‘Content-Type’: ‘application/json’,
};

try {
const { type, subject, html, recipients } = JSON.parse(event.body);

```
if (!type || !subject || !html || !recipients?.length) {
  return { statusCode: 400, headers, body: JSON.stringify({ error: 'Faltan parámetros' }) };
}

// Send email via Resend
const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: FROM_EMAIL,
    to: recipients,
    subject,
    html,
  }),
});

const data = await res.json();

if (!res.ok) {
  return { statusCode: 500, headers, body: JSON.stringify({ error: data }) };
}

return { statusCode: 200, headers, body: JSON.stringify({ ok: true, id: data.id }) };
```

} catch (err) {
return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
}
};
