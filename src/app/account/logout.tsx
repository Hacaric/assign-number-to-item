'use client'

import { useState } from "react"
import { DeleteParticipantAccessKeyCookie } from "./actions";

export function LogOutParticipant() {
    const [isClicked, setClicked] = useState<boolean>(false);
    return <div>
        <button className="bg-red-500 py-1 px-2 mt-5 cursor-pointer" onClick={()=>setClicked(!isClicked)}>
            {isClicked ? 'Cancel' : 'Log out'}
        </button>
        {
            isClicked &&
            <div>
                <p className="text-red-500 font-bold font-xl">Are you sure? You will permanently lose access to your vote history.</p>
                <button className="bg-red-500 py-1 px-2 mt-5 cursor-pointer" 
                onClick={async () => {await DeleteParticipantAccessKeyCookie('/')}}>
                    Yes, log me out!
                </button>
            </div>
        }
    </div>
}