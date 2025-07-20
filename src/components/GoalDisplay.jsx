"use client";
import React from "react";
import { useState } from "react";
import SingleGoalCard from "./SingleGoalCard";

// Categories users can filter goals
const CATEGORIES = [
  "Travel",
  "Emergency",
  "Electronics",
  "Real Estate",
  "Vehicle",
  "Education",
  "Shopping",
  "Retirement",
  "Home",
  "Other",
];

export default function GoalDisplay({
  goals,
  onGoalUpdate,
  onGoalDelete,
  onMakeDeposit,
}) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("deadline");

  // Filter goals by category
  const filteredGoals = selectedCategory
    ? goals.filter((goal) => goal.category === selectedCategory)
    : goals;

  // Sort goals
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    switch (sortBy) {
      case "deadline":
        return new Date(a.deadline) - new Date(b.deadline);
      case "progress":
        const progressA = a.savedAmount / a.targetAmount;
        const progressB = b.savedAmount / b.targetAmount;
        return progressB - progressA;
      case "amount":
        return b.targetAmount - a.targetAmount;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="goal-display">
      <div className="goal-controls">
        <div className="filter-group">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="sort-group">
          <label htmlFor="sort-by">Sort by:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="deadline">Deadline</option>
            <option value="progress">Progress</option>
            <option value="amount">Target Amount</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div className="goals-grid">
        {sortedGoals.length > 0 ? (
          sortedGoals.map((goal) => (
            <SingleGoalCard
              key={goal.id}
              goal={goal}
              onUpdate={onGoalUpdate}
              onDelete={onGoalDelete}
              onMakeDeposit={onMakeDeposit}
            />
          ))
        ) : (
          <div className="empty-state">
            <p>
              {selectedCategory
                ? `No goals found in the ${selectedCategory} category.`
                : "You don't have any goals yet. Create your first goal!"}
            </p>
            {selectedCategory && (
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedCategory("")}
              >
                Clear Filter
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
