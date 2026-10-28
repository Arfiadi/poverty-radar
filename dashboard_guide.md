# Dashboard Design Guide

**Sources:** *Storytelling with Data* (Knaflic) · *Information Dashboard Design* (Few) · *Practical Dashboards* (Desbarats)
**Use:** Standing reference for an AI coding agent building dashboards / data visualizations. Apply when selecting chart types, laying out screens, choosing colors, and designing KPIs.

---

## 1. Dashboard Purpose & Scope

### Rules
- Define the dashboard's function before building: **monitoring** (at-a-glance status, refreshed frequently), **analysis** (exploration, filtering, drill-down), or **communication** (persuading an audience of one conclusion). Each requires different layout and interactivity (Desbarats).
- A monitoring dashboard must fit on a single screen with no scrolling; if content needs scrolling, split into multiple linked screens or demote it to a report (Few).
- Cap a single monitoring screen at roughly 5-9 key metrics — this matches the number of chunks a viewer can hold in working memory at once (Few).
- Match content to the specific decisions/questions the audience needs to answer; don't include a metric "because the data exists" (Desbarats, Knaflic).
- Don't label something a "dashboard" if it's actually a static report or a large table — the two have different design rules (Few, Desbarats).
- Add interactivity (filters, drill-downs) only when the dashboard's purpose is analytical; a monitoring dashboard should answer its core question with zero clicks (Desbarats).

### Do / Don't
- [ ] Do state the dashboard's primary question/decision before building.
- [ ] Do cap monitoring dashboards at one viewport, no scroll.
- [ ] Don't mix a deep analytical tool and a glanceable status screen in one view.
- [ ] Don't add a filter/control unless a defined user task requires it.

---

## 2. Layout & Visual Hierarchy

### Rules
- Place the single most important metric/chart top-left; viewers scan in an F- or Z-pattern starting there (Few).
- Order content by importance, not by data source or by when the data became available (Knaflic).
- Group related metrics using proximity and consistent alignment (Gestalt grouping) so sections are parsed visually without needing extra labels (Few, Knaflic).
- Use a consistent grid with aligned container edges; ragged alignment reads as unfinished and slows scanning (Few).
- Establish visual hierarchy with size, weight, and position — the most important chart/number should look most prominent, not merely appear first (Knaflic).
- Use white space deliberately around groups; don't fill empty space with decorative content — empty space is a hierarchy signal, not a flaw (Knaflic, Few).
- Keep labels/titles close to the chart they describe (proximity) rather than in a detached legend when avoidable (Knaflic).

### Do / Don't
- [ ] Do put the top-priority KPI top-left.
- [ ] Do align all chart containers to a shared grid.
- [ ] Do visibly separate unrelated metric groups with spacing.
- [ ] Don't scatter related metrics across the screen to "balance" it visually.
- [ ] Don't fill blank space with logos, icons, or background images carrying no data.

---

## 3. Chart Type Selection

### Rules
- Use bar charts (horizontal or vertical) for comparing values across categories; always start the value axis at zero (Knaflic, Few).
- Use line charts for trends over continuous time; don't use bars for long time series or lines for discrete unordered categories (Knaflic, Few).
- Avoid pie and donut charts in general — angle and area are harder to compare accurately than position/length. If used, limit to 2-3 slices with one clearly dominant category (Knaflic, Few). Desbarats is more permissive for a strict two-category split but still defaults to bar charts.
- Avoid 3D charts entirely — 3D perspective distorts perceived value and adds no data (Few, Knaflic).
- Avoid dual-axis charts (two different y-axis scales on one chart) — they invite misleading comparisons; use two adjacent charts with matched scales instead (Few, Desbarats).
- Avoid gauges, dials, and speedometer-style meters — very low data density (one value per large area) and poor read precision; use a bullet graph instead (Few). Desbarats agrees, adding that gauges mimic unfamiliar physical instruments that rarely fit screen space well.
- Use a bullet graph (single bar + target tick + qualitative range bands) when a KPI needs actual-vs-target-vs-range in minimal space (Few).
- Use scatter plots for correlation between two continuous variables (Knaflic, Few).
- Use small multiples (a grid of identical small charts, same scale, one per segment) instead of one cluttered combined chart when comparing a metric across many segments (Few, Knaflic).
- Use heatmap/matrix views for scanning many category-by-category values at once (Desbarats).
- Use waterfall charts to show variance decomposition (start value → contributing changes → end value) (Desbarats).
- Avoid radar/spider charts for more than 2 series; area comparisons across axes are misread (Few, Knaflic).
- Prefer chart types the audience already knows; avoid exotic/novel types unless the audience is trained to read them — comprehension cost outweighs novelty (Desbarats).

### Do / Don't
- [ ] Do start bar chart value axes at zero.
- [ ] Do use line charts for continuous time series.
- [ ] Don't use pie/donut charts for more than 3 categories.
- [ ] Don't use 3D variants of any chart type.
- [ ] Don't use dual y-axes.
- [ ] Don't use gauges/dials/speedometers — use a bullet graph instead.
- [ ] Do use small multiples instead of one chart with 8+ overlapping series.

---

## 4. Color Usage

### Rules
- Default to a neutral/grayscale palette; reserve a single saturated accent color for the one data point/series that matters most (Knaflic).
- Limit distinct categorical hues to roughly 5-6 max; beyond that viewers can't reliably map color to category from memory (Few).
- Don't use color as the sole encoding for a critical distinction — pair it with position, label, or icon so colorblind viewers aren't excluded (Desbarats, Few).
- **Flagged disagreement on red/yellow/green ("traffic light") status coloring:** Desbarats argues it's easy to overuse, causes "alarm fatigue" when too many items are flagged at once, and is unreadable to red-green colorblind users without a redundant cue — he recommends a neutral-plus-single-accent scheme by default, reserving red only for genuine critical alerts. Few is more accepting of RYG specifically for exception-highlighting, provided it's used sparingly and consistently. Default to Desbarats' more conservative approach unless the audience specifically expects RYG conventions.
- Keep color-to-meaning mapping consistent across every chart on the dashboard (e.g., if blue = "actual" on one chart, it must mean "actual" everywhere) (Knaflic, Few).
- Avoid decorative or purely aesthetic color gradients/backgrounds that encode no data (Few).
- Use sequential (light→dark, single hue) scales for ordered/continuous data (e.g., heatmap magnitude); use diverging scales only when there's a meaningful midpoint (e.g., zero, target) (Few).

### Do / Don't
- [ ] Do use gray as the default color for non-highlighted data.
- [ ] Do reserve one accent color for the single most important series/value.
- [ ] Don't rely on color alone to flag a critical status — add an icon or label too.
- [ ] Don't use more than ~6 distinct hues in one categorical legend.
- [ ] Don't apply RYG status colors to every metric on the screen simultaneously.

---

## 5. Decluttering & Data-Ink Ratio

### Rules
- Remove every chart element that doesn't represent data: heavy borders/boxes, background fills, 3D effects, drop shadows, decorative icons (Few, Knaflic).
- Remove or drastically lighten gridlines — visible only enough to support reading exact values, never competing with the data itself (Few, Knaflic).
- Remove redundant axis labels/tick marks when direct data labels are already present (Knaflic).
- Prefer direct labeling of data series (label at the line/bar end) over a separate legend, which forces back-and-forth eye movement (Knaflic).
- Remove unnecessary legend entries, chart titles that just restate axis labels, and repeated units on every data label (state the unit once) (Knaflic, Few).
- Every remaining visual element must justify its presence by communicating data; if removing it changes nothing the viewer understands, remove it (Few's data-ink ratio principle; Knaflic calls this eliminating "clutter").

### Do / Don't
- [ ] Do strip chart borders, drop shadows, and background fills by default.
- [ ] Do lighten gridlines to minimal, low-contrast gray, or remove them if direct labels are present.
- [ ] Do label data directly on the chart instead of defaulting to a legend.
- [ ] Don't repeat the same unit/label text on every data point when it can be stated once.
- [ ] Don't add an element (icon, pattern fill, texture) purely for visual interest.

---

## 6. KPI / Metric Design

### Rules
- Never show a bare number without context — a number alone (e.g., "1,204 sales") is close to meaningless; pair it with a comparison value: prior period, target/budget, or benchmark (Desbarats).
- Show direction and magnitude of change (e.g., "+8% vs. last month") alongside the raw value, not just the raw value (Desbarats, Knaflic).
- For KPIs with a defined target, use a bullet graph instead of a plain number or a gauge — far more information-dense (Few).
- Pick one dominant number per KPI card; if several numbers are shown, visually establish which is primary (largest/boldest) and which are supporting context (smaller/muted) (Knaflic).
- Use sparklines (small inline trend lines) next to a KPI value to show recent trend history without a full chart (Few).
- Define and apply "good/bad" threshold logic consistently and document it — don't let color or arrow direction imply the wrong meaning for metrics where lower is better (Desbarats).
- Round displayed numbers to the precision the audience can act on; excess decimal places add noise, not decision value (Knaflic).

### Do / Don't
- [ ] Do pair every KPI value with a comparison (target, prior period, or benchmark).
- [ ] Do show trend direction (arrow, sparkline, or delta %) next to the headline number.
- [ ] Do use bullet graphs, not gauges, for target-based KPIs.
- [ ] Don't display a raw number with no comparison point.
- [ ] Don't show more than 3-4 significant figures unless the audience explicitly needs full precision.

---

## 7. Annotation & Context

### Rules
- Add direct text call-outs on the chart itself stating the key takeaway ("why this matters") rather than relying on separate narrative or forcing the viewer to infer it (Knaflic).
- Add reference lines for target, average, or prior-period value directly on trend/bar charts so comparison doesn't require a separate lookup (Few).
- When a metric moves outside its normal range, annotate the specific event/cause if known (e.g., "Spike due to promo launch") instead of leaving the anomaly unexplained (Knaflic, Desbarats).
- Use bold/color emphasis on specific words within a text annotation to echo the chart's accent color, reinforcing where to look (Knaflic).
- Keep annotations short — a phrase or single sentence; detailed explanation belongs in a tooltip or linked report, not on the dashboard face (Desbarats).

### Do / Don't
- [ ] Do add a one-line annotation for any statistically unusual spike/drop with a known cause.
- [ ] Do draw a reference line for target/average instead of making the viewer compute it mentally.
- [ ] Don't leave a chart title as the only text if the insight isn't self-evident.
- [ ] Don't write paragraph-length annotations directly on the dashboard.

---

## 8. Common Mistakes to Avoid
1. Using 3D charts or effects (Few, Knaflic).
2. Using pie charts for more than 3-4 categories (Knaflic, Few).
3. Using gauges/dials/speedometers instead of bullet graphs (Few, Desbarats).
4. Starting a bar chart's value axis above zero, exaggerating differences (Knaflic, Few).
5. Using dual y-axes on a single chart (Few, Desbarats).
6. Displaying a KPI number with no comparison value or trend (Desbarats).
7. Overusing red/yellow/green status coloring on every metric at once, causing alarm fatigue (Desbarats).
8. Relying on color alone to convey a critical distinction (Few, Desbarats).
9. Requiring scrolling on what's meant to be an at-a-glance monitoring dashboard (Few).
10. Packing more than ~9 metrics onto one monitoring screen (Few).
11. Leaving default gridlines, chart borders, and background fills untouched (Few, Knaflic).
12. Using a legend when direct labeling would remove the need for one (Knaflic).
13. Choosing a chart type for novelty rather than audience familiarity (Desbarats).
14. Mixing a monitoring-purpose screen with heavy analytical interactivity the audience doesn't need (Desbarats).
15. Showing excessive decimal precision that adds no decision value (Knaflic).

---

## Quick Reference Checklist
1. Define the dashboard's purpose (monitor / analyze / communicate) before building (Desbarats).
2. Fit monitoring dashboards on one screen, no scroll, ~5-9 metrics max (Few).
3. Place the most important metric top-left; group related items by proximity (Few, Knaflic).
4. Bar charts for categorical comparison, zero-baseline always (Knaflic, Few).
5. Line charts for time trends; avoid bars for long time series (Knaflic, Few).
6. No pie/donut charts beyond 2-3 slices; no 3D charts ever (Knaflic, Few).
7. No gauges/dials/speedometers — use bullet graphs for target-based KPIs (Few).
8. No dual y-axes — use two aligned small charts instead (Few, Desbarats).
9. Default palette: gray + one accent color; max ~6 categorical hues (Knaflic, Few).
10. Never encode a critical distinction with color alone (Desbarats, Few).
11. Use RYG status coloring sparingly and consistently; prefer neutral + accent by default (Desbarats).
12. Strip borders, shadows, 3D, and heavy gridlines from every chart (Few, Knaflic).
13. Every KPI needs a comparison value (target/prior period) and trend direction (Desbarats).
14. Prefer direct data labeling over legends (Knaflic).
15. Annotate anomalies with a short, specific cause when known (Knaflic, Desbarats).
