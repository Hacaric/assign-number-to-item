'use server'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function DeleteParticipantAccessKeyCookie(redirect_url?:string){
    const cookieStore = await cookies();
    cookieStore.delete('participant_access_key');
    if (redirect_url){
        redirect(redirect_url);
    }
}


