'use server'

import { User, Vote } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";
import { randomUUID } from "node:crypto";
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


export async function GetUserData(): Promise<User|null> {
    const user_cookies = await cookies()
    const user_uuid = user_cookies.get('user_uuid')?.value;

    if (!user_uuid){
        console.warn(`GetUserData(): Failed to load user: cookie 'user_uuid' is missing.`)
        return null
    }
    const user = await prisma.user.findUnique({
        where: {uuid: user_uuid},
    })

    if (!user) {
        console.warn(`GetUserData(): Failed to load user: uuid not in database`)
    }

    return user;
}

export async function GetUserVotes(): Promise<Vote[]|null> {

    // Maybe fasted would be to get user and include: {votes: true} and return the votes, idk

    const user = await GetUserData();
    if (!user) {console.warn(`GetUserVotes(): failed to load user.`); return null}
    const votes = await prisma.vote.findMany({
        where: {owner_uuid: user.uuid}
    })
    return votes;
}

export async function CreateUser(): Promise<User> {
    const uuid = randomUUID();
    const datetime_now = new Date();
    const user = await prisma.user.create({
        data: {
            uuid: uuid,
            first_joined: datetime_now
        },
    })
    console.info(`CreateUser(): Created new user, uuid ${user.uuid}`)
    return user
}

export async function HasUserCompletedStudy( study_id: number ): Promise<boolean|null> {
    const user_votes = await GetUserVotes();
    const study = await GetStudyData(study_id);

    if (!user_votes || !study){ return null; }
    
    const user_answered_items_ids = user_votes.filter((vote) => vote.study_id==study.id).map((vote)=>vote.item_id).sort();
    const all_study_items_ids = study.item_ids.sort();
    console.debug(`HasUserCompletedStudy(): Is this sorted? ${user_answered_items_ids}`)
    for (let i = 0; i < all_study_items_ids.length; i++){
        if (i >= user_answered_items_ids.length) {
            return false;
        }
        if (user_answered_items_ids[i] != all_study_items_ids[i]){
            console.error(`This should never happen: user voted twice on the same item or user voted on item that doesn't exist`)
            return false;
        }
    }
    return true;
}

