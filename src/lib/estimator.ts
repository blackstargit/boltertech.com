import estimatorData from "../../data/estimator.json";

/**
 * The project cost estimator.
 *
 * Every number and label comes from `data/estimator.json` — this file only
 * holds the arithmetic and a build-time guard. A selection sums into a point
 * estimate, which is spread into a low/high band. Nothing about the maths is
 * hardcoded in a component.
 *
 * The data is validated at module load (see the bottom of this file), so a
 * broken `estimator.json` fails the build naming the field rather than
 * rendering `NaN` to a visitor — the same contract the content pipeline has.
 */

export type EstimatorOption = {
  id: string;
  label: string;
  /** Flat contribution to the running total, in `currency`. */
  add?: number;
  /** Multiplies the running total after all `add`s. For urgency, retainers. */
  mult?: number;
  /** Optional. If no option anywhere carries one, no timeline line is shown. */
  weeks?: number;
};

export type EstimatorGroup = {
  id: string;
  label: string;
  hint?: string;
  type: "single" | "multi";
  /** If "projectType", the chosen option id (when ai|automation|software|data)
   *  is forwarded to the contact form payload. */
  role?: "projectType";
  options: EstimatorOption[];
};

export type EstimatorData = {
  currency: string;
  symbol: string;
  base: number;
  spread: number;
  roundTo: number;
  minimum: number;
  disclaimer: string;
  groups: EstimatorGroup[];
};

export const estimator = estimatorData as unknown as EstimatorData;

/** groupId → chosen option ids. A single-type group holds exactly one. */
export type Selections = Record<string, string[]>;

export type ProjectType =
  "ai" | "automation" | "software" | "data" | "not-sure";

export type Estimate = {
  low: number;
  high: number;
  /** Absent unless the data carries `weeks` values. */
  weeks?: { low: number; high: number };
  projectType: ProjectType;
};

const PROJECT_TYPES = ["ai", "automation", "software", "data"] as const;

function isProjectType(id: string): id is Exclude<ProjectType, "not-sure"> {
  return (PROJECT_TYPES as readonly string[]).includes(id);
}

const roundTo = (n: number, step: number) =>
  Math.max(0, Math.round(n / step) * step);

export function estimate(selections: Selections): Estimate {
  let sum = estimator.base;
  let mult = 1;
  let weeks = 0;
  let anyWeeks = false;
  let projectType: ProjectType = "not-sure";

  for (const group of estimator.groups) {
    const chosen = selections[group.id] ?? [];
    for (const opt of group.options) {
      if (!chosen.includes(opt.id)) continue;
      if (opt.add) sum += opt.add;
      if (opt.mult) mult *= opt.mult;
      if (opt.weeks !== undefined) {
        anyWeeks = true;
        weeks += opt.weeks;
      }
      if (group.role === "projectType" && isProjectType(opt.id)) {
        projectType = opt.id;
      }
    }
  }

  const total = sum * mult;
  const low = Math.max(
    estimator.minimum,
    roundTo(total * (1 - estimator.spread), estimator.roundTo),
  );
  const high = roundTo(total * (1 + estimator.spread), estimator.roundTo);

  return {
    low,
    high,
    // ponytail: weeks are summed, not scheduled — parallel work is not
    // modelled. Fine for an indicative figure; the data owner tunes the
    // per-option weeks to compensate.
    weeks: anyWeeks
      ? {
          low: Math.max(1, Math.round(weeks * 0.8)),
          high: Math.max(1, Math.round(weeks * 1.25)),
        }
      : undefined,
    projectType,
  };
}

/* ── Build-time guard ────────────────────────────────────────────────────
   Runs once at module load. The /estimate page imports this module during
   `next build`, so a bad data file stops the deploy here. This is also the
   runnable check for estimate(): the maximal selection must still produce a
   finite, ordered range. */
function assertValid(d: EstimatorData) {
  const scalars: [string, number][] = [
    ["base", d.base],
    ["spread", d.spread],
    ["roundTo", d.roundTo],
    ["minimum", d.minimum],
  ];
  for (const [key, value] of scalars) {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(
        `estimator.json: "${key}" must be a non-negative number, got ${JSON.stringify(value)}`,
      );
    }
  }
  if (d.spread >= 1)
    throw new Error('estimator.json: "spread" must be below 1');
  if (d.roundTo <= 0) throw new Error('estimator.json: "roundTo" must be > 0');
  if (!Array.isArray(d.groups) || d.groups.length === 0) {
    throw new Error('estimator.json: "groups" is empty');
  }

  for (const g of d.groups) {
    if (g.type !== "single" && g.type !== "multi") {
      throw new Error(
        `estimator.json: group "${g.id}" has invalid type ${JSON.stringify(g.type)}`,
      );
    }
    if (!Array.isArray(g.options) || g.options.length === 0) {
      throw new Error(`estimator.json: group "${g.id}" has no options`);
    }
    for (const o of g.options) {
      for (const [key, value] of [
        ["add", o.add],
        ["mult", o.mult],
        ["weeks", o.weeks],
      ] as const) {
        if (value !== undefined && (!Number.isFinite(value) || value < 0)) {
          throw new Error(
            `estimator.json: option "${g.id}/${o.id}" field "${key}" must be a non-negative number, got ${JSON.stringify(value)}`,
          );
        }
      }
    }
  }

  const everything: Selections = Object.fromEntries(
    d.groups.map((g) => [g.id, g.options.map((o) => o.id)]),
  );
  const probe = estimate(everything);
  if (
    !Number.isFinite(probe.low) ||
    !Number.isFinite(probe.high) ||
    probe.low > probe.high
  ) {
    throw new Error(
      `estimator.json: produces an invalid range (${probe.low}–${probe.high})`,
    );
  }
}

assertValid(estimator);
