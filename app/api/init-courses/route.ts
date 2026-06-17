import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

function genId(prefix: string) {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const STARTER_COURSES = [
  {
    title: "Digital Skills for Beginners",
    description: "Learn to use a computer, create documents, and navigate the internet safely. Perfect for complete beginners.",
    category: "Digital Skills",
    totalWeeks: 3,
    difficulty: "Beginner",
    imageEmoji: "💻",
    sortOrder: 50,
    weeks: [
      {
        week: 1,
        title: "Getting Started with Computers",
        content: `# Week 1: Getting Started with Computers

## What You'll Learn
By the end of this week you can turn on a computer, use a mouse and keyboard, and open basic programs.

## Parts of a Computer

| Part | What It Does |
|---|---|
| **Monitor** | Screen that shows everything |
| **Keyboard** | You type with this |
| **Mouse** | You click and move things |
| **CPU / Tower** | The brain of the computer |
| **Speakers** | Play sound |

## How to Use a Mouse
- **Click** — press the left button once to select
- **Double-click** — press twice fast to open a file
- **Right-click** — press the right button for a menu
- **Scroll** — roll the wheel to move up and down a page

## The Desktop
When you turn on a computer, you see the **desktop** — like a real desk where you keep your things.
- **Icons** — small pictures that open programs
- **Taskbar** — the bar at the bottom with the Start menu
- **Folders** — containers to organise your files

## Practice Exercises

**Exercise 1:** Turn on a computer. Find and open the "File Explorer" or "My Documents" folder.

**Exercise 2:** Practice clicking — open a program by double-clicking, then close it by clicking the X in the corner.

**Exercise 3:** Right-click on the desktop and look at the menu that appears. What options do you see?

## Key Takeaways
✅ A computer has input devices (keyboard, mouse) and output devices (monitor, speakers)
✅ Single-click to select; double-click to open
✅ The desktop is your main workspace
✅ The taskbar at the bottom helps you switch between programs`,
      },
      {
        week: 2,
        title: "Creating Documents",
        content: `# Week 2: Creating Documents with Word Processor

## What is a Word Processor?
A word processor (like Microsoft Word or Google Docs) lets you write, edit, and format text — like a typewriter but much more powerful.

## Opening and Saving a Document
1. Open your word processor program
2. A blank page appears — start typing!
3. To save: press **Ctrl + S** (hold Ctrl key and press S)
4. Give your file a name and choose where to save it

## Basic Formatting

| What To Do | How To Do It |
|---|---|
| **Bold** | Select text, press Ctrl + B |
| *Italic* | Select text, press Ctrl + I |
| Underline | Select text, press Ctrl + U |
| Change font size | Select text, click the number and type a new one |
| Change colour | Select text, click the A with colour underneath |

## Useful Keyboard Shortcuts
- **Ctrl + C** — Copy selected text
- **Ctrl + V** — Paste
- **Ctrl + X** — Cut (remove and copy)
- **Ctrl + Z** — Undo (fix a mistake)
- **Ctrl + A** — Select all text

## Practice Exercises

**Exercise 1:** Open a word processor and type a letter to a friend. Include their name, a greeting, 3 sentences about your week, and your name at the end.

**Exercise 2:** Format your letter — make the greeting bold, your name italic, and change the font size of the title to 18.

**Exercise 3:** Save your document with the name "My First Letter" and close the program. Then find the file and open it again.

## Key Takeaways
✅ Ctrl + S saves your work — do it often!
✅ Ctrl + Z undoes mistakes
✅ Select text first, then apply formatting
✅ Save files with clear names so you can find them later`,
      },
      {
        week: 3,
        title: "Internet & Email Basics",
        content: `# Week 3: Internet & Email Basics

## What is the Internet?
The internet is a giant network connecting computers all over the world. It lets you access information, communicate, and learn from anywhere.

## Using a Web Browser
A **browser** is a program you use to visit websites (Chrome, Firefox, Safari).

**Parts of the browser:**
- **Address bar** — type a website address here (e.g. google.com)
- **Back/Forward buttons** — go back to previous pages
- **Refresh button** — reload the current page
- **Tabs** — open multiple websites at once

## Staying Safe Online

**Do:**
✅ Use strong passwords (mix letters, numbers, symbols)
✅ Log out when using shared computers
✅ Only share personal info on trusted sites

**Don't:**
❌ Click links from unknown senders
❌ Share your password with anyone
❌ Enter your details on sites that look suspicious

## Email Basics
Email lets you send written messages instantly anywhere in the world — for free.

**Parts of an email:**
- **To:** — who you're sending it to
- **Subject:** — a short summary of the email
- **Body** — your actual message
- **Attach** — add a file (photo, document)

## Practice Exercises

**Exercise 1:** Open a browser and search for "Her Access platform" — what do you find?

**Exercise 2:** Create a free email account on Gmail (gmail.com). Use your real name and a strong password.

**Exercise 3:** Send an email to a classmate. Include a subject line and at least 3 sentences.

## Key Takeaways
✅ The address bar is where you type website addresses
✅ Never share your password — not even with friends
✅ Log out of email and social media on shared computers
✅ Email is free and works anywhere in the world with internet`,
      },
    ],
  },
  {
    title: "English Conversation Basics",
    description: "Build confidence speaking English in everyday situations — greetings, shopping, school, and making friends.",
    category: "English",
    totalWeeks: 4,
    difficulty: "Beginner",
    imageEmoji: "🗣️",
    sortOrder: 51,
    weeks: [
      {
        week: 1,
        title: "Greetings & Introductions",
        content: `# Week 1: Greetings & Introductions

## What You'll Learn
How to say hello, introduce yourself, and start a conversation in English.

## Common Greetings

| Situation | What to Say |
|---|---|
| Morning | Good morning! |
| Afternoon | Good afternoon! |
| Evening | Good evening! |
| Any time (informal) | Hi! / Hello! / Hey! |
| How are you? | I'm fine, thanks. / I'm good! / Not bad. |

## Introducing Yourself

**Basic introduction:**
> "Hi! My name is Aisha. I'm from Bishkek. Nice to meet you!"

**Asking about someone:**
> "What's your name?" / "Where are you from?" / "How old are you?"

**Responding:**
> "My name is..." / "I'm from..." / "I'm [number] years old."

## Useful Words

- **Nice to meet you** — what you say when you first meet someone
- **Pleased to meet you** — more formal version
- **How do you do?** — very formal (usually with a handshake)
- **See you later / Goodbye / Bye!** — ways to say goodbye

## Practice Exercises

**Exercise 1:** Write your own introduction (4-5 sentences): your name, age, where you're from, and one thing you like.

**Exercise 2:** Practice saying these greetings out loud 5 times each: "Good morning!", "Nice to meet you!", "How are you?"

**Exercise 3:** With a partner (or in front of a mirror), introduce yourself and ask the other person three questions about themselves.

## Key Takeaways
✅ Use "Good morning/afternoon/evening" to be polite
✅ "Nice to meet you" is always the right response when meeting someone new
✅ Smile and make eye contact — it makes English feel more natural
✅ Don't worry about being perfect — just practise!`,
      },
      {
        week: 2,
        title: "Numbers, Time & Dates",
        content: `# Week 2: Numbers, Time & Dates

## Numbers 1–100

1-10: one, two, three, four, five, six, seven, eight, nine, ten
11-20: eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty
Tens: thirty, forty, fifty, sixty, seventy, eighty, ninety, one hundred

**Combined:** 25 = twenty-five | 47 = forty-seven | 93 = ninety-three

## Telling the Time

| Clock | How to Say It |
|---|---|
| 3:00 | It's three o'clock |
| 3:15 | It's quarter past three |
| 3:30 | It's half past three |
| 3:45 | It's quarter to four |
| 3:10 | It's ten past three |

**Asking:** "What time is it?" / "Do you have the time?"

## Days and Months

**Days:** Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday

**Months:** January, February, March, April, May, June, July, August, September, October, November, December

**Dates:** "My birthday is on the fifteenth of March." / "The exam is on Monday, June 5th."

## Practice Exercises

**Exercise 1:** Write these numbers in words: 14, 37, 62, 89, 100.

**Exercise 2:** What time is it right now? Write it in English two ways (e.g. "It's 2:30 / It's half past two").

**Exercise 3:** Write your birthday in English: "I was born on [day], [month] [date], [year]."

## Key Takeaways
✅ Numbers 13-19 end in "-teen"; 20-90 end in "-ty"
✅ "Quarter past" = 15 minutes after; "Half past" = 30 minutes after
✅ Days and months always start with capital letters
✅ Practice saying numbers out loud — it makes them easier to remember`,
      },
      {
        week: 3,
        title: "Shopping & Asking for Help",
        content: `# Week 3: Shopping & Asking for Help

## Shopping Phrases

**Finding something:**
- "Excuse me, where is the...?"
- "Do you have...?"
- "I'm looking for..."

**Asking the price:**
- "How much is this?"
- "How much does it cost?"
- "What's the price?"

**Buying:**
- "I'll take it." / "I'll buy this one."
- "Can I pay by card?" / "Do you accept cash?"
- "Can I have a bag, please?"

**Too expensive:**
- "That's too expensive."
- "Do you have anything cheaper?"

## Useful Quantities

| Word | Meaning |
|---|---|
| a piece of | one unit |
| a pair of | two (shoes, socks) |
| a dozen | twelve |
| a kilo of | 1000 grams |
| a litre of | liquid measurement |

## Asking for Help (Any Situation)

- "Excuse me, can you help me?"
- "Sorry to bother you, but..."
- "Could you tell me where...?"
- "I'm lost. How do I get to...?"
- "Could you repeat that, please? I didn't understand."

## Practice Exercises

**Exercise 1:** Write a short shopping dialogue (6-8 lines) between a customer and shopkeeper. Include asking for a product, asking the price, and buying it.

**Exercise 2:** Practice saying "Excuse me, could you help me? I'm looking for [item]." 3 times with different items.

**Exercise 3:** What do you say if someone speaks too fast and you don't understand? Write 2 polite phrases.

## Key Takeaways
✅ "Excuse me" always sounds polite when asking strangers for help
✅ "How much is this?" is the most useful shopping phrase
✅ It's OK to say "Could you repeat that?" — everyone appreciates politeness
✅ Practise these phrases out loud until they feel natural`,
      },
      {
        week: 4,
        title: "Talking About Yourself & Your Day",
        content: `# Week 4: Talking About Yourself & Your Day

## Talking About Your Hobbies

"I like..." / "I love..." / "I enjoy..." / "I'm interested in..."
"I don't like..." / "I'm not a fan of..."
"My hobby is..." / "In my free time, I..."

**Examples:**
- "I love reading books and learning new languages."
- "I enjoy cooking and helping my family."
- "I'm really interested in science and technology."

## Describing Your Daily Routine

| Time | Activity |
|---|---|
| I wake up at 7 a.m. | get up / wake up |
| I have breakfast | eat / have a meal |
| I go to school / work | commute / travel |
| I study / work | learn / practise |
| I come home | return home |
| I go to bed at 10 p.m. | sleep / rest |

**Useful words:** first, then, after that, later, finally, before, after

## Describing Feelings

| Feeling | How to Express It |
|---|---|
| Happy | "I'm really happy today!" / "I feel great!" |
| Tired | "I'm exhausted." / "I need rest." |
| Excited | "I'm so excited about..." |
| Nervous | "I'm a bit nervous about..." |
| Grateful | "I'm thankful for..." |

## Practice Exercises

**Exercise 1:** Describe your typical weekday. Write 6-8 sentences using time words (first, then, after that).

**Exercise 2:** Write 5 sentences about your hobbies and interests.

**Exercise 3:** How do you feel today? Write 3 sentences explaining why.

## Key Takeaways
✅ Use time words (first, then, after that) to describe routines clearly
✅ "I like / I love / I enjoy" are all correct — use them for variety
✅ Sharing your feelings in English builds real connections
✅ You've now learned enough English to have a real conversation — be proud!`,
      },
    ],
  },
  {
    title: "Life Skills for Young Women",
    description: "Essential practical skills for independence: budgeting, decision-making, safety, and knowing your rights.",
    category: "Leadership",
    totalWeeks: 3,
    difficulty: "Beginner",
    imageEmoji: "🌸",
    sortOrder: 52,
    weeks: [
      {
        week: 1,
        title: "Managing Money & Budgeting",
        content: `# Week 1: Managing Money & Budgeting

## Why Budgeting Matters
Money doesn't have to be a mystery. A simple budget helps you save for what matters, avoid debt, and feel in control of your life.

## The 50/30/20 Rule

| Category | Percentage | What It Covers |
|---|---|---|
| **Needs** | 50% | Food, rent, transport, medicine |
| **Wants** | 30% | Fun, clothes, eating out |
| **Savings** | 20% | Emergency fund, goals |

**Example:** If you earn 10,000 per month:
- 5,000 on needs
- 3,000 on wants
- 2,000 in savings

## Making a Simple Budget

**Step 1:** Write down all income (money coming in)
**Step 2:** List all expenses (money going out)
**Step 3:** Income − Expenses = What's left
**Step 4:** If expenses > income, cut something from "wants"

## Building an Emergency Fund
An emergency fund is 3-6 months of basic living expenses saved.

Start small: even saving 5% of income every month builds a safety net over time.

**Why it matters:** If something unexpected happens (illness, job loss), you won't have to borrow money at high interest.

## Practice Exercises

**Exercise 1:** Write your monthly budget. List all income and all expenses. Does more come in than goes out?

**Exercise 2:** Identify one "want" expense you could reduce or eliminate to save 10% more per month.

**Exercise 3:** Calculate: if you save 500 per month, how much will you have in 1 year? In 3 years?

## Key Takeaways
✅ A budget is just a plan for your money — it's not restricting, it's freeing
✅ Always pay your needs first, then save, then spend on wants
✅ An emergency fund prevents debt when unexpected things happen
✅ Even small savings add up significantly over time`,
      },
      {
        week: 2,
        title: "Making Smart Decisions",
        content: `# Week 2: Making Smart Decisions

## The DECIDE Framework

A structured approach to any important decision:

- **D** — Define the problem clearly
- **E** — Explore all options (at least 3)
- **C** — Consider the consequences of each option
- **I** — Identify the best option
- **D** — Decide and act
- **E** — Evaluate afterwards — did it work?

## Common Thinking Traps

| Trap | What It Means | How to Avoid |
|---|---|---|
| Impulse decisions | Acting without thinking | Wait 24 hours for big decisions |
| Peer pressure | Doing what others want | Ask "Is this what I really want?" |
| Fear of missing out | Choosing out of fear | Ask "What do I actually value?" |
| All-or-nothing thinking | It's perfect or worthless | Look for middle options |

## Saying No Respectfully

Saying no protects your time, energy, and values.

**Scripts:**
- "I appreciate you thinking of me, but I can't do that right now."
- "That's not something I'm comfortable with."
- "I need to think about it — I'll let you know."

You do not have to explain yourself. A respectful "no" is enough.

## Asking for Advice
Smart decision-makers gather information from trusted people.

Ask: "Can I ask your advice on something?" Then listen. You don't have to follow advice, but hearing different perspectives helps you think better.

## Practice Exercises

**Exercise 1:** Think of a recent decision you made. Apply the DECIDE framework to it. What would you do differently?

**Exercise 2:** Practice saying no: write 3 different "no" responses to: "Can you lend me all your savings?"

**Exercise 3:** Write about a decision you're facing right now. List 3 options and the pros/cons of each.

## Key Takeaways
✅ Good decisions are made with clear thinking, not strong emotions
✅ "Sleeping on it" (waiting before deciding) is always a valid strategy
✅ You always have the right to say no
✅ Seeking advice is a sign of strength, not weakness`,
      },
      {
        week: 3,
        title: "Knowing Your Rights",
        content: `# Week 3: Knowing Your Rights

## Universal Human Rights
Every person in the world, regardless of gender, religion, or nationality, has basic rights recognised by the United Nations.

**Key rights relevant to you:**
- ✅ Right to education
- ✅ Right to safety and freedom from violence
- ✅ Right to healthcare
- ✅ Right to fair work and equal pay
- ✅ Right to choose who you marry
- ✅ Right to express your opinion
- ✅ Right to own property

## Your Right to Education
Education is a legal right, not a privilege. If you are denied education because of your gender, that is a violation of international law.

**Article 26 of the Universal Declaration of Human Rights:** "Everyone has the right to education."

## Staying Safe

**If you feel unsafe:**
1. Trust your instincts — they are almost always right
2. Tell a trusted adult
3. Document what happened (write dates, places, what was said)
4. Know your local emergency numbers

**Online safety:**
- Never share your location with strangers
- Private accounts protect your information
- Screenshot and report harassment

## Finding Help
Most countries have organisations that support women and girls. Search for:
- "Women's rights organisation [your country]"
- "Girls' education support [your region]"
- "Legal aid [your city]"

You are never alone.

## Practice Exercises

**Exercise 1:** Write down 3 rights that are most important to you personally and why.

**Exercise 2:** Research one local or international organisation that supports girls' education in your country. What do they offer?

**Exercise 3:** Create a "safety plan" — list 3 trusted people you can contact in an emergency and their phone numbers.

## Key Takeaways
✅ Your rights exist regardless of what anyone tells you
✅ Education is your legal right — no one can rightfully take it from you
✅ Documenting problems (dates, what happened) helps if you need to report them
✅ Help exists — you never have to face difficulties alone`,
      },
    ],
  },
];

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  const existing = await sql`SELECT COUNT(*)::int AS count FROM "Course"`.catch(() => [{ count: 1 }]);
  if ((existing[0]?.count ?? 0) > 0) {
    return NextResponse.json({ ok: true, message: "Courses already exist", seeded: false });
  }

  let created = 0;
  const now = new Date().toISOString();

  for (const courseData of STARTER_COURSES) {
    const courseId = genId("c");

    await sql`
      INSERT INTO "Course" (id, title, description, category, "totalWeeks", difficulty, language, "imageEmoji", "isPublished", "sortOrder", "createdAt", "updatedAt")
      VALUES (
        ${courseId}, ${courseData.title}, ${courseData.description}, ${courseData.category},
        ${courseData.totalWeeks}, ${courseData.difficulty}, 'en', ${courseData.imageEmoji},
        true, ${courseData.sortOrder}, ${now}::timestamp, ${now}::timestamp
      )
    `.catch(() => null);

    for (const week of courseData.weeks) {
      const liId = genId("li");
      await sql`
        INSERT INTO "LibraryItem" (id, title, description, category, content, difficulty, type, "weekNumber", "courseId", "createdAt", "updatedAt")
        VALUES (
          ${liId},
          ${`Week ${week.week}: ${week.title}`},
          ${`Week ${week.week} of ${courseData.title}`},
          ${courseData.category},
          ${week.content},
          ${courseData.difficulty},
          'reading',
          ${week.week},
          ${courseId},
          ${now}::timestamp,
          ${now}::timestamp
        )
      `.catch(() => null);
    }

    created++;
  }

  return NextResponse.json({ ok: true, message: `Created ${created} starter courses`, seeded: true, created });
}
