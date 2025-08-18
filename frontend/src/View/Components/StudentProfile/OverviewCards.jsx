// Components/Profile/OverviewCards.jsx
import React from 'react';
import { TrendingUp } from 'lucide-react';
import BaseCard from './BaseCard';
import './OverviewCards.css';

const OverviewCards = ({ 
  statsCards, 
  showProgressCard = true, 
  progressData,
  entityType = "student",
  className = "",
  cardClassName = "",
  onCardClick
}) => {
  // Generate progress data based on entity type
  const generateProgressData = () => {
    if (entityType === "student") {
      return {
        title: "Academic Progress",
        items: [
          {
            label: "Degree Progress",
            value: "71%",
            percentage: 71,
            barColor: "blue"
          },
          {
            label: "GPA Trend",
            value: "+0.12",
            percentage: 85,
            barColor: "green",
            showTrend: true
          }
        ]
      };
    } else {
      return {
        title: "Teaching Performance",
        items: [
          {
            label: "Course Load",
            value: "85%",
            percentage: 85,
            barColor: "blue"
          },
          {
            label: "Rating Trend",
            value: "+0.3",
            percentage: 92,
            barColor: "green",
            showTrend: true
          }
        ]
      };
    }
  };

  const progressInfo = progressData || generateProgressData();

  // Handle card clicks
  const handleCardClick = (card, index) => {
    if (onCardClick) {
      onCardClick(card, index);
    }
  };

  return (
    <div className={`overview-cards-container ${className}`}>
      <div className="overview-cards-grid">
        {statsCards?.map((card, index) => (
          <BaseCard
            key={card.id || index}
            variant="gradient"
            className={`overview-stat-card ${cardClassName}`}
            gradient={card.gradient}
            onClick={() => handleCardClick(card, index)}
            style={{ cursor: onCardClick ? 'pointer' : 'default' }}
          >
            <div className="overview-card-content">
              <div className="overview-card-info">
                <p className="overview-card-label">{card.title}</p>
                <p className="overview-card-value">{card.value}</p>
              </div>
              <div className="overview-card-icon">
                {card.icon}
              </div>
            </div>
          </BaseCard>
        ))}
        
        {/* Progress Card */}
        {showProgressCard && (
          <BaseCard
            title={progressInfo.title}
            className={`progress-card ${cardClassName}`}
            icon={<div className="progress-icon-bar"></div>}
          >
            <div className="progress-items">
              {progressInfo.items.map((item, index) => (
                <div key={index} className="progress-item">
                  <div className="progress-header">
                    <span>{item.label}</span>
                    <span className={item.showTrend ? "progress-trend" : ""}>
                      {item.showTrend && <TrendingUp />}
                      {item.value}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill-${item.barColor}`} 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </BaseCard>
        )}
      </div>
    </div>
  );
};

export default OverviewCards;