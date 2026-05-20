import type { Metadata } from "next";
import Link from "next/link";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";

export const metadata: Metadata = {
  title: "AOH 90s Org Chart - The Hub",
  description: "Internal AOH 90s-style hierarchy chart for human and agent inspiration personas.",
  robots: { index: false, follow: false },
};

type OrgTone = "executive" | "ops" | "revenue" | "delivery" | "systems";

type OrgRole = {
  title: string;
  persona: string;
  status: "human" | "live" | "manual" | "building" | "planned";
  summary: string;
  owns: string[];
  reportsTo?: string;
  tone: OrgTone;
  image: string;
  imagePosition?: string;
};

const ROLES: OrgRole[] = [
  {
    title: "President",
    persona: "Mike Egidio",
    status: "human",
    summary: "Approves direction, client-facing risk, pricing, tool changes, and final go/no-go calls.",
    owns: ["business decisions", "approvals", "client promises"],
    tone: "executive",
    image: "/team/mike-org.jpg",
  },
  {
    title: "Chief of Staff",
    persona: "Sheryl Sandberg",
    status: "planned",
    summary: "Prepares the morning brief, filters noise, and turns recommendations into a clean approval queue.",
    owns: ["morning brief", "approval queue", "daily agenda"],
    reportsTo: "President",
    tone: "executive",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Sheryl_Sandberg_WEF_2013_%28crop_by_James_Tamim%29.jpg/330px-Sheryl_Sandberg_WEF_2013_%28crop_by_James_Tamim%29.jpg",
  },
  {
    title: "General Manager",
    persona: "Elon Musk",
    status: "live",
    summary: "Runs the agent company day to day, assigns owners, tracks blockers, and escalates to Mike.",
    owns: ["job routing", "client risk triage", "fleet priorities"],
    reportsTo: "Chief of Staff",
    tone: "ops",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Elon_Musk_-_54820081119_%28cropped%29.jpg/330px-Elon_Musk_-_54820081119_%28cropped%29.jpg",
  },
  {
    title: "Systems Director",
    persona: "Charlie Munger",
    status: "planned",
    summary: "Owns IT, tool stack health, access, security, backups, costs, and whether new software is worth adding.",
    owns: ["OpenClaw", "VPS", "GitHub", "Vercel", "Slack", "GHL access", "backups"],
    reportsTo: "General Manager",
    tone: "systems",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Charlie_Munger_%28cropped%29.jpg/330px-Charlie_Munger_%28cropped%29.jpg",
  },
  {
    title: "Sales Manager",
    persona: "Zig Ziglar",
    status: "building",
    summary: "Owns the revenue pipeline from campaign choice to booked calls, including when to pause, change, or scale outreach.",
    owns: ["campaign strategy", "sales pipeline", "reply follow-up", "booked-call handoff"],
    reportsTo: "General Manager",
    tone: "revenue",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Zig_Ziglar_at_Get_Motivated_Seminar%2C_Cow_Palace_2009-3-24_3.JPG/330px-Zig_Ziglar_at_Get_Motivated_Seminar%2C_Cow_Palace_2009-3-24_3.JPG",
  },
  {
    title: "Client Success Manager",
    persona: "Tony Hsieh",
    status: "planned",
    summary: "Owns whether clients are onboarded, happy, reported to, renewed, and not quietly ignored after the sale.",
    owns: ["onboarding health", "client check-ins", "renewals", "retention risks"],
    reportsTo: "General Manager",
    tone: "ops",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Tony_hsieh.jpg/330px-Tony_hsieh.jpg",
  },
  {
    title: "Hub",
    persona: "Marc Benioff",
    status: "planned",
    summary: "Answers account questions by reading the ledger, GHL, Drive, client notes, and delivery history.",
    owns: ["client Q&A", "account lookups", "status answers"],
    reportsTo: "Client Success Manager",
    tone: "ops",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Marc_Benioff.jpg/330px-Marc_Benioff.jpg",
  },
  {
    title: "GHL Expert",
    persona: "Bill Gates",
    status: "live",
    summary: "Owns hub360ai/GHL setup, workflows, pipelines, tags, callbacks, reports, and automation health.",
    owns: ["GHL workflows", "pipelines", "calendars", "report delivery"],
    reportsTo: "Systems Director",
    tone: "systems",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Bill_Gates_at_the_European_Commission_-_P067383-987995_%28cropped%29_5.jpg/330px-Bill_Gates_at_the_European_Commission_-_P067383-987995_%28cropped%29_5.jpg",
  },
  {
    title: "Local Visibility Manager",
    persona: "Seth Godin",
    status: "building",
    summary: "Owns Google Business Profile access, profile health, citations, review links, and local/AI visibility signals.",
    owns: ["Google profile", "local visibility", "citations", "AI visibility checks"],
    reportsTo: "Client Success Manager",
    tone: "delivery",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Seth_Godin_in_2009.jpg/330px-Seth_Godin_in_2009.jpg",
  },
  {
    title: "Reviews Manager",
    persona: "Jeff Bezos",
    status: "planned",
    summary: "Owns review automation delivery, review request health, replies, reporting cadence, and review-volume warnings.",
    owns: ["review requests", "review reports", "reply health", "review velocity"],
    reportsTo: "Client Success Manager",
    tone: "delivery",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/260202-D-PM193-2205_SECWAR_Arsenal_of_Freedom_Tour_-_Florida_%283x4_cropped_on_Bezos_and_rotated%29.jpg/330px-260202-D-PM193-2205_SECWAR_Arsenal_of_Freedom_Tour_-_Florida_%283x4_cropped_on_Bezos_and_rotated%29.jpg",
  },
  {
    title: "Relay Manager",
    persona: "Alexander Graham Bell",
    status: "planned",
    summary: "Owns voice-agent delivery, missed-call recovery, call summaries, routing quality, and escalation issues.",
    owns: ["voice delivery", "call logs", "missed calls", "routing QA"],
    reportsTo: "Client Success Manager",
    tone: "delivery",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Alexander_Graham_Bell_1895_NPG_77_363.jpg/330px-Alexander_Graham_Bell_1895_NPG_77_363.jpg",
  },
  {
    title: "Coach",
    persona: "Tony Robbins",
    status: "building",
    summary: "Keeps product truth, SOPs, sales language, client instructions, and response drafts aligned.",
    owns: ["SOPs", "pricing answers", "objection handling", "client-safe wording"],
    reportsTo: "General Manager",
    tone: "ops",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Tony_Robbins.jpg/330px-Tony_Robbins.jpg",
  },
  {
    title: "Scout",
    persona: "Nikola Tesla",
    status: "live",
    summary: "Finds prospects, weak profiles, review gaps, niche signals, and cheap prefilter evidence.",
    owns: ["prospect research", "fit scoring", "source notes"],
    reportsTo: "Sales Manager",
    tone: "revenue",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Tesla_circa_1890.jpeg/330px-Tesla_circa_1890.jpeg",
  },
  {
    title: "Sender",
    persona: "Steve Jobs",
    status: "planned",
    summary: "Prepares outreach, watches deliverability, validates merge fields, and keeps campaigns reply-first.",
    owns: ["email campaigns", "follow-ups", "deliverability"],
    reportsTo: "Sales Manager",
    tone: "revenue",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Steve_Jobs_Headshot_2010_%28cropped_4%29.jpg/330px-Steve_Jobs_Headshot_2010_%28cropped_4%29.jpg",
  },
  {
    title: "Sorter",
    persona: "Marie Curie",
    status: "planned",
    summary: "Classifies replies, catches hot leads, handles opt-outs, and routes unclear items for review.",
    owns: ["reply triage", "hot lead routing", "suppression"],
    reportsTo: "Sales Manager",
    tone: "revenue",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Marie_Curie_c._1920s.jpg/330px-Marie_Curie_c._1920s.jpg",
  },
  {
    title: "Booker",
    persona: "Oprah Winfrey",
    status: "planned",
    summary: "Turns buying intent into booked calls and keeps handoffs clean.",
    owns: ["booking links", "show-rate follow-up", "meeting handoff"],
    reportsTo: "Sales Manager",
    tone: "revenue",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Oprah_Winfrey_2016.jpg/330px-Oprah_Winfrey_2016.jpg",
  },
  {
    title: "Engagement Scout",
    persona: "Gary Vaynerchuk",
    status: "planned",
    summary: "Finds social conversations worth entering and drafts comments or DM suggestions for approval.",
    owns: ["social listening", "comment drafts", "DM opportunities", "engagement log"],
    reportsTo: "Sales Manager",
    tone: "revenue",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Gary_Vaynerchuk_public_domain.jpg/330px-Gary_Vaynerchuk_public_domain.jpg",
  },
  {
    title: "Studio",
    persona: "Walt Disney",
    status: "live",
    summary: "Creates approved visuals, assets, and eventually content variants for AOH and clients.",
    owns: ["creative assets", "visual drafts", "content production"],
    reportsTo: "General Manager",
    tone: "delivery",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Walt_Disney_1946_%28cropped2%29.JPG/330px-Walt_Disney_1946_%28cropped2%29.JPG",
  },
  {
    title: "Editor",
    persona: "Anna Wintour",
    status: "manual",
    summary: "Chooses angles, priorities, brand voice, and what content is worth making.",
    owns: ["editorial plan", "angle selection", "voice review"],
    reportsTo: "General Manager",
    tone: "delivery",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/AnnaWintour-byPhilipRomano.jpg/330px-AnnaWintour-byPhilipRomano.jpg",
  },
  {
    title: "Press",
    persona: "Richard Branson",
    status: "manual",
    summary: "Publishes approved content and records proof that it went out correctly.",
    owns: ["publishing", "scheduling", "proof of publish"],
    reportsTo: "General Manager",
    tone: "delivery",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Richard_Branson_Addresses_the_Our_Ocean_Conference_2015_in_Valpara%C3%ADso_%2821783214958%29_%28cropped%29.jpg/330px-Richard_Branson_Addresses_the_Our_Ocean_Conference_2015_in_Valpara%C3%ADso_%2821783214958%29_%28cropped%29.jpg",
  },
  {
    title: "Reporter",
    persona: "Warren Buffett",
    status: "live",
    summary: "Confirms report links open, match the right contact, and tell a useful story.",
    owns: ["report QA", "delivery proof", "monthly reporting"],
    reportsTo: "Client Success Manager",
    tone: "delivery",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Warren_Buffett_at_the_2015_SelectUSA_Investment_Summit_%28cropped%29.jpg/330px-Warren_Buffett_at_the_2015_SelectUSA_Investment_Summit_%28cropped%29.jpg",
  },
  {
    title: "Scheduler",
    persona: "Tim Cook",
    status: "live",
    summary: "Protects calendars, booking availability, reminders, and meeting context.",
    owns: ["AOH Talk", "calendar blocks", "meeting briefs"],
    reportsTo: "Chief of Staff",
    tone: "ops",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Tim_Cook_March_2026_%28cropped_2%29.jpg/330px-Tim_Cook_March_2026_%28cropped_2%29.jpg",
  },
];

const DEPARTMENTS = [
  {
    title: "Executive Office",
    lead: "Chief of Staff",
    support: ["Scheduler"],
  },
  {
    title: "Company Operations",
    lead: "General Manager",
    support: ["Coach"],
  },
  {
    title: "Systems and IT",
    lead: "Systems Director",
    support: ["GHL Expert"],
  },
  {
    title: "Sales Department",
    lead: "Sales Manager",
    support: ["Scout", "Sender", "Sorter", "Booker", "Engagement Scout"],
  },
  {
    title: "Client Success",
    lead: "Client Success Manager",
    support: ["Hub", "Reporter"],
  },
  {
    title: "Client Delivery",
    lead: "Local Visibility Manager",
    support: ["Reviews Manager", "Relay Manager"],
  },
  {
    title: "Marketing Department",
    lead: "Editor",
    support: ["Studio", "Press"],
  },
];

const TITLE_BAR_CLASS: Record<OrgTone, string> = {
  executive: "bg-[#003b7a]",
  ops: "bg-[#005a8f]",
  revenue: "bg-[#4b2c83]",
  delivery: "bg-[#7b4d00]",
  systems: "bg-[#7a1f2b]",
};

export default function OrgChartPage() {
  const liveCount = ROLES.filter((role) => role.status === "live" || role.status === "human").length;
  const plannedCount = ROLES.filter((role) => role.status === "planned").length;

  return (
    <ControlShell wide>
      <header className="mb-6 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            AOH - Mission Control
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            AOH 90s Org Chart
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            Business and field-associated public figures are used as inspiration labels only. They are not
            affiliated with AOH and do not endorse this system.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/mike-mc"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Back to Hub
          </Link>
          <Pill tone="accent">{liveCount} live/human</Pill>
          <Pill tone="muted">{plannedCount} planned</Pill>
        </div>
      </header>

      <section className="border-2 border-[#808080] bg-[#c0c0c0] p-3 text-[#111] shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#404040] md:p-5">
        <div className="mb-4 flex items-center justify-between border-2 border-[#808080] bg-[#000080] px-3 py-2 text-white shadow-[inset_1px_1px_0_#8aa1ff,inset_-1px_-1px_0_#001a4d]">
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider">
            AI Outsource Hub - Agent Company Hierarchy
          </h2>
          <span className="font-mono text-xs">v1.0</span>
        </div>

        <div className="flex flex-col items-center">
          <OrgBox role={findRole("President")} size="large" />
          <Connector />
          <div className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
            <OrgBox role={findRole("Chief of Staff")} />
            <OrgBox role={findRole("General Manager")} />
          </div>
          <Connector />
          <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3 2xl:grid-cols-4">
            {DEPARTMENTS.map((department) => (
              <DepartmentBox key={department.title} department={department} />
            ))}
          </div>
        </div>
        <p className="mt-4 border-t border-[#808080] pt-2 font-mono text-[10px] uppercase tracking-wide text-[#333]">
          Portraits load from public Wikimedia/Wikipedia image paths where available. Persona labels are inspiration only.
        </p>
      </section>
    </ControlShell>
  );
}

function DepartmentBox({ department }: { department: { title: string; lead: string; support: string[] } }) {
  return (
    <section className="border-2 border-[#808080] bg-[#d7d3c7] p-2 shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#606060]">
      <div className="mb-2 bg-[#000080] px-2 py-1 font-mono text-xs font-bold uppercase tracking-wide text-white">
        {department.title}
      </div>
      <OrgBox role={findRole(department.lead)} compact />
      <div className="mx-auto h-4 w-px bg-[#606060]" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {department.support.map((title) => (
          <OrgBox key={title} role={findRole(title)} compact />
        ))}
      </div>
    </section>
  );
}

function OrgBox({ role, size = "normal", compact = false }: { role: OrgRole; size?: "normal" | "large"; compact?: boolean }) {
  return (
    <article className="border-2 border-[#808080] bg-[#e7e3d7] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#606060]">
      <div className={`${TITLE_BAR_CLASS[role.tone]} flex items-center justify-between gap-2 px-2 py-1 text-white`}>
        <span className="truncate font-mono text-[11px] font-bold uppercase tracking-wide">{role.title}</span>
        <span className="rounded-none border border-white/50 px-1 font-mono text-[9px] uppercase">{role.status}</span>
      </div>
      <div className={`grid gap-3 p-3 ${size === "large" ? "sm:grid-cols-[96px_1fr]" : "grid-cols-[72px_1fr]"}`}>
        <PersonPhoto role={role} large={size === "large"} />
        <div className="min-w-0">
          <h3 className={`${size === "large" ? "text-xl" : "text-base"} font-serif font-bold leading-tight text-[#111]`}>
            {role.persona}
          </h3>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-[#444]">
            inspiration persona
          </p>
          {!compact && <p className="mt-2 text-sm leading-snug text-[#222]">{role.summary}</p>}
          {role.reportsTo && (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-[#555]">
              reports to {role.reportsTo}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-1">
            {role.owns.slice(0, compact ? 2 : 4).map((item) => (
              <span key={item} className="border border-[#808080] bg-[#f5f1e6] px-1.5 py-0.5 text-[10px] text-[#222]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function PersonPhoto({ role, large = false }: { role: OrgRole; large?: boolean }) {
  const size = large ? "h-24 w-24" : "h-[72px] w-[72px]";

  return (
    <div
      aria-label={`${role.persona} portrait`}
      className={`${size} border-2 border-[#808080] bg-[#bdb8aa] bg-cover bg-center shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#606060]`}
      role="img"
      style={{
        backgroundImage: `url("${role.image}")`,
        backgroundPosition: role.imagePosition ?? "center",
      }}
    />
  );
}

function Connector() {
  return (
    <div className="flex h-8 w-full items-center justify-center">
      <div className="h-full w-px bg-[#606060]" />
    </div>
  );
}

function findRole(title: string) {
  const role = ROLES.find((item) => item.title === title);
  if (!role) throw new Error(`Missing org role: ${title}`);
  return role;
}
