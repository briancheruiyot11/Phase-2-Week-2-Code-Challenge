// Import the db.json data directly for now
import db from "./db.json";

// Create a copy of goals to simulate database changes
let goals = [...db.goals];

// Fetch all goals
export const fetchGoals = async () => {
  return goals;
};

// Create new goal
export const createGoal = async (goalData) => {
  const newGoal = {
    ...goalData,
    id: Date.now().toString(),
    savedAmount: 0,
    createdAt: new Date().toISOString().split("T")[0],
  };
  goals.push(newGoal);
  return newGoal;
};

// Update goal
export const updateGoal = async (id, goalData) => {
  goals = goals.map((goal) =>
    goal.id === id ? { ...goal, ...goalData } : goal
  );
  return goals.find((goal) => goal.id === id);
};

// Delete goal
export const deleteGoal = async (id) => {
  goals = goals.filter((goal) => goal.id !== id);
  return true;
};

// Make deposit
export const makeDeposit = async (goalId, amount) => {
  goals = goals.map((goal) => {
    if (goal.id === goalId) {
      return { ...goal, savedAmount: goal.savedAmount + amount };
    }
    return goal;
  });
  return goals.find((goal) => goal.id === goalId);
};
