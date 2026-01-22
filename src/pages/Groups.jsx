import { useState } from "react";

function Groups() {
  const [groups, setGroups] = useState([
    { id: 1, name: "Goa Trip", members: 4 },
    { id: 2, name: "Roommates", members: 3 }
  ]);

  const [groupName, setGroupName] = useState("");

  function handleCreateGroup() {
    if (groupName.trim() === "") {
      alert("Group name cannot be empty");
      return;
    }

    const newGroup = {
      id: Date.now(),
      name: groupName,
      members: 1
    };

    setGroups([...groups, newGroup]);
    setGroupName("");
  }

  return (
    <div>
      <h2>Your Groups</h2>

      {/* Create Group Section */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <button onClick={handleCreateGroup} style={{ marginLeft: "10px" }}>
          Create Group
        </button>
      </div>

      {/* Groups List */}
      {groups.length === 0 ? (
        <p>No groups yet.</p>
      ) : (
        <ul>
          {groups.map((group) => (
            <li key={group.id} style={{ marginBottom: "10px" }}>
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
