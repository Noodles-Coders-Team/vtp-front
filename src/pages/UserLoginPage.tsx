import Card from "@commonComponents/Card.tsx";
import {Column, Row} from "@commonComponents/Container.tsx";
import {useState} from "react";
import type {UserSignInDto, UserSignUpDto} from "@nct/vtp-common";
import {InputComponent} from "@commonComponents/InputComponent.tsx";
import {authClientSignIn, authClientSignUp} from "@api/AuthApi.ts";
import {appDisplayStyle} from "@/style/appDisplayStyle.ts";
import Button from "@commonComponents/Button.tsx";
import {ButtonType} from "@/enum/ButtonType.ts";


const emptySignIn: UserSignInDto = {callbackURL: "", email: "", password: "", rememberMe: true};
const emptySignUp: UserSignUpDto = {callbackURL: "", email: "", name: "", password: ""};


export default function UserLoginPage() {
    const [isSignIn, setIsSignIn] = useState(true);
    const [isErrorLogin, setIsErrorLogin] = useState<boolean>(false);
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
        authClientSignIn(userSignIn)
            .then((result) => setIsErrorLogin(!result));
    };


    const signUp = () => {
        authClientSignUp(userSignUp)
            .then((result) => setIsErrorLogin(!result));
    };


    return (
        <div style={appDisplayStyle}>
            {isSignIn &&
                <Card title="Sign In" style={{width: '20%'}}>
                    <Row>
                        <Column>
                            <h2>Sign In</h2>
                            {isErrorLogin && <p style={{color: "red"}}>ERROR OCCURRED WHILE SIGNING IN</p>}
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
                            <Button label="Sign In" type={ButtonType.PRIMARY} onClick={signIn} style={{margin: 10}}/>
                        </Column>
                        <Column>
                            <Button label="Sign Up?" type={ButtonType.INFO} onClick={switchToSignUp}
                                    style={{margin: 10}}/>
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
                            {isErrorLogin && <p style={{color: "red"}}>ERROR OCCURRED WHILE SIGNING UP</p>}
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
                            <Button label="Sign Up" type={ButtonType.PRIMARY} onClick={signUp} style={{margin: 10}}/>
                        </Column>
                        <Column>
                            <Button label="Sign In?" type={ButtonType.INFO} onClick={switchToSignIn}
                                    style={{margin: 10}}/>
                        </Column>
                    </Row>
                </Card>
            }
        </div>
    )
}