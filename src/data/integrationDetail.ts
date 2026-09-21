/**
 * Per-connector page content.
 *
 * The catalog carries ~1,000 connectors, so detail-page copy is generated from
 * the connector's category rather than hand-written per tool: each category owns
 * a bank of actions, example asks, and a positioning line, and a name-derived
 * hash picks a stable slice so a given connector always renders the same page.
 */
import { slugify } from '@/data/logos';
import { integrationCatalog, type Category, type Integration } from '@/data/integrations';

export interface Action {
  name: string;
  desc: string;
}

interface CategoryTemplate {
  /** One line on what this class of tool is for, used under the hero. */
  role: string;
  /** What Kentron AI does with it, spliced into the hero paragraph. */
  outcome: string;
  actions: Action[];
  prompts: string[];
}

const templates: Record<Category, CategoryTemplate> = {
  'AI & Machine Learning': {
    role: 'AI platform',
    outcome: 'run models, manage keys, and track spend',
    actions: [
      { name: 'List models', desc: 'Pull the models available on your {tool} account, with context limits and pricing.' },
      { name: 'Run completion', desc: 'Send a prompt to {tool} and capture the full response as evidence on the receipt.' },
      { name: 'List API keys', desc: 'Inventory the keys on the {tool} workspace and which projects they belong to.' },
      { name: 'Get usage', desc: 'Read token and request usage from {tool} for any date range, broken down by model.' },
      { name: 'Get spend', desc: 'Pull current-period {tool} spend and compare it against the previous period.' },
      { name: 'List projects', desc: 'List the {tool} projects or workspaces the connection can reach.' },
      { name: 'Create embedding', desc: 'Generate embeddings through {tool} for a batch of documents you supply.' },
      { name: 'List fine-tunes', desc: 'Read fine-tuning jobs on {tool} with their status and base model.' },
      { name: 'Get rate limits', desc: 'Check the current {tool} rate limits and how close the org is to hitting them.' },
      { name: 'List files', desc: 'List files uploaded to {tool}, their purpose, and their size.' },
    ],
    prompts: [
      'Pull our {tool} spend for the month and tell me which model is driving the increase.',
      'Check whether any {tool} API keys are unused and list the projects they belong to.',
      'Compare {tool} token usage this week against last week and post the delta to Slack.',
      'Summarize which {tool} models we call most and what each one costs us per day.',
    ],
  },
  Analytics: {
    role: 'analytics platform',
    outcome: 'pull metrics, build reports, and explain the movement behind them',
    actions: [
      { name: 'Run report', desc: 'Run a {tool} report for any metric, dimension, and date range you name.' },
      { name: 'List metrics', desc: 'List the metrics and dimensions defined in {tool} so you can ask for them by name.' },
      { name: 'Get funnel', desc: 'Read a {tool} funnel and the step-by-step conversion between each stage.' },
      { name: 'Compare periods', desc: 'Pull two date ranges from {tool} and calculate the change on every metric.' },
      { name: 'List dashboards', desc: 'List {tool} dashboards and the reports each one contains.' },
      { name: 'Get segment', desc: 'Read a saved {tool} segment and the population currently inside it.' },
      { name: 'Export raw rows', desc: 'Export the underlying {tool} rows behind a number, attached to the receipt.' },
      { name: 'Get realtime', desc: 'Read live {tool} activity for the last 30 minutes.' },
      { name: 'List properties', desc: 'List the {tool} properties, views, or projects the connection can reach.' },
      { name: 'Create annotation', desc: 'Write an annotation into {tool} so a spike has its explanation attached.' },
    ],
    prompts: [
      'Pull last week from {tool}, find the biggest drop, and tell me which channel caused it.',
      'Compare this month against last month in {tool} and draft the summary for the team.',
      'Build the weekly {tool} report and post it to Slack every Monday morning.',
      'Which {tool} segments grew fastest this quarter, and what do they have in common?',
    ],
  },
  'Cloud & Data': {
    role: 'cloud and data platform',
    outcome: 'audit resources, read state, and reconcile spend',
    actions: [
      { name: 'List resources', desc: 'Inventory the resources in your {tool} account with region, owner, and tags.' },
      { name: 'Get cost breakdown', desc: 'Pull {tool} spend by service, account, and tag for any period.' },
      { name: 'Run query', desc: 'Run a read query against {tool} and attach the returned rows to the receipt.' },
      { name: 'List instances', desc: 'List running compute in {tool}, with size, uptime, and utilization.' },
      { name: 'Get logs', desc: 'Pull {tool} logs for a service and time window, filtered to what you asked for.' },
      { name: 'Check IAM', desc: 'Read {tool} roles and policies and flag over-broad permissions.' },
      { name: 'List storage', desc: 'List {tool} buckets or volumes with size, class, and public-access status.' },
      { name: 'Get alerts', desc: 'Read open {tool} alerts and the resources that triggered them.' },
      { name: 'List deployments', desc: 'Read recent {tool} deployments and their status.' },
      { name: 'Tag resource', desc: 'Apply or correct tags on {tool} resources — behind an approval gate.' },
    ],
    prompts: [
      'Audit our {tool} spend this month and list the ten resources costing the most.',
      'Find untagged resources in {tool} and tell me who created them.',
      'Check {tool} for anything provisioned last week that nobody is using.',
      'Pull the {tool} logs around the incident and summarize what failed first.',
    ],
  },
  Communication: {
    role: 'communication tool',
    outcome: 'read threads, draft replies, and keep the right people in the loop',
    actions: [
      { name: 'Send message', desc: 'Post a message to a {tool} channel or person — drafted for your review first.' },
      { name: 'List channels', desc: 'List the {tool} channels or conversations the connection can reach.' },
      { name: 'Search messages', desc: 'Search {tool} history for a term, person, or date range.' },
      { name: 'Read thread', desc: 'Pull a full {tool} thread with every reply in order.' },
      { name: 'Summarize channel', desc: 'Read a {tool} channel over a window and summarize decisions and open items.' },
      { name: 'List users', desc: 'List {tool} members, their status, and which teams they belong to.' },
      { name: 'Upload file', desc: 'Attach a file or report to a {tool} conversation.' },
      { name: 'Schedule message', desc: 'Queue a {tool} message to send at a time you pick.' },
      { name: 'Add reaction', desc: 'React to a {tool} message to acknowledge it without a reply.' },
      { name: 'Create channel', desc: 'Open a new {tool} channel and invite the people involved.' },
    ],
    prompts: [
      'Summarize what happened in the {tool} incident channel overnight.',
      'Find every {tool} message about the pricing change and pull out the decisions.',
      'Draft the release note and post it to {tool} once I approve it.',
      'Who has been asking about the migration in {tool} this week?',
    ],
  },
  'Content & Media': {
    role: 'content platform',
    outcome: 'audit content, pull performance, and publish once you approve',
    actions: [
      { name: 'List content', desc: 'List entries, pages, or assets in {tool} with author and status.' },
      { name: 'Get item', desc: 'Read a single {tool} item in full, including metadata and revision history.' },
      { name: 'Search library', desc: 'Search the {tool} library by title, tag, or collection.' },
      { name: 'Get performance', desc: 'Pull views, watch time, or engagement for {tool} content.' },
      { name: 'Create draft', desc: 'Write a new draft into {tool} for a human to review and publish.' },
      { name: 'Update metadata', desc: 'Correct titles, tags, or descriptions on {tool} items — behind an approval gate.' },
      { name: 'List collections', desc: 'List {tool} collections, spaces, or folders and what sits in each.' },
      { name: 'Export asset', desc: 'Export a {tool} asset and attach it to the receipt.' },
      { name: 'Find stale content', desc: 'Flag {tool} content that has not been updated or viewed in a while.' },
      { name: 'List comments', desc: 'Read comments left on {tool} content and who is waiting on a reply.' },
    ],
    prompts: [
      'Find the {tool} content that has not been touched in a year and list what to retire.',
      'Which {tool} posts drove the most engagement last month?',
      'Draft next week’s post in {tool} and leave it unpublished for me to review.',
      'Audit {tool} for missing descriptions or tags and give me the fix list.',
    ],
  },
  'Customer Support': {
    role: 'support desk',
    outcome: 'triage tickets, draft replies, and spot the themes behind the volume',
    actions: [
      { name: 'List tickets', desc: 'Pull {tool} tickets filtered by status, queue, priority, or assignee.' },
      { name: 'Get ticket', desc: 'Read one {tool} ticket in full, with the whole customer conversation.' },
      { name: 'Draft reply', desc: 'Write a reply on a {tool} ticket, held for your approval before it sends.' },
      { name: 'Update ticket', desc: 'Change status, priority, tags, or assignee on a {tool} ticket.' },
      { name: 'Search tickets', desc: 'Search {tool} across subjects and bodies for an issue or customer.' },
      { name: 'Get SLA breaches', desc: 'List {tool} tickets past their SLA and how far over they are.' },
      { name: 'Summarize themes', desc: 'Cluster recent {tool} tickets and report the recurring root causes.' },
      { name: 'List agents', desc: 'Read {tool} agents, their queues, and current load.' },
      { name: 'Add internal note', desc: 'Leave an internal note on a {tool} ticket for the next agent.' },
      { name: 'Get satisfaction', desc: 'Pull CSAT scores from {tool} and the comments behind low ratings.' },
    ],
    prompts: [
      'Triage the open {tool} queue and tell me which five tickets need a human today.',
      'Find every {tool} ticket about the failed export and summarize the root cause.',
      'Draft replies for the {tool} tickets waiting longest — I’ll approve before they send.',
      'What are customers complaining about most in {tool} this month?',
    ],
  },
  'Developer Tools': {
    role: 'engineering system',
    outcome: 'read code, move issues, and open pull requests',
    actions: [
      { name: 'List repositories', desc: 'List the {tool} repositories or projects the connection can reach.' },
      { name: 'Search code', desc: 'Search {tool} across files and history for a symbol, string, or pattern.' },
      { name: 'Open pull request', desc: 'Push a branch and open a PR in {tool} — you review the diff before merge.' },
      { name: 'List issues', desc: 'Pull {tool} issues by label, assignee, milestone, or status.' },
      { name: 'Create issue', desc: 'File a {tool} issue with the reproduction steps and evidence attached.' },
      { name: 'Review diff', desc: 'Read a {tool} diff and comment on the specific lines that need attention.' },
      { name: 'Get build status', desc: 'Read {tool} pipeline or check runs and what failed in each.' },
      { name: 'List commits', desc: 'Read {tool} commit history for a branch, path, or author.' },
      { name: 'Get release notes', desc: 'Assemble what shipped in {tool} between two tags.' },
      { name: 'Move issue', desc: 'Update {tool} issue state, assignee, or sprint as work progresses.' },
    ],
    prompts: [
      'Find the commit that introduced this bug in {tool} and open a PR with the fix.',
      'Summarize what shipped in {tool} this sprint for the release note.',
      'List the {tool} pull requests open more than a week and who is blocking each.',
      'Check which {tool} builds are failing and tell me if it is the same root cause.',
    ],
  },
  'E-Commerce': {
    role: 'commerce platform',
    outcome: 'reconcile orders, watch inventory, and chase what broke',
    actions: [
      { name: 'List orders', desc: 'Pull {tool} orders by date, status, value, or customer.' },
      { name: 'Get order', desc: 'Read one {tool} order in full, with line items, payment, and fulfilment.' },
      { name: 'List products', desc: 'List {tool} products and variants with price and stock level.' },
      { name: 'Check inventory', desc: 'Read {tool} stock levels and flag anything about to run out.' },
      { name: 'List refunds', desc: 'Pull refunds and returns from {tool} with the stated reason.' },
      { name: 'Get revenue', desc: 'Total {tool} revenue for a period, split by channel or product.' },
      { name: 'Find failed payments', desc: 'List {tool} orders where payment failed and why.' },
      { name: 'Update product', desc: 'Correct price, description, or stock in {tool} — behind an approval gate.' },
      { name: 'List customers', desc: 'Read {tool} customers with lifetime value and order count.' },
      { name: 'Get abandoned carts', desc: 'Pull abandoned {tool} checkouts and the value sitting in them.' },
    ],
    prompts: [
      'Reconcile yesterday’s {tool} orders against what landed in the bank.',
      'Which {tool} products are about to go out of stock at the current sell rate?',
      'Find the failed {tool} payments this week and draft the recovery emails.',
      'Compare {tool} revenue this month against last month by product line.',
    ],
  },
  'Finance & Payments': {
    role: 'finance system',
    outcome: 'reconcile transactions, chase invoices, and close the books faster',
    actions: [
      { name: 'List transactions', desc: 'Pull {tool} transactions for any period, with amounts, status, and counterparty.' },
      { name: 'List invoices', desc: 'Read {tool} invoices by status — draft, sent, overdue, or paid.' },
      { name: 'Create invoice', desc: 'Draft an invoice in {tool} with line items, ready for your approval.' },
      { name: 'List disputes', desc: 'Pull open {tool} disputes and chargebacks with their evidence deadlines.' },
      { name: 'Reconcile payouts', desc: 'Match {tool} payouts against the transactions that make them up.' },
      { name: 'Get balance', desc: 'Read current and pending balances on the {tool} account.' },
      { name: 'List customers', desc: 'Read {tool} customers with their payment history and outstanding balance.' },
      { name: 'Find failed payments', desc: 'List failed {tool} charges with decline codes and retry eligibility.' },
      { name: 'Create payment link', desc: 'Generate a {tool} payment link — confirmed with you before it goes out.' },
      { name: 'Get subscription status', desc: 'Read {tool} subscriptions, renewal dates, and upcoming charges.' },
      { name: 'Export ledger', desc: 'Export the {tool} ledger for a period and attach the rows to the receipt.' },
    ],
    prompts: [
      'Pull yesterday’s {tool} transactions and flag anything unusual.',
      'Find the overdue {tool} invoices and draft reminder emails to those customers.',
      'Reconcile {tool} payouts against our books for last month and show me the gaps.',
      'Which {tool} disputes have evidence deadlines in the next seven days?',
    ],
  },
  'HR & Recruiting': {
    role: 'people system',
    outcome: 'track headcount, move candidates, and keep records clean',
    actions: [
      { name: 'List employees', desc: 'Read the {tool} roster with role, team, manager, and start date.' },
      { name: 'List candidates', desc: 'Pull {tool} candidates by role, stage, and source.' },
      { name: 'Get pipeline', desc: 'Read the {tool} hiring pipeline and where each candidate is stuck.' },
      { name: 'List open roles', desc: 'List open {tool} requisitions with hiring manager and time open.' },
      { name: 'Get time off', desc: 'Read approved and pending leave in {tool} for a team or period.' },
      { name: 'Move candidate', desc: 'Advance or reject a {tool} candidate — held for your approval.' },
      { name: 'List reviews', desc: 'Read {tool} performance review cycles and completion status.' },
      { name: 'Get headcount report', desc: 'Total {tool} headcount by team, location, and employment type.' },
      { name: 'Find onboarding gaps', desc: 'Flag {tool} starters missing equipment, access, or paperwork.' },
      { name: 'Schedule interview', desc: 'Draft {tool} interview scheduling for a candidate and panel.' },
    ],
    prompts: [
      'Which {tool} roles have been open longest, and where are candidates dropping out?',
      'Pull the {tool} headcount by team and compare it against the plan.',
      'Find {tool} starters next month who are missing onboarding steps.',
      'Summarize the {tool} pipeline for engineering and tell me what needs a decision.',
    ],
  },
  Marketing: {
    role: 'marketing platform',
    outcome: 'read campaign performance, move budget, and report on what worked',
    actions: [
      { name: 'List campaigns', desc: 'Pull {tool} campaigns with status, budget, and flight dates.' },
      { name: 'Get performance', desc: 'Read spend, clicks, conversions, and CPA from {tool} for any period.' },
      { name: 'Compare channels', desc: 'Put {tool} results next to your other channels on the same metrics.' },
      { name: 'Adjust budget', desc: 'Shift {tool} budget toward what is working — behind an approval gate.' },
      { name: 'Pause campaign', desc: 'Pause an underperforming {tool} campaign once you confirm.' },
      { name: 'List audiences', desc: 'Read {tool} audiences and segments with their current size.' },
      { name: 'Get creative report', desc: 'Rank {tool} creatives or assets by performance.' },
      { name: 'List email sends', desc: 'Read {tool} sends with open, click, and unsubscribe rates.' },
      { name: 'Build report', desc: 'Assemble the {tool} weekly report with the source rows attached.' },
      { name: 'Get attribution', desc: 'Read {tool} attribution paths and which touch drove the conversion.' },
    ],
    prompts: [
      'Pull {tool} spend this week and tell me which campaigns to cut.',
      'Compare {tool} performance against pipeline in the CRM and show me the real CAC.',
      'Build the weekly {tool} report and post it to Slack with the source numbers attached.',
      'Which {tool} creatives are beating the account average right now?',
    ],
  },
  Other: {
    role: 'connected system',
    outcome: 'read records, run the routine work, and log every step',
    actions: [
      { name: 'List records', desc: 'Read records from {tool} filtered by whatever fields you name.' },
      { name: 'Get record', desc: 'Pull a single {tool} record in full, with related objects.' },
      { name: 'Search', desc: 'Search {tool} across the objects the connection can reach.' },
      { name: 'Create record', desc: 'Write a new record into {tool} — shown to you before it is committed.' },
      { name: 'Update record', desc: 'Correct fields on a {tool} record behind an approval gate.' },
      { name: 'Export data', desc: 'Export a {tool} result set and attach the rows to the receipt.' },
      { name: 'List users', desc: 'Read {tool} users and their permissions.' },
      { name: 'Run report', desc: 'Run an existing {tool} report and return the output.' },
      { name: 'Check status', desc: 'Read current {tool} system or job status.' },
      { name: 'Sync to another tool', desc: 'Move {tool} data into another connected system in the same run.' },
    ],
    prompts: [
      'Pull the recent records from {tool} and summarize what changed this week.',
      'Cross-check {tool} against our other systems and list the mismatches.',
      'Export the {tool} data I need for the monthly review.',
      'Watch {tool} and tell me when something needs a decision.',
    ],
  },
  Productivity: {
    role: 'workspace tool',
    outcome: 'read documents, move tasks, and keep the workspace tidy',
    actions: [
      { name: 'Search workspace', desc: 'Search {tool} across pages, docs, and databases.' },
      { name: 'Read page', desc: 'Pull a {tool} page or document in full, including nested content.' },
      { name: 'Create page', desc: 'Draft a new {tool} page from what Kentron AI gathered elsewhere.' },
      { name: 'Update page', desc: 'Edit an existing {tool} page — changes shown to you first.' },
      { name: 'List tasks', desc: 'Read {tool} tasks by assignee, due date, project, or status.' },
      { name: 'Create task', desc: 'File a {tool} task with the context and links already attached.' },
      { name: 'Move task', desc: 'Update {tool} task status, owner, or due date as work progresses.' },
      { name: 'List projects', desc: 'Read {tool} projects, boards, or spaces and what sits in each.' },
      { name: 'Get calendar', desc: 'Read {tool} events and availability for a person or team.' },
      { name: 'Summarize doc', desc: 'Summarize a long {tool} document into the decisions and owners.' },
      { name: 'Find stale items', desc: 'Flag {tool} tasks or docs nobody has touched in weeks.' },
    ],
    prompts: [
      'Summarize the {tool} project docs and tell me what is actually blocked.',
      'Create the meeting notes page in {tool} from this week’s decisions.',
      'List every overdue {tool} task and who owns it.',
      'Find duplicate or stale pages in {tool} and give me the cleanup list.',
    ],
  },
  'Sales & CRM': {
    role: 'CRM',
    outcome: 'keep the pipeline honest, update records, and prep every call',
    actions: [
      { name: 'List deals', desc: 'Pull {tool} deals by stage, owner, value, or close date.' },
      { name: 'Get contact', desc: 'Read a {tool} contact with the full activity and email history.' },
      { name: 'List accounts', desc: 'Read {tool} accounts with owner, tier, and open opportunities.' },
      { name: 'Update deal', desc: 'Move a {tool} deal stage or amount — held for your approval.' },
      { name: 'Log activity', desc: 'Write a call, meeting, or email note back into {tool}.' },
      { name: 'Get pipeline report', desc: 'Total {tool} pipeline by stage and forecast category.' },
      { name: 'Find stale deals', desc: 'Flag {tool} deals with no activity and a close date that already passed.' },
      { name: 'Create task', desc: 'File a follow-up task in {tool} against the right owner.' },
      { name: 'Enrich record', desc: 'Fill gaps on a {tool} record from your other connected systems.' },
      { name: 'Prep call brief', desc: 'Assemble everything {tool} knows about an account into one brief.' },
      { name: 'Find duplicates', desc: 'Detect duplicate {tool} contacts or accounts and propose the merge.' },
    ],
    prompts: [
      'Find the {tool} deals with no activity in 14 days and tell me which to chase.',
      'Reconcile {tool} pipeline against actual revenue and show me where they disagree.',
      'Prep a brief on this account from {tool} before my call tomorrow.',
      'Clean up duplicate contacts in {tool} and show me the merges before they run.',
    ],
  },
};

/** Stable per-name hash, so a connector's generated page never shuffles. */
function hash(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 33 + name.charCodeAt(i)) >>> 0;
  return h;
}

/** Brand name without the connector's auth qualifier, e.g. "Jira (Basic Auth)" -> "Jira". */
export function displayBrand(name: string) {
  return name.replace(/\s*\([^)]*\)\s*/g, ' ').trim() || name;
}

export interface IntegrationDetail {
  integration: Integration;
  slug: string;
  /** Brand name used in prose, with the auth qualifier stripped. */
  brand: string;
  role: string;
  summary: string;
  actions: Action[];
  prompts: string[];
  related: Integration[];
  worksWith: Integration[];
  faqs: { q: string; a: string }[];
}

const bySlug = new Map<string, Integration>();
for (const item of integrationCatalog) {
  const slug = slugify(item.name);
  if (!bySlug.has(slug)) bySlug.set(slug, item);
}

export function integrationSlug(name: string) {
  return slugify(name);
}

export function integrationHref(name: string) {
  return `#/integrations/${slugify(name)}`;
}

export function findIntegration(slug: string) {
  return bySlug.get(slug) ?? null;
}

/** True when a connector name has its own page in the directory. */
export function hasIntegration(name: string) {
  return bySlug.has(slugify(name));
}

/** Detail page for a connector, or the directory when we don't carry it. */
export function safeIntegrationHref(name: string) {
  return hasIntegration(name) ? integrationHref(name) : '#/integrations';
}

/** Live connectors Kentron AI is most often asked to combine with. */
const companions = ['Slack', 'GitHub', 'Notion', 'HubSpot', 'Jira', 'Google Analytics', 'Linear', 'Zendesk'];

export function buildDetail(integration: Integration): IntegrationDetail {
  const t = templates[integration.category] ?? templates.Other;
  const brand = displayBrand(integration.name);
  const h = hash(integration.name);

  // A stable 6-11 action slice, rotated by the name hash so pages differ.
  const count = 6 + (h % Math.max(1, t.actions.length - 5));
  const start = h % t.actions.length;
  const rotated = [...t.actions.slice(start), ...t.actions.slice(0, start)];
  const actions = rotated.slice(0, count).map((a) => ({
    name: a.name,
    desc: a.desc.replace(/\{tool\}/g, brand),
  }));

  const prompts = t.prompts.map((p) => p.replace(/\{tool\}/g, brand));

  const related = integrationCatalog
    .filter((i) => i.category === integration.category && i.name !== integration.name)
    .sort((a, b) => {
      const rank = (x: Integration) => (x.status === 'coming-soon' ? 1 : 0);
      return rank(a) - rank(b) || a.name.localeCompare(b.name);
    })
    .slice(0, 8);

  const worksWith = companions
    .filter((n) => n !== integration.name)
    .map((n) => integrationCatalog.find((i) => i.name === n))
    .filter((i): i is Integration => !!i)
    .slice(0, 6);

  const live = integration.status !== 'coming-soon';

  const summary =
    `Kentron AI is an AI coworker that connects to ${brand} and helps you ${t.outcome}, ` +
    `running ${actions.length} ${brand} actions for you like ${actions
      .slice(0, 3)
      .map((a) => a.name)
      .join(', ')
      .replace(/, ([^,]*)$/, ', and $1')}. ` +
    `Ask in plain language from Slack or the Kentron AI workspace; Kentron AI does the work in ${brand} ` +
    `and writes an immutable receipt for every call it makes.`;

  const faqs = [
    {
      q: `Does Kentron AI integrate with ${brand}?`,
      a: live
        ? `Yes. ${brand} is a live connector — connect it with ${integration.auth === 'Default' ? 'the default one-click flow' : integration.auth} and Kentron AI can operate inside ${brand} the same day.`
        : `${brand} is in the managed-connector catalog and can be enabled for your workspace on request. Tell us you need it and we'll turn it on — or point Kentron AI at the ${brand} API docs and it will build the integration itself.`,
    },
    {
      q: `How do I connect ${brand} to Kentron AI?`,
      a: `Open Connections in your Kentron AI workspace, pick ${brand}, and authorize through ${integration.auth === 'Coming soon' ? 'the connector’s standard flow' : integration.auth}. Credentials stay with the connector layer — Kentron AI only ever stores an encrypted reference, never your secrets.`,
    },
    {
      q: `What can Kentron AI actually do in ${brand}?`,
      a: `${actions.length} actions today, covering ${actions.slice(0, 4).map((a) => a.name.toLowerCase()).join(', ')} and more. Reads run straight away; anything that changes state in ${brand} waits behind an org-level policy gate until you approve it.`,
    },
    {
      q: `Do I have to build a workflow first?`,
      a: `No. Kentron AI is not a workflow builder — there is nothing to wire up. You describe the outcome in plain language and Kentron AI works out which connected systems it needs, including ${brand}, and runs the job in an isolated sandbox.`,
    },
    {
      q: `Is my ${brand} data safe?`,
      a: `Every run happens in an isolated sandbox with no ambient access. Each call against ${brand} is logged as an immutable, cryptographically chained receipt with the raw API response attached, so you can audit it, replay it, and prove exactly what happened. Revoke access at ${brand} any time and Kentron AI loses it instantly.`,
    },
    {
      q: `Can Kentron AI use ${brand} together with our other tools?`,
      a: `That's the point. A single run can read ${brand}, cross-check it against your CRM, open the ticket, and post the summary to Slack — one receipt chain covering the whole job, not four disconnected automations.`,
    },
  ];

  return {
    integration,
    slug: slugify(integration.name),
    brand,
    role: t.role,
    summary,
    actions,
    prompts,
    related,
    worksWith,
    faqs,
  };
}
