'use server'

import { prisma } from "@/lib/prisma"

interface QuizData {
    name: string,
    descrition: string,
    questions_ids: number[]
}
export async function GetQuizData(quiz_id:number): Promise<QuizData|null>{
    const quiz = await prisma.quiz.findUnique({ where: {id: quiz_id}, include: {questions: true} })
    if (!quiz){ return null; }
    const quiz_data: QuizData = {name: quiz.name, descrition: quiz.description, questions_ids: quiz.questions.map((question)=>question.id)}
    return quiz_data;
}