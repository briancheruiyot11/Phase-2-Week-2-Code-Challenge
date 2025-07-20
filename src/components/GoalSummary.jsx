import React from "react";

export default function GoalSummary({ goals }) {

  // Total number of goals
  const totalGoals = goals.length;

  // Sum of saved amounts of all goals listed
  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);

  // Total completed goals
  const completedGoals = goals.filter(
    (goal) => goal.savedAmount >= goal.targetAmount
  ).length;

  const today = new Date();

  //Total ovedue goals which are incomplete
  const overdueGoals = goals.filter((goal) => {
    const deadline = new Date(goal.deadline);
    const isCompleted = goal.savedAmount >= goal.targetAmount;
    return deadline < today && !isCompleted;
  }).length;

  // Counts goals with deadlines in the next 30 days and incomplete
  const nearDeadlineGoals = goals.filter((goal) => {
    const deadline = new Date(goal.deadline);
    const isCompleted = goal.savedAmount >= goal.targetAmount;
    const timeDiff = deadline.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft <= 30 && daysLeft > 0 && !isCompleted;
  }).length;

  // Format currency in Ksh
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="goal-summary">
      <h2>Overview</h2>

      <div className="summary-grid">
        <div className="summary-card primary">
          <div className="summary-value">{totalGoals}</div>
          <div className="summary-label">Total Goals</div>
        </div>

        <div className="summary-card secondary">
          <div className="summary-value">{formatCurrency(totalSaved)}</div>
          <div className="summary-label">Total Saved</div>
        </div>

        <div className="summary-card success">
          <div className="summary-value">{completedGoals}</div>
          <div className="summary-label">Completed</div>
        </div>

        <div className="summary-card danger">
          <div className="summary-value">{overdueGoals}</div>
          <div className="summary-label">Overdue</div>
        </div>
      </div>

      {nearDeadlineGoals > 0 && (
        <div className="warning-alert">
          <strong>⚠️ Warning:</strong> You have {nearDeadlineGoals} goal
          {nearDeadlineGoals > 1 ? "s" : ""} with deadline
          {nearDeadlineGoals > 1 ? "s" : ""} within 30 days!
        </div>
      )}

      {overdueGoals > 0 && (
        <div className="danger-alert">
          <strong>🚨 Alert:</strong> You have {overdueGoals} overdue goal
          {overdueGoals > 1 ? "s" : ""}!
        </div>
      )}
    </div>
  );
}
