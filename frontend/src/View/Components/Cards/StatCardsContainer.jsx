import React from "react";
import StatCard from "./StatCard";
import { getColumnsForSize, getGapForSize } from "../../../Static/StatCardHelper";
import styles from "../../../CSS/Components/Cards/StatCardsContainer.module.css"; // ← CSS-Modules


/* כלי קטן לצירוף כיתות בלי ספרייה */
const cx = (...c) => c.filter(Boolean).join(" ");

const StatCardsContainer = ({
  cards,
  size = "default",          // 'compact' | 'default' | 'large' | 'xl'
  columns,                    // optional override
  gap,                        // optional override
  onCardClick,
  className = "",
}) => {
  /* קביעת עמודות וגאפ – אם לא הועברו מקבלים ברירת-מחדל מה-helper */
  const colCount = columns ?? getColumnsForSize(size);
  const gridGap  = gap     ?? getGapForSize(size);

  /* כיתה נוספת לפי גודל (ב־CSS-Modules) */
  const sizeClass = {
    compact: styles.compactContainer,
    large:   styles.largeContainer,
    xl:      styles.xlContainer,
  }[size] || "";

  const containerClasses = cx(
    styles.statCardsContainer,
    sizeClass,
    className
  );

  return (
    <div
      className={containerClasses}
      style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)`, gap: gridGap }}
    >
      {cards.map((card, idx) => (
        <StatCard
          key={card.id ?? idx}
          {...card}
          size={size}
          onClick={() => onCardClick?.(card, idx)}
        />
      ))}
    </div>
  );
};

export default StatCardsContainer;
