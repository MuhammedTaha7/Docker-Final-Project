import React from 'react';

const Card = () => {
  const styles = {
    card: {
      width: '240px',
      height: '320px',
      backgroundColor: '#1f2937', // bg-neutral-800
      borderRadius: '15px',
      color: '#d1d5db', // text-neutral-300
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '2px',
      transition: 'box-shadow 0.3s, background-color 0.3s',
      cursor: 'pointer',
    },
    image: {
      width: '208px',
      height: '160px',
      backgroundColor: '#8d8cf6', // bg-sky-300
      borderRadius: '1rem',
    },
    title: {
      fontWeight: '800',
      marginBottom: '0.25rem',
    },
    description: {
      fontSize: '0.9rem',
    },
    button: {
      backgroundColor: '#8d8cf6', // bg-sky-700
      fontWeight: '800',
      padding: '0.5rem 1.5rem',
      borderRadius: '0.75rem',
      color: 'white',
      border: 'none',
      transition: 'background-color 0.3s',
    },
  };

  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#111827'; // hover:bg-gray-900
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(56, 189, 248, 0.4)'; // hover:shadow-sky-400
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#1f2937';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={styles.image}></div>
      <div>
        <p style={styles.title}>Card title</p>
        <p style={styles.description}>4 popular types of cards in UI design.</p>
      </div>
      <button
        style={styles.button}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0284c7')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0369a1')}
      >
        See more
      </button>
    </div>
  );
};

export default Card;