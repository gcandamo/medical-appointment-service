export const ok = (body: any) => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

export const badRequest = (msg: string) => ({
  statusCode: 400,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ error: msg })
});
