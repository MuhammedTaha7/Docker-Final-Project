import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import BaseList from './BaseList';
import BaseCard from './BaseCard';
import './RequestsList.css';

const RequestsList = ({ requests }) => {
  const headerActions = (
    <button className="btn-new">New Request</button>
  );

  const renderRequestItem = (request) => {
    const getStatusBadgeClass = (status) => {
      switch (status) {
        case "pending":
          return "status-badge-pending";
        case "approved":
          return "status-badge-approved";
        case "completed":
          return "status-badge-completed";
        case "rejected":
          return "status-badge-rejected";
        default:
          return "status-badge-pending";
      }
    };

    const requestActions = (
      <div className="request-actions">
        {request.status === "pending" && (
          <>
            <button className="action-approve" title="Approve">
              <CheckCircle />
            </button>
            <button className="action-reject" title="Reject">
              <XCircle />
            </button>
          </>
        )}
      </div>
    );

    return (
      <BaseCard
        className="request-item-card"
        headerActions={requestActions}
      >
        <div className="request-content">
          <div className="request-title-row">
            <h4 className="request-title">{request.type}</h4>
            <span className={getStatusBadgeClass(request.status)}>
              {request.status}
            </span>
            {request.priority === "high" && (
              <AlertTriangle className="priority-icon" />
            )}
          </div>
          {request.course && (
            <p className="request-course">
              Course: {request.course}
            </p>
          )}
          <p className="request-date">
            Submitted: {new Date(request.date).toLocaleDateString()}
          </p>
        </div>
      </BaseCard>
    );
  };

  return (
    <BaseList
      title="Student Requests"
      items={requests}
      renderItem={renderRequestItem}
      headerActions={headerActions}
      className="requests-list"
      emptyMessage="No requests found"
    />
  );
};

export default RequestsList;