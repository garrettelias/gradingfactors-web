---
title: Update Model
description: How and when Grading Factors API data is updated.
---

The Grading Factors API serves reference data sourced from the Canadian Grain Commission's Official Grain Grading Guide. Understanding when that data changes -- and how this API tracks those changes -- helps you build reliable integrations.

## How CGC data changes

The CGC publishes updated grade determinant tables at the start of each crop year, typically in August. Changes may include revised thresholds, new or removed grading factors, or updated grade structures.

Not all grain classes change every year. In a typical crop year, some classes are updated and others remain identical to the prior year.

## How this API is updated

This API is updated manually after the CGC publishes new crop year data. The process:

1. The scraper fetches live CGC pages and compares them against the current dataset
2. Differences are reviewed and confirmed against the source
3. Approved changes are imported and a changelog entry is created

Human review will occur before any updates are made to the dataset. Updates follow CGC's publication schedule and are applied once reviewed.

## How to detect changes

Use the [changelog endpoint](/api-reference/get-changelog) to check for updates since your last sync:

```http
GET /api/changelog?limit=5
X-API-Key: gf_live_...
```

Each changelog entry includes the affected grain classes, the effective date, and a summary of what changed. If the changelog has no new entries since your last sync, your local copy is current.

## Recommended sync pattern

This API is designed for periodic sync, not live query. The recommended approach:

1. On first use, pull the full dataset with [GET /api/grains/{grain_id}](/api-reference/get-grains-grain-id) for each grain class you need
2. Store the data locally and build against your own copy
3. Periodically check [GET /api/changelog](/api-reference/get-changelog) for new entries
4. When a changelog entry affects a grain class you use, re-fetch that grain's full record and update your local copy

Checking the changelog once per week is sufficient for most use cases -- CGC data changes at most once per year.