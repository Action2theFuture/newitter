import Neweet from "components/Neweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import NeweetFactory from "components/NeweetFactory";

const Home = ({ userObj }) => {
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
    return (
        <div className="container">
            <NeweetFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {neweets.map((neweet) => (
                    <Neweet key={neweet.id} neweetObj={neweet} isOwner={neweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    )
}


export default Home;