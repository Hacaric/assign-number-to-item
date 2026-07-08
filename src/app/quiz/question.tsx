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
    
    return <div className="m-20 mt-10 mx-[20vw] p-2 pt-0 grid grid-cols-5 place-items-center gap-4 border border-1px white rounded-3xl">
        <div className="p-0 m-0 mt-5"><p className="text-xl">Question #{id}</p></div>
        <p className="col-span-5 text-4xl font-bold my-10">{data.question}</p>
        <div></div>
        <div className="col-span-5 pt-40 p-5 py-5">
            <AnswerBox options_range_start={data.options_range_start} options_range_end={data.options_range_end} trigger_function={handleAnswer} />
        </div>
    </div>
}