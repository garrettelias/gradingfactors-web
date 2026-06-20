---
title: GET /changelog
description: Return recent data changelog entries.
---

Returns changelog entries recording updates to the API dataset, newest first. Use this endpoint to detect whether data has changed since your last sync.

## Request

```http
GET /api/changelog
X-API-Key: gf_live_...
```

## Query parameters

| Parameter | Type | Default | Max | Description |
|---|---|---|---|---|
| `grain_id` | string | -- | -- | Filter to entries affecting a specific grain class |
| `limit` | integer | 20 | 100 | Maximum number of entries to return |

## Response

```json
{
  "schema_version": "1.0",
  "count": 1,
  "entries": [
    {
      "id": "a1b2c3d4-...",
      "crop_year": "2026/27",
      "effective_date": "2026-08-01",
      "grain_ids_affected": ["CWRS", "CWAD", "CPSR"],
      "summary": "Updated thresholds for 2026/27 crop year across all western wheat classes.",
      "created_at": "2026-08-01T14:32:00Z"
    }
  ]
}
```

## Filtered request

```http
GET /api/changelog?grain_id=CWRS&limit=5
X-API-Key: gf_live_...
```

## Notes

- Results are ordered by `effective_date` descending, then `created_at` descending.
- The changelog reflects manual imports following CGC data updates. See [Update Model](/data-model/update-model) for details on how and when data changes.