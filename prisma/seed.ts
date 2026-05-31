import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create default peer circles
  const circles = [
    {
      name: "English Learners Circle",
      description: "Practice English together — reading, writing, speaking",
      topic: "🌍 English",
      maxMembers: 5,
    },
    {
      name: "Coding Girls",
      description: "Learn programming from scratch — Python, web development",
      topic: "💻 Coding",
      maxMembers: 5,
    },
    {
      name: "STEM Explorers",
      description: "Science, math, and technology — explore the universe",
      topic: "🔬 STEM",
      maxMembers: 5,
    },
    {
      name: "Business & Leadership",
      description: "Entrepreneurship, finance, and leadership skills",
      topic: "📊 Business",
      maxMembers: 5,
    },
    {
      name: "Language Bridge",
      description: "Arabic, Dari, Pashto, Russian — learn together",
      topic: "🗣️ Languages",
      maxMembers: 5,
    },
    {
      name: "Creative Minds",
      description: "Art, writing, music, and creative expression",
      topic: "🎨 Creative",
      maxMembers: 5,
    },
  ];

  for (const circle of circles) {
    await prisma.circle.upsert({
      where: { id: circle.name.toLowerCase().replace(/\s+/g, "-") },
      create: { ...circle, id: circle.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
    });
  }

  console.log("✅ Database seeded with peer circles");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
