export const announcements = [
  { icon: '📊', text: 'AI analytics use case: how Mercor unlocked $100M in revenue', href: '#' },
  { icon: '🤯', text: 'Generative data apps: Gorgeous, interactive dashboards and apps you can build with just a prompt', href: '#' },
  { icon: '📖', text: 'State of Data Teams 2026 — discover key insights from data leaders', href: '#' },
];

export const departments = [
  { label: 'All Teams', href: '#/department/all-teams', desc: 'One workspace for every team', icon: 'Users' },
  { label: 'Engineering', href: '#/department/engineering', desc: 'Ship insights alongside code', icon: 'Code2' },
  { label: 'Customer Service', href: '#/department/customer-service', desc: 'Resolve tickets with real data', icon: 'Headphones' },
  { label: 'Sales', href: '#/department/sales', desc: 'Close faster with live account context', icon: 'TrendingUp' },
  { label: 'Marketing', href: '#/department/marketing', desc: 'Measure and optimize every campaign', icon: 'Megaphone' },
  { label: 'B2B Marketing', href: '#/department/b2b-marketing', desc: 'Pipeline analytics for demand gen', icon: 'Building2' },
  { label: 'B2C Marketing', href: '#/department/b2c-marketing', desc: 'Segment and grow your customer base', icon: 'ShoppingBag' },
  { label: 'People', href: '#/department/people', desc: 'HR analytics for the whole org', icon: 'UserCog' },
  { label: 'IT', href: '#/department/it', desc: 'Govern access and track adoption', icon: 'Server' },
  { label: 'Finance', href: '#/department/finance', desc: 'Trusted numbers for reporting', icon: 'Wallet' },
  { label: 'Legal', href: '#/department/legal', desc: 'Audit-ready analysis and evidence', icon: 'Scale' },
];

export type Department = {
  label: string;
  href: string;
  desc: string;
  icon: string;
};

export type NavChild = {
  label: string;
  href: string;
  desc?: string;
  submenu?: Department[];
};

export type NavLink = {
  label: string;
  href?: string;
  children?: NavChild[];
};

export const navLinks: NavLink[] = [
  { label: 'Solutions', children: [
    { label: 'Use Cases', href: '#', desc: 'From exploration to production in one workspace', submenu: departments },
  ]},
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Customers', href: '#customers' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'FAQ', href: '#faq' },
];

export const trustedBy = [
  'OrangePro', 'MyVisionLab', 'TenUp',  'Binaryflux', 'CStream'
];

export const heroStats = [
  { value: '10x', label: 'faster from question to insight' },
  { value: '$100M', label: 'unlocked by Mercor in revenue' },
  { value: '500+', label: 'data teams trust Receipt daily' },
];

export const notebookSqlData = [
  { quarter: 'Q3-2025', product_line: 'Teleportation pads', region: 'Core Worlds', customer_sector: 'Defense', revenue_usd: 18200000 },
  { quarter: 'Q3-2025', product_line: 'Quantum drives', region: 'Core Worlds', customer_sector: 'Defense', revenue_usd: 16500000 },
  { quarter: 'Q3-2025', product_line: 'Wormhole initiators', region: 'Core Worlds', customer_sector: 'Defense', revenue_usd: 14800000 },
  { quarter: 'Q3-2025', product_line: 'Dark matter lasers', region: 'Mid-Rim', customer_sector: 'Commercial', revenue_usd: 12200000 },
  { quarter: 'Q3-2025', product_line: 'Temporal stabilizers', region: 'Mid-Rim', customer_sector: 'Research', revenue_usd: 9800000 },
  { quarter: 'Q3-2025', product_line: 'Anti-gravity generators', region: 'Outer Rim', customer_sector: 'Government', revenue_usd: 7400000 },
];

export const productLines = [
  'Teleportation pads',
  'Quantum drives',
  'Wormhole initiators',
  'Dark matter lasers',
  'Temporal stabilizers',
  'Anti-gravity generators',
];

export const regions = ['Core Worlds', 'Mid-Rim', 'Outer Rim'];
export const sectors = ['Defense', 'Commercial', 'Research', 'Government'];
export const quarters = ['Q1', 'Q2', 'Q3'];

export const agentChat = [
  { role: 'user', text: 'Can you show me NexaCorp\u2019s Q3 sales by product line?' },
  { role: 'agent', text: 'I\u2019ll help you analyze NexaCorp\u2019s revenue by product line. I\u2019ll pull data from Q1\u2013Q3 so you can compare trends across quarters.' },
  { role: 'user', text: 'Which region grew the most this quarter?' },
  { role: 'agent', text: 'The Mid-Rim region posted the strongest growth at 4.1% vs last quarter, driven by Dark matter lasers and Temporal stabilizers in the Commercial sector.' },
];

export const features = [
  {
    id: 'notebooks',
    eyebrow: 'Agentic notebooks',
    title: 'One workspace for every question',
    description: 'Combine SQL, Python, no-code, and visuals in a flexible notebook. Receipt\u2019s Notebook Agent generates queries, charts, and entire analyses \u2014 grounded in your governed data.',
    bullets: [
      'Write SQL and Python side by side with rich cell types',
      'Let the agent scaffold analyses, debug queries, and suggest charts',
      'Comment, react, and collaborate in real time \u2014 no more merge conflicts',
    ],
    badge: 'Notebook Agent',
  },
  {
    id: 'threads',
    eyebrow: 'Conversational self-serve',
    title: 'Answers for everyone, grounded in facts',
    description: 'Business users ask questions in plain language in Receipt, Slack, or via MCP. Every answer is explainable, editable, and reusable \u2014 because it runs on the same context as your notebooks.',
    bullets: [
      'No SQL, no Python, no ticket to the data team',
      'Every answer links back to the underlying logic',
      'Data practitioners can jump into the same workflow instantly',
    ],
    badge: 'Threads',
  },
  {
    id: 'context',
    eyebrow: 'Context Studio',
    title: 'A curated context layer for trusted AI',
    description: 'Combine database descriptions, semantic models, business rules, and analytical logic into one layer that powers every AI answer. Observe what\u2019s asked and improve context over time.',
    bullets: [
      'Define metrics once \u2014 reuse everywhere',
      'See what people ask and where context gaps appear',
      'Version and review context like code',
    ],
    badge: 'Context Studio',
  },
  {
    id: 'data-apps',
    eyebrow: 'Data apps & dashboards',
    title: 'Beautiful, interactive data apps with just a prompt',
    description: 'Build anything \u2014 a dashboard, a report, a presentation \u2014 on top of your real, governed data. Sharing is easy, and users can start new Threads right from your apps.',
    bullets: [
      'Turn any notebook into a shareable app with one click',
      'Filters, inputs, and charts update live',
      'Embed where teams already work \u2014 Slack, Notion, and more',
    ],
    badge: 'App builder',
  },
];

export const dashboardSummaryCards = [
  { label: 'Total Q3 Revenue', value: '$175.7M', sub: '9.7% vs last quarter', trend: 'up' as const },
  { label: 'Top Growth Region', value: 'Mid-Rim', sub: '4.1% vs last quarter', trend: 'up' as const },
  { label: 'Highest Revenue Sector', value: 'Commercial', sub: '3.0% vs last quarter', trend: 'up' as const },
];

export const dashboardFilters = [
  { label: 'Product Line', options: ['All product lines', ...productLines] },
  { label: 'Region', options: ['All regions', ...regions] },
  { label: 'Customer Sector', options: ['All customer sectors', ...sectors] },
  { label: 'Quarter', options: ['All quarters', ...quarters] },
];

export const testimonials = [
  { quote: 'If we didn\u2019t have Receipt, we might\u2019ve left more than $100M on the table. That might even be an underestimate.', name: 'Dhaval P.', role: 'Account Lead', company: 'NexaCorp Galactic Warehouse' },
  { quote: 'AI can do almost everything for you in Receipt. I use it to scaffold entire apps and help me debug SQL queries. It makes me 10x faster.', name: 'Tom C.', role: 'Principal Engineer', company: 'NexaCorp' },
  { quote: 'We spend a lot of time investigating edge cases in metrics. Just today, Threads saved me 20 minutes digging into a metric issue.', name: 'Sumeet M.', role: 'Head of Data', company: 'NexaCorp' },
  { quote: 'Our vision is that anyone, regardless of technical proficiency, is comfortable using data to answer their own questions \u2014 and Receipt enables that.', name: 'Abhishek Modi', role: 'Software Engineer', company: 'Notion' },
  { quote: 'Receipt\u2019s notebook agent just works. I describe what I want and get working SQL back. It\u2019s made us 10x faster at turning questions into insights.', name: 'Kristian K.', role: 'Product', company: 'Lovable' },
  { quote: 'With Receipt and Snowflake, Doximity was able to completely transition off of Jupyter Notebooks.', name: 'Erik Selin', role: 'Engineering Director, Data Platform', company: 'Doximity' },
];

export const customerStories = [
  { company: 'Notion', title: 'One place for insights', desc: 'Notion made Receipt the one place for everyone \u2014 from data science to CX and sales \u2014 to make decisions with data.', logo: 'Notion', href: '#' },
  { company: 'Mercor', title: 'Scaling self-serve AI analytics', desc: 'Mercor democratizes analysis across their org with Notebook Agent.', logo: 'Mercor', href: '#' },
  { company: 'Figma', title: 'Lowering barriers to insight', desc: 'Figma\u2019s team focuses on strategy over syntax using Receipt\u2019s AI agents.', logo: 'Figma', href: '#' },
  { company: 'Neo Financial', title: 'Breaking data silos', desc: 'Neo drives insights right where they work using Threads and Slack integration.', logo: 'Neo', href: '#' },
];

export const integrations = [
  { name: 'AWS', category: 'Cloud', desc: 'Query and act across your AWS account', logo: 'aws' },
  { name: 'Azure', category: 'Cloud', desc: 'Connect Azure resources and data', logo: 'azure' },
  { name: 'GCP', category: 'Cloud', desc: 'Connect Google Cloud resources and data', logo: 'gcp' },
  { name: 'Snowflake', category: 'Warehouse', desc: 'Native connection with oAuth passthrough', logo: 'snowflake' },
  { name: 'BigQuery', category: 'Warehouse', desc: 'Query BigQuery directly from notebooks', logo: 'bigquery' },
  { name: 'dbt', category: 'Transformation', desc: 'dbt metadata, docs & metrics enriched automatically', logo: 'dbt' },
  { name: 'GitHub', category: 'Version control', desc: 'Export projects to create an audit trail', logo: 'github' },
  { name: 'GitLab', category: 'Version control', desc: 'Sync your projects to GitLab repos', logo: 'gitlab' },
  { name: 'Airflow', category: 'Orchestration', desc: 'Include Receipt projects in DAGs', logo: 'airflow' },
  { name: 'Slack', category: 'Collaboration', desc: 'Ask and share insights where teams work', logo: 'slack' },
  { name: 'Notion', category: 'Collaboration', desc: 'Embed interactive Receipt apps in Notion', logo: 'notion' },
  { name: 'Jira', category: 'Project mgmt', desc: 'Turn tickets into governed data workflows', logo: 'jira' },
  { name: 'HubSpot', category: 'CRM', desc: 'Ground answers in your HubSpot data', logo: 'hubspot' },
  { name: 'Salesforce', category: 'CRM', desc: 'Ground answers in your Salesforce data', logo: 'salesforce' },
  { name: 'Receipt API', category: 'Custom', desc: 'Write your own integrations with our public API', logo: 'api' },
];

export const integrationHighlights = [
  {
    title: 'Built for the cloud',
    desc: 'Receipt connects directly to your cloud accounts to query and act across resources.',
    badges: ['AWS', 'Azure', 'GCP'],
  },
  {
    title: 'Built for the warehouse',
    desc: 'Receipt has built-in connections to the most popular data warehouses. Securely share connections with your team.',
    badges: ['Snowflake', 'BigQuery'],
  },
  {
    title: 'dbt metadata, docs & metrics',
    desc: 'Receipt has a deep integration with dbt, including automatically enriching schemas with dbt docs.',
    badges: ['dbt'],
  },
  {
    title: 'Connect with oAuth',
    desc: 'Leverage the permissions set up in your data warehouse by authenticating with oAuth.',
    badges: ['oAuth'],
  },
  {
    title: 'Git it together',
    desc: 'Export your projects to GitHub or GitLab to create an audit trail.',
    badges: ['GitHub', 'GitLab'],
  },
  {
    title: 'Orchestration',
    desc: 'Include Receipt projects in DAGs in Airflow.',
    badges: ['Airflow'],
  },
  {
    title: 'CRM & project tools',
    desc: 'Ground answers in the tickets and accounts your team already tracks.',
    badges: ['Jira', 'HubSpot', 'Salesforce'],
  },
  {
    title: 'Receipt API',
    desc: 'Want to connect to something we haven\u2019t thought of? Use our powerful public API to write your own integrations.',
    badges: ['API'],
  },
];

export const faqs = [
  { q: 'What is Receipt and what does it actually do?', a: 'Receipt is an autonomous AI coworker platform that gives your team an AI agent with real execution capability: it runs code in a private isolated sandbox, reaches 1000+ SaaS apps (AWS, Jira, GitHub, Vercel, Slack, etc.) via Nango, and converts probabilistic AI requests into deterministic, auditable outcomes. Every action is logged as an immutable, cryptographically chained \u201creceipt\u201d\u2014the permanent source of truth\u2014enabling full audit, replay, and crash recovery.' },
  { q: 'How is Receipt different from Claude Code, Codex, or other AI coding tools?', a: 'Claude Code and Codex are single-session coding assistants for individual developers; Receipt is a multi-tenant production control plane that can orchestrate and run AI agents like those as auditable background workers. Receipt adds durable execution (survives crashes), deterministic replay (proves what happened), compliance logging (immutable audit trail), multi-tenant isolation (each org\u2019s data is separate), and integration with 1000+ SaaS systems\u2014all things you need for production governance that a session-based coding tool doesn\u2019t provide.' },
  { q: 'Is it actually safe to give AI agents access to my production systems?', a: 'Yes\u2014if you use Receipt correctly. Every action runs in an isolated OpenSandbox with zero ambient access; credentials are never stored in Receipt (Nango owns them, Receipt only stores encrypted references); all state-changing operations are deterministic, replayable, and cryptographically chained so you can verify exactly what happened; and Receipt enforces org-level policy gates before any AI decision is executed. The default is \u201csandbox first, audit everything\u201d\u2014not \u201ctrust and react.\u201d' },
  { q: 'What\u2019s the difference between a "receipt" and regular logs or observability?', a: 'Observability logs describe state that exists elsewhere; deleting logs loses visibility but not data. Receipts are the state\u2014the append-only source of truth\u2014and the running system is just a derived copy. Deleting receipts loses everything. This matters because it means Receipt doesn\u2019t copy data around; it owns the provable history. You can replay any past moment, audit any decision, and prove causation\u2014not just observe failures after they happen.' },
  { q: 'What SaaS apps and systems can Receipt connect to?', a: 'Receipt integrates with 1000+ SaaS providers through Nango (AWS, Azure, Vercel, GitHub, GitLab, Jira, Confluence, Slack, HubSpot, Salesforce, Linear, Zendesk, and many more). You control which integrations each team member can access via org-level policy; credentials stay with the provider (Nango), never in Receipt; and you can add new integrations without waiting for a Receipt release. If Nango supports it and your team has a connection, the AI can use it\u2014sandbox first, audit everything.' },
  { q: 'How do I know the AI actually did what it claimed to do?', a: 'Every action is a receipt: immutable, timestamped, cryptographically chained to the previous receipt, and contains the command, the evidence artifact, and the exit code. You can replay that receipt independently to verify the outcome. For external APIs (AWS, Jira, GitHub), the evidence includes the raw API response verbatim plus a tamper-evident hash. For code execution, you get the stdout, exit code, and any files created. Replay + independent verification = proof. No copying data between systems, no hidden side effects.' },
  { q: 'What happens if the agent makes a mistake, gets stuck, or a task crashes?', a: 'Receipt logs every step as an immutable receipt, so if a task crashes, you can replay from the last receipt without re-running earlier work\u2014crash recovery is automatic. If the AI makes a wrong decision, that\u2019s logged and auditable; you can review the evidence, fix the underlying issue, and replay from any point. If the agent gets stuck, Receipt detects stalled work (expired leases, watchdog, invariant checks) and self-heals with no human intervention\u2014re-folding receipts and re-dispatching deterministically.' },
];

export const footerLinks = {
  Product: [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Dashboards', href: '#dashboard' },
    { label: 'Integrations', href: '#integrations' },
  ],
  Solutions: departments.slice(0, 5).map((d) => ({ label: d.label, href: d.href })),
  Resources: [
    { label: 'Customers', href: '#customers' },
    { label: 'FAQ', href: '#faq' },
  ],
};
