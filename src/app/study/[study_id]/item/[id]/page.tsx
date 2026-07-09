import { loadItemData, ItemData } from "@/src/lib/quiz_utils";
import { StudyQuestion } from "./question";
import { prisma } from "@/lib/prisma";

export default async function QuestionPage(props: { params: Promise<{ study_id: string, id: string }> }){
    'use server'
    const params = await props.params;
    const study_id = Number.parseInt(params.study_id);
    const id = Number.parseInt(params.id);
    if (isNaN(study_id)){ return <div>Error loading question: provided study indentificator '{params.study_id}' is not a number.</div> }
    if (isNaN(id)){ return <div>Error loading question: provided item indentificator '{params.id}' is not a number.</div> }
    const data: ItemData|null = await loadItemData(id);
    const study = await prisma.study.findUnique({
        where: {id: study_id},
        include: {items: true}
    })
    if (!data) {
        return <div>Failed to load: item with id {id} not found.</div>
    }
    if (!study){
        return <div>Failed to load: study with id {study_id} not found </div>
    }
    if (study.items.map((item)=>item.id).includes(id)){
        return <div>Failed to load: item {id} does not belong to study {study_id}</div>
    }
    
    return <div>
        <StudyQuestion id={id} item_data={data} />
    </div>
}