import { authService } from "fbase";
import React, { useState } from "react";

const Auth= () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const onChange = (event) => {
        const {target : {name, value}} = event;
        if(name === "email"){
            setEmail(value);
        }   else if (name === "password") {
                setPassword(value);
        }
    };
    const onSubmit = async(event) => {
        event.preventDefault();
        try {
            let data
            if (newAccount) {
                data = await authService.createUserWithEmailAndPassword(email, password);
                // create account
            } else {
                data = await authService.signInWithEmailAndPassword(email, password);
                // log in
            }
            console.log(data)
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="email" placeholder="Email" required value={email} onChange={onChange} />
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange} />
                <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
            </form>
            <div>
                <button>Continue With Google</button>
                <button>Continue With Github</button>
            </div>
        </div>
    )
};

export default Auth;