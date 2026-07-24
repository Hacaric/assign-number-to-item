import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CreateParticipant, GetParticipantAccessCookie, getUser, isParticipantAccessKeyValid as isParticipantAccessCookieValid, isUserSessionValid } from "./lib/user_utils";
import { prisma } from "@/lib/prisma";

async function CreateParticipantAndSetCookie(response: NextResponse) {
    const participant = await CreateParticipant();
    const access_cookie = await GetParticipantAccessCookie(participant.uuid);
    if (!access_cookie) {
        console.error(`Failed to get access cookie of user that was just created, this should never happen.`)
        return null;
    }
    response.cookies.set('participant_access_key', access_cookie);
    return participant;
} 

export async function proxy(request: NextRequest) {
    console.debug(`PROXY TIMEEE`)
    
    // FIRSTLY - REDIRECTS
    switch (new URL(request.url).pathname) {
        case ('/'):
            return NextResponse.redirect(new URL('/home', request.url));
    }
    
    // AUTH PART
    const response = NextResponse.next();
    const session_cookie = request.cookies.get('session')?.value;
    const participant_access_cookie = request.cookies.get('participant_access_key')?.value;
    const current_path = (new URL(request.url)).pathname;
    if (!participant_access_cookie || (participant_access_cookie && !await isParticipantAccessCookieValid(participant_access_cookie))){
        return NextResponse.redirect(new URL(`/register?redirect=${current_path}`, request.url));
    }
    if (session_cookie && !await isUserSessionValid(session_cookie)){
        return NextResponse.redirect(new URL(`/register?redirect=${current_path}`, request.url));
    }

    //     request.cookies.set('participant_access_key', user.participant_uuid);
    // } else {
    //     const participant_uuid_cookie = request.cookies.get('participant_access_key')?.value;
    //     if (!participant_uuid_cookie) {
    //         console.info(`Proxy: No cookie found: creating participant.`)
    //         const participant = await CreateParticipantAndSetCookie(response);
    //         if (participant){
    //             console.info(`Proxy: Created participant ${participant.uuid}, set cookie`)
    //         } else {console.error(`Failed to create participant, this should never happen.`)}
    //     } else {
    //         const participant = await prisma.participant.findUnique({
    //             where: {uuid: participant_uuid_cookie}
    //         })
    //         if (!participant) {
    //             console.warn(`Proxy: Invalid uuid, creating new participant`);
    //             const participant_fr = await CreateParticipantAndSetCookie(response);
    //             if (participant_fr){
    //                 console.info(`Proxy: Created participant uuid ${participant_fr.uuid}`)
    //             } else {console.error(`Failed to create participant, this should never happen.`)}
    //         }
    //     }
    // }
    return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login
     * - register
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|register|account|home).*)',
  ],
}
