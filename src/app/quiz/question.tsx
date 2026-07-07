import { prisma } from "@/lib/prisma";
import { AnswerBox } from "./answer";

interface QuestionData {
    question: string,
    options_range_start?: number,
    options_range_end?: number
}

async function loadQuestionData( id:number ): Promise<QuestionData|null>{
    'use server'
    console.log(await prisma.question.findMany())
    const question_data = await prisma.question.findUnique( {where: {id: id}} )
    if (!question_data){
        return null
    }
    return question_data;
}

async function handleAnswer(answer:number){
    "use server"
    console.log(`User response is ${answer}`);
}

export async function StudyQuestion({ id }: {id: number}) {
    const data: QuestionData|null = await loadQuestionData(id);
    if (!data){
        return <div>Failed to load question id {id}: not found</div>
    }
    
    return <div>
        <p>{data.question}</p>
        <AnswerBox options_range_start={data.options_range_start} options_range_end={data.options_range_end} trigger_function={handleAnswer} />
    </div>
}