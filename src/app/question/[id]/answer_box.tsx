'use client'

export function AnswerBox({current_choice, trigger_function}: 
    {current_choice:number|null, trigger_function:(id: number)=>void}){

        // TODO: Load vote options
    const buttons = Array.apply(null, Array(options_range_end - options_range_start)).map(function (x, i) { 
        if (i == current_choice){
            return <button className="m-1 px-5 py-2 rounded-sm border border-1px white text-4xl cursor-pointer bg-[#ccc] text-black" key={i} onClick={() => trigger_function(i)}> {i} </button>;
        }
        return <button className="m-1 px-5 py-2 rounded-sm border border-1px white text-4xl cursor-pointer hover:bg-[#222] hover:text-white" key={i} onClick={() => trigger_function(i)}> {i} </button>;
     })
    return <div>
        {buttons}
    </div>
}