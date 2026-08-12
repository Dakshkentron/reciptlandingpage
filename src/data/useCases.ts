/**
 * Use cases, grouped by the team that lives with the problem.
 *
 * Every case is written the same way on purpose: the sentence you'd actually type,
 * the steps Receipt takes across connected systems, and the proof it leaves behind.
 * That last field is the whole point of the product — nothing here is a workflow
 * you have to draw first.
 */

export type TeamStatus = 'live' | 'beta' | 'soon';

export interface UseCase {
  /** Short, verb-first name for the job. */
  title: string;
  /** What a person types in Slack or the workspace. */
  prompt: string;
  /** What Receipt does, in order, across connected tools. */
  steps: string[];
  /** Connector names — resolved to real brand logos. */
  tools: string[];
  /** What lands in the receipt chain when it's done. */
  proof: string;
}

export interface ThreadMessage {
  from: 'user' | 'receipt';
  name: string;
  time: string;
  text: string;
  reactions?: string[];
}

export interface Team {
  slug: string;
  label: string;
  /** lucide-react icon name. */
  icon: string;
  status: TeamStatus;
  /** One line, shown under the team name in the picker. */
  tagline: string;
  /** Tailwind gradient stops for the team's accent. */
  accent: string;
  /** Detail-page hero. */
  headline: string;
  intro: string;
  /** The thing this team stops doing by hand. */
  killed: string;
  /** Slack-style preview shown next to the picker. */
  thread: { title: string; messages: ThreadMessage[] };
  stack: string[];
  metrics: { value: string; label: string }[];
  cases: UseCase[];
}

export const teams: Team[] = [
  {
    slug: 'engineering',
    label: 'Engineering',
    icon: 'Code2',
    status: 'live',
    tagline: 'The on-call work between the alert and the fix',
    accent: 'from-sky-500 to-indigo-600',
    headline: 'Everything between the alert and the pull request.',
    intro:
      'Engineers rarely lose the day to writing code. They lose it to the connective work around it — reading the trace, finding the commit, checking whether the deploy is the cause, updating the ticket, telling everyone. Receipt does that span in one run and hands you a diff to review.',
    killed: 'Twenty browser tabs open at 2am to answer one question: what changed?',
    thread: {
      title: 'Checkout 500s spiked after the 14:02 deploy',
      messages: [
        {
          from: 'user',
          name: 'Priya',
          time: '2:11 PM',
          text: '@Receipt checkout is throwing 500s. Find what shipped in the last hour and tell me if it is the cause.',
          reactions: ['👀 3'],
        },
        {
          from: 'receipt',
          name: 'Receipt',
          time: '2:13 PM',
          text: 'Sentry issue RCP-4471 started at 14:04, two minutes after Vercel deploy dpl_9f2. The deploy carried PR #2288, which changed the Stripe idempotency key. Draft revert PR #2291 is open — receipt chain rcp_8c41.',
          reactions: ['✅ 5', '🙏 2'],
        },
      ],
    },
    stack: ['GitHub', 'Sentry', 'Linear', 'Vercel', 'Datadog', 'Slack', 'AWS', 'Terraform Cloud'],
    metrics: [
      { value: '11 min', label: 'median alert → root cause' },
      { value: '0', label: 'context switches to answer "what changed?"' },
      { value: '100%', label: 'of production calls replayable' },
    ],
    cases: [
      {
        title: 'Root-cause an alert before anyone joins the call',
        prompt: 'Checkout error rate tripled at 14:00. What changed?',
        steps: [
          'Reads the Sentry issue, groups the stack traces, and pulls the first-seen timestamp',
          'Correlates that window against Vercel deploys, Datadog metrics, and merged GitHub PRs',
          'Names the suspect commit, quotes the changed lines, and opens a revert PR for review',
          'Posts the timeline into the incident channel with links to every artifact it read',
        ],
        tools: ['Sentry', 'Datadog', 'Vercel', 'GitHub', 'Slack'],
        proof: 'Each API response — Sentry, Vercel, GitHub — is stored verbatim, hashed and chained, so the postmortem cites evidence instead of memory.',
      },
      {
        title: 'Clear the flaky-test backlog on a schedule',
        prompt: 'Every Monday, find tests that failed intermittently last week and file them.',
        steps: [
          'Scans CI runs for tests that both passed and failed on the same commit',
          'Ranks by how often they blocked a merge, not by raw failure count',
          'Opens one Linear issue per flake with the failing seed, the run links, and a suspected owner from git blame',
          'Closes issues automatically when the test has been green for fourteen days',
        ],
        tools: ['GitHub', 'Linear', 'Slack'],
        proof: 'Every issue it opened, edited, or closed is one receipt — so nobody has to trust that the backlog groomed itself honestly.',
      },
      {
        title: 'Answer the dependency question in minutes, not days',
        prompt: 'Which of our services still use the deprecated auth SDK, and who owns them?',
        steps: [
          'Searches every repository in the org for the import, not just the ones you remembered',
          'Cross-checks the lockfiles for transitive versions the search would miss',
          'Maps each hit to a team via CODEOWNERS and the service catalog in Confluence',
          'Returns a table with owners, and files a tracking issue per team when you say go',
        ],
        tools: ['GitHub', 'GitLab', 'Confluence', 'Linear'],
        proof: 'The full repository list it searched is in the receipt — including the repos that returned nothing, which is what makes the answer trustworthy.',
      },
      {
        title: 'Run the pre-deploy check nobody has time for',
        prompt: 'Before the release, diff the Terraform plan against prod and flag anything destructive.',
        steps: [
          'Pulls the pending Terraform Cloud plan and reads the resource-level changes',
          'Compares live AWS state for the resources being replaced or deleted',
          'Flags every destructive action with its blast radius and the ticket that requested it',
          'Holds the apply behind a policy gate until a named human approves in Slack',
        ],
        tools: ['Terraform Cloud', 'AWS', 'GitHub', 'Slack'],
        proof: 'The approval, the approver, and the exact plan hash they approved are chained together — the apply cannot drift from what was reviewed.',
      },
    ],
  },
  {
    slug: 'customer-support',
    label: 'Customer Support',
    icon: 'Headphones',
    status: 'live',
    tagline: 'Tickets answered with the system of record, not a guess',
    accent: 'from-emerald-500 to-teal-600',
    headline: 'The answer is in five systems. Receipt reads all five.',
    intro:
      'Support does not usually need a smarter reply — it needs the truth. Was the charge refunded? Did the webhook fire? Is this the known bug or a new one? Receipt goes and looks, in the billing system, the logs, and the tracker, then writes the reply with the evidence attached.',
    killed: 'Escalating to engineering to ask a question the logs already answered.',
    thread: {
      title: 'Ticket #40912 — "I was charged twice"',
      messages: [
        {
          from: 'user',
          name: 'Marcus',
          time: '9:24 AM',
          text: '@Receipt customer on #40912 says they were double charged in March. Check before I escalate.',
          reactions: ['👀 2'],
        },
        {
          from: 'receipt',
          name: 'Receipt',
          time: '9:25 AM',
          text: 'Two Stripe charges, 4 seconds apart, same idempotency key missing — retry after a gateway timeout. Second charge ch_3Ox refunded, $118.00, drafted reply in Zendesk for your approval. Receipt rcp_2f70.',
          reactions: ['✅ 4', '🎯 1'],
        },
      ],
    },
    stack: ['Zendesk', 'Stripe (API Key)', 'Linear', 'Slack', 'Intercom', 'Notion', 'HubSpot', 'Sentry'],
    metrics: [
      { value: '4×', label: 'more tickets closed without escalation' },
      { value: '< 90s', label: 'to a fully evidenced draft reply' },
      { value: 'Every', label: 'refund gated on human approval' },
    ],
    cases: [
      {
        title: 'Verify the billing complaint instead of trusting it',
        prompt: 'Did this customer actually get charged twice, and if so, why?',
        steps: [
          'Matches the ticket email to the Stripe customer and pulls the charge history',
          'Checks whether the duplicate was a retry, a subscription overlap, or a genuine second purchase',
          'Drafts the reply in the customer\'s own timeline of events, in your tone',
          'Queues the refund — which waits for a human to approve before a cent moves',
        ],
        tools: ['Zendesk', 'Stripe (API Key)', 'HubSpot'],
        proof: 'The raw Stripe charge objects are attached to the receipt, so a disputed refund can be reconstructed months later without opening Stripe.',
      },
      {
        title: 'Tell a new bug from a known one, automatically',
        prompt: 'Is this the same crash we already have a ticket for?',
        steps: [
          'Extracts the error signature from the customer\'s screenshot or log paste',
          'Searches Sentry for a matching fingerprint and Linear for an existing issue',
          'Links the ticket to the issue and subscribes the customer to its resolution',
          'Opens a new issue with reproduction steps only when nothing matches',
        ],
        tools: ['Zendesk', 'Sentry', 'Linear'],
        proof: 'The search it ran and the candidates it rejected are both recorded — a duplicate filed anyway is a fact you can audit, not an argument.',
      },
      {
        title: 'Turn the week\'s tickets into a product signal',
        prompt: 'What did customers complain about most this week that we have no issue for?',
        steps: [
          'Clusters closed tickets by underlying cause rather than by the tag an agent picked',
          'Discards clusters that already map to a tracked issue',
          'Ranks the rest by affected ARR using the CRM, not by ticket count',
          'Publishes the digest to Notion and posts the top three to the product channel',
        ],
        tools: ['Zendesk', 'HubSpot', 'Linear', 'Notion', 'Slack'],
        proof: 'Every ticket that fed a cluster is listed in the receipt, so "customers keep asking for X" becomes a claim with a row count behind it.',
      },
      {
        title: 'Catch the account that is about to churn quietly',
        prompt: 'Flag any customer whose support tone got worse while usage dropped.',
        steps: [
          'Reads sentiment across the account\'s last ten conversations, not just the newest',
          'Cross-checks product usage and seat count in the analytics warehouse',
          'Writes an account brief — what broke, what was promised, what is still open',
          'Notifies the CSM with the brief before renewal, not after the cancellation email',
        ],
        tools: ['Zendesk', 'HubSpot', 'Google Analytics', 'Slack'],
        proof: 'The brief cites the exact conversations and usage rows it read, so the save call opens with facts rather than an apology.',
      },
    ],
  },
  {
    slug: 'sales',
    label: 'Sales',
    icon: 'TrendingUp',
    status: 'live',
    tagline: 'A clean CRM and a briefed rep, without the admin hour',
    accent: 'from-amber-500 to-orange-600',
    headline: 'Reps sell. Receipt does the CRM.',
    intro:
      'Pipeline hygiene is the tax every sales team pays and nobody wants to collect. Receipt sits between the calendar, the call recording, the inbox, and the CRM — updating records from what actually happened, and briefing the rep before they dial.',
    killed: 'The Friday afternoon spent guessing which stage a deal is really in.',
    thread: {
      title: 'Pre-call brief — Northwind Logistics',
      messages: [
        {
          from: 'user',
          name: 'Dana',
          time: '8:40 AM',
          text: '@Receipt I have Northwind at 9. Brief me.',
        },
        {
          from: 'receipt',
          name: 'Receipt',
          time: '8:41 AM',
          text: 'Stage: negotiation, 41 days, slipped twice. Blocker from the 12 Mar call: SOC 2 report. Their CTO opened the security page 6 times last week. Two open tickets, both resolved. Suggested open: lead with the SOC 2 pack. Receipt rcp_5b19.',
          reactions: ['🔥 6', '💰 2'],
        },
      ],
    },
    stack: ['HubSpot', 'Salesforce', 'Gong (Oauth)', 'Slack', 'Zoom', 'Apollo', 'Google Calendar', 'Notion'],
    metrics: [
      { value: '6 hrs', label: 'of CRM admin returned per rep, per week' },
      { value: '92%', label: 'of closed deals with complete field data' },
      { value: '1 run', label: 'from call recording to updated pipeline' },
    ],
    cases: [
      {
        title: 'Update the CRM from what was said on the call',
        prompt: 'After every customer call, update the deal from the transcript.',
        steps: [
          'Pulls the recording and transcript once the meeting ends',
          'Extracts the stated blocker, budget signal, timeline, and next step',
          'Updates the deal stage, close date, and notes — with the quote that justified each change',
          'Files a follow-up task and drafts the recap email for the rep to send',
        ],
        tools: ['Gong (Oauth)', 'Zoom', 'HubSpot', 'Salesforce'],
        proof: 'Every field change carries the transcript timestamp that caused it. A forecast review can inspect the quote, not just the number.',
      },
      {
        title: 'Brief the rep before the call, from every system at once',
        prompt: 'Brief me on my next three meetings.',
        steps: [
          'Reads the calendar and resolves each attendee to a CRM contact',
          'Assembles deal history, open support tickets, product usage, and recent site visits',
          'Surfaces the last unresolved objection and what was promised in response',
          'Delivers it as a one-screen brief in Slack fifteen minutes before the call',
        ],
        tools: ['Google Calendar', 'HubSpot', 'Zendesk', 'Slack', 'Apollo'],
        proof: 'The brief links to each source record, so a rep who wants to check a claim is one click away rather than one guess away.',
      },
      {
        title: 'Find the pipeline that is quietly dying',
        prompt: 'Which deals look healthy in the CRM but are actually stalled?',
        steps: [
          'Compares stated deal stage against real activity — email replies, meetings, champion engagement',
          'Flags deals where the champion has gone quiet or changed job title on LinkedIn',
          'Ranks by amount at risk, not by how overdue the record is',
          'Posts the list to the pipeline channel every Monday with a suggested action each',
        ],
        tools: ['HubSpot', 'Salesforce', 'Slack', 'ZoomInfo'],
        proof: 'The signals behind each flag are itemised, so a rep can disagree with the evidence instead of the algorithm.',
      },
      {
        title: 'Research the account without the research afternoon',
        prompt: 'Tell me who else at this company we should be talking to.',
        steps: [
          'Maps the org chart around your current contact from enrichment sources',
          'Cross-checks who has already touched your product, your docs, or a support ticket',
          'Identifies the economic buyer and the likely blocker for this deal shape',
          'Creates the contacts in the CRM, deduped, with sourcing noted on each',
        ],
        tools: ['Apollo', 'ZoomInfo', 'HubSpot', 'Salesforce'],
        proof: 'Each created contact records where the data came from — so the CRM never fills up with facts of unknown origin.',
      },
    ],
  },
  {
    slug: 'marketing',
    label: 'Marketing & Growth',
    icon: 'Megaphone',
    status: 'live',
    tagline: 'Numbers reconciled across every channel, with the rows attached',
    accent: 'from-fuchsia-500 to-purple-600',
    headline: 'Reporting that shows its working.',
    intro:
      'Every channel has its own dashboard and every dashboard disagrees. Receipt pulls the raw numbers from each platform, reconciles them against pipeline, and publishes the report with the source rows attached — so the meeting argues about strategy instead of about whose spreadsheet is right.',
    killed: 'The Monday export-and-paste ritual across six ad platforms.',
    thread: {
      title: 'Weekly acquisition report',
      messages: [
        {
          from: 'user',
          name: 'Leah',
          time: '7:02 AM',
          text: '@Receipt weekly report — spend by channel against pipeline created, flag anything above target CAC.',
        },
        {
          from: 'receipt',
          name: 'Receipt',
          time: '7:09 AM',
          text: 'Done. Spend $84,210 across 5 channels. Blended CAC $412 (target $380). Two campaigns above threshold, both LinkedIn retargeting — paused pending your approval. Report in Notion, source rows attached. Receipt rcp_1d08.',
          reactions: ['📊 4', '✅ 3'],
        },
      ],
    },
    stack: ['Google Ads', 'Meta Marketing API', 'LinkedIn', 'Google Analytics', 'HubSpot', 'Notion', 'Slack', 'Webflow'],
    metrics: [
      { value: '1 source', label: 'of truth across every ad platform' },
      { value: 'Weekly', label: 'report built while you sleep' },
      { value: 'Gated', label: 'spend changes need a human yes' },
    ],
    cases: [
      {
        title: 'Reconcile spend against pipeline, not against clicks',
        prompt: 'Build the weekly report: spend by channel versus pipeline created.',
        steps: [
          'Pulls spend and conversion data from every ad platform in one pass',
          'Joins it to CRM opportunities by source, deduping the self-reported attribution',
          'Recomputes CAC and payback per channel against the real closed-won rate',
          'Publishes the report and attaches the underlying rows for anyone who wants to check',
        ],
        tools: ['Google Ads', 'Meta Marketing API', 'LinkedIn', 'HubSpot', 'Notion'],
        proof: 'The report and its raw inputs live in the same receipt — a number in the deck can always be traced back to the API response it came from.',
      },
      {
        title: 'Catch the campaign burning budget overnight',
        prompt: 'Watch CAC by campaign and tell me the moment one goes over target.',
        steps: [
          'Checks live campaign performance on a schedule you set, not on a dashboard refresh',
          'Compares against your target, adjusted for the channel\'s typical lag',
          'Alerts the channel owner with the offending ad sets and their spend curve',
          'Pauses them on approval — never silently, and never without a receipt',
        ],
        tools: ['Google Ads', 'Meta Marketing API', 'Slack'],
        proof: 'Every pause records who approved it, when, and the exact metric that triggered the alert — including the ones you chose not to pause.',
      },
      {
        title: 'Audit the site for the things that quietly break',
        prompt: 'Check every landing page for broken links, dead forms, and missing tracking.',
        steps: [
          'Crawls the live site and every page referenced by an active campaign',
          'Submits a test payload against each form and verifies it reaches the CRM',
          'Confirms analytics and conversion tags fire, per page, per campaign',
          'Files one ticket per real defect, grouped by owner, with a screenshot',
        ],
        tools: ['Webflow', 'Google Analytics', 'HubSpot', 'Linear'],
        proof: 'The pass and fail result for every page checked is retained — the audit can be repeated next month and diffed against this one.',
      },
      {
        title: 'Keep the competitive picture current without the tab habit',
        prompt: 'Tell me when a competitor changes pricing, positioning, or launches something.',
        steps: [
          'Watches competitor pricing pages, changelogs, and job postings on a cadence',
          'Diffs each against the last captured version rather than describing it fresh',
          'Summarises what changed and what it implies for your positioning',
          'Drops the digest into the marketing channel with before-and-after captures',
        ],
        tools: ['Slack', 'Notion', 'Private API (Bearer Auth)'],
        proof: 'Each capture is timestamped and stored, so the claim "they raised prices in April" comes with the April page.',
      },
    ],
  },
  {
    slug: 'finance',
    label: 'Finance & RevOps',
    icon: 'Wallet',
    status: 'live',
    tagline: 'Close faster, and be able to prove every number in it',
    accent: 'from-lime-500 to-emerald-600',
    headline: 'A month-end close that carries its own audit trail.',
    intro:
      'Finance already knows how to reconcile. What costs the week is gathering — pulling statements, chasing approvals, matching invoices to purchase orders, and then proving it all again when the auditor arrives. Receipt does the gathering and keeps the evidence as it goes.',
    killed: 'Rebuilding the audit trail in March for work you did in January.',
    thread: {
      title: 'Month-end close — March',
      messages: [
        {
          from: 'user',
          name: 'Sanjay',
          time: '10:15 AM',
          text: '@Receipt start the March close. Flag anything that does not reconcile.',
        },
        {
          from: 'receipt',
          name: 'Receipt',
          time: '10:41 AM',
          text: '312 of 318 transactions matched. 6 exceptions: 4 missing receipts (owners notified), 1 duplicate vendor invoice ($2,480), 1 FX variance $91.20. Nothing posted — all six await your review. Receipt chain rcp_7a33.',
          reactions: ['🙏 3', '✅ 2'],
        },
      ],
    },
    stack: ['Stripe (API Key)', 'Quickbooks', 'Xero', 'Ramp', 'NetSuite (OAuth)', 'Slack', 'Google Sheet', 'HubSpot'],
    metrics: [
      { value: '3 days', label: 'off a typical month-end close' },
      { value: '0', label: 'journal entries posted without approval' },
      { value: 'Replayable', label: 'evidence for every reconciliation' },
    ],
    cases: [
      {
        title: 'Reconcile the month and surface only the exceptions',
        prompt: 'Match every card transaction to a receipt and a GL code. Show me what fails.',
        steps: [
          'Pulls the full transaction set from the card platform and the payment processor',
          'Matches each against submitted receipts, purchase orders, and vendor invoices',
          'Chases the owner of every unmatched item directly in Slack, with the amount and merchant',
          'Presents the exceptions only — and posts nothing to the ledger without approval',
        ],
        tools: ['Ramp', 'Stripe (API Key)', 'Quickbooks', 'Slack'],
        proof: 'Every match, and the rule that produced it, is chained — so the auditor tests the logic rather than re-doing the work.',
      },
      {
        title: 'Find the SaaS spend nobody is using',
        prompt: 'Which subscriptions renew next quarter, and is anyone actually using them?',
        steps: [
          'Extracts recurring vendor charges from the ledger and the card feed',
          'Matches each vendor to seat counts and last-login data from the identity provider',
          'Ranks by annual cost against active usage, flagging auto-renewals within 60 days',
          'Drafts the cancellation or downgrade email for each, held for your sign-off',
        ],
        tools: ['Ramp', 'Quickbooks', 'Okta', 'Google Workspace Admin', 'Slack'],
        proof: 'The seat-count evidence sits beside the spend figure, so the renewal conversation with the vendor starts from data they cannot dispute.',
      },
      {
        title: 'Chase receivables without the awkward reminder',
        prompt: 'Chase every invoice more than 15 days overdue, politely, escalating weekly.',
        steps: [
          'Reads the aged receivables ledger and pairs each invoice with its CRM owner',
          'Checks whether payment arrived through any processor before sending anything',
          'Sends the reminder from the right sender, in the right tone for the account tier',
          'Escalates to the account owner and then to finance on a schedule you define',
        ],
        tools: ['Xero', 'Quickbooks', 'Stripe (API Key)', 'HubSpot', 'Slack'],
        proof: 'Every reminder sent and every payment check performed is logged — so "we chased them three times" is a record, not a recollection.',
      },
      {
        title: 'Explain the variance before the board asks',
        prompt: 'Why did cloud spend jump 22% in March?',
        steps: [
          'Breaks the bill down by service, account, and tag against the prior period',
          'Correlates the increase with infrastructure changes and deploys in the same window',
          'Names the resources responsible and who provisioned them',
          'Writes the variance note in the format your board deck already uses',
        ],
        tools: ['AWS', 'Google Cloud', 'Terraform Cloud', 'Google Sheet'],
        proof: 'The billing rows behind the explanation are attached, so the note survives the follow-up question.',
      },
    ],
  },
  {
    slug: 'it-security',
    label: 'IT & Security',
    icon: 'ShieldCheck',
    status: 'live',
    tagline: 'Access reviews, offboarding, and evidence that holds up',
    accent: 'from-red-500 to-rose-600',
    headline: 'Give the agent access. Keep the proof.',
    intro:
      'The reason security teams distrust AI agents is that most of them cannot prove what they touched. Receipt inverts that: isolated execution, a policy gate before every write, and an immutable, hash-chained record of each call. The audit artifact is a by-product of the work, not a project after it.',
    killed: 'Screenshot-based evidence collection two weeks before the audit.',
    thread: {
      title: 'Offboarding — contractor access',
      messages: [
        {
          from: 'user',
          name: 'Rachel',
          time: '4:50 PM',
          text: '@Receipt J. Okoye finished today. Show me everything they still have access to.',
        },
        {
          from: 'receipt',
          name: 'Receipt',
          time: '4:52 PM',
          text: '14 systems: 9 SSO-governed (auto-revoke on suspend), 5 not — a GitHub PAT, an AWS access key last used 2 days ago, Datadog, Figma, and a shared Notion. Revocation queued, awaiting your approval. Receipt rcp_9e27.',
          reactions: ['🔐 5', '👏 2'],
        },
      ],
    },
    stack: ['Okta', 'Google Workspace Admin', 'AWS', 'GitHub', 'Slack', '1Password (Events API)', 'Vanta', 'Jira'],
    metrics: [
      { value: 'Same day', label: 'complete offboarding, evidenced' },
      { value: 'Hash-chained', label: 'record of every privileged call' },
      { value: 'Zero', label: 'ambient access — sandbox per run' },
    ],
    cases: [
      {
        title: 'Find the access that SSO does not cover',
        prompt: 'This person is leaving. What do they have that suspending SSO will not kill?',
        steps: [
          'Enumerates identity-provider group membership and app assignments',
          'Goes past SSO into personal access tokens, API keys, and standing cloud credentials',
          'Sorts by last use and privilege level, so the dangerous ones surface first',
          'Executes revocation on approval and re-verifies each one afterwards',
        ],
        tools: ['Okta', 'Google Workspace Admin', 'GitHub', 'AWS', '1Password (Events API)'],
        proof: 'The receipt records the revoke call and the confirming read after it — evidence the access is gone, not just that a request was sent.',
      },
      {
        title: 'Run the quarterly access review as a run, not a project',
        prompt: 'Who has production database access, and did anyone approve it?',
        steps: [
          'Pulls current entitlements from every governed system in scope',
          'Reconciles each against the approval ticket that granted it',
          'Flags standing access with no approval, no recent use, or no current manager',
          'Exports the reviewed evidence pack in the format your auditor expects',
        ],
        tools: ['Okta', 'AWS', 'Jira', 'Vanta'],
        proof: 'The whole review is one replayable chain. Next quarter you re-run it and diff, instead of starting a fresh spreadsheet.',
      },
      {
        title: 'Triage the vulnerability queue by real exposure',
        prompt: 'Of this week\'s CVEs, which ones actually reach our production surface?',
        steps: [
          'Maps each advisory to the services that actually import the package',
          'Checks whether the vulnerable path is reachable from an internet-facing route',
          'Ranks by real exposure rather than by CVSS score alone',
          'Opens tickets only for the ones that matter, with the upgrade path attached',
        ],
        tools: ['GitHub', 'AWS', 'Datadog', 'Jira'],
        proof: 'The reasoning for every deprioritised CVE is preserved — which is exactly the question an auditor asks six months later.',
      },
      {
        title: 'Keep the compliance evidence current all year',
        prompt: 'Collect this quarter\'s SOC 2 evidence and tell me what is missing.',
        steps: [
          'Gathers control evidence from the systems that produce it, on a schedule',
          'Verifies each artifact against the control it is supposed to satisfy',
          'Lists the gaps with the owner and the specific artifact still needed',
          'Files the evidence into your compliance platform with its source recorded',
        ],
        tools: ['Vanta', 'Okta', 'AWS', 'GitHub', 'Jira'],
        proof: 'Evidence arrives with provenance attached — which system produced it, when it was read, and the hash proving it has not changed since.',
      },
    ],
  },
  {
    slug: 'data-analytics',
    label: 'Data & Analytics',
    icon: 'BarChart3',
    status: 'live',
    tagline: 'Pipelines that heal, and metrics you can defend',
    accent: 'from-cyan-500 to-blue-600',
    headline: 'The ad-hoc request queue, answered at source.',
    intro:
      'Data teams do not have a modelling problem, they have an interruption problem. Receipt takes the questions that never needed a human — the pipeline that failed at 3am, the metric that moved, the one-off pull — and handles them where the data lives, with the query it ran attached to the answer.',
    killed: 'Being paged for a pipeline failure whose fix is always the same three steps.',
    thread: {
      title: 'Nightly load failed — orders_fact',
      messages: [
        {
          from: 'user',
          name: 'Ines',
          time: '6:58 AM',
          text: '@Receipt orders_fact is stale again. What happened and can we backfill?',
        },
        {
          from: 'receipt',
          name: 'Receipt',
          time: '7:00 AM',
          text: 'Upstream schema change: orders.discount_cents became nullable at 02:14, load failed on the not-null constraint. 4 downstream dashboards affected, owners notified. Backfill statement drafted — 1 approval away. Receipt rcp_0b64.',
          reactions: ['🙌 4', '✅ 2'],
        },
      ],
    },
    stack: ['Snowflake', 'Google BigQuery', 'Databricks (Workspace Level)', 'Looker', 'Metabase', 'Slack', 'Notion', 'GitHub'],
    metrics: [
      { value: '80%', label: 'of ad-hoc requests never reach a human' },
      { value: 'Every', label: 'answer ships with the query that produced it' },
      { value: 'Auto', label: 'downstream impact notification' },
    ],
    cases: [
      {
        title: 'Diagnose the failed pipeline before the standup',
        prompt: 'The nightly load failed. What broke, what is stale, and who needs to know?',
        steps: [
          'Reads the failure, isolates the failing step, and identifies the upstream change behind it',
          'Traces lineage to every dashboard and model now serving stale data',
          'Notifies each downstream owner with what is stale and until when',
          'Drafts the backfill and holds it behind approval before touching the warehouse',
        ],
        tools: ['Snowflake', 'Databricks (Workspace Level)', 'Looker', 'Slack'],
        proof: 'The diagnosis quotes the exact schema diff and the failing statement — so the fix is reviewed, not trusted.',
      },
      {
        title: 'Explain the metric that moved, with receipts',
        prompt: 'Activation dropped 8% week over week. Is it real?',
        steps: [
          'Checks instrumentation first — a tracking change explains more drops than product ever does',
          'Segments the movement by platform, cohort, geography, and acquisition source',
          'Isolates whether the drop is concentrated or broad, and names the segment carrying it',
          'Writes the finding with the query attached, so the next analyst starts from your work',
        ],
        tools: ['Snowflake', 'Google Analytics', 'Metabase', 'Notion'],
        proof: 'Both the queries and their results are in the receipt, which turns an analysis into something reproducible rather than something remembered.',
      },
      {
        title: 'Answer the ad-hoc pull without joining the queue',
        prompt: 'Give me signups by plan and region for Q1, as a sheet.',
        steps: [
          'Resolves the request against the governed semantic layer, not a guessed table',
          'Writes and runs the query, then sanity-checks totals against a known-good metric',
          'Delivers a formatted sheet with definitions noted beside each column',
          'Escalates to a human analyst when the request is genuinely ambiguous',
        ],
        tools: ['Snowflake', 'Google BigQuery', 'Google Sheet', 'Slack'],
        proof: 'The requester gets the SQL alongside the numbers, which is what stops the same question being asked again next quarter.',
      },
      {
        title: 'Keep the dashboard graveyard from growing',
        prompt: 'Which dashboards has nobody opened in 90 days, and what do they cost us?',
        steps: [
          'Pulls view counts and last-accessed timestamps across BI tools',
          'Maps each dead dashboard to the models and scheduled queries feeding it',
          'Estimates the warehouse spend those refreshes consume every month',
          'Proposes an archive list, notifies the owners, and archives on approval',
        ],
        tools: ['Looker', 'Metabase', 'Snowflake', 'Slack'],
        proof: 'The usage data behind each archival decision is retained, so restoring one later is a lookup rather than an argument.',
      },
    ],
  },
  {
    slug: 'product',
    label: 'Product',
    icon: 'Boxes',
    status: 'live',
    tagline: 'Evidence for the roadmap, gathered continuously',
    accent: 'from-violet-500 to-indigo-600',
    headline: 'Roadmap decisions with the evidence already gathered.',
    intro:
      'The feedback is real, it is just scattered — across tickets, calls, reviews, the community, and three different feature-request boards. Receipt gathers it continuously, weights it by revenue rather than by volume, and keeps the trail so a prioritisation call can be revisited without being re-litigated.',
    killed: 'Quarterly planning weeks spent assembling evidence that already existed.',
    thread: {
      title: 'Q3 planning input',
      messages: [
        {
          from: 'user',
          name: 'Tobi',
          time: '11:20 AM',
          text: '@Receipt what are enterprise accounts asking for that is not on the roadmap?',
        },
        {
          from: 'receipt',
          name: 'Receipt',
          time: '11:26 AM',
          text: 'Three themes across 148 sources. SCIM provisioning ($1.2M ARR, 9 accounts, 4 of them in renewal). Audit-log export ($740K). Per-project RBAC ($510K). Full brief in Notion with every source linked. Receipt rcp_3c85.',
          reactions: ['🎯 7', '📌 3'],
        },
      ],
    },
    stack: ['Linear', 'Jira', 'Zendesk', 'HubSpot', 'Notion', 'Gong (Oauth)', 'Productboard', 'Slack'],
    metrics: [
      { value: '148', label: 'feedback sources read per brief' },
      { value: 'ARR-weighted', label: 'not upvote-weighted' },
      { value: 'Continuous', label: 'gathering, not quarterly scramble' },
    ],
    cases: [
      {
        title: 'Build the demand picture from everywhere at once',
        prompt: 'What are customers asking for that we are not building?',
        steps: [
          'Reads tickets, sales-call transcripts, feature boards, and community threads together',
          'Clusters by the underlying need rather than by the words customers happened to use',
          'Weights each cluster by account revenue and renewal proximity',
          'Publishes a brief where every theme links back to its supporting sources',
        ],
        tools: ['Zendesk', 'Gong (Oauth)', 'Productboard', 'HubSpot', 'Notion'],
        proof: 'A prioritisation call can open any theme and read the actual customer sentence behind it, months later.',
      },
      {
        title: 'Watch the launch instead of refreshing the dashboard',
        prompt: 'We ship at noon. Tell me if anything looks wrong in the first 48 hours.',
        steps: [
          'Baselines the affected funnel and error rates before the release goes out',
          'Watches adoption, latency, support volume, and sentiment against that baseline',
          'Distinguishes an ordinary launch dip from a genuine regression',
          'Escalates with the evidence, and drafts the rollback ticket if it is the latter',
        ],
        tools: ['Sentry', 'Google Analytics', 'Zendesk', 'Linear', 'Slack'],
        proof: 'The pre-launch baseline is captured in the receipt, so post-launch claims are measured against a recorded number.',
      },
      {
        title: 'Keep the changelog and docs honest',
        prompt: 'Turn everything merged this sprint into a changelog customers can read.',
        steps: [
          'Reads merged pull requests and closed issues, discarding internal churn',
          'Groups changes into customer-visible themes and writes them in plain language',
          'Flags shipped changes whose documentation was never updated',
          'Opens the changelog as a draft for a human to edit and publish',
        ],
        tools: ['GitHub', 'Linear', 'Notion', 'Confluence'],
        proof: 'The PR list behind each changelog entry is preserved — so "when did that ship?" has an answer with a commit attached.',
      },
      {
        title: 'Answer the competitive question with current facts',
        prompt: 'A prospect says a competitor has X. Do they, and how does ours compare?',
        steps: [
          'Checks the competitor\'s current docs, pricing, and changelog rather than a stale battlecard',
          'Compares against your own shipped capability, verified in your tracker',
          'Notes the honest gaps as clearly as the honest advantages',
          'Returns a response the rep can send, plus a note for the roadmap if the gap is real',
        ],
        tools: ['Notion', 'Linear', 'Slack', 'Private API (Bearer Auth)'],
        proof: 'The captured competitor pages are timestamped, so the claim can be checked rather than repeated.',
      },
    ],
  },
  {
    slug: 'people',
    label: 'People & HR',
    icon: 'UserCog',
    status: 'live',
    tagline: 'Onboarding, reviews, and the paperwork behind both',
    accent: 'from-pink-500 to-rose-600',
    headline: 'The first day works because the week before did.',
    intro:
      'People teams run processes that touch every system in the company and own none of them. Receipt reaches across the HRIS, the ATS, identity, payroll, and the tools a new hire needs — doing the provisioning, chasing the signatures, and leaving a record of who approved each piece of access.',
    killed: 'A twelve-step onboarding checklist copied between four tools.',
    thread: {
      title: 'New hire — starts Monday',
      messages: [
        {
          from: 'user',
          name: 'Amara',
          time: '3:05 PM',
          text: '@Receipt set up the new backend engineer starting Monday.',
        },
        {
          from: 'receipt',
          name: 'Receipt',
          time: '3:07 PM',
          text: 'Accounts staged in Google Workspace, Okta, GitHub, Linear and Slack — all matched to the Engineering role template. Laptop request filed, contract out for signature, buddy assigned, week-one plan drafted. Provisioning waits on your approval. Receipt rcp_6d12.',
          reactions: ['🎉 8', '✅ 3'],
        },
      ],
    },
    stack: ['Greenhouse', 'BambooHR (OAuth)', 'Okta', 'Google Workspace Admin', 'Slack', 'Notion', 'Deel', 'DocuSign'],
    metrics: [
      { value: 'Day one', label: 'access ready, nothing over-provisioned' },
      { value: 'Every grant', label: 'tied to a named approver' },
      { value: '90%', label: 'of chasing done without a human' },
    ],
    cases: [
      {
        title: 'Onboard from the role template, not from memory',
        prompt: 'Set up everything a new designer needs to start on the 5th.',
        steps: [
          'Reads the offer record and resolves the correct role-based access template',
          'Stages accounts and group membership across identity, code, and collaboration tools',
          'Files the equipment request and sends the contract for signature',
          'Drafts the week-one plan and assigns a buddy — provisioning still needs a human yes',
        ],
        tools: ['Greenhouse', 'BambooHR (OAuth)', 'Okta', 'Google Workspace Admin', 'Slack'],
        proof: 'Every account created and every group joined is tied to the approving manager — so an access review can answer "why does this person have that?"',
      },
      {
        title: 'Run the review cycle without the reminder spreadsheet',
        prompt: 'Chase outstanding performance reviews and tell me where the cycle is stuck.',
        steps: [
          'Tracks completion across the HRIS by manager, team, and reviewer',
          'Sends targeted, private nudges rather than a company-wide reminder',
          'Escalates the genuinely stuck ones to the next level up after your grace period',
          'Reports cycle health with the specific blockers, not just a completion percentage',
        ],
        tools: ['BambooHR (OAuth)', 'Lattice', 'Slack', 'Notion'],
        proof: 'Reminder history is recorded per person, which keeps a fairness question answerable with dates instead of impressions.',
      },
      {
        title: 'Keep the pipeline moving between the hiring meetings',
        prompt: 'Which candidates have been waiting more than three days for a decision?',
        steps: [
          'Reads the ATS for candidates stalled at every stage, with the owner of each',
          'Distinguishes a slow scheduler from a genuinely undecided panel',
          'Nudges the interviewer whose scorecard is missing, with a link straight to it',
          'Drafts the rejection or the next-step email so nobody waits on a blank page',
        ],
        tools: ['Greenhouse', 'Lever (OAuth)', 'Google Calendar', 'Slack'],
        proof: 'Time-in-stage per candidate is recorded, turning a hiring retro into a data exercise rather than a discussion.',
      },
      {
        title: 'Close the loop on offboarding, everywhere',
        prompt: 'Run the full offboarding for someone leaving on Friday.',
        steps: [
          'Builds the complete list of systems, licences, and physical assets held',
          'Coordinates the revocation sequence so nothing is cut before the handover completes',
          'Transfers document ownership and reassigns open tickets to the right people',
          'Confirms each step afterwards and reports anything that failed to revoke',
        ],
        tools: ['BambooHR (OAuth)', 'Okta', 'Google Workspace Admin', 'Deel', 'Slack'],
        proof: 'The post-revocation verification read is chained to the revoke call — the record shows access ended, not that removal was requested.',
      },
    ],
  },
  {
    slug: 'founders',
    label: 'Founders & Leadership',
    icon: 'Rocket',
    status: 'live',
    tagline: 'The company\'s real numbers, without asking four people',
    accent: 'from-orange-500 to-red-600',
    headline: 'Stop asking four people for one number.',
    intro:
      'The metrics exist. They are just in the billing system, the CRM, the warehouse, and someone\'s spreadsheet, and getting them costs three people an afternoon. Receipt assembles the picture directly from source, on whatever cadence you want, and shows the work.',
    killed: 'The board-deck week that starts with five Slack messages asking for numbers.',
    thread: {
      title: 'Monday morning brief',
      messages: [
        {
          from: 'user',
          name: 'Nadia',
          time: '6:30 AM',
          text: '@Receipt where are we? Revenue, burn, pipeline, and anything I should be worried about.',
        },
        {
          from: 'receipt',
          name: 'Receipt',
          time: '6:34 AM',
          text: 'ARR $4.28M (+3.1% MoM). Net burn $312K, 19 months runway. Pipeline $2.1M, coverage 2.4× — below the 3× you set. Worth your attention: two enterprise renewals in 40 days with open escalations. Sources linked. Receipt rcp_4f90.',
          reactions: ['🙏 4', '📈 2'],
        },
      ],
    },
    stack: ['Stripe (API Key)', 'HubSpot', 'Quickbooks', 'Snowflake', 'Slack', 'Notion', 'Google Sheet', 'Linear'],
    metrics: [
      { value: '4 min', label: 'from question to sourced answer' },
      { value: 'Daily', label: 'if you want it daily' },
      { value: 'Sourced', label: 'every figure links to its system' },
    ],
    cases: [
      {
        title: 'Get the operating brief before the day starts',
        prompt: 'Every Monday at 6am: revenue, burn, pipeline, hiring, and the risks.',
        steps: [
          'Pulls each metric from the system that owns it, rather than from a stale dashboard',
          'Compares against your plan and the prior period, not just the last data point',
          'Surfaces only what moved beyond the thresholds you set',
          'Delivers it as one message with every figure linked to its source',
        ],
        tools: ['Stripe (API Key)', 'Quickbooks', 'HubSpot', 'Slack'],
        proof: 'Because every figure carries its source call, a number you question can be checked in a click instead of a thread.',
      },
      {
        title: 'Assemble the board pack from the systems, not the team',
        prompt: 'Build the Q2 board deck from actuals and flag the variances.',
        steps: [
          'Assembles the standard metrics from finance, CRM, and product analytics',
          'Computes variance against plan and drafts the explanation for each material gap',
          'Populates your existing deck template rather than inventing a new format',
          'Lists the questions a board member is most likely to ask, with the answers prepared',
        ],
        tools: ['Quickbooks', 'HubSpot', 'Snowflake', 'Google Sheet', 'Notion'],
        proof: 'The deck ships with a receipt chain behind every figure, which is a materially different conversation with an investor than a spreadsheet.',
      },
      {
        title: 'Watch the leading indicators, not the lagging ones',
        prompt: 'Alert me when something in the business breaks trend, before it hits revenue.',
        steps: [
          'Tracks the early signals — activation, expansion motion, support load, sales-cycle length',
          'Detects a genuine trend break rather than ordinary week-to-week noise',
          'Explains the likely driver by cross-checking the systems involved',
          'Tells you once, with context, instead of alerting you daily into indifference',
        ],
        tools: ['Snowflake', 'HubSpot', 'Zendesk', 'Slack'],
        proof: 'Every alert keeps the data window that triggered it, so a false alarm makes the next threshold better.',
      },
      {
        title: 'Run diligence on your own house first',
        prompt: 'A term sheet is coming. What will diligence find that we should fix now?',
        steps: [
          'Checks contract, invoice, and revenue records line up across systems',
          'Verifies security and compliance evidence is current and complete',
          'Confirms cap-table, vendor, and customer paperwork is where it should be',
          'Returns a gap list ordered by how badly each would slow a data room',
        ],
        tools: ['Quickbooks', 'HubSpot', 'Vanta', 'Google Drive', 'DocuSign'],
        proof: 'The check itself is an auditable artifact — you can hand the reviewer the chain instead of re-running the review by hand.',
      },
    ],
  },
  {
    slug: 'legal-compliance',
    label: 'Legal & Compliance',
    icon: 'Scale',
    status: 'beta',
    tagline: 'Contract review and obligations that get tracked',
    accent: 'from-slate-500 to-slate-700',
    headline: 'The obligations you signed, actually tracked.',
    intro:
      'Contracts are signed and then forgotten, along with every renewal date, SLA credit, and data-processing commitment inside them. Receipt reads the executed documents, extracts what was promised, and watches for the dates — with the clause it relied on quoted beside every claim.',
    killed: 'Discovering an auto-renewal three weeks after the notice window closed.',
    thread: {
      title: 'Vendor MSA — redline review',
      messages: [
        {
          from: 'user',
          name: 'Ben',
          time: '1:15 PM',
          text: '@Receipt review this MSA against our playbook and flag anything unusual.',
        },
        {
          from: 'receipt',
          name: 'Receipt',
          time: '1:19 PM',
          text: '4 deviations from playbook. Uncapped indemnity (§8.2), 60-day notice on auto-renewal (§3.4, we require 30), no data-deletion SLA, and governing law changed to Delaware. Redline drafted, clauses quoted, nothing sent. Receipt rcp_1a55.',
          reactions: ['⚖️ 3', '👍 2'],
        },
      ],
    },
    stack: ['DocuSign', 'Google Drive', 'Ironclad', 'Notion', 'Slack', 'Jira', 'Box', 'Vanta'],
    metrics: [
      { value: 'Clause-level', label: 'citation on every flag' },
      { value: 'Tracked', label: 'renewal and notice windows' },
      { value: 'Draft only', label: 'nothing is ever sent for you' },
    ],
    cases: [
      {
        title: 'Review the incoming contract against your own playbook',
        prompt: 'Check this MSA against our standard positions and mark the deviations.',
        steps: [
          'Reads the executed or proposed document, section by section',
          'Compares each clause against your playbook and your last-signed precedent',
          'Ranks deviations by real commercial risk rather than by word count',
          'Produces a redline with the reasoning and the precedent for each change',
        ],
        tools: ['DocuSign', 'Google Drive', 'Ironclad', 'Notion'],
        proof: 'Every flag quotes the clause and the playbook rule it violates — the review can be checked without being repeated.',
      },
      {
        title: 'Never miss a renewal or notice window again',
        prompt: 'Extract every key date from our vendor contracts and warn me in advance.',
        steps: [
          'Reads the full contract repository, including the ones nobody filed properly',
          'Extracts renewal dates, notice periods, price-escalation and termination terms',
          'Builds the calendar and alerts the owner before the notice window opens',
          'Re-checks after every amendment so the dates stay true',
        ],
        tools: ['Google Drive', 'Box', 'DocuSign', 'Google Calendar', 'Slack'],
        proof: 'Each extracted date cites its clause and document version, so an incorrect reminder is traceable to a source rather than to the model.',
      },
      {
        title: 'Answer the security questionnaire from evidence you already have',
        prompt: 'Fill this vendor questionnaire from our existing controls and flag what I must answer.',
        steps: [
          'Matches each question to your documented controls and prior answers',
          'Drafts the response, citing the policy or evidence artifact behind it',
          'Marks every question where the honest answer has changed since last time',
          'Leaves the sign-off to a human — always',
        ],
        tools: ['Vanta', 'Notion', 'Google Drive', 'Slack'],
        proof: 'Each drafted answer links to the control evidence supporting it, so an inaccurate answer is a finding rather than a mystery.',
      },
      {
        title: 'Turn signed obligations into tracked work',
        prompt: 'What did we commit to in signed contracts that nobody is doing?',
        steps: [
          'Extracts affirmative obligations — SLAs, reporting, audit rights, deletion commitments',
          'Checks each against what the business actually does today',
          'Files owned tickets for the ones with no process behind them',
          'Re-verifies quarterly and reports the drift',
        ],
        tools: ['Ironclad', 'DocuSign', 'Jira', 'Notion'],
        proof: 'The obligation, its clause, and the ticket tracking it stay linked — so compliance is demonstrable rather than asserted.',
      },
    ],
  },
];

export const teamBySlug = new Map(teams.map((t) => [t.slug, t]));

export const useCaseCount = teams.reduce((n, t) => n + t.cases.length, 0);

export function teamUseCaseHref(slug: string) {
  return `#/use-cases/${slug}`;
}

/** Nav children for the team menu — same shape the header dropdown expects. */
export const teamNavChildren = teams.map((t) => ({
  label: t.label,
  href: teamUseCaseHref(t.slug),
  desc: t.tagline,
  icon: t.icon,
}));
