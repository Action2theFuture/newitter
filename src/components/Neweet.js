import { dbService } from "fbase";
import React, { useState } from "react";

const Neweet = ({ neweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNeweet, setNewNeweet] = useState(neweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you want to delete this neweet")
        if (ok) {
            await dbService.doc(`Neweets/${neweetObj.id}`).delete();
            //delete neweet
        }
    }
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`Neweets/${neweetObj.id}`).update({
            text: newNeweet
        });
        setEditing(false);
    }
    const onChange = (event) => {
        const { target: { value }, } = event;
        setNewNeweet(value);
    };
    return (
        <div >
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            placeholder="Edityour Neweet"
                            value={newNeweet}
                            required
                            onChange={onChange}
                        />
                        <input type="submit" value="Update Neweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancle</button>
                </>
            ) : (
                    <>
                        <h4>{neweetObj.text}</h4>
                        {isOwner && (
                            <>
                                <button onClick={onDeleteClick}>Delete Neweet</button>
                                <button onClick={toggleEditing}>Edit Neweet</button>
                            </>
                        )}
                    </>
                )}
        </div>
    )
}

export default Neweet;