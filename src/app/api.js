const API_URL = "https://smart-goal-app-api.onrender.com/goals";

// Fetch all goals
export const fetchGoals = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch goals");
  return res.json();
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
  return res.json();
};

// Update goal
export const updateGoal = async (id, goalData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(goalData),
  });

  if (!res.ok) throw new Error("Failed to update goal");
  return res.json();
};

// Delete goal
export const deleteGoal = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete goal");
  return true;
};

// Make deposit
export const makeDeposit = async (goalId, amount) => {
  const currentGoalRes = await fetch(`${API_URL}/${goalId}`);
  if (!currentGoalRes.ok) throw new Error("Failed to fetch goal for deposit");

  const currentGoal = await currentGoalRes.json();
  const updatedGoal = {
    ...currentGoal,
    savedAmount: currentGoal.savedAmount + amount,
  };

  return updateGoal(goalId, updatedGoal);
};
