import { useEffect, useState } from "react";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";


function Groups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");

  // Fetch groups for logged-in user
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "groups"),
      where("ownerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userGroups = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGroups(userGroups);
    });

    return unsubscribe;
  }, [user]);

  const handleCreateGroup = async () => {
    if (groupName.trim() === "") {
      alert("Group name cannot be empty");
      return;
    }

    await addDoc(collection(db, "groups"), {
      name: groupName,
      members: 1,
      ownerId: user.uid,
      createdAt: serverTimestamp(),
    });

    setGroupName("");
  };

  return (
    <div>
      <h2>Your Groups</h2>

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

      {groups.length === 0 ? (
        <p>No groups yet.</p>
      ) : (
        <ul>
  {groups.map((group) => (
    <li key={group.id} style={{ marginBottom: "10px" }}>
      <Link to={`/groups/${group.id}`}>
        <strong>{group.name}</strong>
      </Link>
      <div>{group.members} members</div>
    </li>
  ))}
</ul>

      )}
    </div>
  );
}

export default Groups;
