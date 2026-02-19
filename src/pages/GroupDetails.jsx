import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { calculateBalances } from "../utils/balanceCalculator";

function GroupDetails() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const [splitType, setSplitType] = useState("equal");
const [percentageSplits, setPercentageSplits] = useState({});

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberProfiles, setMemberProfiles] = useState({});
  const members = group?.members || [];
  const balances =
    members.length > 0 ? calculateBalances(expenses, members) : {};

  // 🔄 Realtime group data (members)
  useEffect(() => {
    if (!groupId) return;

    const groupRef = doc(db, "groups", groupId);
    const unsubscribe = onSnapshot(groupRef, (snap) => {
      if (snap.exists()) {
        setGroup({ id: snap.id, ...snap.data() });
      }
    });

    return unsubscribe;
  }, [groupId]);
  
  useEffect(() => {
  if (!group || !group.members || group.members.length === 0) return;

  const fetchMemberProfiles = async () => {
    const profiles = {};

    const usersRef = collection(db, "users");

    // Fetch each member's profile
    for (const uid of group.members) {
      const q = query(usersRef, where("__name__", "==", uid));
      const snap = await getDocs(q);

      if (!snap.empty) {
        profiles[uid] = snap.docs[0].data();
      }
    }

    setMemberProfiles(profiles);
  };

  fetchMemberProfiles();
}, [group]);


  // 🔄 Realtime expenses
  useEffect(() => {
    if (!groupId) return;

    const expensesRef = collection(db, "groups", groupId, "expenses");
    const unsubscribe = onSnapshot(expensesRef, (snapshot) => {
      const expenseList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(expenseList);
    });

    return unsubscribe;
  }, [groupId]);

  const handleAddExpense = async () => {
  if (!title || !amount) {
    alert("Please enter title and amount");
    return;
  }

  if (splitType === "percentage") {
    const total = Object.values(percentageSplits).reduce(
      (sum, v) => sum + v,
      0
    );

    if (total !== 100) {
      alert("Percentages must add up to 100%");
      return;
    }
  }

  const expenseData = {
    title,
    amount: Number(amount),
    paidBy: user.uid,
    splitType,
    createdAt: serverTimestamp(),
  };

  if (splitType === "percentage") {
    expenseData.splits = percentageSplits;
  }

  await addDoc(collection(db, "groups", groupId, "expenses"), expenseData);

  setTitle("");
  setAmount("");
  setPercentageSplits({});
  setSplitType("equal");
};

  const handleAddMember = async () => {
    if (!memberEmail) {
      alert("Enter member email");
      return;
    }

    if (!group || !group.members) {
      alert("Group not loaded yet, try again");
      return;
    }

    // Find user by email
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", memberEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("User not found. Ask them to login once.");
      return;
    }

    const memberUid = querySnapshot.docs[0].id;

    if (group.members.includes(memberUid)) {
      alert("User already in group");
      return;
    }

    await updateDoc(doc(db, "groups", groupId), {
      members: arrayUnion(memberUid),
    });

    setMemberEmail("");
  };

  return (
    <div>
      <h2>Group Expenses</h2>

      <div>
  <label>
    <input
      type="radio"
      value="equal"
      checked={splitType === "equal"}
      onChange={() => setSplitType("equal")}
    />
    Equal split
  </label>

  <label style={{ marginLeft: "10px" }}>
    <input
      type="radio"
      value="percentage"
      checked={splitType === "percentage"}
      onChange={() => setSplitType("percentage")}
    />
    Percentage split
  </label>
</div>

{splitType === "percentage" && (
  <div style={{ marginTop: "10px" }}>
    {members.map((uid) => (
      <div key={uid}>
        <label>
          {uid === user.uid
            ? "You"
            : memberProfiles[uid]?.name || memberProfiles[uid]?.email}
        </label>
        <input
          type="number"
          placeholder="%"
          value={percentageSplits[uid] || ""}
          onChange={(e) =>
            setPercentageSplits({
              ...percentageSplits,
              [uid]: Number(e.target.value),
            })
          }
          style={{ marginLeft: "10px", width: "60px" }}
        />
      </div>
    ))}
  </div>
)}
      {/* Add Expense */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Expense title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <button onClick={handleAddExpense} style={{ marginLeft: "10px" }}>
          Add Expense
        </button>
      </div>

      {/* Add Member */}
      <h3>Add Member</h3>
      <input
        type="email"
        placeholder="Enter member email"
        value={memberEmail}
        onChange={(e) => setMemberEmail(e.target.value)}
      />
      <button onClick={handleAddMember} style={{ marginLeft: "10px" }}>
        Add Member
      </button>

        {/* Members List */}

      <h3>Members</h3>

<ul>
  {members.map((uid) => (
    <li key={uid}>
      {uid === user?.uid
        ? "You"
        : memberProfiles[uid]?.name || memberProfiles[uid]?.email || uid}
    </li>
  ))}
</ul>


      {/* Expenses */}
      {expenses.length === 0 ? (
        <p>No expenses yet.</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              <strong>{expense.title}</strong> — ₹{expense.amount}
            </li>
          ))}
        </ul>
      )}

      {/* Balances */}
      <h3>Balances</h3>
      <ul>
        {Object.entries(balances).map(([memberId, balance]) => (
          <li key={memberId}>
            {memberId === user?.uid
  ? "You"
  : memberProfiles[memberId]?.name || memberProfiles[memberId]?.email}
            {balance > 0 && ` gets ₹${balance}`}
            {balance < 0 && ` owes ₹${Math.abs(balance)}`}
            {balance === 0 && " settled"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupDetails;
