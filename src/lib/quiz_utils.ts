'use server'

import { prisma } from "@/lib/prisma"

interface StudyData {
    name: string,
    descrition: string,
    item_ids: number[]
}
export async function GetStudyData(study_id:number): Promise<StudyData|null>{
    const study = await prisma.study.findUnique({ where: {id: study_id}, include: {items: true} })
    if (!study){ return null; }
    const study_data: StudyData = {
        name: study.name, 
        descrition: study.description, 
        item_ids: study.items.map((item)=>item.id)
    }
    return study_data;
}

export interface ItemData {
    name: string,
    question: string,
    options_range_start?: number,
    options_range_end?: number
}
export async function loadItemData( id:number ): Promise<ItemData|null>{
    console.log(await prisma.item.findMany())
    const item = await prisma.item.findUnique({
        where: {id: id},
        include: {study: true}
    })

    if (!item || !item.study){ return null; }

    const study = await prisma.study.findUnique({ 
        where: { id: item.study_id } 
    })

    if (!study){ return null; }
    return {
        name: item.name,
        question: item.study.question_text
    };
}
