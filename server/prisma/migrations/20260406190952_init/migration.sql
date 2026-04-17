-- CreateTable
CREATE TABLE "Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    "weightUnit" TEXT NOT NULL DEFAULT 'kg',
    "height" REAL NOT NULL,
    "heightUnit" TEXT NOT NULL DEFAULT 'cm',
    "activityLevel" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "bmr" REAL NOT NULL,
    "tdee" REAL NOT NULL,
    "calorieTarget" REAL NOT NULL,
    "proteinPct" INTEGER NOT NULL DEFAULT 30,
    "carbsPct" INTEGER NOT NULL DEFAULT 40,
    "fatsPct" INTEGER NOT NULL DEFAULT 30,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "calories" REAL NOT NULL,
    "protein" REAL NOT NULL DEFAULT 0,
    "carbs" REAL NOT NULL DEFAULT 0,
    "fats" REAL NOT NULL DEFAULT 0,
    "time" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Meal_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER,
    "notes" TEXT,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Workout_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workoutId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "notes" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Exercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExerciseSet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exerciseId" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" REAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'normal',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ExerciseSet_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cardio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "distance" REAL,
    "caloriesBurned" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Cardio_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WaterLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'glasses',
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WaterLog_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SleepLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "hours" REAL NOT NULL,
    "quality" TEXT,
    "bedtime" TEXT,
    "wakeTime" TEXT,
    CONSTRAINT "SleepLog_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StepLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    CONSTRAINT "StepLog_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeightLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    CONSTRAINT "WeightLog_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomTarget" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CustomTarget_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "completionPct" REAL NOT NULL DEFAULT 0,
    "targetsMet" TEXT,
    "notes" TEXT,
    CONSTRAINT "DailyLog_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "badge" TEXT NOT NULL,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Achievement_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "weightUnit" TEXT NOT NULL DEFAULT 'kg',
    "heightUnit" TEXT NOT NULL DEFAULT 'cm',
    "distanceUnit" TEXT NOT NULL DEFAULT 'km',
    "dateFormat" TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
    "waterGoal" INTEGER NOT NULL DEFAULT 8,
    "waterUnit" TEXT NOT NULL DEFAULT 'glasses',
    "stepGoal" INTEGER NOT NULL DEFAULT 10000,
    "sleepGoal" REAL NOT NULL DEFAULT 8,
    "streakThreshold" INTEGER NOT NULL DEFAULT 80,
    "restTimerDefault" INTEGER NOT NULL DEFAULT 90,
    CONSTRAINT "Settings_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "author" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WaterLog_profileId_date_key" ON "WaterLog"("profileId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "SleepLog_profileId_date_key" ON "SleepLog"("profileId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "StepLog_profileId_date_key" ON "StepLog"("profileId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "WeightLog_profileId_date_key" ON "WeightLog"("profileId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyLog_profileId_date_key" ON "DailyLog"("profileId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_profileId_badge_key" ON "Achievement"("profileId", "badge");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_profileId_key" ON "Settings"("profileId");
