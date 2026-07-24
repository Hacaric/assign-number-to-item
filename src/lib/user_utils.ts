'use server'

import { Participant, User, Vote } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";
import { hash, randomUUID } from "node:crypto";
import { GetStudyData } from "./quiz_utils";
import { assert } from "node:console";

const UUID_LENGHT = 36

export async function GetUerIP(): Promise<string> {
    const headerList = await headers();
    let ip = headerList.get('x-forwarded-for')
    if (!ip) {
        ip = headerList.get('x-real-ip')
    }
    if (ip && ip.includes(',')) {
        ip = ip.split(',')[0].trim()
    }
    if (!ip){
        // fallback
        ip = '127.0.0.1'
    }
    return ip;
}


export async function GetParticipantData(): Promise<Participant&{votes:Vote[]}|null> {
    const participant_cookies = await cookies()
    const participant_access_cookie = participant_cookies.get('participant_access_key')?.value;
    const participant_uuid = participant_access_cookie?.slice(0, UUID_LENGHT);

    if (!participant_uuid){
        console.warn(`GetParticipantData(): Failed to load participant: cookie 'participant_access_key' is missing.`)
        return null
    }
    const participant = await prisma.participant.findUnique({
        where: {uuid: participant_uuid},
        include: {votes: true}
    })

    if (!participant) {
        console.warn(`GetParticipantData(): Failed to load participant: uuid not in database`)
        return null;
    }

    if (await GetParticipantAccessCookie(participant.uuid) != participant_access_cookie) {
        console.warn(`Participant uuid ${participant.uuid} with access key ${participant_access_cookie}: Access denied: bad acces key`)
        return null;
    }

    return participant;
}

export async function GetParticipantVotes(): Promise<Vote[]|null> {

    // Maybe fasted would be to get participant and include: {votes: true} and return the votes, idk

    const participant = await GetParticipantData();
    if (!participant) {console.warn(`GetParticipantVotes(): failed to load participant.`); return null}
    const votes = await prisma.vote.findMany({
        where: {owner_uuid: participant.uuid}
    })
    return votes;
}

export async function CreateParticipant(): Promise<Participant> {
    const uuid = randomUUID();
    assert(uuid.length == UUID_LENGHT);
    const datetime_now = new Date();
    const participant = await prisma.participant.create({
        data: {
            uuid: uuid,
            first_joined: datetime_now
        },
    })
    console.info(`CreateParticipant(): Created new participant, uuid ${participant.uuid}`)
    return participant
}

export async function HasParticipantCompletedStudy( study_id: number ): Promise<boolean|null> {
    const participant_votes = await GetParticipantVotes();
    const study = await GetStudyData(study_id);

    if (!participant_votes || !study){ return null; }
    
    const participant_answered_items_ids = participant_votes.filter((vote) => vote.study_id==study.id).map((vote)=>vote.item_id).sort();
    const all_study_items_ids = study.item_ids.sort();
    console.debug(`HasParticipantCompletedStudy(): Is this sorted? ${participant_answered_items_ids}`)
    for (let i = 0; i < all_study_items_ids.length; i++){
        if (i >= participant_answered_items_ids.length) {
            return false;
        }
        if (participant_answered_items_ids[i] != all_study_items_ids[i]){
            console.error(`This should never happen: participant voted twice on the same item or participant voted on item that doesn't exist`)
            return false;
        }
    }
    return true;
}

export async function GetParticipantAccessCookie(participant_uuid:string): Promise<string|null> {
    const participant = await prisma.participant.findUnique({
        where: {uuid: participant_uuid}
    })
    if (!participant) {
        return null
    }
    return `${participant.uuid}${hash('sha256', `${participant.uuid}#${participant.first_joined}`)}`;
}

export async function getUser(session_id:string): Promise<User|null> {
    const session = await prisma.session.findUnique({
        where: {
            session_id: session_id
        },
        include: {user: true}
    })
    if (session) {
        return session.user;
    } else {
        return null;
    }
}

export async function isUserSessionValid(session_cookie:string): Promise<boolean> {
    return false;
}

export async function isParticipantAccessKeyValid(access_key: string): Promise<boolean> {
    return await GetParticipantAccessCookie(access_key.slice(0, UUID_LENGHT)) == access_key;
}

export async function GetUserData(): Promise<User|null> {
    return null;
}
