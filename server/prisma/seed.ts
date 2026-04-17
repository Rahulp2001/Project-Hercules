import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed motivational quotes
  const quotes = [
    { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
    { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
    { text: "The body achieves what the mind believes.", author: "Napoleon Hill" },
    { text: "Strive for progress, not perfection.", author: "Unknown" },
    { text: "The hard days are the best because that's when champions are made.", author: "Gabby Douglas" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "What hurts today makes you stronger tomorrow.", author: "Jay Cutler" },
    { text: "Your body can stand almost anything. It's your mind that you have to convince.", author: "Unknown" },
    { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
    { text: "The only way to define your limits is by going beyond them.", author: "Arthur C. Clarke" },
    { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
    { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
    { text: "Strength does not come from the body. It comes from the will.", author: "Unknown" },
    { text: "You don't have to be extreme, just consistent.", author: "Unknown" },
    { text: "The greatest wealth is health.", author: "Virgil" },
    { text: "No matter how slow you go, you're still lapping everyone on the couch.", author: "Unknown" },
    { text: "A year from now you'll wish you had started today.", author: "Karen Lamb" },
    { text: "Push yourself because no one else is going to do it for you.", author: "Unknown" },
    { text: "If it doesn't challenge you, it doesn't change you.", author: "Fred DeVito" },
    { text: "The difference between try and triumph is a little umph.", author: "Marvin Phillips" },
    { text: "Sore today, strong tomorrow.", author: "Unknown" },
    { text: "We are what we repeatedly do. Excellence is not an act, but a habit.", author: "Aristotle" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "A champion is someone who gets up when they can't.", author: "Jack Dempsey" },
    { text: "Your health is an investment, not an expense.", author: "Unknown" },
    { text: "The clock is ticking. Are you becoming the person you want to be?", author: "Greg Plitt" },
  ];

  for (const quote of quotes) {
    await prisma.quote.create({ data: quote });
  }

  console.log(`Seeded ${quotes.length} quotes`);

  // Seed a sample profile
  const profile = await prisma.profile.create({
    data: {
      name: 'Sample User',
      age: 25,
      gender: 'male',
      weight: 75,
      weightUnit: 'kg',
      height: 175,
      heightUnit: 'cm',
      activityLevel: 'moderate',
      goal: 'maintain',
      bmr: 1724,
      tdee: 2672,
      calorieTarget: 2672,
      proteinPct: 30,
      carbsPct: 40,
      fatsPct: 30,
    },
  });

  // Create default settings for the sample profile
  await prisma.settings.create({
    data: {
      profileId: profile.id,
    },
  });

  console.log(`Seeded sample profile (id: ${profile.id}) with default settings`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
