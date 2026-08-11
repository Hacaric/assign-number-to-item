'use client';

import { useState } from "react";
import { decidePasswordStrenght, passwordStrenght, passwordStrenghtMessage, passwordStrenghtMessageColor } from "./passwordStrenght";
import { CreateAccount } from "./actions";


export function RegisterForm() {
    const [passwordInput, setPasswordInput] = useState<string>("");
    const [passwordInput2, setPasswordInput2] = useState<string>("");
    const [submitMessage, setSubmitMessage] = useState<string>("");
    async function handleSubmit(formData: FormData) {
        const username = formData.get('username');
        const password = formData.get('password');
        const password_repeat = formData.get('password2');
        if ((typeof username != 'string') || (typeof password != 'string') || (typeof password_repeat != 'string')) {
            setSubmitMessage("Refused to submit: You messed up datatypes of some fields (all should be strings). I literally don't know how a normal use could get this message. You are probably doing something fishy ;). Good luck, try to break the system (just report responsibly)")
            return;
        }
        if (username == '' || password == '') {
            setSubmitMessage("Refused to submit: Psername or password is empty.");
            return;
        }
        if (password != password_repeat) {
            setSubmitMessage("Refured to submit: Passwords don't match.");
            return;
        }
        const psw_strenght = decidePasswordStrenght(password);
        if (!psw_strenght[0]) {
            setSubmitMessage("Refused to submit: Password does not pass required specifications.")
        }
        setSubmitMessage("Submiting...");
        const {wasSuccessful, message} = await CreateAccount(username, password);
        setSubmitMessage(`Server responded with: ${message}`);
    }
    function getPasswordStrenghtMessage(){
        const strenght = decidePasswordStrenght(passwordInput);
        console.log(`text-[${passwordStrenghtMessageColor[strenght[1]]}]`)
        return <p className={`text-[${passwordStrenghtMessageColor[strenght[1]]}] italic`}>
            {passwordStrenghtMessage[strenght[1]]}
        </p>
    }

    return <div className="min-w-[40vw] border-1 p-10 pb-5 mt-5">
        <h3 className="text-xl font-bold">Create account</h3>
        <form action={handleSubmit}>
            <p>Username: <input name="username" type="text" className="border border-1px white pl-1" /></p>
            <p>Password: <input name="password" type="password" value={passwordInput} onChange={(event)=>setPasswordInput(event.target.value)} className="border border-1px white pl-1" /></p>
            <p>Password again: <input name="password2" type="password" value={passwordInput2} onChange={(event)=>setPasswordInput2(event.target.value)} className="border border-1px white pl-1" /></p>
            {passwordInput && getPasswordStrenghtMessage()}
            {passwordInput != passwordInput2 && <p className="text-[#ff0000] text-sm italic">Passwords do not match</p>}
            <div className="flex flex-col items-center">
                <button type="submit" className="px-2 py-0 mt-5 bg-black text-white font-medium shadow-md hover:bg-gray-700 hover:cursor-pointer border-1">Submit</button>
            </div>
            {submitMessage && <p>{submitMessage}</p>}
        </form>
    </div>
}