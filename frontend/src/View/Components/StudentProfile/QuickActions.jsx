import React from 'react';
import { MessageSquare, Bell, CreditCard, XCircle } from 'lucide-react';
import './QuickActions.css';

const QuickActions = ({ show }) => {
  if (!show) return null;

  return (
    <div className="quick-actions">
      <h3>Quick Actions</h3>
      <div className="actions-list">
        <button className="action-item action-message">
          <MessageSquare />
          <span>Send Message</span>
        </button>
        <button className="action-item action-alert">
          <Bell />
          <span>Create Alert</span>
        </button>
        <button className="action-item action-financial">
          <CreditCard />
          <span>Financial Aid</span>
        </button>
        <button className="action-item action-item-danger">
          <XCircle />
          <span>Suspend Account</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;