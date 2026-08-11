const specialCharacters = ",./<>?;'[]\\:\"{}|-=!@#$%^&*()_+`~";
const digits = "0123456789";
const capitalLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
export const requiredLenght = 5
export enum passwordStrenght {
    strong,
    empty,
    tooShort,
    missingDigit,
    missingCapital,
    missingSpecialCharacter
}
export const passwordStrenghtMessage = {
    [passwordStrenght.empty]: "",
    [passwordStrenght.strong]: "The password is strong enough",
    [passwordStrenght.tooShort]: `The password must be at least ${requiredLenght} characters long`,
    [passwordStrenght.missingDigit]: "The password must contain at least one digit",
    [passwordStrenght.missingCapital]: "The password should contain at least one capital letter",
    [passwordStrenght.missingSpecialCharacter]: "The password should contain at least one speacial character",
}

export const passwordStrenghtMessageColor = {
    [passwordStrenght.empty]: "#000000",
    [passwordStrenght.strong]: "#00ff00",
    [passwordStrenght.tooShort]: "#ff0000",
    [passwordStrenght.missingDigit]: "#ff0000",
    [passwordStrenght.missingCapital]: "#ff8800",
    [passwordStrenght.missingSpecialCharacter]: "#ff8800",
}

function intersectionOfStrings(a:string, b:string): boolean {
    for (let i = 0; i < a.length; i++) {
        if (b.indexOf(a[i]) != -1) {
            return true;
        }
    }
    return false;
}

/**
 * 
 * @param password 
 * @returns [allowUse:boolean, passwordStrenght: passwordStrenght(enum)]
 */
export function decidePasswordStrenght(password: string): [boolean, passwordStrenght] {
    if (password == ''){
        return [false, passwordStrenght.empty];
    }
    if (password.length < requiredLenght) {
        return [false, passwordStrenght.tooShort];
    }
    if (!intersectionOfStrings(password, digits)){
        return [false, passwordStrenght.missingDigit];
    }
    if (!intersectionOfStrings(password, capitalLetters)){
        return [true, passwordStrenght.missingCapital];
    }
    if (!intersectionOfStrings(password, specialCharacters)){
        return [true, passwordStrenght.missingSpecialCharacter];
    }
    return [true, passwordStrenght.strong];
}

// console.log(intersectionOfStrings('abcdef', capitalLetters))

