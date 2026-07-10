'use server'

import { User, Vote } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";
import { hash, randomUUID } from "node:crypto";

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
    return user
}

