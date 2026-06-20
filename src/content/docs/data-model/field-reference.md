---
title: Field Reference
description: Every field in the Grading Factors API response schema, with types, valid values, and usage notes.
---

This page describes every field in the grain record schema returned by the Grading Factors API. All grain data is sourced from the Canadian Grain Commission's Official Grain Grading Guide and reflects the primary grade determination tables for the current crop year.

## Grain record fields

A grain record is the top-level object returned by `GET /api/grains/{grain_id}`. It describes a single grain class and contains all grading factor data for that class.

### `schema_version`

**Type:** string

The version of the response schema. Check this field when syncing to detect structural changes that require updates to your integration.

Additive changes - new optional fields - do not increment this value. Only breaking changes increment it: field renames, type changes, or structural reorganization.

```json
"schema_version": "1.0"
```

Current value: `"1.0"`

---

### `grain_id`

**Type:** string

The unique identifier for this grain class. Used as the path parameter in `GET /api/grains/{grain_id}`. Lookup is case-insensitive.

```json
"grain_id": "CWRS"
```

Valid v1 values: `CWRS`, `CWAD`, `CPSR`, `CANOLA`, `BARLEY_GP_CW`, `BARLEY_GP_CE`, `CORN_CW`, `CORN_CE`, `SOYBEANS`

---

### `grain_name`

**Type:** string

The full human-readable name of the grain class, as used by the CGC.

```json
"grain_name": "Canada Western Red Spring"
```

---

### `kind`

**Type:** string (enum)

The broad category the grain belongs to.

| Value | Description |
|---|---|
| `wheat` | All wheat classes |
| `cereal` | Non-wheat cereals (barley, rye, oats, triticale) |
| `oilseed` | Canola, rapeseed, flaxseed, mustard, sunflower, safflower |
| `pulse` | Peas, lentils, beans, faba beans, chickpeas, soybeans |

```json
"kind": "wheat"
```

---

### `region`

**Type:** string (enum) or null

Indicates whether this record applies to a specific geographic production region. When a grain class has meaningfully different grade specifications between western and eastern Canada, separate records are created - one per region.

| Value | Description |
|---|---|
| `"western"` | Applies to grain grown in western Canada |
| `"eastern"` | Applies to grain grown in eastern Canada |
| `null` | No regional distinction - the record applies nationally |

```json
"region": "western"
```

`null` appears on grains like Canola and Soybeans where the CGC publishes a single national table. `"western"` and `"eastern"` appear where separate records exist, such as Barley General Purpose CW and CE.

:::note
Some grains with a single record still have regionally branching outcomes within individual factors (notably Stones). See [`fallthrough`](#fallthrough) for how this is handled at the factor level.
:::

---

### `use_class`

**Type:** string (enum) or null

For grains where different end uses produce different grade specifications, this field identifies which use class this record covers. Currently used only for Barley.

| Value | Description |
|---|---|
| `"malting"` | Selected for malting purposes |
| `"food"` | Selected for food purposes |
| `"general_purpose"` | All other barley; primarily used as feed |
| `null` | Use class is not applicable for this grain |

```json
"use_class": "general_purpose"
```

---

### `variety_tracks`

**Type:** array of track objects, or null

Used when a single grade table contains parallel columns for different variety types - distinct grade sequences that exist side by side in the same source table rather than as separate records.

In v1 this appears only in Barley General Purpose, where covered and hulless barley have separate grade sequences within the same table.

Each track object contains:

| Field | Type | Description |
|---|---|---|
| `track_id` | string | Machine-readable identifier for this track |
| `grades` | array of strings | The grade names belonging to this track, in quality order |

```json
"variety_tracks": [
  { "track_id": "covered", "grades": ["No. 1 CW", "No. 2 CW"] },
  { "track_id": "hulless", "grades": ["No. 1 CW Hulless", "No. 2 CW Hulless"] }
]
```

When `variety_tracks` is present, use it to understand which grades are comparable. Thresholds keyed to `"No. 1 CW"` and `"No. 1 CW Hulless"` are the top grade of their respective tracks - they are parallel, not sequential.

When `variety_tracks` is `null`, all grades form a single sequential quality ladder from highest to lowest.

---

### `colour_modifier`

**Type:** boolean

When `true`, the colour of the grain is appended to the grade name when expressing an official grade.

```json
"colour_modifier": true
```

For example, Soybeans grades are expressed as "No. 1 Canada Yellow" or "No. 2 Canada Brown." The API stores thresholds under base grade names (e.g. `"No. 1 Canada"`) without a colour suffix. When `colour_modifier` is `true`, append the appropriate colour when assembling a full grade name.

Grains with `colour_modifier: true` in v1: `CORN_CW`, `CORN_CE`, `SOYBEANS`

---

### `size_modifier`

**Type:** boolean

When `true`, the physical size of the grain (Large or Small, determined by sieve) is appended to the grade name. Applies to Buckwheat, which is not in v1 but is included in the schema for forward compatibility.

```json
"size_modifier": false
```

---

### `source_url`

**Type:** string

The canonical URL of the CGC source page this record was parsed from.

```json
"source_url": "https://www.grainscanada.gc.ca/en/grain-quality/official-grain-grading-guide/04-wheat/primary-grade-determination/cwrs-wheat.html"
```

---

### `crop_year`

**Type:** string

The crop year this record reflects.

```json
"crop_year": "2025/26"
```

---

### `grades`

**Type:** array of strings

The official grade names for this grain class, in quality order from highest to lowest. These are the exact strings used as keys in each factor's `thresholds` object.

```json
"grades": ["No. 1 CWRS", "No. 2 CWRS", "No. 3 CWRS", "CW Feed"]
```

---

### `grade_floor_rules`

**Type:** array of rule objects

CGC rules that prevent a sample from being graded below a certain level for a specific reason, even when factor measurements would otherwise place it lower.

Each rule object contains:

| Field | Type | Description |
|---|---|---|
| `account` | string | The reason (factor or condition) that triggers this floor |
| `floor_grade` | string | The lowest grade this sample can receive on this account |

```json
"grade_floor_rules": [
  { "account": "mildew", "floor_grade": "No. 3 CWRS" }
]
```

Floor rules are evaluated after all factor thresholds. The process is:

1. Evaluate all factors and determine the grade each would assign
2. The lowest grade from step 1 is the preliminary grade
3. Check whether any floor rules apply to the account that produced the preliminary grade
4. If a floor rule applies, the final grade is the floor grade

Floor rules are account-specific - a floor that applies on account of mildew does not protect against downgrade on account of light weight. When `grade_floor_rules` is an empty array, no floor rules apply.

---

## Factor group fields

Factor groups organize related grading factors. Each grain record contains one or more factor groups.

### `group_id`

**Type:** string

Machine-readable identifier for this factor group.

---

### `group_label`

**Type:** string

Human-readable name for the group, as used in the CGC source table.

---

### `footnotes`

**Type:** object or null

A keyed object of footnote strings referenced by factors within this group. Keys are footnote identifiers (e.g. `"1"`, `"a"`); values are the full footnote text.

```json
"footnotes": {
  "1": "Percent by weight.",
  "2": "Not included in total damage assessment."
}
```

`null` when no footnotes apply to this group.

---

## Factor fields

Each factor represents one grading criterion within a factor group.

### `factor_id`

**Type:** string

Machine-readable identifier for this factor. Unique within a grain record.

```json
"factor_id": "ergot"
```

---

### `factor_label`

**Type:** string

Human-readable factor name, as used by the CGC.

```json
"factor_label": "Ergot"
```

---

### `unit`

**Type:** string or null

The unit of measurement for this factor's thresholds.

```json
"unit": "%"
```

`null` for qualitative factors where no unit applies.

---

### `unit_alt`

**Type:** string or null

A secondary unit of measurement. Present only on test weight factors, where the CGC expresses thresholds in both kg/hL and g/0.5L. `null` in all other cases.

---

### `threshold_direction`

**Type:** string (enum) or null

Indicates how a sample's measured value should be compared against the threshold.

| Value | Description |
|---|---|
| `"maximum"` | Sample must not exceed this value |
| `"minimum"` | Sample must meet or exceed this value |
| `null` | Factor is qualitative - no numeric comparison applies |

---

### `is_aggregate`

**Type:** boolean

When `true`, this factor's threshold applies to the sum of two or more other factors listed in `aggregates`.

A sample must pass both the individual factor thresholds and the aggregate threshold to achieve a given grade. See [Aggregate factors](#aggregate-factors-is_aggregate-and-aggregates) for detail.

---

### `aggregates`

**Type:** array of strings or null

When `is_aggregate` is `true`, lists the `factor_id` values of the contributing factors whose measurements are summed. `null` when `is_aggregate` is `false`.

```json
"aggregates": ["shrunken", "broken"]
```

---

### `footnote_ref`

**Type:** string or null

References a key in the parent group's `footnotes` object. When present, the referenced footnote text is essential context for interpreting this factor's thresholds.

```json
"footnote_ref": "1"
```

---

### `thresholds`

**Type:** object

A keyed object mapping each grade name to a threshold object. Keys are the exact grade name strings from the grain record's `grades` array.

```json
"thresholds": {
  "No. 1 CWRS": { "value_type": "numeric", "value": 0.04, "value_alt": null, "threshold_note": null },
  "No. 2 CWRS": { "value_type": "numeric", "value": 0.04, "value_alt": null, "threshold_note": null },
  "No. 3 CWRS": { "value_type": "numeric", "value": 0.04, "value_alt": null, "threshold_note": null },
  "CW Feed":    { "value_type": "numeric", "value": 0.10, "value_alt": null, "threshold_note": null }
}
```

---

### `fallthrough`

**Type:** string or array

The CGC-specified outcome when a sample exceeds (or fails to meet) this factor's threshold. `null` when no specific downgrade outcome is defined.

**Simple string** - one outcome applies unconditionally:

```json
"fallthrough": "Wheat, Sample CW Account Ergot"
```

**Array of condition objects** - outcome varies by how far the threshold is exceeded, or by region:

```json
"fallthrough": [
  { "condition": "<= 2.5%", "region": "west", "grade": "Canola, Rejected (grade) Account Stones" },
  { "condition": "<= 2.5%", "region": "east", "grade": "Canola, Sample Canada Account Stones" },
  { "condition": "> 2.5%",  "region": null,   "grade": "Canola, Sample Salvage" }
]
```

Evaluate conditions in order. Apply the first condition that matches the sample's measured value and region. When `region` is `null` within a condition object, that outcome applies regardless of region.

---

## Threshold fields

A threshold object describes the value at which a factor passes or fails for a specific grade.

### `value_type`

**Type:** string (enum)

Describes the nature of the threshold value and how it should be interpreted.

| Value | Description |
|---|---|
| `"numeric"` | A number. Compare the sample's measured value against `value` using `threshold_direction`. |
| `"no_limit"` | No ceiling or floor applies at this grade level. The factor is not a limiting factor for this grade. |
| `"qualitative"` | A text description or specification. Not directly machine-comparable. |
| `"qualitative_judgment"` | A text instruction replacing a numeric threshold at a specific grade - the grader must exercise judgment. Appears only where sibling grades have numeric thresholds. |
| `"not_applicable"` | This factor is not assessed at this grade level at all. |

The distinction between `qualitative` and `qualitative_judgment`: `qualitative` appears on factors that are descriptive by nature throughout all grades. `qualitative_judgment` appears only where a factor is otherwise numeric but the CGC has substituted an explicit judgment instruction at a specific grade. The only v1 occurrence is CWAD smudge factors at No. 4 CWAD.

See [`no_limit` vs `not_applicable`](#no_limit-vs-not_applicable) for the important distinction between those two types.

---

### `value`

**Type:** number, string, or null

The threshold value. Its type depends on `value_type`:

| value_type | value type | Notes |
|---|---|---|
| `"numeric"` | number | The threshold number in the primary unit |
| `"no_limit"` | null | No value; limit does not exist |
| `"qualitative"` | string | The full CGC prose description |
| `"qualitative_judgment"` | string | The CGC instruction text |
| `"not_applicable"` | null | No value; factor does not apply |

```json
{ "value_type": "numeric", "value": 0.04 }
{ "value_type": "no_limit", "value": null }
{ "value_type": "qualitative", "value": "Reasonably well matured, reasonably free from damaged kernels" }
{ "value_type": "qualitative_judgment", "value": "Consider overall appearance" }
{ "value_type": "not_applicable", "value": null }
```

---

### `value_alt`

**Type:** number or null

The threshold value in the secondary unit (`unit_alt`). Present only on test weight thresholds. `null` in all other cases.

```json
{ "value_type": "numeric", "value": 75, "value_alt": 365 }
```

This means the No. 1 CWRS test weight minimum is 75 kg/hL, equivalent to 365 g/0.5L.

---

### `threshold_note`

**Type:** string or null

A qualifying annotation that modifies how the threshold value should be interpreted, without replacing the value itself.

```json
{ "value_type": "no_limit", "value": null, "threshold_note": "within broken tolerances" }
{ "value_type": "numeric", "value": 8, "threshold_note": "excluding frost" }
```

`null` in the vast majority of cases. When present, the note is essential context - do not ignore it.

---

## Special values

### `threshold_direction: null`

`threshold_direction` is `null` on any factor where the CGC specifies a text description instead of a numeric limit. This is intentional and not a data error.

Common examples are Degree of soundness and Variety. For these factors, the CGC defines what a sample must look like or be - not a number to exceed or fall below. Consumers building a grading tool should treat `threshold_direction: null` factors as informational - they cannot be automatically compared against a sample measurement.

---

### `no_limit` vs `not_applicable`

These two `value_type` values look similar but represent meaningfully different situations.

**`no_limit`** means the factor is assessed for this grade, but there is no ceiling or floor. The sample cannot fail this grade on account of this factor alone.

Example: Dark immature kernels in CWRS CW Feed have `value_type: "no_limit"`. A sample graded CW Feed can contain any percentage - this factor will not further downgrade it. But the factor is still a real consideration at No. 1, 2, and 3.

**`not_applicable`** means the factor is not assessed at this grade level at all.

Example: The Varieties with adhered hulls factor in Barley GP has `value_type: "not_applicable"` at No. 1 CW and No. 2 CW. This factor only applies to the hulless track.

`no_limit` means "no threshold to fail." `not_applicable` means "do not assess this factor for this grade." These require different handling in a grading tool.

---

### Aggregate factors (`is_aggregate` and `aggregates`)

Some factors are totals of two or more other factors in the same group. These exist because a sample can pass each individual sub-factor threshold while still failing the combined total.

Example: A CWRS sample might have 4% shrunken (under the 4% limit) and 5% broken (under the 5% No. 1 limit) - but 9% total, which exceeds the 7% No. 1 total limit.

When `is_aggregate` is `true`:
- `aggregates` lists the `factor_id` values of the contributing factors
- The threshold applies to the sum of those factors' measurements
- A sample must pass both individual and aggregate thresholds to achieve a given grade

Evaluate individual factors first, then evaluate aggregate factors against the sum of the referenced measurements. A sample's grade is determined by the most restrictive factor.