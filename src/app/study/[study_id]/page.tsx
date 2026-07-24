import { prisma } from "@/lib/prisma";
import { HasParticipantCompletedStudy } from "@/src/lib/user_utils";

export default async function AboutStudy(props: { params: Promise<{ study_id: string }> }){
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

    const participant_completed_study = await HasParticipantCompletedStudy(study_id);

    return <div className="grid grid-cols-3 place-items-center gap-4">
        <p className="p-0 m-0 mt-5 ml-3">
            <a href="/" className="underline mx-1">Home</a>
            / Study {study_id}
        </p>
        <div></div>
        <div></div>
        <div></div>
        <div className="mb-10">
            <h1 className="text-4xl font-bold">Study {study_id}</h1>
            <p className="font-bold">Name: {study.name}</p>
            <p className="font-bold">Description: <span className="font-normal">{study.description}</span></p>
            {
                participant_completed_study &&
                <p className="font-bold">Overview: <a href={`/study/${study_id}/overview`} className="font-normal text-sky-400 undeline">here</a></p>
            }
            <button className="text-bg font-bold m-5 ml-0 px-3 py-1 border border-1px white cursor-pointer"><a href={`/study/${study_id}/item/0`}>Jump to the first question</a></button>
        </div>
    </div>
}