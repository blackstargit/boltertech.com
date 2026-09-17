// Deck-only copy. The website's own words come from data/, content/ and
// messages/ — anything written specifically for this deck lives here, so
// editing a line never means touching the site.
//
// PLACEHOLDER: `team.senior[1]` and `team.senior[2]` are invented people.
// Replace both with real staff, or delete them, before this deck is sent.

export const DECK = {
  statement: {
    eyebrow: "02  Who we are",
    heading: "Who we are",
    body: [
      "Bolter Technologies is a software company in Islamabad. We build the systems a business runs on: the software itself, the automation around it, the reporting on top of it, and the security under it.",
      "Most of our work starts the same way. A company is doing something by hand that eats a day a week, or has data sitting in four systems that do not talk to each other, or runs on software that no longer matches how the business works. We build the thing that fixes it, put it into daily use, and keep supporting it afterwards.",
      "We are the sister company of Sigma Engineering, in business since 2008, and of Sigma Technologies. That is where our senior people come from, and it is why a company of our age can put people with twenty-five years behind them on a project.",
    ],
    companiesLabel: "We run the technology for",
    companies: [
      { name: "Sigma Engineering", note: "Sister company, since 2008" },
      { name: "Sigma Technologies", note: "Sister company" },
      { name: "Berkeley Technology", note: "Client" },
      { name: "Logmate Engineering and Services", note: "Client" },
    ],
  },

  vision: {
    eyebrow: "03  Vision",
    heading: "Where we are going",
    body: [
      "We want every company we work with to be able to hand its repetitive work to software and trust it to run.",
      "That is not the same as buying more tools. It means the work is joined up: one system doing the job from start to finish, with people spending their time on the decisions that need judgement.",
      "We want to be the team a business calls first when it needs that built, and the team still answering the phone a year after it went live.",
    ],
    quote: {
      text: "The first rule of any technology used in a business is that automation applied to an efficient operation will magnify the efficiency. The second is that automation applied to an inefficient operation will magnify the inefficiency.",
      author: "Bill Gates",
      role: "Co-founder, Microsoft",
    },
  },

  team: {
    leadershipEyebrow: "04  People",
    leadershipHeading: "Leadership",
    seniorEyebrow: "04  People",
    seniorHeading: "Senior team",
    seniorLede:
      "Bolter is a young company staffed by people who are not. Our senior engineers and directors come out of telecom, enterprise software and Sigma Engineering, where most of them have spent their careers.",
    // Years of experience shown under each founder, keyed by data/founders.json id.
    experience: {
      "founder-one": "27 years in business and operations",
      "founder-two": "Delivery and client engagements",
      "founder-three": "Software architecture and engineering",
    },
    senior: [
      {
        name: "Muhammad Naaim",
        role: "Director",
        focus: "Telecom",
        years: "25 years",
        bio: "Naaim has spent twenty-five years in the telecom industry. He advises on the network and carrier side of our work and opens the doors that come with that long in one industry.",
      },
      {
        // PLACEHOLDER — invented person. Replace with a real engineer.
        name: "Bilal Ahmed",
        role: "Lead Engineer",
        focus: "Software delivery",
        years: "12 years",
        bio: "Bilal has built enterprise software for twelve years. He leads the build on client projects and reviews what the team ships before a client sees it.",
      },
      {
        // PLACEHOLDER — invented person. Replace with a real engineer.
        name: "Hina Rauf",
        role: "Data Lead",
        focus: "Data and analytics",
        years: "10 years",
        bio: "Hina has worked on data systems for ten years, most of it in reporting and analytics for large operations. She owns the data side of our projects, from the pipelines to the dashboards people actually open.",
      },
    ],
  },

  // Deck wording for the five practices. The website's own summaries are
  // written for a reader browsing a site; these are written for someone who
  // wants to know what we would do for their company. Order is deliberate:
  // automation leads.
  practiceOrder: ["automation", "ai", "software", "data", "security"],
  practices: {
    automation: {
      name: "AI and business automation",
      lead: true,
      summary:
        "Most offices have a job someone does by hand every day: copying numbers between two systems, chasing an approval, sending the same report every Monday. We find those jobs, build software that does them, and leave people in charge of the decisions that need judgement.",
      helps: [
        "Work out which parts of a process are worth automating, and say which are not",
        "Build the whole run, so a job that took a day happens on its own overnight",
        "Connect the systems you already pay for, so nobody retypes data between them",
        "Invoices, bills, reports and approvals that go out on time without anyone remembering",
        "A person still approves anything that needs a decision",
        "Alerts when a run fails, so you hear it from us and not from a customer",
      ],
    },
    ai: {
      name: "AI solutions",
      summary:
        "AI is worth paying for when it takes real work off people. We start with the job you want done, pick the model that does it, and build the checks that keep the answers honest. If AI is the wrong tool for a job, we say so.",
      helps: [
        "Read and sort documents: invoices, forms, contracts, reports",
        "Answer questions from your own files and data, with the source shown",
        "Assistants that do one specific job inside software your team already uses",
        "Test the output against real examples before it goes live, then keep watching it",
        "Run it on your own servers when the data cannot leave the building",
        "Agents that carry out multi-step work and keep a record of every step",
      ],
    },
    software: {
      name: "Software development",
      summary:
        "The software a business runs on: the product customers use, the internal system nobody outside ever sees, and the replacement for the spreadsheet that has quietly been holding a department together for six years.",
      helps: [
        "Web applications, customer portals and internal systems",
        "Replace spreadsheets and manual trackers with something built for the job",
        "Connect to what you already use: accounting, CRM, payments, email, WhatsApp",
        "Extend and repair software you already own instead of starting again",
        "Logins, permissions, payments, notifications and the workflow behind them",
        "Put it live, watch it, and hand over documentation your team can work from",
      ],
    },
    data: {
      name: "Data analytics",
      summary:
        "Most companies already have the numbers they need. They are spread across systems that do not talk to each other, so answering a simple question takes someone two days and a spreadsheet. We bring the numbers together and keep them current.",
      helps: [
        "Get data out of the systems it is stuck in, and clean it up",
        "One dashboard for the numbers you check daily, built around your questions",
        "Reports that build themselves instead of someone assembling them every Monday",
        "Match records across systems that spell the same customer four different ways",
        "Forecasting and early warnings where the data actually supports them",
        "Checks that flag a wrong number before anyone makes a decision on it",
      ],
    },
    security: {
      name: "Cyber security",
      summary:
        "Two kinds of work. Testing your systems the way an attacker would and telling you what we got into, and building the platforms security teams use to watch, investigate and report.",
      helps: [
        "Penetration testing of applications and infrastructure, with a report your team can act on",
        "Find what you have exposed to the internet and forgotten about",
        "Monitoring that surfaces the few incidents that matter, not thousands of alerts",
        "Threat intelligence and vulnerability tracking platforms",
        "Compliance and complaint systems with a full audit trail behind them",
        "Review code and design for security problems before something ships",
      ],
    },
  },

  practiceOverview: {
    eyebrow: "05  What we do",
    heading: "What we do",
    lede: "Five lines of work, one team. Automation leads because it is where most companies get the fastest return, and it is what the other four end up supporting.",
  },

  caseStudy: {
    problemLabel: "The problem",
    outcomeLabel: "What changed",
    worksLabel: "Case studies that follow",
  },

  clients: {
    eyebrow: "06  Clients",
    heading: "In our clients' words",
  },

  faq: {
    eyebrow: "07  Working together",
  },

  contact: {
    eyebrow: "08  Contact",
  },
};
