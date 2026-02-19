export function calculateBalances(expenses, members) {
  const balances = {};

  // Initialize balances
  members.forEach((memberId) => {
    balances[memberId] = 0;
  });

  expenses.forEach((expense) => {
    if (expense.splitType === "equal") {
      const splitAmount = expense.amount / members.length;

      members.forEach((memberId) => {
        balances[memberId] -= splitAmount;
      });

      balances[expense.paidBy] += expense.amount;
    }

    if (expense.splitType === "percentage") {
      Object.entries(expense.splits).forEach(([memberId, percent]) => {
        const share = (expense.amount * percent) / 100;
        balances[memberId] -= share;
      });

      balances[expense.paidBy] += expense.amount;
    }
  });

  return balances;
}