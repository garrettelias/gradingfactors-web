---
title: Overview
description: What the Grading Factors API is, what it includes, and how to use it.
---

Grading Factors is a RESTful API serving the official grade determinant table data published by the Canadian Grain Commission. It exists because that data - the thresholds used to assign a CGC grade to a grain sample - is only available as HTML pages and printable PDFs. No machine-readable version exists anywhere. This API fills that gap.

:::note
This is a reference data service, not a grading calculator. Grading Factors does not accept sample measurements and return a grade. It serves the grading information that developers need to build such tools themselves.
:::

## What's included in v1

The following grain classes are available:

- Canada Western Red Spring Wheat (CWRS)
- Canada Western Amber Durum Wheat (CWAD)
- Canada Prairie Spring Red Wheat (CPSR)
- Canola, Canada (CANOLA)
- Barley, Canada Western General Purpose (BARLEY_GP_CW)
- Barley, Canada Eastern General Purpose (BARLEY_GP_CE)
- Corn, Canada Western Yellow, White or Mixed (CORN_CW)
- Corn, Canada Eastern Yellow, White or Mixed (CORN_CE)
- Soybeans, Canada Yellow, Green, Brown, Black or Mixed (SOYBEANS)

All data is accurate to what the CGC currently has published on their website. In select cases this includes known typos and inconsistencies, which are documented in the [Update Model](/data-model/update-model).

## What's not included

V1 covers primary (domestic) grade determination only. Export grade tables and the remaining grain classes in the CGC guide are not included. Additional grain classes and export data will be added in future major updates.

## How to use it

The API is designed for periodic sync, not live query. The recommended pattern is to pull the full dataset on a schedule, store it locally, and build against your own copy. The rate limit is designed to encourage periodic sync - you do not need to query this API on every request your application makes.