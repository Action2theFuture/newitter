import Neweet from "components/Neweet";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid"
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
    const [neweet, setNeweet] = useState("");
    const [neweets, setNeweets] = useState([]);
    const [attachment, setAttachment] = useState("");
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
        let attachmentUrl = "";
        if (attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const neweetObj = {
            text: neweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        };
        await dbService.collection("Neweets").add(neweetObj);
        setNeweet("");
        setAttachment("");
    };
    const onChange = (event) => {
        const { target: { value }, } = event;
        setNeweet(value);
    };
    const onFileChange = (event) => {
        const { target: { files }, } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result } } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }
    const onClearAttachment = () => setAttachment(null);
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={neweet} onChange={onChange} type="text" placeholder="What is your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Neweet" />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
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