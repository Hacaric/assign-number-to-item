'use server'
import { CreateParticipant, GetParticipantAccessCookie } from "@/src/lib/user_utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function LoginAnonymously(redirect_url_promise?:string|undefined|any) {
    const redirect_url = await redirect_url_promise;
    console.log(`REDIRECT_URL=${redirect_url}`)
    const cookieStore = await cookies();
    const participant = await CreateParticipant();
    const access_cookie = await GetParticipantAccessCookie(participant.uuid);
    if (!access_cookie) {
        console.error(`Failed to get access cookie of user that was just created, this should never happen.`)
        return null;
    }
    cookieStore.set('participant_access_key', access_cookie);
    if (redirect_url){
        redirect(redirect_url);
    } else {
        redirect('/');
    }
}


export async function CreateAccount(username: string, password: string): Promise<{wasSuccessful: boolean, message: string}> {
    return {wasSuccessful: false, message: "Under construction..."}
}



