'use client'
import { useState } from "react";
import { AnswerBox } from "./answer_box";
import { ItemData } from "@/src/lib/quiz_utils";
import { SubmitAnswer } from "./actions";

export function StudyQuestion({ id, item_data }: {id: number, item_data:ItemData|null}) {
    const [currentChoice, setCurrentChoice] = useState<string|null>(null);
    
    if (!item_data){
        return <div>Failed to load question id {id}: not found</div>
    }
        
    async function handleSubmit(){
        if (!currentChoice){
            alert("Choose an option before submiting");
            return
        }
        const status: boolean = await SubmitAnswer(id, currentChoice)
    }

    return <div className="m-20 mt-10 mx-[20vw] p-2 pt-0 grid grid-cols-5 place-items-center gap-4 border border-1px white rounded-3xl">
        <div className="p-0 m-0 mt-5"><p className="text-bg">Question #{id}</p></div>
        {/* <div className="col-span-4"></div> */}
        <p className="col-span-3 text-xl font-bold mt-6">{item_data.question}</p>
        <p className="col-span-5 text-6xl font-bold my-10 mt-20">{item_data.name}</p>
        <div></div>
        <div className="col-span-5 pt-20 p-5 py-5">
            <AnswerBox current_choice={currentChoice} trigger_function={setCurrentChoice} />
        </div>
        <div className="col-span-5">
            <button onClick={()=>handleSubmit()} className="text-xl font-bold border border-1px white py-3 px-5 mb-5 rounded-xl cursor-pointer hover:bg-[#ccc] hover:text-black">
                Submit
            </button>
        </div>
    </div>
}