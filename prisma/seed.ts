import { config } from "dotenv";
config();

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Seeding aborted.");
}

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });
console.log("Starting seed.ts")

async function main() {
  console.log('Start seeding...')
  await prisma.study.create({
    data: {
      name: "test",
      description: "desc",
      question_text: "Choose a number for the word: ",
      items: {
        create: [
          {id:0, name:"Heart"},
          {id:1, name:"Hat"},
          {id:2, name:"Dog"},
          {id:3, name:"Frog"},
        ]
      },
      voting_options: {
        create: [
          {id:0, name:"0"},
          {id:1, name:"1"},
          {id:2, name:"2"},
          {id:3, name:"3"},
          {id:4, name:"4"},
          {id:5, name:"5"},
          {id:6, name:"6"},
          {id:7, name:"7"},
          {id:8, name:"8"},
          {id:9, name:"9"},
        ]
      }
    },
    include: {items:true}
  })
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
