import {createAuthClient} from "better-auth/react";
import type {UserSignInDto, UserSignUpDto} from "@nct/vtp-common";


export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});


export async function authClientSignUp(user: UserSignUpDto): Promise<boolean> {
    const {data, error} = await authClient.signUp.email({...user});
    return !error;
}


export async function authClientSignIn(user: UserSignInDto): Promise<boolean> {
    const {data, error} = await authClient.signIn.email({...user});
    return !error;
}


export async function authClientSignOut(): Promise<void> {
    await authClient.signOut();
}