import React, { useState } from "react";

export default function DepositBox({ goal, onDeposit, onCancel }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const remaining = goal.targetAmount - goal.savedAmount;

  // Format currency in Ksh
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle deposit form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const depositAmount = parseFloat(amount);

    if (isNaN(depositAmount) || depositAmount <= 0) {
      setError("Please enter a valid deposit amount.");
      return;
    }

    if (depositAmount > remaining) {
      setError(`Deposit exceeds remaining amount (${formatCurrency(remaining)}).`);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onDeposit(depositAmount);
      setAmount("");
    } catch (error) {
      setError("Failed to make deposit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="deposit-box">
      <h4>Make a Deposit</h4>
      <p className="goal-info">
        Goal: <strong>{goal.name}</strong>
      </p>
      <p className="remaining-info">
        {remaining > 0
          ? `${formatCurrency(remaining)} remaining to reach your goal`
          : "Goal already reached! You can still add more if you wish."}
      </p>

      <form onSubmit={handleSubmit} className="deposit-form">
        <div className="amount-input">
          <span className="currency-symbol">KES</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            placeholder="0"
            min="0"
            step="0.01"
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        {error && <div className="error-text">{error}</div>}

        <div className="deposit-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Deposit"}
          </button>
        </div>
      </form>
    </div>
  );
}
