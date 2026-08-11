'use client'
import { useState } from "react"
import { LoginAnonymously } from "./actions"
import { RegisterForm } from "./forms"
enum menuEnum {
    none,
    loginMenu,
    registerMenu
}

export function LoginOptions({ redirect_url }: { redirect_url:string }) {
    const [menu, setMenu] = useState<menuEnum>(menuEnum.none)
    function handleClick(name: menuEnum) {
        if (name == menu) {
            setMenu(menuEnum.none);
            return
        }
        setMenu(name);
    }
    return <div className="grid grid-cols-1 place-items-center my-5 mb-10">
        <h2>Register</h2>
        <div className="grid grid-cols-1 place-items-center">
            <button onClick={()=>handleClick(menuEnum.registerMenu)} className="px-3 py-1 bg-black text-white font-medium shadow-md hover:bg-gray-700 hover:cursor-pointer mt-5 border-1">Create account</button>
            {menu == menuEnum.registerMenu && <RegisterForm />}
            <span>or</span>
            <button onClick={()=>handleClick(menuEnum.loginMenu)} className="px-3 py-1 bg-black text-white font-medium shadow-md hover:bg-gray-700 hover:cursor-pointer border-1">Log in</button>
            {/* {menu == menuEnum.registerMenu && <LoginForm />} */}
            <span>or</span>
            <button onClick={async function(){await LoginAnonymously(redirect_url)}} className="px-3 py-1 bg-black text-white font-medium shadow-md hover:bg-gray-700 hover:cursor-pointer border-1">Continue anonymously</button>
        </div>
    </div>
}