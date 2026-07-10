import { loadItemData, ItemData, StudyData, GetStudyData } from "@/src/lib/quiz_utils";
import { prisma } from "@/lib/prisma";
import { GetUserData, GetUserVotes } from "@/src/lib/user_utils";
import { assert } from "node:console";

export default async function QuestionPage(props: { params: Promise<{ study_id: string }> }){
    const study_id_string = (await props.params).study_id;
    const study_id = Number(study_id_string)
    if (isNaN(study_id)) {
        return <div><b>Error: provided study indentificator '{study_id_string}' is not a number.</b><p>Bruh, you don't know that {study_id_string} is not a number?&#128128;</p></div>
    }
    const study = await prisma.study.findUnique({
        where: {id: study_id}
    })
    if (!study) {
        return <div><b>Error: study with indentificator '{study_id}' does not exist</b></div>
    }

    return <div>
        <h1 className="text-4xl font-bold">Study {study_id}</h1>
        <h2 className="font-bold">Name: {study.name}</h2>
        <p>Description: {study.description}</p>
        <button className="text-bg font-bold m-5 ml-0 px-3 py-1 border border-1px white cursor-pointer"><a href={`/study/${study_id}/item/0`}>Jump to the first question</a></button>
    </div>
}