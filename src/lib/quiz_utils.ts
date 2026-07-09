'use server'

import { prisma } from "@/lib/prisma"

export interface StudyData {
    id: number,
    name: string,
    descrition: string,
    item_ids: number[]
    item_amount: number
}
export async function GetStudyData(study_id:number): Promise<StudyData|null>{
    const study = await prisma.study.findUnique({ where: {id: study_id}, include: {items: true} })
    if (!study){ return null; }
    const study_data: StudyData = {
        id: study.id,
        name: study.name, 
        descrition: study.description, 
        item_ids: study.items.map((item)=>item.id),
        item_amount: study.items.length,
    }
    return study_data;
}

export interface ItemData {
    id: number,
    studyId: number,
    name: string,
    question: string,
    vote_options: string[]
}
export async function loadItemData( studyId:number, id:number ): Promise<ItemData|null>{
    console.log(await prisma.item.findMany())
    const item = await prisma.item.findUnique({
        where: {studyId_id: {studyId: studyId, id: id}},
        include: {study: true}
    })

    if (!item || !item.study){ return null; }

    const study = await prisma.study.findUnique({ 
        where: { id: item.studyId },
        include: { voting_options: true }
    })

    if (!study){ return null; }
    return {
        id: item.id,
        studyId: item.studyId,
        name: item.name,
        question: item.study.question_text,
        vote_options: study.voting_options.map((option)=>option.name)
    };
}
