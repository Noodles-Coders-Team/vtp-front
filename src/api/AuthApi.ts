import {createAuthClient} from "better-auth/react";
import type {UserSignInDto, UserSignUpDto} from "@nct/vtp-common";
import {adminClient} from "better-auth/client/plugins";


export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    plugins: [
        adminClient()
    ]
});


export async function authClientSignUp(user: UserSignUpDto): Promise<boolean> {
    const {data, error} = await authClient.signUp.email({...user});
    console.log(`Signed up as ${data?.user.name ?? "NONE"}`);
    return !error;
}


export async function authClientSignIn(user: UserSignInDto): Promise<boolean> {
    const {data, error} = await authClient.signIn.email({...user});
    console.log(`Signed in as ${data?.user.name ?? "NONE"}`);
    return !error;
}


export async function authClientSignOut(): Promise<void> {
    await authClient.signOut();
}