'use server'

import { Participant, User, Vote } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";
import { hash, randomUUID } from "node:crypto";
import { GetStudyData } from "./quiz_utils";

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


export async function GetParticipantData(): Promise<Participant|null> {
    const participant_cookies = await cookies()
    const participant_uuid = participant_cookies.get('participant_access_key')?.value;

    if (!participant_uuid){
        console.warn(`GetParticipantData(): Failed to load participant: cookie 'participant_access_key' is missing.`)
        return null
    }
    const participant = await prisma.participant.findUnique({
        where: {uuid: participant_uuid},
    })

    if (!participant) {
        console.warn(`GetParticipantData(): Failed to load participant: uuid not in database`)
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

export async function GetParticipantAccessCookie(participant_uuid:string) {
    const participant = await prisma.participant.findUnique({
        where: {uuid: participant_uuid}
    })
    if (!participant) {
        return null
    }
    return hash('sha256', `${participant.uuid}#${participant.first_joined}`);
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

