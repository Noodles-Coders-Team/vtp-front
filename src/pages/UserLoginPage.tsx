import Card from "@commonComponents/Card.tsx";
import {Column, Row} from "@commonComponents/Container.tsx";
import {useState} from "react";
import type {UserSignInDto, UserSignUpDto} from "@nct/vtp-common";
import {InputComponent} from "@commonComponents/InputComponent.tsx";
import {authClientSignIn, authClientSignUp} from "@api/AuthApi.ts";
import {appDisplayStyle} from "@/style/appDisplayStyle.ts";


const emptySignIn: UserSignInDto = {callbackURL: "", email: "", password: "", rememberMe: true};
const emptySignUp: UserSignUpDto = {callbackURL: "", email: "", name: "", password: ""};


export default function UserLoginPage() {
    const [isSignIn, setIsSignIn] = useState(true);
    const [userSignIn, setUserSignIn] = useState<UserSignInDto>(emptySignIn);
    const [userSignUp, setUserSignUp] = useState<UserSignUpDto>(emptySignUp);


    const switchToSignIn = () => {
        setIsSignIn(true);
        setUserSignIn({...emptySignIn, email: userSignUp.email});
    };


    const switchToSignUp = () => {
        setIsSignIn(false);
        setUserSignUp({...emptySignUp, email: userSignIn.email});
    };


    const signIn = () => {
        authClientSignIn(userSignIn);
    };


    const signUp = () => {
        authClientSignUp(userSignUp);
    };


    return (
        <div style={appDisplayStyle}>
            {isSignIn &&
                <Card title="Sign In" style={{width: '20%'}}>
                    <Row>
                        <Column>
                            <h2>Sign In</h2>
                            <InputComponent id={"signInEmail"} label={"Email"} value={userSignIn.email} type={"email"}
                                            onChange={(value: string) => {
                                                setUserSignIn({...userSignIn, email: value});
                                            }}/>
                            <InputComponent id={"signInPassword"} label={"Password"} value={userSignIn.password}
                                            type={"password"}
                                            onChange={(value: string) => {
                                                setUserSignIn({...userSignIn, password: value});
                                            }}/>
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            <button onClick={signIn} className="btn btn-primary" style={{margin: 10}}>
                                Sign In
                            </button>
                        </Column>
                        <Column>
                            <button onClick={switchToSignUp} className="btn btn-info" style={{margin: 10}}>
                                Sign Up?
                            </button>
                        </Column>
                    </Row>
                </Card>
            }
            {
                !isSignIn &&
                <Card title="Sign Up" style={{width: '20%'}}>
                    <Row>
                        <Column>
                            <h2>Sign Up</h2>
                            <InputComponent id={"signUpName"} label={"User Name"} value={userSignUp.name}
                                            onChange={(value: string) => {
                                                setUserSignUp({...userSignUp, name: value});
                                            }}/>
                            <InputComponent id={"signUpEmail"} label={"Email"} value={userSignUp.email} type={"email"}
                                            onChange={(value: string) => {
                                                setUserSignUp({...userSignUp, email: value});
                                            }}/>
                            <InputComponent id={"signInPassword"} label={"Password"} value={userSignUp.password}
                                            type={"password"}
                                            onChange={(value: string) => {
                                                setUserSignUp({...userSignUp, password: value});
                                            }}/>
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            <button onClick={signUp} className="btn btn-primary" style={{margin: 10}}>
                                Sign Up
                            </button>
                        </Column>
                        <Column>
                            <button onClick={switchToSignIn} className="btn btn-info" style={{margin: 10}}>
                                Sign In?
                            </button>
                        </Column>
                    </Row>
                </Card>
            }
        </div>
    )
}