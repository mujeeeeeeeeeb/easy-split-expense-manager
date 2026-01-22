export function calculateBalances(expenses, members) {
  const balances = {};

  // Initialize balances
  members.forEach((memberId) => {
    balances[memberId] = 0;
  });

  expenses.forEach((expense) => {
    const splitAmount = expense.amount / members.length;

    members.forEach((memberId) => {
      // Everyone owes their share
      balances[memberId] -= splitAmount;
    });

    // Person who paid gets credited
    balances[expense.paidBy] += expense.amount;
  });

  return balances;
}
