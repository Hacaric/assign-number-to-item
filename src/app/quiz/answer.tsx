'use client'

const DEFAULT_RANGE_START = 0;
const DEFAULT_RANGE_END = 10;

export function AnswerBox({options_range_start, options_range_end, trigger_function}: 
    {options_range_start:number|undefined, options_range_end:number|undefined, trigger_function:(id: number)=>void}){
    if (!options_range_start) {options_range_start = DEFAULT_RANGE_START;}
    if (!options_range_end) {options_range_end = DEFAULT_RANGE_END;}

    const buttons = Array.apply(null, Array(options_range_end - options_range_start)).map(function (x, i) { 
        return <button className="m-1 px-5 py-2 rounded-sm border border-1px white text-4xl cursor-pointer hover:bg-white hover:text-black" key={i} onClick={() => trigger_function(i)}> {i} </button>;
     })
    return <div>
        {buttons}
    </div>
}