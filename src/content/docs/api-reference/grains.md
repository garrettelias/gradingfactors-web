---
title: GET /grains
description: Return metadata for all supported grain classes.
---

Returns a summary of all grain classes available in the API. Factor data is not included -- use [GET /grains/{grain_id}](/api-reference/grains-grain-id) for the full grading factor table.

## Request

```http
GET /api/grains
X-API-Key: gf_live_...
```

## Response

```json
{
  "schema_version": "1.0",
  "count": 9,
  "grains": [
    {
      "grain_id": "CWRS",
      "grain_name": "Canada Western Red Spring",
      "kind": "wheat",
      "region": "western",
      "use_class": null,
      "effective_crop_year": "2025/26",
      "coverage_status": "complete",
      "grades": ["No. 1 CWRS", "No. 2 CWRS", "No. 3 CWRS", "CW Feed"]
    }
  ]
}
```

`region` and `use_class` are nullable -- not all grain classes have these attributes. All other fields are always present.

## Supported grains

| grain_id | Name |
|---|---|
| `CWRS` | Canada Western Red Spring |
| `CWAD` | Canada Western Amber Durum |
| `CPSR` | Canada Prairie Spring Red |
| `CANOLA` | Canola, Canada (CAN) |
| `BARLEY_GP_CW` | Barley, Canada Western General Purpose |
| `BARLEY_GP_CE` | Barley, Canada Eastern General Purpose |
| `CORN_CW` | Corn, Canada Western Yellow, White or Mixed |
| `CORN_CE` | Corn, Canada Eastern Yellow, White or Mixed |
| `SOYBEANS` | Soybeans, Canada Yellow, Green, Brown, Black or Mixed |