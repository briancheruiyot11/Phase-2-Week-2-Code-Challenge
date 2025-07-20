const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/goals";

// Fetch all goals
export const fetchGoals = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch goals");
  return await res.json();
};

// Create new goal
export const createGoal = async (goalData) => {
  const newGoal = {
    ...goalData,
    savedAmount: 0,
    createdAt: new Date().toISOString().split("T")[0],
  };
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newGoal),
  });
  if (!res.ok) throw new Error("Failed to create goal");
  return await res.json();
};

// Update goal
export const updateGoal = async (id, goalData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(goalData),
  });
  if (!res.ok) throw new Error("Failed to update goal");
  return await res.json();
};

// Delete goal
export const deleteGoal = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete goal");
  return true;
};

// Make deposit
export const makeDeposit = async (goalId, amount) => {
  const existingGoal = await fetch(`${API_URL}/${goalId}`).then((res) => res.json());
  const updatedGoal = {
    ...existingGoal,
    savedAmount: existingGoal.savedAmount + amount,
  };
  return updateGoal(goalId, updatedGoal);
};
