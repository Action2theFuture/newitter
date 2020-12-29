import Neweet from "components/Neweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
    const [neweet, setNeweet] = useState("");
    const [neweets, setNeweets] = useState([]);
    // const getNeweets = async () => {
    //     const dbNeweets = await dbService.collection("Neweets").get();
    //     dbNeweets.forEach((document) => {
    //         const neweetObject = {
    //             ...document.data(),
    //             id: document.id
    //         };
    //         setNeweets((prev) => [neweetObject, ...prev]);
    //     });
    // };

    // the old way

    useEffect(() => {
        // getNeweets(); <<< using snapshot instead
        dbService.collection("Neweets").onSnapshot((snapshot) => {
            const neweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setNeweets(neweetArray);
        });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("Neweets").add({
            text: neweet,
            createdAt: Date.now(),
            creatorId: userObj.uid
        });
        setNeweet("");
    };
    const onChange = (event) => {
        const { target: { value }, } = event;
        setNeweet(value);
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={neweet} onChange={onChange} type="text" placeholder="What is your mind?" maxLength={120} />
                <input type="submit" value="Neweet" />
            </form>
            <div>
                {neweets.map((neweet) => (
                    <Neweet key={neweet.id} neweetObj={neweet} isOwner={neweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    )
}


export default Home;