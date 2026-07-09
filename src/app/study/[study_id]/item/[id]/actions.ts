'use server'
import { prisma } from "@/lib/prisma";
import { assert } from "node:console";

export async function SubmitAnswer(studyId:number, item_id:number, answer: string): Promise<boolean>{
    const item = await prisma.item.findUnique({
        where: { studyId_id: {studyId: studyId, id: item_id} }
    })
    if (!item) {
        console.error(`Failed to submit answer '${answer}' to item id '${item_id}': item is not in database.`)
        return false;
    }
    const possible_voteOptions = await prisma.voteOption.findMany({
        where: {
            studyId: studyId,
            name: answer
        }
    })

    // Dumb, but if this isn't the case, something is seriously messed up
    assert(possible_voteOptions.length <= 1);

    if (possible_voteOptions.length == 0){
        console.error(`Failed to submit answer '${answer}' to item id '${item_id}': vote option of study id '${studyId}' with name '${answer}' not found.`)
        return false;
    }
    const voteOption = possible_voteOptions[0];

    const vote = await prisma.vote.create({
        data: {
            study_id: studyId,
            chosen_option_id: voteOption.id,
            item_id: item.id,
        }
    })
    
    if (!voteOption){
        console.error(`Failed to submit answer '${answer}' to item id '${item_id}': failed to create vote. Why? Idk, it's ur problem now :3.`)
        return false;
    }
    return true;
}

