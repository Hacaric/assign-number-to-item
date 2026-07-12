// import { loadItemData, ItemData, StudyData, GetStudyData } from "@/src/lib/quiz_utils";
import { prisma } from "@/lib/prisma";
import { chart_user_color, ItemStats } from "./item_stats";

export default async function Overview(props: { params: Promise<{ study_id: string }> }){
    const study_id_string = (await props.params).study_id;
    const study_id = Number(study_id_string)
    if (isNaN(study_id)) {
        return <div><b>Error: provided study indentificator '{study_id_string}' is not a number.</b><p>Bruh, you don't know that {study_id_string} is not a number?&#128128;</p></div>
    }
    const study = await prisma.study.findUnique({
        where: {id: study_id},
        include: {items: true}
    })
    if (!study) {
        return <div><b>Error: study with indentificator '{study_id}' does not exist</b></div>
    }

    const charts = study.items.map(
        (item) => {
            return <ItemStats study_id={study_id} item_id={item.id} key={`chart-${item.id}`} />
        }
    )

    return <div className="w-full min-w-[80vw] mt-10 p-5 pt-0 grid grid-cols-3 place-items-center gap-2 border border-white rounded-3xl">
        <p className="p-0 m-0 mt-4 ml-0 justify-self-start">
            <a href="/" className="underline mx-1">Home</a>
            / Study {study_id}
        </p>
        <div></div>
        <div></div>
        {/* <p className="mb-5 mt-0">
            <a href="/" className="underline mx-1">Home</a>
            /
            <a href={`/study/${study_id}/`} className="underline mx-1">Study {study_id}</a>
            / Overview
        </p> */}
        <div className="col-span-5 mb-20">
            <h1 className="text-4xl font-bold">Overview of Study {study_id}</h1>
            <p className="font-bold">Name: {study.name}</p>
            <span>
                <span className="font-bold">Description:</span> 
                <p className="ml-5">{study.description}</p>
            </span>
            <p className="italic">Note: options you voted for are colored <span style={{ backgroundColor: chart_user_color }} className="p-1">Dark Green</span></p>
        </div>
        <div className="mx-10 col-span-3 w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8 justify-center items-center">
            { charts }
        </div>
    </div>
}