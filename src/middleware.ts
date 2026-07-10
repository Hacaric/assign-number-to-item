import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CreateUser } from "./lib/user_utils";

export async function middleware(request: NextResponse) {
    const response = NextResponse.next();
    if (!request.cookies.get('user_uuid')) {
        const user = await CreateUser();
        response.cookies.set('user_uuid', user.uuid);
    }
    return response;
}
