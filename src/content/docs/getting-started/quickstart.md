---
title: Quickstart
description: Make your first Grading Factors API request in under five minutes.
---

This guide walks you from registration to a working API call. You'll need curl or any HTTP client.

## 1. Get an API key

Register with your email address:

```bash
curl -X POST https://api.gradingfactors.ca/api/register \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com"}'
```

Your key is returned once -- copy it immediately. See [Authentication](/getting-started/authentication) for details.

## 2. Fetch the grain list

Confirm your key works by pulling the list of available grain classes:

```bash
curl https://api.gradingfactors.ca/api/grains \
  -H "X-API-Key: gf_live_..."
```

You should see a response with 9 grain classes and their metadata.

## 3. Fetch a full grading factor table

Pull the complete grading factor table for Canada Western Red Spring wheat:

```bash
curl https://api.gradingfactors.ca/api/grains/CWRS \
  -H "X-API-Key: gf_live_..."
```

The response includes all factor groups, factors, and per-grade thresholds for CWRS. See [Field Reference](/data-model/field-reference) for a description of every field in the response.

## 4. Check for updates

Before building against the data, check the changelog to confirm you have the current version:

```bash
curl https://api.gradingfactors.ca/api/changelog \
  -H "X-API-Key: gf_live_..."
```

## What's next

- [Field Reference](/data-model/field-reference) -- complete documentation of every response field
- [Update Model](/data-model/update-model) -- how and when data changes, and how to sync
- [API Reference](/api-reference/grains) -- thorough endpoint documentation