'use client'
import { useState } from "react";
import { AnswerBox } from "./answer_box";
import { ItemData, StudyData } from "@/src/lib/quiz_utils";
import { SubmitAnswer } from "./actions";

export function StudyQuestion({ studyData, itemData, selected }: { studyData:StudyData, itemData:ItemData, selected: number|null }) {
    const [currentChoice, setCurrentChoice] = useState<number|null>(selected);
        
    async function handleSubmit(){
        if (!currentChoice){
            alert("Choose an option before submiting");
            return
        }
        const successful: boolean = await SubmitAnswer(studyData.id, itemData.id, currentChoice);
        if (!successful){
            alert("Error sending vote")
        }
    }

    return <div className="m-20 mt-10 mx-[20vw] p-1 pt-0 grid grid-cols-5 place-items-center gap-4 border border-1px white rounded-3xl">
        <div className="p-0 m-0 mt-5 ml-3"><p className="text-bg"><a href="/" className="underline">Home</a> / Study {studyData.id} / Item #{itemData.id}</p></div>
        {/* <div className="col-span-4"></div> */}
        <p className="col-span-3 text-xl font-bold mt-6">{itemData.question}</p>
        <div className="">
            {itemData.id > 0 && <a href={`/study/${studyData.id}/item/${itemData.id - 1}`} className="whitespace-nowrap">{"< Previous"}</a>}
            {/* {itemData.id <= 0 && <span>{"-------------"}</span>} */}
            <span className="mx-2">{itemData.id > 0 && itemData.id < studyData.item_amount-1 && "|"}</span>
            {itemData.id < studyData.item_amount-1 && <a href={`/study/${studyData.id}/item/${itemData.id + 1}`} className="whitespace-nowrap">{"Next >"}</a>}
            {/* {itemData.id >= studyData.item_amount-1 && <span>{"---------"}</span>} */}
        </div>
        <p className="col-span-5 text-6xl font-bold my-10 mt-20">{itemData.name}</p>
        <div></div>
        <div className="col-span-5 pt-20 p-5 py-5">
            <AnswerBox current_choice={currentChoice} options={itemData.vote_options} trigger_function={setCurrentChoice} />
        </div>
        <div className="col-span-5">
            <button onClick={()=>handleSubmit()} className="text-xl font-bold border border-1px white py-3 px-5 mb-5 rounded-xl cursor-pointer hover:bg-[#ccc] hover:text-black">
                Submit
            </button>
        </div>
    </div>
}