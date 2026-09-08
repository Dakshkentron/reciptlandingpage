/**
 * Shape of the company metrics returned by Receipt.
 *
 * Mirrors `lib/shared/admin/admin-overview.ts` in the Receipt repo field for
 * field, so drift between the two surfaces here as a type error rather than a
 * blank column.
 *
 * The upstream query stays aggregate for everything except the prompt feed: no
 * email addresses, no assistant replies, no connection secrets, no tokens. Do
 * not widen these types to carry any of that.
 *
 * `AdminPromptRow` is the deliberate exception — it carries the text people type
 * into Receipt, truncated upstream. It exists because the console is meant to
 * answer "what are customers actually asking for", which counts alone cannot.
 */

export interface AdminCompanyRow {
  organizationId: string;
  name: string;
  slug: string;
  createdAt: string | null;
  members: number;
  integrationsTotal: number;
  integrationsValid: number;
  providers: string[];
  lastLoginAt: string | null;
  /** Sessions that have not expired — not a count of who is online right now. */
  activeSessions: number;
  /** User-typed prompts, all time. Assistant replies are not counted. */
  prompts: number;
  /** The same count over the last seven days, which is what "still active" means. */
  promptsLast7Days: number;
  lastPromptAt: string | null;
}

/** One prompt somebody typed. Carries no user id and no email, by design. */
export interface AdminPromptRow {
  messageId: string;
  organizationId: string;
  organizationName: string;
  /** Already truncated by Receipt; `truncated` says whether that happened. */
  text: string;
  truncated: boolean;
  createdAt: string | null;
  model: string | null;
}

export interface AdminTotals {
  companies: number;
  members: number;
  integrations: number;
  activeSessions: number;
  prompts: number;
  promptsLast7Days: number;
}

export interface AdminViewer {
  id: string;
  email: string;
  name: string;
}

export interface AdminOverview {
  /** When Receipt ran the query, not when this page rendered it. */
  generatedAt: string;
  totals: AdminTotals;
  companies: AdminCompanyRow[];
  recentPrompts: AdminPromptRow[];
  viewer: AdminViewer;
  /**
   * Set only by the temporary demo account. The header shows a "Demo data"
   * badge when it is true, so invented figures can never be read as real
   * customers. Real responses from Receipt never carry it.
   */
  demo?: boolean;
}

/**
 * Mirrors `lib/shared/admin/admin-run.ts` in the Receipt repo, field for
 * field. Backs `GET /api/admin-run` — the prompt inspector's execution trace.
 *
 * Deliberately carries no message text from either side, same boundary as
 * `AdminPromptRow` draws around the assistant's reply. See the Receipt-side
 * file for why: this shows a run's timing, status, cost, and — when a
 * background objective carried it out — that objective's id and step
 * timeline, not what it said or did.
 */
export interface AdminRunStep {
  seq: number;
  ts: string | null;
  eventType: string;
}

export interface AdminRunObjective {
  objectiveId: string;
  title: string;
  status: string;
  latestSummary: string | null;
  blockedReason: string | null;
}

export interface AdminRunDetail {
  runId: string;
  chatId: string;
  organizationId: string;
  model: string | null;
  status: string | null;
  serverError: string | null;
  inputTokens: number | null;
  outputTokens: number | null;
  cacheReadTokens: number | null;
  cacheWriteTokens: number | null;
  estimatedCost: number | null;
  startedAt: string | null;
  completedAt: string | null;
  objective: AdminRunObjective | null;
  steps: AdminRunStep[];
}
