import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Neweet = ({ neweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNeweet, setNewNeweet] = useState(neweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you want to delete this neweet")
        if (ok) {
            await dbService.doc(`Neweets/${neweetObj.id}`).delete();
            await storageService.refFromURL(neweetObj.attachmentUrl).delete();
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
        <div className="nweet">
            {editing ? (
                <>
                    <form onSubmit={onSubmit} className="container nweetEdit">
                        <input
                            type="text"
                            placeholder="Edityour Neweet"
                            value={newNeweet}
                            required
                            autoFocus
                            onChange={onChange}
                            className="formInput"
                        />
                        <input type="submit" value="Update Nweet" className="formBtn" />
                    </form>
                    <span onClick={toggleEditing} className="formBtn cancelBtn">
                        Cancel
                    </span>
                </>
            ) : (
                    <>
                        <h4>{neweetObj.text}</h4>
                        {neweetObj.attachmentUrl && <img src={neweetObj.attachmentUrl} />}
                        {isOwner && (
                            <div class="nweet__actions">
                                <span onClick={onDeleteClick}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </span>
                                <span onClick={toggleEditing}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </span>
                            </div>
                        )}
                    </>
                )}
        </div>
    )
}

export default Neweet;