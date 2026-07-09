import { loadItemData, ItemData, StudyData, GetStudyData } from "@/src/lib/quiz_utils";
import { StudyQuestion } from "./item";
import { prisma } from "@/lib/prisma";

export default async function QuestionPage(props: { params: Promise<{ study_id: string, id: string }> }){
    'use server'
    const params = await props.params;
    const studyId = Number.parseInt(params.study_id);
    const id = Number.parseInt(params.id);
    if (isNaN(studyId)){ return <div>Error loading question: provided study indentificator '{params.study_id}' is not a number.</div> }
    if (isNaN(id)){ return <div>Error loading question: provided item indentificator '{params.id}' is not a number.</div> }
    const item_data: ItemData|null = await loadItemData(studyId, id);
    if (!item_data) {
        return <div>Failed to load: item with id {id} not found.</div>
    }
    const study_data: StudyData|null = await GetStudyData(studyId);
    if (!study_data){
        return <div>Failed to load: failed to load study {studyId} </div>
    }
    
    return <div>
        <StudyQuestion studyData={study_data} itemData={item_data} />
    </div>
}