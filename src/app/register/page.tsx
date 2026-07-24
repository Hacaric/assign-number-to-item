
import { LoginOptions } from "./loginOptions";

export default async function Register({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    'use server';
    const redirect_param = (await searchParams)?.redirect;
    let redirect_url: string|undefined;
    if (typeof redirect_param == 'string'){
        redirect_url = redirect_param;
    } else if (Array.isArray(redirect_param) && redirect_param.length) {
        redirect_url = redirect_param[0];
    } else {
        redirect_url = '/';
    }
    return <div>
        <LoginOptions redirect_url={redirect_url} />
    </div>
}