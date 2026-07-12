import { loadItemData, ItemData, StudyData, GetStudyData } from "@/src/lib/quiz_utils";
import { StudyQuestion } from "./item";
import { GetUserVotes, HasUserCompletedStudy } from "@/src/lib/user_utils";
import { assert } from "node:console";

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
    
    let selected = null
    const user_votes = await GetUserVotes();
    if (user_votes){
        console.log(`ALL user votes ids: ${user_votes.map((vote)=>vote.id)}`)
        const user_votes_on_this_item = user_votes.filter(
            (val) => 
                val.study_id == studyId
                && val.item_id == id
        )

        assert(user_votes_on_this_item.length <= 1);

        console.log(`USER VOTES: ${user_votes_on_this_item}`)
        if (user_votes_on_this_item.length > 0) {
            selected = user_votes_on_this_item[0].chosen_option_id;
        }
    } else {console.log(`Failed to load user votes`)}
    
    const studyPreviouslyCompleted:boolean = await HasUserCompletedStudy(study_data.id) || false;

    return <div>
        <StudyQuestion studyData={study_data} itemData={item_data} selected={selected} studyPreviouslyCompleted={studyPreviouslyCompleted} />
    </div>
}