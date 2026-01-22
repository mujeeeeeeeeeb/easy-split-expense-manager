import { calculateBalances } from "../utils/balanceCalculator";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

function GroupDetails() {
  const { groupId } = useParams();
  const { user } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const members = user ? [user.uid] : [];
  const balances =
    members.length > 0 ? calculateBalances(expenses, members) : {};

  // Fetch expenses
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

    await addDoc(collection(db, "groups", groupId, "expenses"), {
      title,
      amount: Number(amount),
      paidBy: user.uid,
      splitType: "equal",
      createdAt: serverTimestamp(),
    });

    setTitle("");
    setAmount("");
  };

  const handleAddMember = async () => {
    if (!memberEmail) {
      alert("Enter member email");
      return;
    }

    alert(
      "Member adding logic placeholder.\n" +
      "Next step we will link email → UID properly."
    );

    setMemberEmail("");
  };

  return (
    <div>
      <h2>Group Expenses</h2>

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
            {memberId === user?.uid ? "You" : memberId}
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
