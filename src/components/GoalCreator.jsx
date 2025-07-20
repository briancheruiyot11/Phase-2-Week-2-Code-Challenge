import React from "react";
import { useState } from "react";

// Goal categories
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


export default function GoalCreator({ onGoalCreated, onCancel }) {
  
   // Set up form state and errors
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    category: CATEGORIES[0],
    deadline: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle changes for each input field
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Goal name is required";
    }

    const amount = parseFloat(formData.targetAmount);
    if (isNaN(amount) || amount <= 0) {
      newErrors.targetAmount = "Please enter a valid amount";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Please enter a deadline";
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isNaN(deadlineDate.getTime())) {
        newErrors.deadline = "Please enter a valid date";
      } else if (deadlineDate < today) {
        newErrors.deadline = "Deadline must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onGoalCreated({
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        category: formData.category,
        deadline: formData.deadline,
      });

      // Clear form after successful creation
      setFormData({
        name: "",
        targetAmount: "",
        category: CATEGORIES[0],
        deadline: "",
      });
    } catch (error) {
      console.error("Error creating goal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="goal-creator">
      <h2>Create New Goal</h2>

      <form onSubmit={handleSubmit} className="goal-form">
        {/* Goal Name Field */}
        <div className="form-group">
          <label htmlFor="name">Goal Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g., Travel Fund, New Car"
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Target Amount Field */}
        <div className="form-group">
          <label htmlFor="targetAmount">Target Amount</label>
          <div className="amount-input">
            <span className="currency-label">KES</span>
            <input
              type="number"
              id="targetAmount"
              value={formData.targetAmount}
              onChange={(e) =>
                handleInputChange("targetAmount", e.target.value)
              }
              placeholder="0"
              min="0"
              step="0.01"
              className={errors.targetAmount ? "error" : ""}
            />
          </div>
          {errors.targetAmount && (
            <span className="error-text">{errors.targetAmount}</span>
          )}
        </div>

        {/* Category Selector */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Deadline */}
        <div className="form-group">
          <label htmlFor="deadline">Deadline</label>
          <input
            type="date"
            id="deadline"
            value={formData.deadline}
            onChange={(e) => handleInputChange("deadline", e.target.value)}
            className={errors.deadline ? "error" : ""}
          />
          {errors.deadline && (
            <span className="error-text">{errors.deadline}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="button-group">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Goal"}
          </button>
        </div>
      </form>
    </div>
  );
}
