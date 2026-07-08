import { loadItemData, ItemData } from "@/src/lib/quiz_utils";
import { StudyQuestion } from "./question";

export default async function QuestionPage(props: { params: Promise<{ id: string }> }){
    'use server'
    const params = await props.params;
    console.log(params.id)
    const id = Number.parseInt(params.id);
    if (isNaN(id)){ return <div>Error loading question: provided indentificator '{params.id}' is not a number.</div> }
    const data: ItemData|null = await loadItemData(id);
    return <div>
        <StudyQuestion id={id} item_data={data} />
    </div>
}