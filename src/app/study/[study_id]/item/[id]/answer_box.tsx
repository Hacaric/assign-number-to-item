'use client'

export function AnswerBox({current_choice, options, trigger_function}: 
    {current_choice:string|null, options: string[], trigger_function:(id: string)=>void}){

        // TODO: Load vote options
    const buttons = options.map(function (name) { 
        if (name == current_choice){
            return <button className="m-1 px-5 py-2 rounded-sm border border-1px white text-4xl cursor-pointer bg-[#ccc] text-black" key={name} onClick={() => trigger_function(name)}> {name} </button>;
        }
        return <button className="m-1 px-5 py-2 rounded-sm border border-1px white text-4xl cursor-pointer hover:bg-[#222] hover:text-white" key={name} onClick={() => trigger_function(name)}> {name} </button>;
     })
    return <div>
        {buttons}
    </div>
}