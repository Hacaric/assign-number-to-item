'use client'

export function AnswerBox({current_choice, options, trigger_function}: 
    {current_choice:number|null, options: {name: string, id: number}[], trigger_function:(id: number)=>void}){

        // TODO: Load vote options
    const buttons = options.map(function ({name, id}) { 
        if (id == current_choice){
            return <button className="m-1 px-5 py-2 rounded-sm border border-1px white text-4xl cursor-pointer bg-[#ccc] text-black" key={id} onClick={() => trigger_function(id)}> {name} </button>;
        }
        return <button className="m-1 px-5 py-2 rounded-sm border border-1px white text-4xl cursor-pointer hover:bg-[#222] hover:text-white" key={id} onClick={() => trigger_function(id)}> {name} </button>;
     })
    return <div>
        {buttons}
    </div>
}