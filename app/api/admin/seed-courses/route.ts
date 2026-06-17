import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

const COURSES = [
  {
    title: "Grammar Fundamentals",
    description: "Master the building blocks of English: nouns, verbs, tenses, and sentence structure with clear, practical examples.",
    category: "English",
    totalWeeks: 4,
    difficulty: "Beginner",
    imageEmoji: "📖",
    sortOrder: 1,
    weeks: [
      {
        week: 1,
        title: "Parts of Speech & Sentence Structure",
        videoTitle: "Introduction to English Grammar",
        videoUrl: "https://www.youtube.com/watch?v=9huXuIrghSY",
        videoDuration: "45:00",
        content: `# Week 1: Parts of Speech & Sentence Structure

## What You'll Learn
By the end of this week you can identify the eight parts of speech and build grammatically correct sentences.

## The Eight Parts of Speech

| Part of Speech | Role | Example |
|---|---|---|
| **Noun** | Person, place, thing, idea | *girl, city, book, freedom* |
| **Pronoun** | Replaces a noun | *she, it, they, we* |
| **Verb** | Action or state | *run, is, think, became* |
| **Adjective** | Describes a noun | *beautiful, three, cold* |
| **Adverb** | Describes a verb/adjective | *quickly, very, yesterday* |
| **Preposition** | Shows relationship | *in, on, at, between* |
| **Conjunction** | Joins words/clauses | *and, but, because, although* |
| **Interjection** | Expresses emotion | *Oh! Wow! Yes!* |

## Basic Sentence Patterns

Every sentence needs a **subject** (who/what) and a **predicate** (what they do/are).

> **She** [subject] **reads every day** [predicate].

Common patterns:
- Subject + Verb → *Birds fly.*
- Subject + Verb + Object → *She reads books.*
- Subject + Verb + Complement → *He is a teacher.*

## Subject–Verb Agreement
The verb must match the subject in number.

✅ *She **walks** to school.*
✅ *They **walk** to school.*
❌ *She **walk** to school.*

## Practice Exercises

**Exercise 1:** Identify the part of speech of each underlined word.
> The *quick* brown fox *jumped* over the lazy dog *and* ran away *quickly*.

**Exercise 2:** Correct the errors:
1. She go to the market every morning.
2. The childrens are playing outside.
3. He have three sisters.

**Exercise 3:** Write five sentences about your daily routine using at least three different parts of speech in each.

## Key Takeaways
✅ Every sentence needs a subject and predicate
✅ Verbs must agree with their subjects
✅ Adjectives describe nouns; adverbs describe verbs
✅ Prepositions show relationships between words`,
      },
      {
        week: 2,
        title: "Verb Tenses",
        videoTitle: "English Verb Tenses Explained",
        videoUrl: "https://www.youtube.com/watch?v=1XxMKkW5eXE",
        videoDuration: "38:00",
        content: `# Week 2: Verb Tenses

## Why Tenses Matter
Tense tells us *when* something happens. Using the wrong tense is one of the most common grammar mistakes.

## The Three Main Tenses

### Past Tense
Something already happened.
- Simple past: *She **studied** last night.*
- Past continuous: *She **was studying** when the lights went out.*
- Past perfect: *She **had studied** before the exam.*

### Present Tense
Something is happening now or habitually.
- Simple present: *She **studies** every evening.*
- Present continuous: *She **is studying** right now.*
- Present perfect: *She **has studied** three chapters today.*

### Future Tense
Something will happen.
- Simple future (will): *She **will study** tomorrow.*
- Going to: *She **is going to study** after dinner.*
- Future continuous: *She **will be studying** at 8 p.m.*

## Irregular Verbs — Must Memorise

| Base | Simple Past | Past Participle |
|---|---|---|
| go | went | gone |
| eat | ate | eaten |
| write | wrote | written |
| think | thought | thought |
| see | saw | seen |
| take | took | taken |
| come | came | come |

## Time Expressions

| Tense | Common Time Words |
|---|---|
| Past | yesterday, last week, ago, in 2020 |
| Present | now, always, every day, usually |
| Future | tomorrow, next week, soon, in the future |

## Practice Exercises

**Exercise 1:** Put the verb in the correct tense.
1. She ________ (study) English for two years now. *(present perfect)*
2. Yesterday I ________ (go) to the library. *(simple past)*
3. This time next week, they ________ (travel) to the capital. *(future continuous)*

**Exercise 2:** Find and correct the tense errors:
> "Last summer I go to my grandmother's village. We swim in the river every day and eat fresh fruit. Now I miss it and I am wishing I can go again."

## Key Takeaways
✅ Use simple past for completed actions
✅ Use present perfect for past actions connected to now
✅ Memorise the most common irregular verbs
✅ Time expressions are clues to the correct tense`,
      },
      {
        week: 3,
        title: "Articles, Prepositions & Common Errors",
        videoTitle: "Articles and Prepositions in English",
        videoUrl: "https://www.youtube.com/watch?v=0-kHRN3QXOM",
        videoDuration: "32:00",
        content: `# Week 3: Articles, Prepositions & Common Errors

## Articles: a, an, the

### Indefinite Articles (a / an)
Use when introducing something for the **first time** or when it is **one of many**.
- *I saw **a** cat.* (any cat, first mention)
- *She is **an** engineer.* (one of many engineers)
- Use **an** before vowel sounds: *an apple, an hour, an umbrella*

### Definite Article (the)
Use when the noun is **specific** or has been **mentioned before**.
- *I saw a cat. **The** cat was black.* (now we know which cat)
- *Please close **the** door.* (a specific door, both speakers know which)
- Use with unique things: ***the** sun, **the** moon, **the** internet*

### No Article
- Names of people and most countries: *Fatima, France*
- Uncountable nouns in general: *I love **music**.*
- Plural nouns in general: ***Books** are important.*

## Prepositions of Time and Place

| Preposition | Time | Place |
|---|---|---|
| **at** | at 3 o'clock, at night | at the door, at school |
| **on** | on Monday, on my birthday | on the table, on the wall |
| **in** | in January, in 2024, in the morning | in the room, in Bishkek |

## Most Common Errors & Fixes

| Error | Correct | Rule |
|---|---|---|
| *I am agree* | *I **agree*** | "Agree" is already a verb |
| *She is very beautiful* ✅ / *very* overuse | Vary: *quite, really, extremely* | — |
| *I went to home* | *I went **home*** | No preposition with "home" |
| *Since three days* | ***For** three days* | Duration = for; start point = since |
| *He explained me* | *He explained **to** me* | "Explain" needs "to" |

## Practice Exercises

**Exercise 1:** Fill in a, an, the, or nothing (—).
1. She is ___ doctor at ___ hospital near my house.
2. ___ coffee is her favourite drink in ___ morning.
3. He visited ___ France last summer.

**Exercise 2:** Choose the correct preposition.
1. The meeting is *(at / on / in)* Friday *(at / on / in)* 9 a.m.
2. I have lived here *(for / since)* 2019.
3. The keys are *(at / on / in)* the table.

## Key Takeaways
✅ Use *the* for specific nouns, *a/an* for general ones
✅ *at* for exact times/points; *on* for days/dates; *in* for periods/places
✅ "For" measures duration; "since" marks a starting point`,
      },
      {
        week: 4,
        title: "Writing Clear Sentences & Paragraphs",
        videoTitle: "How to Write Clear English",
        videoUrl: "https://www.youtube.com/watch?v=oLkiG7fvMqY",
        videoDuration: "28:00",
        content: `# Week 4: Writing Clear Sentences & Paragraphs

## Sentence Variety
Good writing mixes different sentence types.

**Simple:** One independent clause.
> *She reads every night.*

**Compound:** Two independent clauses joined by a conjunction.
> *She reads every night, and she always learns something new.*

**Complex:** One independent + one dependent clause.
> *Although she is busy, she reads every night.*

## The PEEL Paragraph Structure

Every strong paragraph has four parts:

- **P**oint — State your main idea (topic sentence)
- **E**vidence — Support it with facts or examples
- **E**xplain — Analyse how the evidence supports your point
- **L**ink — Connect back to the main idea or lead to the next point

**Example:**
> Regular reading significantly improves vocabulary. *(Point)* Research shows that reading for just 20 minutes a day exposes readers to nearly 1.8 million words per year. *(Evidence)* This repeated exposure to new words in context helps learners absorb their meaning naturally, without memorisation. *(Explain)* Therefore, making reading a daily habit is one of the most effective ways to build strong language skills. *(Link)*

## Editing Checklist
Before submitting any written work, check:
- [ ] Each sentence has a subject and verb
- [ ] Tenses are consistent throughout
- [ ] Articles (a/an/the) are used correctly
- [ ] No spelling errors
- [ ] Paragraphs have clear topic sentences
- [ ] Ideas flow logically

## Practice Exercises

**Exercise 1:** Combine these simple sentences into one complex or compound sentence.
1. *She studied hard. She passed the exam.*
2. *It was raining. We stayed inside. We played board games.*

**Exercise 2:** Write a PEEL paragraph (5–8 sentences) on ONE of these topics:
- Why learning English is important in your community
- The best way to learn a new skill
- A person who inspired you

**Exercise 3:** Edit this paragraph — find and fix 5 errors:
> "Reading have many benefit. It improve you vocabulary and help you to understanding new ideas. Many successful peoples read every day and they says it changed they life."

## Key Takeaways
✅ Mix simple, compound, and complex sentences for natural writing
✅ Every paragraph needs a clear topic sentence
✅ Always edit your work before submitting
✅ PEEL structure keeps paragraphs focused and logical`,
      },
    ],
  },
  {
    title: "Business English",
    description: "Professional communication skills for emails, meetings, negotiations, and presentations in a global workplace.",
    category: "English",
    totalWeeks: 6,
    difficulty: "Intermediate",
    imageEmoji: "💼",
    sortOrder: 2,
    weeks: [
      {
        week: 1,
        title: "Professional Email Writing",
        videoTitle: "How to Write Professional Emails",
        videoUrl: "https://www.youtube.com/watch?v=PmRPo3oS-cM",
        videoDuration: "22:00",
        content: `# Week 1: Professional Email Writing

## Email Structure

Every professional email follows this structure:

1. **Subject line** — specific, clear, actionable
2. **Greeting** — formal or semi-formal
3. **Opening line** — context or purpose
4. **Body** — main message in short paragraphs
5. **Call to action** — what you need from the reader
6. **Closing** — polite sign-off
7. **Signature** — name, title, contact

## Subject Lines

| ❌ Weak | ✅ Strong |
|---|---|
| "Hello" | "Meeting Request — Q3 Budget Review, Oct 15" |
| "Question" | "Follow-up: Proposal Submitted 5 Oct" |
| "Important" | "Action Required: Deadline Extended to Friday" |

## Greetings & Sign-offs

**Formal (clients, senior colleagues):**
- Dear Ms Seitkali, / Dear Dr Abuov,
- Yours sincerely, / Yours faithfully,

**Semi-formal (regular colleagues):**
- Dear Aida, / Hello Marat,
- Best regards, / Kind regards,

## Useful Phrases

**Opening:**
- I am writing to enquire about…
- Further to our conversation on Monday…
- Thank you for your email regarding…

**Making a request:**
- Could you please send me…?
- I would appreciate it if you could…
- Would it be possible to…?

**Closing:**
- Please do not hesitate to contact me if you have any questions.
- I look forward to hearing from you.
- Thank you for your time and consideration.

## Practice

Write a professional email in response to this situation:
> Your manager asked you to arrange a meeting with an international partner next week. Write to the partner suggesting two possible times, attaching the agenda.`,
      },
      {
        week: 2,
        title: "Meeting Language",
        videoTitle: "Business English for Meetings",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoDuration: "25:00",
        content: `# Week 2: Meeting Language & Vocabulary

## Chairing a Meeting

**Opening:**
- *Let's get started / Let's begin.*
- *The purpose of today's meeting is to discuss…*
- *We have three items on the agenda.*

**Managing discussion:**
- *Could we hear from…?*
- *Let's move on to the next point.*
- *Let's come back to that later.*
- *Could you clarify what you mean by…?*

**Closing:**
- *To summarise the key points…*
- *The next steps are…*
- *Our next meeting will be on…*

## Participating in Meetings

**Agreeing:**
- *That's a good point.*
- *I completely agree with…*
- *Exactly. / Absolutely.*

**Disagreeing politely:**
- *I see your point, however…*
- *With respect, I think we should consider…*
- *That may be true, but…*

**Asking for clarification:**
- *Could you elaborate on that?*
- *What exactly do you mean by…?*
- *So are you saying that…?*

## Practice
Role-play: Chair a 5-minute meeting to decide on the best time for a team training session. Use at least 5 phrases from the lists above.`,
      },
      {
        week: 3,
        title: "Presentations & Public Speaking",
        videoTitle: "Business Presentations in English",
        videoUrl: "https://www.youtube.com/watch?v=2GoIdBDdBRg",
        videoDuration: "30:00",
        content: `# Week 3: Presentations & Public Speaking

## The PREP Structure

- **P**oint — State your main message
- **R**eason — Explain why
- **E**xample — Give evidence or a story
- **P**oint — Restate your message

## Signposting Language

Help your audience follow your talk:

**Structure:** *Today I'm going to cover three areas…*
**Moving on:** *Let's now turn to…*
**Emphasis:** *The key point here is…*
**Contrast:** *On the other hand…*
**Conclusion:** *To sum up… / In conclusion…*
**Questions:** *I'd be happy to take any questions.*

## Handling Nerves
- Breathe deeply before you start
- Pause deliberately — silence is powerful
- Make eye contact with different people
- Slow down — nervous speakers rush

## Visual Aids
- Maximum 6 words per slide
- One idea per slide
- Use images, not blocks of text
- Face the audience, not the screen

## Practice
Prepare a 3-minute presentation on "A skill I want to develop this year." Use PREP structure and at least 4 signposting phrases.`,
      },
      {
        week: 4,
        title: "Negotiation Language",
        videoTitle: "Negotiation Skills in English",
        videoUrl: "https://www.youtube.com/watch?v=BI-mVHjWqQ0",
        videoDuration: "28:00",
        content: `# Week 4: Negotiation Language

## Principles of Effective Negotiation
1. Prepare thoroughly — know your position and theirs
2. Listen more than you speak
3. Separate people from problems
4. Focus on interests, not positions
5. Look for win-win outcomes

## Key Phrases

**Opening:**
- *We're hoping to reach an agreement on…*
- *Our main priority is…*

**Making proposals:**
- *We'd like to propose…*
- *What if we were to…?*
- *Would you consider…?*

**Responding:**
- *That sounds reasonable, provided that…*
- *We could accept that if…*
- *I'm afraid that's not quite what we had in mind.*

**Compromising:**
- *We're willing to be flexible on…*
- *Could we meet halfway on…?*
- *We could go along with that if you could…*

**Closing:**
- *So to confirm, we've agreed that…*
- *Shall we put that in writing?*

## Practice
Role-play: Negotiate the deadline for a project. One person wants it in 2 weeks; the other needs 5 weeks. Reach a compromise using the phrases above.`,
      },
      {
        week: 5,
        title: "Business Reports & Proposals",
        videoTitle: "Writing Business Reports",
        videoUrl: "https://www.youtube.com/watch?v=HwgrfCjdFpA",
        videoDuration: "26:00",
        content: `# Week 5: Business Reports & Proposals

## Report Structure

1. **Title & Date**
2. **Executive Summary** — key findings in 3–5 sentences
3. **Introduction** — purpose and scope
4. **Findings** — what you discovered
5. **Conclusions** — what the findings mean
6. **Recommendations** — what should be done
7. **Appendices** — supporting data

## Formal Report Language

**Presenting findings:**
- *The data indicates that…*
- *It was found that…*
- *The results show a significant increase in…*

**Drawing conclusions:**
- *Based on the findings, it can be concluded that…*
- *The evidence suggests…*

**Making recommendations:**
- *It is recommended that…*
- *The company should consider…*
- *We propose implementing…*

## Proposal vs Report

| Feature | Report | Proposal |
|---|---|---|
| Purpose | Analyse what happened | Suggest what to do |
| Tone | Objective, analytical | Persuasive |
| Tense | Past/present | Future |

## Practice
Write a one-page report on: "Why our team should switch to remote work on Fridays." Include findings (real or invented), a conclusion, and two recommendations.`,
      },
      {
        week: 6,
        title: "Networking & Professional Relationships",
        videoTitle: "Networking in English",
        videoUrl: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
        videoDuration: "24:00",
        content: `# Week 6: Networking & Professional Relationships

## Small Talk — Why It Matters
Small talk builds trust before business begins. Topics to use:
- Weather, travel, local events
- Industry trends
- A compliment about the venue or event

Topics to avoid: religion, politics, personal income, controversial opinions.

## Networking Phrases

**Introducing yourself:**
- *Hi, I'm [Name]. I work in [field] at [company].*
- *I'm here representing [organisation].*

**Starting conversation:**
- *What brings you to this event?*
- *How long have you been working in this field?*
- *What projects are you excited about at the moment?*

**Exchanging contacts:**
- *It was great talking with you. Could I have your card?*
- *Let's connect on LinkedIn.*
- *I'll send you that article we discussed.*

**Following up:**
- *It was a pleasure meeting you at [event].*
- *As promised, I'm attaching the report we discussed.*

## Your 30-Second Pitch
Prepare a brief, confident self-introduction:
1. Your name and role
2. What you do / your expertise
3. What you're looking for or working on
4. A question for them

## Practice
Write your 30-second pitch, then write a follow-up email to someone you met at a networking event. Reference something specific from your conversation.`,
      },
    ],
  },
  {
    title: "Python Basics",
    description: "Write your first programs in one of the world's most popular languages. Variables, loops, functions — no experience needed.",
    category: "Coding",
    totalWeeks: 6,
    difficulty: "Beginner",
    imageEmoji: "🐍",
    sortOrder: 9,
    weeks: [
      {
        week: 1,
        title: "Your First Program — Variables & Types",
        videoTitle: "Python for Beginners — Full Course",
        videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
        videoDuration: "4:26:52",
        content: `# Week 1: Your First Python Program

## What is Python?
Python is used by Google, Instagram, NASA, and thousands of companies. It reads almost like English, making it the best first language to learn.

## Your First Program
Open any Python editor and type:
\`\`\`python
print("Hello, World!")
print("My name is Aisha and I am learning Python!")
\`\`\`
The \`print()\` function displays text on the screen.

## Variables
A variable is a labelled container that holds data.
\`\`\`python
name = "Aisha"
age = 17
height = 1.62
is_student = True
\`\`\`

Rules:
- Start with a letter or underscore
- No spaces — use \`under_scores\`
- Case-sensitive: \`name\` ≠ \`Name\`

## The Four Basic Data Types

| Type | Example | Use |
|---|---|---|
| \`str\` | \`"Hello"\` | Text |
| \`int\` | \`42\` | Whole numbers |
| \`float\` | \`3.14\` | Decimal numbers |
| \`bool\` | \`True\` / \`False\` | Yes/no values |

Check the type of anything with \`type()\`:
\`\`\`python
print(type("hello"))   # <class 'str'>
print(type(42))        # <class 'int'>
\`\`\`

## User Input
\`\`\`python
name = input("What is your name? ")
print("Nice to meet you, " + name + "!")
\`\`\`

## Practice Exercises

**Exercise 1:** Create variables for your name, age, city, and favourite subject. Print them all.

**Exercise 2:** Ask the user for their name and age, then print: *"Hello [name], you are [age] years old!"*

**Exercise 3:** What is the data type of each?
- \`"3.14"\`
- \`3.14\`
- \`True\`
- \`100\`

## Key Takeaways
✅ \`print()\` outputs to the screen
✅ Variables store data — choose clear names
✅ Every value has a type: str, int, float, bool
✅ \`input()\` reads from the keyboard`,
      },
      {
        week: 2,
        title: "Control Flow — If/Else & Loops",
        videoTitle: "Python Control Flow Tutorial",
        videoUrl: "https://www.youtube.com/watch?v=DZwmZ8Usvnk",
        videoDuration: "35:00",
        content: `# Week 2: Control Flow — Decisions & Loops

## If / Elif / Else
Make your program decide:
\`\`\`python
age = int(input("How old are you? "))

if age >= 18:
    print("You are an adult.")
elif age >= 13:
    print("You are a teenager.")
else:
    print("You are a child.")
\`\`\`

## Comparison Operators

| Operator | Meaning | Example |
|---|---|---|
| \`==\` | Equal to | \`5 == 5\` → True |
| \`!=\` | Not equal | \`5 != 3\` → True |
| \`>\` | Greater than | \`7 > 3\` → True |
| \`<\` | Less than | \`2 < 9\` → True |
| \`>=\` | Greater or equal | \`5 >= 5\` → True |
| \`<=\` | Less or equal | \`4 <= 6\` → True |

## Logical Operators
\`\`\`python
if age >= 13 and age <= 19:
    print("Teenager")

if raining or cold:
    print("Stay inside")

if not is_student:
    print("You are not a student")
\`\`\`

## While Loop
Repeats while a condition is True:
\`\`\`python
count = 1
while count <= 5:
    print(count)
    count += 1
# Prints 1 2 3 4 5
\`\`\`

## For Loop
Repeats a set number of times:
\`\`\`python
for i in range(5):
    print("Hello!")     # Prints "Hello!" 5 times

for i in range(1, 11):
    print(i)            # Prints 1 to 10
\`\`\`

## Practice Exercises

**Exercise 1:** Write a program that asks for a number and tells the user if it is positive, negative, or zero.

**Exercise 2:** Use a \`for\` loop to print the multiplication table of any number the user enters.

**Exercise 3:** Guess the number game — the program picks 7, the user guesses. Keep asking until they get it right.

## Key Takeaways
✅ \`if/elif/else\` controls which code runs
✅ \`while\` loops run as long as a condition is True
✅ \`for\` loops iterate a fixed number of times
✅ Always prevent infinite loops with a counter or break condition`,
      },
      {
        week: 3,
        title: "Functions",
        videoTitle: "Python Functions — Complete Guide",
        videoUrl: "https://www.youtube.com/watch?v=9Os0o3wzS_I",
        videoDuration: "28:00",
        content: `# Week 3: Functions

## Why Functions?
Functions let you write code once and use it many times. They keep your program organised.

## Defining and Calling a Function
\`\`\`python
def greet(name):
    print("Hello, " + name + "!")

greet("Aisha")   # Hello, Aisha!
greet("Malika")  # Hello, Malika!
\`\`\`

## Parameters and Return Values
\`\`\`python
def add(a, b):
    return a + b

result = add(3, 4)
print(result)    # 7
\`\`\`

## Default Parameters
\`\`\`python
def greet(name, greeting="Hello"):
    print(greeting + ", " + name + "!")

greet("Aisha")            # Hello, Aisha!
greet("Aisha", "Salam")   # Salam, Aisha!
\`\`\`

## Scope — Local vs Global
\`\`\`python
x = 10  # global

def my_function():
    x = 5  # local — doesn't change the global x
    print(x)  # 5

my_function()
print(x)  # 10
\`\`\`

## Practice Exercises

**Exercise 1:** Write a function \`celsius_to_fahrenheit(c)\` that converts temperature. Formula: F = (C × 9/5) + 32.

**Exercise 2:** Write a function \`is_even(n)\` that returns True if the number is even, False if odd.

**Exercise 3:** Write a function \`count_vowels(word)\` that returns how many vowels are in a word.

## Key Takeaways
✅ \`def\` defines a function; \`return\` sends back a result
✅ Parameters let functions accept inputs
✅ Functions should do one thing well
✅ Variables inside functions are local by default`,
      },
      {
        week: 4,
        title: "Lists, Tuples & Dictionaries",
        videoTitle: "Python Data Structures Tutorial",
        videoUrl: "https://www.youtube.com/watch?v=W8KRzm-HUcc",
        videoDuration: "40:00",
        content: `# Week 4: Lists, Tuples & Dictionaries

## Lists — Ordered, Changeable
\`\`\`python
fruits = ["apple", "banana", "mango"]
print(fruits[0])      # apple
fruits.append("kiwi") # add to end
fruits.remove("banana")
print(len(fruits))    # 3
\`\`\`

Common list methods:
- \`append()\` — add to end
- \`insert(i, x)\` — add at position i
- \`remove(x)\` — remove first occurrence
- \`sort()\` — sort alphabetically/numerically
- \`len()\` — number of items

## Looping Through a List
\`\`\`python
for fruit in fruits:
    print(fruit)
\`\`\`

## Tuples — Ordered, Unchangeable
\`\`\`python
coordinates = (40.7128, -74.0060)  # latitude, longitude
# coordinates[0] = 50  ← ERROR! Tuples are immutable
\`\`\`
Use tuples for data that should not change.

## Dictionaries — Key: Value Pairs
\`\`\`python
student = {
    "name": "Aisha",
    "age": 17,
    "city": "Bishkek"
}

print(student["name"])       # Aisha
student["grade"] = "A"       # add new key
print(student.get("phone", "Not provided"))  # safe access
\`\`\`

Looping through a dictionary:
\`\`\`python
for key, value in student.items():
    print(key, ":", value)
\`\`\`

## Practice Exercises

**Exercise 1:** Create a shopping list. Let the user add items, remove items, and display the list.

**Exercise 2:** Create a dictionary for a book (title, author, year, pages). Print each field with a label.

**Exercise 3:** Given a list of numbers, write code to find the highest, lowest, and average.

## Key Takeaways
✅ Lists are mutable; tuples are immutable
✅ Dictionaries store data as key-value pairs
✅ Use \`append()\`, \`remove()\`, \`sort()\` with lists
✅ Use \`dict.get(key, default)\` for safe dictionary access`,
      },
      {
        week: 5,
        title: "File Handling & Modules",
        videoTitle: "Python File Handling Tutorial",
        videoUrl: "https://www.youtube.com/watch?v=Uh2ebFW8OYM",
        videoDuration: "22:00",
        content: `# Week 5: File Handling & Modules

## Reading Files
\`\`\`python
with open("notes.txt", "r") as file:
    content = file.read()
    print(content)
\`\`\`

Reading line by line:
\`\`\`python
with open("notes.txt", "r") as file:
    for line in file:
        print(line.strip())
\`\`\`

## Writing Files
\`\`\`python
with open("output.txt", "w") as file:  # "w" overwrites
    file.write("Hello, file!")

with open("output.txt", "a") as file:  # "a" appends
    file.write("\\nAnother line")
\`\`\`

## File Modes

| Mode | Description |
|---|---|
| \`"r"\` | Read (default) |
| \`"w"\` | Write (overwrites) |
| \`"a"\` | Append |
| \`"r+"\` | Read and write |

## Built-in Modules
\`\`\`python
import math
print(math.sqrt(16))   # 4.0
print(math.pi)         # 3.14159...

import random
print(random.randint(1, 10))  # random number 1–10

import datetime
today = datetime.date.today()
print(today)
\`\`\`

## Practice Exercises

**Exercise 1:** Write a program that saves a user's name, age, and city to a file, then reads it back and prints it nicely.

**Exercise 2:** Create a simple diary app — user types a journal entry, it gets saved with today's date to a file.

**Exercise 3:** Use the \`random\` module to create a quiz with 5 questions drawn randomly from a list.

## Key Takeaways
✅ Always use \`with open()\` — it closes the file automatically
✅ \`"w"\` overwrites; \`"a"\` adds to existing content
✅ Modules add powerful features without extra code
✅ \`import module\` brings in external tools`,
      },
      {
        week: 6,
        title: "Final Project — Build a Calculator App",
        videoTitle: "Python Project: Build a Calculator",
        videoUrl: "https://www.youtube.com/watch?v=SqvVm3QiQVk",
        videoDuration: "18:00",
        content: `# Week 6: Final Project — Build a Calculator

## What You'll Build
A fully working command-line calculator that:
- Performs +, −, ×, ÷
- Handles errors (division by zero, invalid input)
- Keeps a history of calculations
- Saves history to a file

## Project Structure

\`\`\`python
# calculator.py

def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return "Error: Cannot divide by zero"
    return a / b

def save_history(history):
    with open("calc_history.txt", "a") as f:
        for entry in history:
            f.write(entry + "\\n")

def main():
    history = []
    print("=== Python Calculator ===")

    while True:
        print("\\nOperations: + - * / | Type 'history' or 'quit'")
        choice = input("Choose operation: ")

        if choice == "quit":
            save_history(history)
            print("History saved. Goodbye!")
            break
        elif choice == "history":
            print("\\n".join(history) if history else "No history yet")
            continue

        if choice not in ["+", "-", "*", "/"]:
            print("Invalid operation. Try again.")
            continue

        try:
            a = float(input("First number: "))
            b = float(input("Second number: "))
        except ValueError:
            print("Please enter valid numbers.")
            continue

        operations = {"+": add, "-": subtract, "*": multiply, "/": divide}
        result = operations[choice](a, b)

        entry = f"{a} {choice} {b} = {result}"
        print(f"Result: {result}")
        history.append(entry)

if __name__ == "__main__":
    main()
\`\`\`

## How to Extend Your Project
- Add square root and power functions
- Create a GUI with \`tkinter\`
- Add unit conversion (km to miles, °C to °F)

## Congratulations!
You have completed Python Basics. You can now:
✅ Write, run, and debug Python programs
✅ Use variables, loops, and conditionals
✅ Define and call functions
✅ Work with lists and dictionaries
✅ Read and write files
✅ Build a complete working application`,
      },
    ],
  },
  {
    title: "Web Development Intro",
    description: "Build real websites with HTML, CSS, and JavaScript. Go from zero to publishing your own page online.",
    category: "Coding",
    totalWeeks: 8,
    difficulty: "Beginner",
    imageEmoji: "🌐",
    sortOrder: 10,
    weeks: [
      {
        week: 1,
        title: "HTML — Structure of the Web",
        videoTitle: "HTML Full Course for Beginners",
        videoUrl: "https://www.youtube.com/watch?v=pQN-pnXPaVg",
        videoDuration: "2:00:00",
        content: `# Week 1: HTML — Structure of the Web

## What is HTML?
HTML (HyperText Markup Language) is the skeleton of every webpage. It defines the structure and content.

## Your First Web Page
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My First Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first web page.</p>
</body>
</html>
\`\`\`

## Essential HTML Tags

| Tag | Purpose | Example |
|---|---|---|
| \`<h1>\` to \`<h6>\` | Headings | \`<h1>Title</h1>\` |
| \`<p>\` | Paragraph | \`<p>Text here</p>\` |
| \`<a>\` | Link | \`<a href="url">Click</a>\` |
| \`<img>\` | Image | \`<img src="photo.jpg" alt="description">\` |
| \`<ul>\` / \`<ol>\` | Lists | \`<li>Item</li>\` |
| \`<div>\` | Container | Groups elements |
| \`<span>\` | Inline container | Wraps text |

## Semantic HTML
Use meaningful tags:
\`\`\`html
<header>  — top of page
<nav>     — navigation links
<main>    — main content
<section> — a section of content
<article> — self-contained content
<footer>  — bottom of page
\`\`\`

## Practice
Build a personal profile page with: your name as H1, a short bio paragraph, a list of your hobbies, and a link to your favourite website.`,
      },
      {
        week: 2,
        title: "HTML Forms & Tables",
        videoTitle: "HTML Forms and Tables Tutorial",
        videoUrl: "https://www.youtube.com/watch?v=fNcJuPIZ2WE",
        videoDuration: "45:00",
        content: `# Week 2: HTML Forms & Tables

## Forms — Collecting User Input
\`\`\`html
<form action="/submit" method="post">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email">

    <label for="message">Message:</label>
    <textarea id="message" name="message" rows="4"></textarea>

    <button type="submit">Send</button>
</form>
\`\`\`

## Common Input Types

| Type | Use |
|---|---|
| \`text\` | Short text |
| \`email\` | Email address (auto-validates) |
| \`password\` | Hidden text |
| \`number\` | Numeric input |
| \`date\` | Date picker |
| \`radio\` | One choice from many |
| \`checkbox\` | Multiple choices |
| \`file\` | File upload |

## Tables
\`\`\`html
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Score</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Aisha</td>
            <td>95</td>
        </tr>
    </tbody>
</table>
\`\`\`

## Practice
Build a contact form with fields for name, email, subject (dropdown), and message. Add a table of your weekly study schedule.`,
      },
      {
        week: 3,
        title: "CSS Basics — Styling Your Page",
        videoTitle: "CSS Tutorial for Beginners",
        videoUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
        videoDuration: "6:00:00",
        content: `# Week 3: CSS Basics

## What is CSS?
CSS (Cascading Style Sheets) makes your HTML look beautiful. It controls colours, fonts, spacing, and layout.

## Three Ways to Add CSS

**1. External (best practice):**
\`\`\`html
<link rel="stylesheet" href="style.css">
\`\`\`

**2. Internal:**
\`\`\`html
<style>
  h1 { color: purple; }
</style>
\`\`\`

**3. Inline (avoid for most things):**
\`\`\`html
<h1 style="color: purple;">Title</h1>
\`\`\`

## CSS Selectors

\`\`\`css
h1 { }              /* element selector */
.card { }           /* class selector */
#header { }         /* id selector */
p, h2 { }          /* multiple elements */
.card h1 { }        /* descendant */
\`\`\`

## Essential Properties

\`\`\`css
body {
    font-family: 'Arial', sans-serif;
    font-size: 16px;
    color: #333;
    background-color: #f9f9f9;
    margin: 0;
    padding: 0;
}

h1 {
    color: #6B21A8;
    font-size: 2rem;
    margin-bottom: 1rem;
}

.card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
\`\`\`

## The Box Model
Every element is a box:
- **Content** — the text/image
- **Padding** — space inside the border
- **Border** — the outline
- **Margin** — space outside the border

## Practice
Style your Week 1 profile page — add colours, a custom font, and rounded cards for each section.`,
      },
      {
        week: 4,
        title: "CSS Layout — Flexbox",
        videoTitle: "CSS Flexbox Tutorial",
        videoUrl: "https://www.youtube.com/watch?v=K74l26pE4YA",
        videoDuration: "35:00",
        content: `# Week 4: CSS Layout — Flexbox

## Why Flexbox?
Flexbox makes it easy to align and distribute elements in a row or column.

## Flex Container
\`\`\`css
.container {
    display: flex;
    justify-content: center;   /* horizontal alignment */
    align-items: center;       /* vertical alignment */
    gap: 16px;                 /* space between items */
    flex-wrap: wrap;           /* wrap to next line if needed */
}
\`\`\`

## Justify-Content Options

| Value | Effect |
|---|---|
| \`flex-start\` | Pack to left |
| \`flex-end\` | Pack to right |
| \`center\` | Centre |
| \`space-between\` | First & last at edges |
| \`space-around\` | Equal space around each |
| \`space-evenly\` | Equal space between all |

## Flex Direction

\`\`\`css
flex-direction: row;           /* default — horizontal */
flex-direction: column;        /* vertical */
flex-direction: row-reverse;   /* right to left */
\`\`\`

## Practical: Navigation Bar

\`\`\`css
nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 32px;
    background: #6B21A8;
}

.nav-logo { color: white; font-size: 1.5rem; }
.nav-links { display: flex; gap: 24px; list-style: none; }
.nav-links a { color: white; text-decoration: none; }
\`\`\`

## Practice
Build a navigation bar, a three-column card layout, and a footer using only flexbox for alignment.`,
      },
      {
        week: 5,
        title: "Responsive Design",
        videoTitle: "Responsive Web Design Tutorial",
        videoUrl: "https://www.youtube.com/watch?v=srvUrASNj0s",
        videoDuration: "40:00",
        content: `# Week 5: Responsive Web Design

## Mobile-First Design
Most people browse on phones. Design for small screens first, then scale up.

## The Viewport Meta Tag
Always include in your \`<head>\`:
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`

## Media Queries
Apply different styles based on screen size:

\`\`\`css
/* Mobile styles (default) */
.grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* Tablet and up */
@media (min-width: 768px) {
    .grid {
        flex-direction: row;
        flex-wrap: wrap;
    }
    .card { width: calc(50% - 8px); }
}

/* Desktop */
@media (min-width: 1024px) {
    .card { width: calc(33.33% - 11px); }
}
\`\`\`

## Responsive Images
\`\`\`css
img {
    max-width: 100%;
    height: auto;
}
\`\`\`

## Common Breakpoints

| Name | Width |
|---|---|
| Mobile | < 768px |
| Tablet | 768px – 1024px |
| Desktop | > 1024px |

## Practice
Make your profile page fully responsive — it should look great on both mobile and desktop.`,
      },
      {
        week: 6,
        title: "JavaScript Basics",
        videoTitle: "JavaScript for Beginners",
        videoUrl: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
        videoDuration: "3:26:42",
        content: `# Week 6: JavaScript Basics

## What is JavaScript?
JavaScript makes web pages interactive. While HTML is structure and CSS is style, JavaScript is behaviour.

## Adding JavaScript
\`\`\`html
<script src="script.js"></script>  <!-- External (best) -->
<script> /* inline */ </script>    <!-- Internal -->
\`\`\`

## Variables & Types
\`\`\`javascript
let name = "Aisha";          // can change
const age = 17;              // cannot change
var old = "avoid using var"; // old style

let isStudent = true;
let score = 95.5;
\`\`\`

## Functions
\`\`\`javascript
function greet(name) {
    return "Hello, " + name + "!";
}

// Arrow function (modern)
const greet = (name) => \`Hello, \${name}!\`;

console.log(greet("Aisha"));  // Hello, Aisha!
\`\`\`

## Arrays & Objects
\`\`\`javascript
const fruits = ["apple", "banana", "mango"];
fruits.push("kiwi");
console.log(fruits[0]); // apple

const person = {
    name: "Aisha",
    age: 17,
    city: "Bishkek"
};
console.log(person.name); // Aisha
\`\`\`

## Practice
Write JavaScript functions for: greeting a user by name, calculating the area of a rectangle, and checking if a number is prime.`,
      },
      {
        week: 7,
        title: "DOM Manipulation",
        videoTitle: "JavaScript DOM Manipulation",
        videoUrl: "https://www.youtube.com/watch?v=0ik6X4DJKCc",
        videoDuration: "30:00",
        content: `# Week 7: DOM Manipulation

## What is the DOM?
The Document Object Model (DOM) lets JavaScript interact with HTML elements.

## Selecting Elements
\`\`\`javascript
document.getElementById("header")       // by ID
document.querySelector(".card")          // first matching element
document.querySelectorAll(".card")       // all matching elements
\`\`\`

## Changing Content
\`\`\`javascript
const title = document.getElementById("title");
title.textContent = "New Title";         // change text
title.innerHTML = "<strong>Bold</strong>"; // change HTML
title.style.color = "purple";            // change style
title.classList.add("active");           // add class
title.classList.toggle("hidden");        // toggle class
\`\`\`

## Events
\`\`\`javascript
const button = document.getElementById("myBtn");

button.addEventListener("click", function() {
    alert("Button clicked!");
});

// Form submission
const form = document.getElementById("myForm");
form.addEventListener("submit", function(event) {
    event.preventDefault(); // stop page refresh
    const name = document.getElementById("name").value;
    console.log("Name:", name);
});
\`\`\`

## Creating Elements Dynamically
\`\`\`javascript
const newItem = document.createElement("li");
newItem.textContent = "New list item";
document.getElementById("myList").appendChild(newItem);
\`\`\`

## Practice
Build an interactive to-do list: user types a task, clicks Add, the task appears in the list with a Delete button.`,
      },
      {
        week: 8,
        title: "Build & Publish Your First Website",
        videoTitle: "Deploy a Website for Free",
        videoUrl: "https://www.youtube.com/watch?v=p1QU3kLFPdg",
        videoDuration: "22:00",
        content: `# Week 8: Build & Publish Your Website

## Final Project — Personal Portfolio
Combine everything you've learned into a real portfolio website.

## What to Include

\`\`\`
portfolio/
├── index.html       ← Home/About page
├── projects.html    ← Your projects
├── contact.html     ← Contact form
├── style.css        ← All your styles
└── script.js        ← Interactive features
\`\`\`

## Must-Have Sections

1. **Hero** — Name, title, short bio
2. **About** — Your background and goals
3. **Skills** — What you know (progress bars look great)
4. **Projects** — Cards linking to your work
5. **Contact** — Form + social links

## Publishing for Free with GitHub Pages

1. Create a free account at [github.com](https://github.com)
2. Create a new repository named \`yourusername.github.io\`
3. Upload your HTML, CSS, and JS files
4. Go to Settings → Pages → Enable GitHub Pages
5. Your site is live at \`https://yourusername.github.io\`

## Performance Checklist
- [ ] Images are compressed (use squoosh.app)
- [ ] No broken links
- [ ] Loads on mobile (test in Chrome DevTools)
- [ ] All text is readable (check contrast)
- [ ] Contact form works

## Congratulations!
You have completed Web Development Intro. You can now:
✅ Build structured HTML pages
✅ Style with CSS including flexbox and responsive design
✅ Add interactivity with JavaScript
✅ Publish websites online
✅ You are a web developer!`,
      },
    ],
  },
  {
    title: "Algebra Foundation",
    description: "From variables to equations — build the mathematical thinking skills that underpin science, coding, and finance.",
    category: "Math",
    totalWeeks: 4,
    difficulty: "Beginner",
    imageEmoji: "📐",
    sortOrder: 7,
    weeks: [
      {
        week: 1,
        title: "Variables, Expressions & Order of Operations",
        videoTitle: "Introduction to Algebra",
        videoUrl: "https://www.youtube.com/watch?v=NybHckSEQBI",
        videoDuration: "10:00",
        content: `# Week 1: Variables, Expressions & Order of Operations

## Why Algebra?
Algebra is the language of mathematics. It lets us solve problems when we don't know all the values — which is almost every real problem.

## Variables
A variable (usually *x*, *y*, or *n*) stands for an unknown number.

- *x + 5 = 12* → What is x?
- Answer: x = 7, because 7 + 5 = 12

## Expressions vs Equations

| Type | Has = sign? | Example |
|---|---|---|
| Expression | No | 3x + 2 |
| Equation | Yes | 3x + 2 = 14 |

## Evaluating Expressions
Substitute the value of the variable:

If x = 4: evaluate *2x² − 3x + 1*
= 2(4²) − 3(4) + 1
= 2(16) − 12 + 1
= 32 − 12 + 1 = **21**

## Order of Operations — PEMDAS/BODMAS

1. **P/B** — Parentheses / Brackets
2. **E/O** — Exponents / Orders (powers, roots)
3. **MD** — Multiplication & Division (left to right)
4. **AS** — Addition & Subtraction (left to right)

**Example:** 3 + 4 × 2²
= 3 + 4 × 4    *(exponent first)*
= 3 + 16       *(multiplication)*
= **19**       *(addition)*

## Practice Exercises

**Exercise 1:** Evaluate when x = 3, y = 2:
1. 4x − y
2. x² + 2y
3. (x + y)² − x

**Exercise 2:** Add parentheses to make each equation true:
1. 5 + 3 × 2 = 16
2. 10 − 4 × 2 = 12

## Key Takeaways
✅ Variables represent unknown values
✅ Always follow PEMDAS order of operations
✅ Evaluate expressions by substituting values`,
      },
      {
        week: 2,
        title: "Solving Equations & Inequalities",
        videoTitle: "Solving Linear Equations",
        videoUrl: "https://www.youtube.com/watch?v=l3XzepN03KQ",
        videoDuration: "12:00",
        content: `# Week 2: Solving Equations & Inequalities

## The Golden Rule
Whatever you do to one side of an equation, do to the other side.

## Solving Linear Equations

**One step:**
- x + 7 = 15 → x = 15 − 7 = **8**
- 3x = 21 → x = 21 ÷ 3 = **7**

**Two steps:**
- 2x + 5 = 13
- 2x = 13 − 5 = 8
- x = 8 ÷ 2 = **4**

**With fractions:**
- x/3 + 2 = 6
- x/3 = 4
- x = **12**

## Inequalities
Instead of = use: < (less than), > (greater than), ≤, ≥

- 2x + 1 < 9
- 2x < 8
- x < 4 → solution: any number less than 4

⚠️ **Important:** When multiplying or dividing by a **negative** number, flip the inequality sign!
- −2x > 6 → x **<** −3

## Graphing Inequalities on a Number Line
- Open circle ○ = strict (< or >)
- Closed circle ● = inclusive (≤ or ≥)

## Practice Exercises

**Exercise 1:** Solve for x:
1. 3x − 7 = 14
2. 5(x + 2) = 35
3. x/4 − 1 = 3

**Exercise 2:** Solve and graph on a number line:
1. 4x + 3 ≥ 19
2. −2x < 10

## Key Takeaways
✅ Keep equations balanced — same operation on both sides
✅ Flip the inequality sign when multiplying/dividing by a negative
✅ Check your answer by substituting back in`,
      },
      {
        week: 3,
        title: "Functions & Graphs",
        videoTitle: "Introduction to Functions and Graphs",
        videoUrl: "https://www.youtube.com/watch?v=VhokQhjl1iY",
        videoDuration: "15:00",
        content: `# Week 3: Functions & Graphs

## What is a Function?
A function takes an input and produces exactly one output. Think of it as a machine:

Input (x) → **Function** → Output (y)

Notation: f(x) = 2x + 1

If x = 3: f(3) = 2(3) + 1 = **7**

## Linear Functions
y = mx + b
- **m** = slope (steepness)
- **b** = y-intercept (where the line crosses the y-axis)

**Example:** y = 2x + 3
- When x = 0: y = 3 *(y-intercept)*
- When x = 1: y = 5
- When x = 2: y = 7

## Slope
Slope = rise ÷ run = change in y ÷ change in x

Between (1, 3) and (4, 9):
slope = (9 − 3) ÷ (4 − 1) = 6 ÷ 3 = **2**

| Slope | Meaning |
|---|---|
| Positive | Line goes up left → right |
| Negative | Line goes down left → right |
| 0 | Horizontal line |
| Undefined | Vertical line |

## Plotting a Line
1. Mark the y-intercept (0, b)
2. Use the slope to find the next point: rise/run
3. Connect with a straight line

## Practice Exercises

**Exercise 1:** For f(x) = 3x − 2, find f(0), f(2), f(−1).

**Exercise 2:** Find the slope between:
1. (2, 5) and (6, 13)
2. (−1, 4) and (3, −4)

**Exercise 3:** Write the equation of a line with slope 3 passing through (0, −1).

## Key Takeaways
✅ A function maps each input to exactly one output
✅ In y = mx + b: m is slope, b is y-intercept
✅ Positive slope = upward trend; negative = downward`,
      },
      {
        week: 4,
        title: "Polynomials & Factoring",
        videoTitle: "Factoring Polynomials",
        videoUrl: "https://www.youtube.com/watch?v=U6FndtdgpcA",
        videoDuration: "20:00",
        content: `# Week 4: Polynomials & Factoring

## What is a Polynomial?
A polynomial is an expression with one or more terms:
- Monomial: 5x²
- Binomial: x + 3
- Trinomial: x² + 5x + 6

## Degree
The degree is the highest power of the variable.
- 3x⁴ + 2x − 1 → degree **4**

## Adding & Subtracting Polynomials
Combine like terms:
(3x² + 2x − 1) + (x² − 4x + 5)
= 4x² − 2x + 4

## Multiplying Polynomials — FOIL
For (a + b)(c + d):
- **F**irst: ac
- **O**uter: ad
- **I**nner: bc
- **L**ast: bd

(x + 3)(x + 2)
= x² + 2x + 3x + 6
= **x² + 5x + 6**

## Factoring — The Reverse of FOIL
Factor x² + 5x + 6:
- Find two numbers that **multiply** to 6 and **add** to 5
- Those numbers: 2 and 3
- Answer: **(x + 2)(x + 3)**

## Common Factoring Patterns

| Pattern | Formula |
|---|---|
| Difference of squares | a² − b² = (a+b)(a−b) |
| Perfect square | a² + 2ab + b² = (a+b)² |
| GCF | 6x² + 9x = 3x(2x + 3) |

## Practice Exercises

**Exercise 1:** Multiply using FOIL:
1. (x + 4)(x − 2)
2. (2x + 1)(3x − 5)

**Exercise 2:** Factor completely:
1. x² + 7x + 12
2. x² − 9
3. 4x² + 8x

## Key Takeaways
✅ Combine like terms when adding polynomials
✅ FOIL distributes two binomials
✅ Factoring reverses multiplication — look for numbers that add and multiply correctly`,
      },
    ],
  },
  {
    title: "Biology Basics",
    description: "Explore the science of life: cells, genetics, ecosystems, and the human body explained simply and visually.",
    category: "Science",
    totalWeeks: 5,
    difficulty: "Beginner",
    imageEmoji: "🔬",
    sortOrder: 4,
    weeks: [
      {
        week: 1,
        title: "The Cell — Building Block of Life",
        videoTitle: "Introduction to Biology and Cells",
        videoUrl: "https://www.youtube.com/watch?v=URUJD5NEXC8",
        videoDuration: "14:00",
        content: `# Week 1: The Cell — Building Block of Life

## What is a Cell?
The cell is the smallest unit of life. Every living thing — from bacteria to blue whales — is made of cells.

## Types of Cells

### Prokaryotic (Simple)
- No nucleus
- Found in bacteria
- Example: E. coli

### Eukaryotic (Complex)
- Has a nucleus containing DNA
- Found in animals, plants, fungi
- Larger than prokaryotic cells

## Key Cell Organelles

| Organelle | Function |
|---|---|
| **Nucleus** | Control centre — holds DNA |
| **Mitochondria** | Energy production ("powerhouse") |
| **Ribosomes** | Build proteins |
| **Cell membrane** | Controls what enters/exits |
| **Cytoplasm** | Jelly-like fluid filling the cell |
| **Vacuole** | Stores water, nutrients, waste |
| **Chloroplast** | Photosynthesis (plant cells only) |
| **Cell wall** | Rigid outer layer (plant cells only) |

## Plant vs Animal Cells

| Feature | Plant | Animal |
|---|---|---|
| Cell wall | ✅ | ❌ |
| Chloroplasts | ✅ | ❌ |
| Large vacuole | ✅ | Small or none |
| Shape | Regular, box-like | Irregular |

## Cell Division — Why It Matters
Cells divide to:
- Grow (more cells = bigger organism)
- Repair damage (wounds heal)
- Reproduce (pass life to next generation)

## Practice
Draw and label a plant cell and an animal cell. List three differences between them.

## Key Takeaways
✅ All living things are made of cells
✅ Eukaryotic cells have a nucleus; prokaryotic do not
✅ Mitochondria make energy; chloroplasts do photosynthesis
✅ Plant cells have walls and chloroplasts; animal cells do not`,
      },
      {
        week: 2,
        title: "Genetics & DNA",
        videoTitle: "DNA and Genetics Explained",
        videoUrl: "https://www.youtube.com/watch?v=8m6hHRlKwxY",
        videoDuration: "18:00",
        content: `# Week 2: Genetics & DNA

## What is DNA?
DNA (deoxyribonucleic acid) is the molecule that carries the genetic instructions for all living organisms.

**Structure:** A double helix — like a twisted ladder
- The sides (rails) = sugar-phosphate backbone
- The rungs = base pairs: A-T and G-C

## Genes & Chromosomes
- **Gene** = a section of DNA that codes for one trait (e.g. eye colour)
- **Chromosome** = a tightly coiled strand of DNA
- Humans have **46 chromosomes** (23 pairs)
- Every cell in your body contains a complete copy of your DNA

## Mendel's Laws of Inheritance
Gregor Mendel, a monk, discovered how traits are inherited by growing pea plants.

**Key terms:**
- **Dominant** (capital letter, e.g. *B*) — shows even if only one copy
- **Recessive** (lowercase, e.g. *b*) — only shows if two copies

**Example — Eye colour:**
| Genotype | Eye Colour |
|---|---|
| BB | Brown |
| Bb | Brown (dominant wins) |
| bb | Blue |

## Punnett Square
Predict offspring traits:

Parent 1: Bb (brown eyes, carries blue)
Parent 2: Bb (brown eyes, carries blue)

|   | B | b |
|---|---|---|
| **B** | BB | Bb |
| **b** | Bb | bb |

Result: 75% brown eyes, 25% blue eyes

## DNA → Protein
1. **Transcription** — DNA is copied into mRNA inside the nucleus
2. **Translation** — ribosomes read mRNA and build proteins
3. Proteins do everything: build structures, run chemical reactions, fight disease

## Practice
Use a Punnett square to predict the offspring of two parents who are both carriers of a recessive trait (Aa × Aa). What percentage will show the trait?`,
      },
      {
        week: 3,
        title: "Human Body Systems",
        videoTitle: "Human Body Systems Overview",
        videoUrl: "https://www.youtube.com/watch?v=Ae4MadKPJC0",
        videoDuration: "20:00",
        content: `# Week 3: Human Body Systems

## The Body as a System of Systems
Your body has 11 organ systems, all working together.

## Key Systems

### Circulatory System
- **Job:** Transport blood, oxygen, nutrients, and waste
- **Key organs:** Heart, blood vessels, blood
- The heart beats ~100,000 times per day
- Blood makes a full circuit every minute

### Respiratory System
- **Job:** Gas exchange — take in O₂, release CO₂
- **Key organs:** Lungs, trachea, diaphragm
- **Breathing:** Diaphragm contracts → lungs expand → air in

### Digestive System
- **Job:** Break down food into nutrients
- **Path:** Mouth → oesophagus → stomach → small intestine → large intestine → rectum
- Small intestine absorbs most nutrients

### Nervous System
- **Job:** Control and communication
- **Brain** — processes information
- **Spinal cord** — highway between brain and body
- **Neurons** — send electrical signals at up to 120 m/s

### Skeletal System
- **Job:** Support, movement, protection, blood cell production
- 206 bones in the adult body
- Bone marrow produces red blood cells

### Immune System
- **Job:** Defend against disease
- **White blood cells** attack pathogens
- **Antibodies** recognise and remember specific threats
- Vaccines train the immune system

## How Systems Work Together
When you exercise:
1. Muscles need more oxygen (muscular system)
2. Heart beats faster (circulatory system)
3. You breathe faster (respiratory system)
4. Brain monitors and adjusts (nervous system)

## Practice
Pick any two body systems and write a paragraph explaining how they work together during a specific activity (e.g. eating, running, sleeping).`,
      },
      {
        week: 4,
        title: "Ecosystems & Food Webs",
        videoTitle: "Ecosystems and Food Webs",
        videoUrl: "https://www.youtube.com/watch?v=jEDOtQlD9dg",
        videoDuration: "16:00",
        content: `# Week 4: Ecosystems & Food Webs

## What is an Ecosystem?
An ecosystem is all the living organisms in an area, together with their non-living environment.

**Components:**
- **Biotic** (living): plants, animals, fungi, bacteria
- **Abiotic** (non-living): water, sunlight, soil, temperature

## Energy Flow
Energy enters through the sun and passes through the ecosystem:

**Producers** → **Primary Consumers** → **Secondary Consumers** → **Tertiary Consumers**
(Plants)      → (Herbivores)          → (Small carnivores)     → (Apex predators)

**Energy rule:** Only ~10% of energy passes to the next level. That's why there are fewer predators than prey.

## Food Chains vs Food Webs
- **Food chain** = one path (grass → rabbit → fox)
- **Food web** = many interconnected paths (more realistic)

## Biomes
Major types of ecosystems:

| Biome | Key Features | Examples |
|---|---|---|
| Tropical rainforest | High rainfall, biodiversity | Amazon, Congo |
| Desert | Low rainfall, extreme temps | Sahara, Gobi |
| Temperate forest | Four seasons | European forests |
| Tundra | Very cold, no trees | Arctic, Antarctic |
| Ocean | Largest biome | Pacific, Atlantic |

## Threats to Ecosystems
- Habitat destruction (deforestation, urban sprawl)
- Pollution (water, air, soil)
- Invasive species
- Climate change

## Ecological Roles
- **Decomposers** (bacteria, fungi) break down dead matter — recycling nutrients
- **Keystone species** have a disproportionately large effect on the ecosystem

## Practice
Draw a food web for your local environment (or any ecosystem). Include at least 8 organisms and show the energy flow between them.`,
      },
      {
        week: 5,
        title: "Evolution & Natural Selection",
        videoTitle: "Evolution by Natural Selection",
        videoUrl: "https://www.youtube.com/watch?v=GcjgWov7mTM",
        videoDuration: "12:00",
        content: `# Week 5: Evolution & Natural Selection

## Darwin's Theory
Charles Darwin observed that:
1. Individuals in a population vary
2. Some variations are inherited
3. More offspring are born than can survive
4. Individuals with better-suited traits survive and reproduce more

**Conclusion:** Over time, beneficial traits become more common — the population evolves.

## Key Concepts

**Variation:** Individuals within a species differ (different colours, sizes, behaviours)

**Natural Selection:** Nature "selects" which individuals survive and reproduce

**Adaptation:** A trait that improves survival in a specific environment

**Speciation:** When populations become so different they can no longer interbreed — a new species forms

## Evidence for Evolution

| Evidence | Example |
|---|---|
| Fossil record | Transitional forms (e.g. whale ancestors) |
| Comparative anatomy | Homologous structures (human arm, whale flipper, bat wing — same bones) |
| DNA comparison | Humans share 98.7% of DNA with chimpanzees |
| Direct observation | Bacteria evolving antibiotic resistance |

## Common Misconceptions

❌ *"Organisms evolve to survive"* → Evolution is not purposeful; it's random variation + selection

❌ *"Humans evolved from chimps"* → Humans and chimps share a common ancestor

❌ *"Evolution is just a theory"* → In science, "theory" means an explanation supported by overwhelming evidence

## Timeline of Life on Earth

- 3.8 billion years ago: First single-celled life
- 600 million years ago: First multicellular animals
- 230 million years ago: Dinosaurs
- 66 million years ago: Mass extinction
- 300,000 years ago: Homo sapiens

## Practice
Research one specific adaptation (e.g. the polar bear's white fur, the giraffe's long neck). Write a paragraph explaining what environment the organism lives in and how the adaptation improves its survival.`,
      },
    ],
  },
  {
    title: "Public Speaking",
    description: "Overcome fear and communicate with confidence. Practical techniques for speeches, interviews, and everyday conversations.",
    category: "Leadership",
    totalWeeks: 3,
    difficulty: "Beginner",
    imageEmoji: "🎤",
    sortOrder: 11,
    weeks: [
      {
        week: 1,
        title: "Overcoming Fear & Building Confidence",
        videoTitle: "How to Speak with Confidence",
        videoUrl: "https://www.youtube.com/watch?v=tShavGuo0_E",
        videoDuration: "18:00",
        content: `# Week 1: Overcoming Fear & Building Confidence

## Why We Fear Public Speaking
Public speaking is the #1 phobia worldwide — more common than fear of death. Here's why:

- **Evolutionary response:** Being watched by a group triggered threat responses in our ancestors
- **Fear of judgement:** We worry about what others think
- **Perfectionism:** Fear of making mistakes
- **Unfamiliarity:** It feels unnatural

The good news: Confidence is a *skill*, not a personality trait. It can be built with practice.

## The Physiological Response
When nervous, your body releases adrenaline:
- Heart beats faster
- Breathing quickens
- Palms sweat
- Hands shake

**Reframe it:** These are the *exact same* physical responses as excitement. Tell yourself you're excited, not scared.

## Techniques to Manage Nervousness

### 1. Diaphragmatic Breathing
Breathe from your belly, not your chest:
- Inhale slowly for 4 counts
- Hold for 4 counts
- Exhale slowly for 6 counts
- Repeat 3–5 times before speaking

### 2. Power Posing
Before presenting, stand in a "power pose" for 2 minutes (hands on hips, chest open, head up). Research shows this reduces cortisol and increases confidence.

### 3. Preparation
The single biggest confidence builder is knowing your material cold. Rehearse out loud — reading is not rehearsing.

### 4. Focus on the Audience
Shift your attention from *yourself* to *your audience*. Ask: "How can I help them?" This kills self-consciousness.

## Vocal Confidence
- **Speak slowly** — nervous people rush; slow speech sounds authoritative
- **Lower pitch slightly** — higher pitch signals anxiety
- **Use pauses** — silence is not awkward; it's powerful
- **Project** — speak to the back of the room

## Practice This Week
1. Record yourself speaking for 2 minutes on any topic
2. Watch it back without cringing — focus on what went well
3. Give a 1-minute "speech" to a mirror every day

## Key Takeaways
✅ Fear of public speaking is universal — you are not alone
✅ Nervousness feels bad but looks minimal to the audience
✅ Reframe anxiety as excitement
✅ Preparation is the strongest confidence builder`,
      },
      {
        week: 2,
        title: "Structure, Delivery & Storytelling",
        videoTitle: "How to Structure a Great Speech",
        videoUrl: "https://www.youtube.com/watch?v=OUSqzpmHpuE",
        videoDuration: "22:00",
        content: `# Week 2: Structure, Delivery & Storytelling

## The Power of Structure
A well-structured speech is easy to follow and hard to forget.

## The Three-Part Structure

**Opening (10% of time):** Hook your audience immediately.
- A surprising fact
- A powerful question
- A short story
- A bold statement

*"By the time I finish this sentence, three girls in the world will have dropped out of school."*

**Body (80%):** Your main points. Limit to 2–3.
For each point: make the point → explain → give an example.

**Closing (10%):** End memorably.
- Call to action
- Return to your opening story/question
- A memorable final sentence that echoes your theme

## Storytelling
Stories are how humans connect. The best speakers are storytellers.

**Story structure:**
1. Set the scene (who, where, when)
2. Introduce a problem or challenge
3. Show the journey or turning point
4. Reveal the resolution
5. Connect to your point

## Delivery Techniques

**Eye contact:** Look at one person for a complete sentence, then move to another. Never scan or stare.

**Gestures:** Use natural, deliberate gestures to emphasise key points. Avoid nervous fidgeting.

**Pace:** Vary your speed. Slow down for important points. Pause after key moments.

**Volume:** Speak louder than you think you need to. Vary volume for emphasis — whisper to create intimacy; raise your voice for energy.

**Body language:** Stand straight, feet shoulder-width apart. Avoid rocking or pacing.

## Practice
Prepare a 3-minute speech on a topic you're passionate about. Use the three-part structure. Record it and assess your eye contact, pace, and gestures.`,
      },
      {
        week: 3,
        title: "Q&A, Interviews & Everyday Communication",
        videoTitle: "Communication Skills for Life",
        videoUrl: "https://www.youtube.com/watch?v=HAnw168huqA",
        videoDuration: "25:00",
        content: `# Week 3: Q&A, Interviews & Everyday Communication

## Handling Q&A Sessions

**Before questions start:**
- "I'll take questions at the end."
- "Please feel free to ask at any point."

**When a question is asked:**
1. Pause briefly — don't rush
2. Restate or paraphrase the question (clarifies + buys time): *"So you're asking about..."*
3. Answer directly
4. Check: *"Does that answer your question?"*

**If you don't know the answer:**
- *"That's a great question. I don't have that data to hand, but I'll find out and follow up."*
- Never guess or bluff.

**Handling hostile questions:**
- Stay calm; don't take it personally
- *"I understand your concern. Let me address that..."*
- Acknowledge, then redirect: *"That's an important point. What I'd add is..."*

## Job Interview Techniques

**The STAR method for behavioural questions:**
- **S**ituation — Set the context
- **T**ask — What was your role/responsibility?
- **A**ction — What did you do?
- **R**esult — What was the outcome?

*Question: "Tell me about a time you solved a problem."*
*Answer:* "When I was [Situation], I was responsible for [Task]. I [Action]. As a result, [measurable Result]."

## Everyday Confident Communication

**Active listening:**
- Make eye contact and nod
- Don't interrupt
- Ask follow-up questions
- Reflect back: *"So what you're saying is..."*

**Assertiveness:**
- Express your needs clearly: *"I need..."* not *"I was wondering if maybe..."*
- Say no respectfully: *"I appreciate you thinking of me, but I'm not able to take that on right now."*
- Disagree diplomatically: *"I see it differently — here's my perspective..."*

## Your Communication Toolkit
By completing this course, you now have:
✅ Techniques to manage speaking anxiety
✅ A structure for any speech or presentation
✅ Storytelling skills that make you memorable
✅ Strategies for Q&A and job interviews
✅ Tools for confident everyday communication`,
      },
    ],
  },
  {
    title: "Goal Setting",
    description: "Turn big dreams into achievable plans. Learn SMART goals, habit formation, and the mindset of consistent progress.",
    category: "Leadership",
    totalWeeks: 2,
    difficulty: "Beginner",
    imageEmoji: "🌟",
    sortOrder: 12,
    weeks: [
      {
        week: 1,
        title: "SMART Goals & Vision Setting",
        videoTitle: "How to Set Goals and Achieve Them",
        videoUrl: "https://www.youtube.com/watch?v=L4N1q4RNi9I",
        videoDuration: "20:00",
        content: `# Week 1: SMART Goals & Vision Setting

## Why Most Goals Fail
People often say "I want to get healthy" or "I want to learn English." These are wishes, not goals. Without a clear plan, motivation fades after a few days.

The solution: **SMART goals**.

## The SMART Framework

| Letter | Meaning | Question to Ask |
|---|---|---|
| **S** | Specific | What exactly do I want to achieve? |
| **M** | Measurable | How will I know I've achieved it? |
| **A** | Achievable | Is this realistic given my resources? |
| **R** | Relevant | Does this align with my bigger goals? |
| **T** | Time-bound | By when will I achieve this? |

**Vague goal:** "I want to learn coding."

**SMART goal:** "I will complete the Python Basics course on Her Access and build one small project by [date 6 weeks from now], studying 30 minutes each evening."

## Vision Setting — Starting with Why
Before setting goals, clarify your vision:
- Where do you want to be in 5 years?
- What kind of person do you want to become?
- What does success look like for you?

Write a **Vision Statement:** A paragraph describing your ideal future in vivid detail. Read it every morning.

## Breaking Goals into Milestones
Big goals feel overwhelming. Break them down:

**Goal:** Get an IELTS score of 7.0 in 12 months.

| Month | Milestone |
|---|---|
| 1–2 | Complete IELTS preparation course |
| 3–4 | Practice reading and listening daily, take mock test |
| 5–6 | Focus on writing — get feedback on essays |
| 7–8 | Intensive speaking practice with a partner |
| 9–10 | Full mock tests under timed conditions |
| 11–12 | Final review, book the real test |

## Accountability Systems
Goals without accountability fail. Build in accountability:
- **Accountability partner** — share your goal with someone who will check in
- **Weekly review** — every Sunday, review: what did I do? What's next?
- **Habit tracker** — tick off each day you worked toward your goal

## Practice
Write three SMART goals — one for the next month, one for 6 months, one for 1 year. For each, identify one potential obstacle and how you will overcome it.`,
      },
      {
        week: 2,
        title: "Habit Formation & Consistent Progress",
        videoTitle: "The Science of Building Good Habits",
        videoUrl: "https://www.youtube.com/watch?v=75d_29QWELk",
        videoDuration: "22:00",
        content: `# Week 2: Habit Formation & Consistent Progress

## Why Habits Matter
Your outcomes are the result of your habits. You don't rise to your goals — you fall to your systems.

## The Habit Loop
Every habit has three components:
1. **Cue** — triggers the habit (time, location, emotion, other behaviour)
2. **Routine** — the behaviour itself
3. **Reward** — what you get from doing it

To build a new habit, design all three parts deliberately.

## The Two-Minute Rule
If a new habit feels hard to start, make the first action take less than two minutes:
- *"Study for an hour"* → *"Open my textbook and read one paragraph"*
- *"Exercise"* → *"Put on my workout clothes"*

Once you've started, momentum carries you forward.

## Habit Stacking
Attach a new habit to an existing one:
*"After [CURRENT HABIT], I will [NEW HABIT]."*

Examples:
- "After I make my morning tea, I will study English for 15 minutes."
- "After dinner, I will write three things I'm grateful for."

## The Power of 1% Better
Improving by just 1% every day seems tiny, but:
- 1% better every day for a year = **37x better**
- 1% worse every day for a year = nearly zero

Small, consistent actions compound into extraordinary results.

## Dealing with Setbacks
Everyone misses a day. The key rule: **Never miss twice.**

One missed day is a mistake. Two missed days is the start of a new (bad) habit.

## Measuring Progress
Track your habits visually:
- Mark a calendar with an X on every day you complete your habit
- The goal: "Don't break the chain"
- When you miss, your only job is to get an X tomorrow

## Mindset: Growth vs Fixed

| Fixed Mindset | Growth Mindset |
|---|---|
| "I'm not smart enough" | "I can't do this *yet*" |
| "I failed — I give up" | "I failed — what can I learn?" |
| "I'm not a maths person" | "I haven't practised maths enough" |

The word *yet* is one of the most powerful words in personal development.

## Completing This Course
You've now learned:
✅ How to set SMART goals that are specific and measurable
✅ How to create a clear vision of your future
✅ How to break large goals into manageable milestones
✅ How habits work and how to build new ones
✅ How to recover from setbacks and stay consistent

**Your next action:** Choose one habit from this course that you will start tomorrow. Write it down with the cue, routine, and reward clearly defined.`,
      },
    ],
  },
  {
    title: "Statistics Intro",
    description: "Learn to collect, analyse, and interpret data. Essential skills for research, business, and informed decision-making.",
    category: "Math",
    totalWeeks: 4,
    difficulty: "Intermediate",
    imageEmoji: "📊",
    sortOrder: 8,
    weeks: [
      {
        week: 1,
        title: "Data Collection & Types",
        videoTitle: "Introduction to Statistics",
        videoUrl: "https://www.youtube.com/watch?v=xxpc-HPKN28",
        videoDuration: "15:00",
        content: `# Week 1: Data Collection & Types

## What is Statistics?
Statistics is the science of collecting, organising, analysing, and interpreting data to make decisions.

## Types of Data

### Qualitative (Categorical)
Describes qualities or categories — cannot be measured numerically.
- Nominal: no order (colours, names, yes/no)
- Ordinal: has order but unequal intervals (ratings: poor/fair/good/excellent)

### Quantitative (Numerical)
Measured numerically.
- Discrete: counted in whole numbers (number of students, goals scored)
- Continuous: measured on a scale (height, weight, temperature)

## Data Collection Methods

| Method | Best For | Limitation |
|---|---|---|
| Survey/Questionnaire | Large groups | Response bias |
| Interview | Detailed responses | Time-consuming |
| Observation | Behaviour | Observer effect |
| Experiment | Cause-and-effect | May not be ethical/practical |
| Secondary data | Historical trends | May be outdated |

## Sampling

**Population** = the entire group you want to study
**Sample** = a subset of the population

Types of sampling:
- **Random** — every member has equal chance of selection
- **Stratified** — divide into subgroups, sample proportionally
- **Convenience** — use whoever is available (easy but biased)

**Representative sample** = reflects the diversity of the population

## Bias in Data
Watch for:
- **Selection bias** — sample doesn't represent the population
- **Response bias** — people answer dishonestly
- **Confirmation bias** — looking for data that supports your existing view

## Practice
Design a survey to find out how students in your school spend their free time. Identify: your population, sampling method, and 5 survey questions. Are there any potential sources of bias?`,
      },
      {
        week: 2,
        title: "Descriptive Statistics",
        videoTitle: "Mean, Median, Mode and Range",
        videoUrl: "https://www.youtube.com/watch?v=B1HjXkSV-j8",
        videoDuration: "12:00",
        content: `# Week 2: Descriptive Statistics

## Measures of Central Tendency

### Mean (Average)
Sum all values ÷ number of values.

Data: 4, 7, 7, 9, 13
Mean = (4 + 7 + 7 + 9 + 13) ÷ 5 = 40 ÷ 5 = **8**

⚠️ Sensitive to outliers: if one value is 1000, the mean is pulled far up.

### Median (Middle Value)
Arrange in order; find the middle.

Odd count: 4, 7, **7**, 9, 13 → Median = **7**

Even count: 4, 7, 9, 13 → Median = (7 + 9) ÷ 2 = **8**

The median is resistant to outliers.

### Mode (Most Frequent)
Data: 4, 7, **7**, 9, 13 → Mode = **7**

A dataset can have:
- No mode (all values appear once)
- One mode (unimodal)
- Two modes (bimodal)

## Measures of Spread

### Range
Range = Maximum − Minimum
Data: 4, 7, 7, 9, 13 → Range = 13 − 4 = **9**

### Standard Deviation
Measures how spread out values are from the mean.
- Low SD = values clustered near the mean
- High SD = values spread out widely

### Interquartile Range (IQR)
IQR = Q3 − Q1 (middle 50% of data)
Resistant to outliers — often preferred for skewed data.

## Data Visualisation

| Chart Type | Best For |
|---|---|
| Bar chart | Comparing categories |
| Histogram | Distribution of continuous data |
| Pie chart | Parts of a whole (max 5 categories) |
| Line graph | Trends over time |
| Box plot | Distribution + outliers |
| Scatter plot | Relationship between two variables |

## Practice
Given these test scores: 55, 62, 70, 71, 72, 74, 74, 82, 85, 95
1. Find the mean, median, and mode
2. Find the range
3. Which measure of centre best represents this data and why?
4. Draw a histogram showing the distribution`,
      },
      {
        week: 3,
        title: "Probability",
        videoTitle: "Introduction to Probability",
        videoUrl: "https://www.youtube.com/watch?v=uzkc-qNVoOk",
        videoDuration: "14:00",
        content: `# Week 3: Probability

## What is Probability?
Probability measures how likely an event is to occur.

**Formula:** P(event) = favourable outcomes ÷ total possible outcomes

**Scale:** 0 (impossible) to 1 (certain)

**Example:** Rolling a 6 on a die = 1/6 ≈ 0.167 = 16.7%

## Key Terms
- **Experiment** = a process that produces an outcome
- **Sample space** = all possible outcomes
- **Event** = one or more outcomes

Rolling a die: Sample space = {1, 2, 3, 4, 5, 6}

## Types of Probability

### Theoretical
Based on reasoning, not experiments.
P(getting heads) = 1/2

### Experimental (Relative Frequency)
Based on actual results.
After 100 coin flips, 52 heads: P(heads) = 52/100 = 0.52

As more experiments are run, experimental approaches theoretical (Law of Large Numbers).

## Combined Events

**AND (Intersection):** Both events occur.
P(A and B) = P(A) × P(B) *(for independent events)*

**OR (Union):** At least one event occurs.
P(A or B) = P(A) + P(B) − P(A and B)

**Complement:** Event does NOT occur.
P(not A) = 1 − P(A)

**Example:** P(not rolling a 6) = 1 − 1/6 = 5/6

## Independent vs Dependent Events

**Independent:** Outcome of first does not affect second.
*Drawing a card, replacing it, then drawing again.*

**Dependent:** Outcome of first affects second.
*Drawing a card and NOT replacing it.*

P(King then Queen, no replacement) = (4/52) × (4/51)

## Practice
1. A bag has 5 red, 3 blue, and 2 green marbles. Find: P(red), P(not green), P(blue or green).
2. What is the probability of rolling an even number or a number > 4 on a single die?`,
      },
      {
        week: 4,
        title: "Correlation, Regression & Interpreting Results",
        videoTitle: "Correlation and Regression",
        videoUrl: "https://www.youtube.com/watch?v=11c9cs6WpJU",
        videoDuration: "16:00",
        content: `# Week 4: Correlation & Interpreting Results

## Correlation
Correlation measures the relationship between two variables.

**Scatter plots show correlation:**
- Points slope up → **positive correlation** (more study hours, higher grades)
- Points slope down → **negative correlation** (more absences, lower grades)
- No clear pattern → **no correlation**

## Correlation Coefficient (r)
Ranges from −1 to +1:

| r value | Interpretation |
|---|---|
| 0.9 to 1.0 | Very strong positive |
| 0.5 to 0.9 | Moderate positive |
| 0 to 0.5 | Weak positive |
| 0 | No correlation |
| −0.5 to 0 | Weak negative |
| −1.0 to −0.5 | Strong negative |

## ⚠️ Correlation ≠ Causation
Just because two variables are correlated does NOT mean one causes the other.

**Famous example:** Ice cream sales correlate with drowning rates. Cause? Neither — both are caused by hot weather (confounding variable).

Always look for alternative explanations.

## Line of Best Fit (Regression Line)
A line drawn through a scatter plot that minimises the distance to all points.

Used to make predictions: "If study time is 8 hours, what grade is predicted?"

## Interpreting Statistical Results Critically

Ask these questions:
1. Who conducted the study and why? (Any bias?)
2. How was the sample selected? (Representative?)
3. How many people were studied? (Larger = more reliable)
4. Are there confounding variables?
5. Has the study been replicated?

## Statistics in the Real World
- Medical trials: Does this medicine work?
- Business: Which marketing strategy increases sales?
- Government: Are crime rates rising or falling?
- Journalism: Understanding the statistics behind headlines

## Completing Statistics Intro
You can now:
✅ Collect data appropriately and identify bias
✅ Calculate and interpret mean, median, mode, range
✅ Calculate basic probability
✅ Analyse correlations without confusing them with causation
✅ Read and critically evaluate statistical claims`,
      },
    ],
  },
  {
    title: "IELTS Preparation",
    description: "Structured preparation for all four IELTS modules — listening, reading, writing, and speaking — with practice tests.",
    category: "English",
    totalWeeks: 8,
    difficulty: "Advanced",
    imageEmoji: "🎓",
    sortOrder: 3,
    weeks: [
      {
        week: 1,
        title: "IELTS Overview & Reading Skills",
        videoTitle: "IELTS Overview and Tips",
        videoUrl: "https://www.youtube.com/watch?v=odUgPMZnBoI",
        videoDuration: "30:00",
        content: `# Week 1: IELTS Overview & Reading Skills

## What is IELTS?
The International English Language Testing System is accepted by universities, employers, and immigration authorities in 140+ countries.

## The Four Modules

| Module | Time | Tasks |
|---|---|---|
| Listening | 30 min + 10 min transfer | 4 sections, 40 questions |
| Reading | 60 min | 3 passages, 40 questions |
| Writing | 60 min | Task 1 (20 min) + Task 2 (40 min) |
| Speaking | 11–14 min | 3 parts, with an examiner |

**Band scores:** 1 (no English) to 9 (expert). Most universities require 6.0–7.0.

## IELTS Reading Strategies

### Time Management
- 60 minutes for 3 passages = 20 minutes each
- Skim the passage first (2–3 min), then read questions, then find answers

### Question Types

**True / False / Not Given:**
- TRUE: statement agrees with text
- FALSE: statement contradicts text
- NOT GIVEN: information not in the text
⚠️ "Not Given" means not mentioned — not that it's wrong

**Matching Headings:**
- Read the heading options first
- Skim each paragraph for the main idea
- Match paragraph to heading

**Gap Fill:**
- Use words directly from the text
- Check grammar — singular/plural, tense
- Check word limit (usually "NO MORE THAN TWO WORDS")

## Skimming vs Scanning
- **Skim** = read quickly for general meaning (first read)
- **Scan** = search for specific information (finding answers)

## Practice
Download an IELTS Reading practice test. Complete one passage (20 minutes). Check your answers, then analyse errors — did you misread? Choose incorrectly between True/False/NG?`,
      },
      {
        week: 2,
        title: "Listening Skills",
        videoTitle: "IELTS Listening Tips and Strategies",
        videoUrl: "https://www.youtube.com/watch?v=S7pZcRSYHrA",
        videoDuration: "28:00",
        content: `# Week 2: IELTS Listening

## The Listening Test
- 4 sections, increasingly difficult
- Section 1–2: Everyday situations
- Section 3–4: Academic contexts
- You hear each recording ONCE

## Before the Recording Plays
Use the preparation time (30 seconds per section) to:
1. Read all questions carefully
2. Predict the type of answer (number, name, place, adjective)
3. Identify keywords that signal when an answer is coming

## During the Recording
- Write answers as you listen — don't wait
- If you miss one, move on immediately — don't dwell on it
- Watch for **paraphrasing** — the recording rarely uses the exact words in the question

**Example:**
Question: *"What is the price of the apartment?"*
Recording: *"The monthly rent comes to £750."*
Answer: **£750** (or £750 per month)

## Common Trap: Distractor Information
Speakers often correct themselves or change their mind:
*"I'll arrive on Tuesday... actually, make that Wednesday."*
→ Answer: Wednesday

## Spelling & Numbers
- Spelling is tested: names, addresses, postcodes
- Practice spelling common words and names aloud
- Numbers: practice quickly writing dates, times, prices, statistics

## Strategies for Each Section

**Section 1 (conversation):** Usually a form, booking, or enquiry. Answer usually follows question order.

**Section 2 (monologue):** Often a guided tour, talk, or announcement. Maps and diagrams may be included.

**Section 3 (academic discussion):** 2–4 speakers discussing a project or assignment. More complex language.

**Section 4 (lecture):** Most difficult. Dense academic content. Often uses signposting language.

## Practice
Listen to BBC Radio 4 programmes, TED talks, or University Challenge episodes for 20 minutes daily. Note down key words and numbers you hear.`,
      },
    ],
  },
  {
    title: "Physics for Beginners",
    description: "Understand forces, motion, energy, and light. Real-world examples make abstract concepts click.",
    category: "Science",
    totalWeeks: 6,
    difficulty: "Beginner",
    imageEmoji: "⚡",
    sortOrder: 6,
    weeks: [
      {
        week: 1,
        title: "Motion & Measurement",
        videoTitle: "Physics - Motion and Speed",
        videoUrl: "https://www.youtube.com/watch?v=ZM8ECpBuQYE",
        videoDuration: "16:00",
        content: `# Week 1: Motion & Measurement

## Why Physics?
Physics explains how the universe works — from why apples fall to how stars shine. It's the foundation of all technology: phones, cars, medical scanners.

## Measuring Motion

**Distance** = how far an object travels (in metres, km, etc.)
**Displacement** = how far from the starting point (includes direction)

**Speed** = how fast something moves
Formula: **Speed = Distance ÷ Time** (m/s or km/h)

**Example:** A car travels 120 km in 2 hours.
Speed = 120 ÷ 2 = **60 km/h**

**Velocity** = speed with direction
*"60 km/h north"* — this is velocity, not just speed.

## Acceleration
Acceleration = how quickly speed changes.

Formula: **Acceleration = (Final Speed − Initial Speed) ÷ Time** (m/s²)

**Example:** A car goes from 0 to 30 m/s in 5 seconds.
Acceleration = (30 − 0) ÷ 5 = **6 m/s²**

Deceleration = negative acceleration (slowing down)

## Distance-Time Graphs

| Line Type | Meaning |
|---|---|
| Horizontal | Object is stationary |
| Straight diagonal | Constant speed |
| Curved, getting steeper | Accelerating |
| Curved, getting flatter | Decelerating |

## Scientific Notation & SI Units
Physics uses SI (International System) units:

| Quantity | Unit | Symbol |
|---|---|---|
| Distance | metre | m |
| Mass | kilogram | kg |
| Time | second | s |
| Temperature | kelvin | K |
| Force | newton | N |

## Practice
A cyclist travels 2.4 km in 8 minutes.
1. Calculate speed in m/s
2. Draw a distance-time graph for this journey
3. If the cyclist then slows from 5 m/s to 1 m/s in 4 seconds, find the deceleration`,
      },
    ],
  },
  {
    title: "Chemistry 101",
    description: "Atoms, molecules, reactions, and the periodic table — foundational chemistry that connects to everyday life.",
    category: "Science",
    totalWeeks: 5,
    difficulty: "Beginner",
    imageEmoji: "⚗️",
    sortOrder: 5,
    weeks: [
      {
        week: 1,
        title: "Atoms & the Periodic Table",
        videoTitle: "Introduction to Chemistry and Atoms",
        videoUrl: "https://www.youtube.com/watch?v=FSyAehMdpyI",
        videoDuration: "18:00",
        content: `# Week 1: Atoms & the Periodic Table

## What is Chemistry?
Chemistry is the study of matter — what it's made of and how it changes. Everything around you is chemistry: the water you drink, the air you breathe, the phone in your hand.

## The Atom
The atom is the smallest unit of an element that still has the properties of that element.

**Sub-atomic particles:**

| Particle | Charge | Location |
|---|---|---|
| Proton | Positive (+) | Nucleus |
| Neutron | Neutral (0) | Nucleus |
| Electron | Negative (−) | Shells around nucleus |

**Atomic number** = number of protons (unique to each element)
**Mass number** = protons + neutrons

**Example — Carbon:**
- Atomic number: 6 (6 protons)
- Mass number: 12 (6 protons + 6 neutrons)
- Electrons: 6 (equal to protons in a neutral atom)

## The Periodic Table
118 elements, arranged by atomic number and grouped by similar properties.

**Key groups:**

| Group | Name | Properties |
|---|---|---|
| Group 1 | Alkali metals | Very reactive, soft |
| Group 7 | Halogens | Reactive non-metals, form salts |
| Group 0/18 | Noble gases | Unreactive, used in lighting |
| Middle | Transition metals | Good conductors, form coloured compounds |

**Periods** (horizontal rows) = same number of electron shells
**Groups** (vertical columns) = same number of outer electrons = similar reactions

## Isotopes
Atoms of the same element with different numbers of neutrons.

Carbon-12: 6 protons, 6 neutrons
Carbon-14: 6 protons, 8 neutrons *(used in carbon dating)*

Isotopes have the same chemical properties but different masses.

## Practice
1. For Sodium (Na, atomic number 11, mass number 23): state the number of protons, neutrons, and electrons.
2. Look at a periodic table and find the pattern in Group 1 reactivity — does reactivity increase or decrease going down the group?
3. Explain why carbon-12 and carbon-14 react the same chemically, even though they have different masses.`,
      },
    ],
  },
];

function genId(prefix: string) {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function POST() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sql = neon(process.env.DATABASE_URL!);
  let created = 0;
  let skipped = 0;

  for (const courseData of COURSES) {
    const existing = await sql`
      SELECT id FROM "Course" WHERE title = ${courseData.title} LIMIT 1
    `.catch(() => []);

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    const courseId = genId("c");
    const now = new Date().toISOString();

    await sql`
      INSERT INTO "Course" (id, title, description, category, "totalWeeks", difficulty, language, "imageEmoji", "isPublished", "sortOrder", "createdAt", "updatedAt")
      VALUES (
        ${courseId}, ${courseData.title}, ${courseData.description}, ${courseData.category},
        ${courseData.totalWeeks}, ${courseData.difficulty}, 'en', ${courseData.imageEmoji},
        true, ${courseData.sortOrder}, ${now}::timestamp, ${now}::timestamp
      )
    `;

    for (const week of courseData.weeks) {
      const liId = genId("li");
      await sql`
        INSERT INTO "LibraryItem" (id, title, description, category, content, difficulty, duration, type, "weekNumber", "courseId", "createdAt", "updatedAt")
        VALUES (
          ${liId},
          ${`Week ${week.week}: ${week.title}`},
          ${`Week ${week.week} reading material for ${courseData.title}`},
          ${courseData.category},
          ${week.content},
          ${courseData.difficulty},
          ${`Week ${week.week}`},
          'reading',
          ${week.week},
          ${courseId},
          ${now}::timestamp,
          ${now}::timestamp
        )
      `;

      const vlId = genId("vl");
      await sql`
        INSERT INTO "VideoLesson" (id, title, description, category, "videoUrl", duration, language, "isPublished", "sortOrder", "courseId", "weekNumber", "createdAt", "updatedAt")
        VALUES (
          ${vlId},
          ${`Week ${week.week}: ${week.videoTitle}`},
          ${`Video lesson for Week ${week.week} of ${courseData.title}`},
          ${courseData.category},
          ${week.videoUrl},
          ${week.videoDuration},
          'en',
          true,
          ${week.week},
          ${courseId},
          ${week.week},
          ${now}::timestamp,
          ${now}::timestamp
        )
      `;
    }

    created++;
  }

  return NextResponse.json({
    ok: true,
    message: `Seeded ${created} courses (${skipped} already existed)`,
    created,
    skipped,
  });
}
