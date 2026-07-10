'use client'
import { useState } from "react";
import { AnswerBox } from "./answer_box";
import { ItemData, StudyData } from "@/src/lib/quiz_utils";
import { SubmitAnswer } from "./actions";

export function StudyQuestion({ studyData, itemData, selected }: { studyData:StudyData, itemData:ItemData, selected: number|null }) {
    const [currentChoice, setCurrentChoice] = useState<number|null>(selected);
        
    async function handleSubmit(choice?: number){
        if (!choice){
            choice = currentChoice || undefined;
        }
        if (!choice) {
            console.error(`handleSubmit(): Failed to submit: choice is undefined`)
            return;
        }
        console.log(`handleSubmit(): Submiting choice ${choice}...`)
        if (!choice){
            alert("Choose an option before submiting");
            console.error("Choose an option before submiting");
            return
        }
        const successful: boolean = await SubmitAnswer(studyData.id, itemData.id, choice);
        if (!successful){
            alert("handleSubmit(): Error sending vote")
            console.error("handleSubmit(): Error sending vote")
        } else {
            console.log("handleSubmit(): Vote sent successfully")
        }
    }

    async function handleAnswerChange(choice_id: number) {
        console.log(`Changing choice from ${currentChoice} to ${choice_id}`)
        const change: boolean = choice_id != currentChoice;
        setCurrentChoice(choice_id);
        if (change){
            // Passing the id is required, because at time of call, currentChoice is not updated - react states are async
            await handleSubmit(choice_id);
        }
    }

    return <div className="m-20 mt-10 mx-[20vw] p-1 pt-0 grid grid-cols-5 place-items-center gap-4 border border-1px white rounded-3xl">
        <div className="p-0 m-0 mt-5 ml-3">
            <p className="text-bg"><a href="/" className="underline">Home</a> / <a href={`/study/${studyData.id}/`} className="underline">Study {studyData.id}</a> / Item #{itemData.id}</p>
        </div>
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
            <AnswerBox current_choice={currentChoice} options={itemData.vote_options} trigger_function={handleAnswerChange} />
        </div>
        { currentChoice != null && itemData.id < studyData.item_amount-1 &&
        <div className="col-span-5">
            <a href={`/study/${studyData.id}/item/${itemData.id + 1}`} className="whitespace-nowrap">
                <button className="text-xl font-bold border border-1px white py-3 px-5 mb-5 rounded-xl cursor-pointer hover:bg-[#ccc] hover:text-black">
                    {"Next >"}
                </button>
            </a>
        </div>
        }
        { currentChoice != null && itemData.id >= studyData.item_amount-1 &&
        <div className="col-span-5">
            <a href={`/`} className="text-xl font-bold border border-1px white py-3 px-5 mb-5 rounded-xl cursor-pointer hover:bg-[#ccc] hover:text-black whitespace-nowrap inline-block">
                Home
            </a>
            <a href={`/study/${studyData.id}/overview`} className="text-xl font-bold border border-1px white py-3 px-5 mb-5 rounded-xl cursor-pointer hover:bg-[#ccc] hover:text-black m-2 whitespace-nowrap inline-block">
                Overview
            </a>
            <a href={`/study/${studyData.id}/`} className="text-xl font-bold border border-1px white py-3 px-5 mb-5 rounded-xl cursor-pointer hover:bg-[#ccc] hover:text-black whitespace-nowrap inline-block">
                Study page
            </a>
        </div>
        }
    </div>
}