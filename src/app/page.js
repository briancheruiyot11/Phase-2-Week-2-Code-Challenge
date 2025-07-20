'use client';
import React, { useState, useEffect } from "react";
import GoalSummary from "../components/GoalSummary";
import GoalDisplay from "../components/GoalDisplay";
import GoalCreator from "../components/GoalCreator";
import {
  fetchGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  makeDeposit,
} from "./api";
import "./globals.css";

// State for managing goals, loading, errors, and goal creation toggle
export default function Home() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreator, setShowCreator] = useState(false);

  // Load goals when component mounts
  useEffect(() => {
    loadGoals();
  }, []);

  // Fetch goals from backend
  const loadGoals = async () => {
    try {
      setLoading(true);
      setError("");
      const goalsData = await fetchGoals();
      setGoals(goalsData);
    } catch (err) {
      console.error("Error loading goals:", err);
      setError("Failed to load goals. Make sure json-server is running on port 3001.");
    } finally {
      setLoading(false);
    }
  };

  // Handle creation of a new goal
  const handleCreateGoal = async (goalData) => {
    try {
      const newGoal = await createGoal(goalData);
      setGoals((prev) => [...prev, newGoal]);
      setShowCreator(false);
    } catch (err) {
      console.error("Error creating goal:", err);
    }
  };

  // Handle updating an existing goal
  const handleUpdateGoal = async (id, goalData) => {
    try {
      const updatedGoal = await updateGoal(id, goalData);
      setGoals((prev) =>
        prev.map((goal) => (goal.id === id ? updatedGoal : goal))
      );
    } catch (err) {
      console.error("Error updating goal:", err);
    }
  };

  // Handle deleting a goal
  const handleDeleteGoal = async (id) => {
    try {
      await deleteGoal(id);
      setGoals((prev) => prev.filter((goal) => goal.id !== id));
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };

  // Handle making a deposit to a goal
  const handleMakeDeposit = async (goalId, amount) => {
    try {
      const updatedGoal = await makeDeposit(goalId, amount);
      setGoals((prev) =>
        prev.map((goal) => (goal.id === goalId ? updatedGoal : goal))
      );
    } catch (err) {
      console.error("Error making deposit:", err);
    }
  };

  // Show loading message 
  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <h2>Loading goals...</h2>
          <p>
            Make sure json-server is running: <code>npm run server</code>
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadGoals}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main app layout
  return (
    <div className="app">
      <header className="app-header">
        <h1>Smart Goal Planner</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreator(!showCreator)}
        >
          {showCreator ? "Cancel" : "Add New Goal"}
        </button>
      </header>

      <main className="app-main">
        <GoalSummary goals={goals} />

        {showCreator && (
          <GoalCreator
            onGoalCreated={handleCreateGoal}
            onCancel={() => setShowCreator(false)}
          />
        )}

        <GoalDisplay
          goals={goals}
          onGoalUpdate={handleUpdateGoal}
          onGoalDelete={handleDeleteGoal}
          onMakeDeposit={handleMakeDeposit}
        />
      </main>
    </div>
  );
}
