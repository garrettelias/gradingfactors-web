---
title: Authentication
description: How to register for an API key and authenticate requests to the Grading Factors API.
---

All requests to the Grading Factors API require an API key. Keys are free and issued instantly via self-serve registration.

## Getting a key

Send a POST request to the registration endpoint with your email address:

```bash
curl -X POST https://api.gradingfactors.ca/api/register \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com"}'
```

A successful response returns your API key:

```json
{
  "api_key": "gf_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "email": "you@example.com",
  "schema_version": "1.0"
}
```

:::caution
Your API key is returned once and not stored. Copy it immediately and store it securely. If you lose your key, register again with the same email address to receive a new one.
:::

## Using your key

Include your API key in the `X-API-Key` header on every request:

```bash
curl https://api.gradingfactors.ca/api/grains \
  -H "X-API-Key: gf_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Rate limiting

Each API key is limited to 100 requests per hour. Requests exceeding this limit receive a `429 Too Many Requests` response with a `Retry-After` header indicating when the limit resets.

The API is designed for periodic sync rather than live query - 100 requests per hour is more than sufficient for the intended use pattern. See [How to use it](/getting-started/overview#how-to-use-it) in the Overview for more detail.

## Security

- Never expose your API key in client-side code or public repositories
- Use environment variables to store your key in applications
- Keys are stored as SHA-256 hashes - Grading Factors does not have access to your raw key after registration

## Problems with your key

If your key isn't working or you need a replacement, register again at `POST /api/register` with your email address. For other issues, contact [contact@gradingfactors.ca](mailto:contact@gradingfactors.ca).