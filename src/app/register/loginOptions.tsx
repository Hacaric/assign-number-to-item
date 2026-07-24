'use client'
import { LoginAnonymously } from "./actions"

export function LoginOptions({ redirect_url }: { redirect_url:string }) {
    return <div className="grid grid-cols-1 place-items-center my-5 mb-10">
        <h2>Register</h2>
        <div className="grid grid-cols-1 place-items-center">
            <button className="button0 mt-5">Create account</button>
            <span>or</span>
            <button className="button0">Log in</button>
            <span>or</span>
            <button className="button0" onClick={async function(){await LoginAnonymously(redirect_url)}}>Continue anonymously</button>
        </div>
    </div>
}