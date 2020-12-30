import { authService, dbService } from "fbase";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default ({ userObj }) => {
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
    const getMyNeweets = async () => {
        const neweets = await dbService.collection("neweets").orderBy("createdAt").where("creatorId", "==", userObj.uid).get();
        console.log(neweets)
    }
    useEffect(() => {
        getMyNeweets();
    }, [])
    return (
        <>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};