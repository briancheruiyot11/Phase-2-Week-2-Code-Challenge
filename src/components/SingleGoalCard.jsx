import React from "react"; 
import { useState } from "react";
import DepositBox from "./DepositBox";

export default function SingleGoalCard({
  goal,
  onUpdate,
  onDelete,
  onMakeDeposit,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [editData, setEditData] = useState({
    name: goal.name,
    targetAmount: goal.targetAmount,
    category: goal.category,
    deadline: goal.deadline,
  });

  // Calculate goal status
  const progress = goal.savedAmount / goal.targetAmount;
  const remaining = goal.targetAmount - goal.savedAmount;
  const today = new Date();
  const deadline = new Date(goal.deadline);
  const isCompleted = goal.savedAmount >= goal.targetAmount;
  const isOverdue = deadline < today && !isCompleted;
  const timeDiff = deadline.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const isNearDeadline = daysLeft <= 30 && daysLeft > 0 && !isCompleted;

  // Format currency into Ksh
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get status class and text based on the goal status
  const getStatusInfo = () => {
    if (isCompleted) {
      return { class: "completed", text: "Completed" };
    } else if (isOverdue) {
      return { class: "overdue", text: "Overdue" };
    } else if (isNearDeadline) {
      return { class: "near-deadline", text: `${daysLeft} days left` };
    } else if (daysLeft > 0) {
      return { class: "on-track", text: `${daysLeft} days left` };
    }
    return { class: "", text: "" };
  };

  const statusInfo = getStatusInfo();

   // Enter edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Save changes after editing
  const handleSaveEdit = async () => {
    try {
      await onUpdate(goal.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  // Cancel editing and return changes
  const handleCancelEdit = () => {
    setEditData({
      name: goal.name,
      targetAmount: goal.targetAmount,
      category: goal.category,
      deadline: goal.deadline,
    });
    setIsEditing(false);
  };

  // Delete and confirm goal
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await onDelete(goal.id);
      } catch (error) {
        console.error("Error deleting goal:", error);
      }
    }
  };

  // Handle a new deposit
  const handleDeposit = async (amount) => {
    try {
      await onMakeDeposit(goal.id, amount);
      setShowDeposit(false);
    } catch (error) {
      console.error("Error making deposit:", error);
    }
  };

  if (isEditing) {
    return (
      <div className="goal-card editing">
        <div className="edit-form">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            placeholder="Goal name"
          />
          <input
            type="number"
            value={editData.targetAmount}
            onChange={(e) =>
              setEditData({
                ...editData,
                targetAmount: parseFloat(e.target.value),
              })
            }
            placeholder="Target amount"
            min="0"
            step="0.01"
          />
          <select
            value={editData.category}
            onChange={(e) =>
              setEditData({ ...editData, category: e.target.value })
            }
          >
            <option value="Travel">Travel</option>
            <option value="Emergency">Emergency</option>
            <option value="Electronics">Electronics</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Education">Education</option>
            <option value="Shopping">Shopping</option>
            <option value="Retirement">Retirement</option>
            <option value="Home">Home</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="date"
            value={editData.deadline}
            onChange={(e) =>
              setEditData({ ...editData, deadline: e.target.value })
            }
          />
          <div className="edit-buttons">
            <button className="btn btn-primary" onClick={handleSaveEdit}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`goal-card ${statusInfo.class}`}>
      <div className="goal-header">
        <h3 className="goal-name">{goal.name}</h3>
        <span className="goal-category">{goal.category}</span>
      </div>

      <div className="goal-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          ></div>
        </div>
        <div className="progress-text">
          <span className="saved">{formatCurrency(goal.savedAmount)}</span>
          <span className="target">of {formatCurrency(goal.targetAmount)}</span>
        </div>
        {!isCompleted && (
          <div className="remaining">{formatCurrency(remaining)} remaining</div>
        )}
      </div>

      <div className="goal-details">
        <div className="detail-row">
          <span>Deadline:</span>
          <span>{goal.deadline}</span>
        </div>
        {statusInfo.text && (
          <div className={`status ${statusInfo.class}`}>{statusInfo.text}</div>
        )}
      </div>

      <div className="goal-actions">
        {!isCompleted && (
          <button
            className="btn btn-primary"
            onClick={() => setShowDeposit(!showDeposit)}
          >
            Make Deposit
          </button>
        )}
        <button className="btn btn-secondary" onClick={handleEdit}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>

      {showDeposit && (
        <DepositBox
          goal={goal}
          onDeposit={handleDeposit}
          onCancel={() => setShowDeposit(false)}
        />
      )}
    </div>
  );
}
