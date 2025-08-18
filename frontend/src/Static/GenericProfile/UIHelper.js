import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Table from "../../View/Components/Tables/Table";

export const ActionButtons = ({ onEdit, onDelete }) => [
  (row) => (
    <button 
      onClick={() => onEdit(row)} 
      className="edit-btn" 
      title="Edit"
      key={`edit-${row.id}`}
    >
      <FontAwesomeIcon icon={faPenToSquare} />
    </button>
  ),
  (row) => (
    <button 
      onClick={() => onDelete(row)} 
      className="delete-btn" 
      title="Delete"
      key={`delete-${row.id}`}
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
  ),
];

export const SummaryCards = ({ data, colorScheme }) => (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
    gap: '1rem', 
    marginBottom: '2rem' 
  }}>
    {data.map((item, index) => (
      <div key={index} style={{ 
        background: colorScheme[index % colorScheme.length], 
        padding: '1.5rem', 
        borderRadius: '8px', 
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', fontWeight: '700' }}>{item.value}</div>
        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>{item.label}</div>
      </div>
    ))}
  </div>
);

export const TableSection = ({ title, description, data, actionButtons, customColumns, children,onAddClick }) => (
  <div style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '8px' }}>
    <div style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>{title}</h3>
      {description && (
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{description}</p>
      )}
    </div>
    {children}
    <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <Table
        data={data || []}
        showAddButton
        actionButtons={actionButtons}
        customColumns={customColumns}
        onAddClick={onAddClick}
      />
    </div>
  </div>
);