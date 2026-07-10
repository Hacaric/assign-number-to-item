'use server'
import { prisma } from "@/lib/prisma";
import { GetUserData } from "@/src/lib/user_utils";
import { assert } from "node:console";


export async function SubmitAnswer(studyId:number, item_id:number, answer_id: number): Promise<boolean>{
    const user = await GetUserData();
    if (!user) {
        return false;
    }

    const item = await prisma.item.findUnique({
        where: { studyId_id: {studyId: studyId, id: item_id} }
    })
    if (!item) {
        console.error(`Failed to submit answer '${answer_id}' to item id '${item_id}': item is not in database.`)
        return false;
    }
    const possible_voteOptions = await prisma.voteOption.findMany({
        where: {
            id: answer_id,
            studyId: studyId,
        }
    })

    // Dumb, but if this isn't the case, something is seriously messed up
    assert(possible_voteOptions.length <= 1);

    if (possible_voteOptions.length == 0){
        console.error(`Failed to submit answer '${answer_id}' to item id '${item_id}': vote option of study id '${studyId}' with name '${answer_id}' not found.`)
        return false;
    }
    const voteOption = possible_voteOptions[0];

    const previous_vote = await prisma.vote.findFirst({
        where: {
            study_id: studyId,
            item_id: item_id,
        }
    })
    let vote;
    if (previous_vote) {
        vote = await prisma.vote.update({
            where: {id: previous_vote.id},
            data: {
                chosen_option_id: answer_id,
            }
        })
    } else {
        vote = await prisma.vote.create({
            data: {
                study_id: studyId,
                chosen_option_id: voteOption.id,
                item_id: item.id,
                owner_uuid: user.uuid,
            }
        })
    }
    
    if (!vote){
        console.error(`Failed to submit answer '${answer_id}' to item id '${item_id}': failed to create vote. Why? Idk, it's ur problem now :3.`)
        return false;
    }
    
    console.log(`Successfully created/updated vote: ${vote}`)
    return true;
}

