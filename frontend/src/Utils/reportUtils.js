// src/Utils/reportUtils.js

export const reportActionButtons = (onRegenerate, onDownload, onDelete, onView) => [
    (row) => (
        <button 
            key="view" 
            className="action-btn view-btn"
            onClick={() => onView(row.id)}
            style={{
                padding: '6px 12px',
                margin: '0 2px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#007bff',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px'
            }}
        >
            View
        </button>
    ),
    (row) => (
        <button 
            key="download" 
            className="action-btn download-btn"
            onClick={() => onDownload(row.id)}
            style={{
                padding: '6px 12px',
                margin: '0 2px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#28a745',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px'
            }}
        >
            Download
        </button>
    ),
    (row) => (
        <button 
            key="regenerate" 
            className="action-btn regenerate-btn"
            onClick={() => onRegenerate(row.query)}
            style={{
                padding: '6px 12px',
                margin: '0 2px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#ffc107',
                color: '#212529',
                cursor: 'pointer',
                fontSize: '12px'
            }}
        >
            Regenerate
        </button>
    ),
    (row) => (
        <button
            key="delete"
            className="action-btn delete-btn"
            onClick={() => onDelete(row.id)}
            style={{
                padding: '6px 12px',
                margin: '0 2px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#dc3545',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px'
            }}
        >
            Delete
        </button>
    )
];