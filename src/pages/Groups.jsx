import { useState } from "react";
function Groups(){
    const [groups, setGroups] = useState([
        {id: 1, name: "Goa Trip", members: 4},
        {id: 2, name: "Roommates", members: 3},
        {id: 3, name: "Office Team", members: 6}
    ]);
    
    return(
        <div>
            <h2>Your Groups</h2>
            <button style={{ marginBottom:"15px"}}>
                + Create Group
            </button>
            {groups.length === 0 ? (
                <p>No groups yet.</p>
            ) : (
                <ul>
                    {groups.map(group =>(
                        <li key={group.id} style={{ marginBottom: "10px"}}>
                        <strong>{group.name}</strong>
                        <div>{group.members} members</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default Groups;