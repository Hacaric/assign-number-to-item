import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CreateUser } from "./lib/user_utils";
import { prisma } from "@/lib/prisma";

async function CreateUserAndSetCookie(response: NextResponse) {
    const user = await CreateUser();
    response.cookies.set('user_uuid', user.uuid);
    return user;
} 

export async function proxy(request: NextResponse) {
    console.debug(`PROXY TIMEEE`)
    const response = NextResponse.next();
    const uuid_cookie = request.cookies.get('user_uuid')?.value
    if (!uuid_cookie) {
        console.info(`Proxy: No cookie found: creating user.`)
        const user = await CreateUserAndSetCookie(response);
        console.info(`Proxy: Created user ${user.uuid}, set cookie`)
    } else {
        const user = await prisma.user.findUnique({
            where: {uuid: uuid_cookie}
        })
        if (!user) {
            console.warn(`Proxy: Invalid uuid, creating new user`);
            const user_fr = await CreateUserAndSetCookie(response);
            console.info(`Proxy: Created user uuid ${user_fr.uuid}`)
        }
    }
    return response;
}
