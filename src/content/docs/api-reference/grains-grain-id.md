---
title: GET /grains/{grain_id}
description: Return the full grading factor table for a single grain class.
---

Returns the complete grading factor table for a single grain class, including all factor groups, factors, per-grade thresholds, grade floor rules, and footnotes.

`grain_id` is case-insensitive -- `CWRS`, `cwrs`, and `Cwrs` all return the same record.

Returns `404` if the grain class is not found.

## Request

```http
GET /api/grains/CWRS
X-API-Key: gf_live_...
```

## Response

The response includes the full grain record. The example below is abbreviated -- a real response contains all factor groups and factors for the grain class.

```json
{
  "schema_version": "1.0",
  "grain_id": "CWRS",
  "grain_name": "Canada Western Red Spring",
  "kind": "wheat",
  "region": "western",
  "use_class": null,
  "variety_tracks": null,
  "colour_modifier": false,
  "size_modifier": false,
  "source_url": "https://www.grainscanada.gc.ca/en/grain-quality/official-grain-grading-guide/04-wheat/primary-grade-determination/cwrs-wheat.html",
  "effective_crop_year": "2025/26",
  "last_scraped": "2026-04-11T00:00:00Z",
  "coverage_status": "complete",
  "fallthrough_label": "Grade, if specs for CW Feed not met",
  "grade_floor_rules": [
    {
      "account": "mildew",
      "floor_grade": "No. 3 CWRS",
      "note": "Samples of CWRS will be graded no lower than No. 3 CWRS on account of mildew."
    }
  ],
  "grades": ["No. 1 CWRS", "No. 2 CWRS", "No. 3 CWRS", "CW Feed"],
  "factor_groups": [
    {
      "group_id": "foreign_material",
      "group_label": "Foreign material",
      "factors": [
        {
          "factor_id": "ergot",
          "factor_label": "Ergot",
          "unit": "%",
          "unit_alt": null,
          "threshold_direction": "maximum",
          "is_aggregate": false,
          "aggregates": null,
          "footnote_ref": null,
          "thresholds": {
            "No. 1 CWRS": { "value_type": "numeric", "value": 0.04, "value_alt": null, "threshold_note": null },
            "No. 2 CWRS": { "value_type": "numeric", "value": 0.04, "value_alt": null, "threshold_note": null },
            "No. 3 CWRS": { "value_type": "numeric", "value": 0.04, "value_alt": null, "threshold_note": null },
            "CW Feed":    { "value_type": "numeric", "value": 0.10, "value_alt": null, "threshold_note": null }
          },
          "fallthrough": "Wheat, Sample CW Account Ergot"
        }
      ]
    }
  ],
  "footnotes": {
    "fnt1": "See Frost and Mildew for applicable standard",
    "fnt2": "See working tolerance for Wheats of Other Classes or Varieties."
  }
}
```

## Error response

```json
{
  "error": "Grain 'XYZ' not found. Use GET /api/grains to list available grain_ids.",
  "status": 404
}
```

## Notes

- Nullable fields (`region`, `use_class`, `variety_tracks`, `unit_alt`, `aggregates`, `footnote_ref`, `fallthrough`, `threshold_note`, `value_alt`) are always present in the response with a `null` value when not applicable.
- See [Field Reference](/data-model/field-reference) for a complete description of every field.