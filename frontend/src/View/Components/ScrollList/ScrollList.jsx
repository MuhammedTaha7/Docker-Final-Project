import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import styles from './ScrollList.module.css';

const ScrollList = ({
  title = "Items",
  subtitle,
  items = [],
  renderItem,
  onItemClick,
  onAddNew,
  searchFields = ['title'],
  filters = [],
  showSearch = true,
  showFilters = true,
  showStats = true,
  layout = 'grid', // 'grid' or 'list'
  emptyState = {},
  headerActions = [],
  stats = [],
  className = '',
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter and search items
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Apply search
    if (searchTerm && searchFields.length > 0) {
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = field.split('.').reduce((obj, key) => obj?.[key], item);
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply filters
    if (activeFilter !== 'all') {
      const activeFilterConfig = filters.find(f => f.key === activeFilter);
      if (activeFilterConfig?.filter) {
        filtered = filtered.filter(activeFilterConfig.filter);
      }
    }

    return filtered;
  }, [items, searchTerm, activeFilter, searchFields, filters]);

  // Generate default stats
  const defaultStats = useMemo(() => {
    if (stats.length > 0) return stats;

    const totalItems = items.length;
    const completedItems = items.filter(item => 
      item.status === 'completed' || item.completed
    ).length;
    const pendingItems = items.filter(item => 
      item.status === 'pending' || item.status === 'in-progress'
    ).length;

    return [
      { label: 'Total', value: totalItems, color: '#6b7280' },
      { label: 'Pending', value: pendingItems, color: '#f59e0b' },
      { label: 'Completed', value: completedItems, color: '#10b981' }
    ];
  }, [items, stats]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
  };

  return (
    <div 
      className={`${styles.container} ${className}`}
      {...props}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h3 className={styles.title}>
              {title}
              <span className={styles.count}>
                {filteredItems.length}
              </span>
            </h3>
            {subtitle && (
              <p className={styles.subtitle}>{subtitle}</p>
            )}
          </div>

          <div className={styles.actions}>
            {headerActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={styles.button}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
            
            {onAddNew && (
              <button 
                onClick={onAddNew}
                className={styles.buttonSecondary}
              >
                <Plus size={16} />
                Add New
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        {showSearch && (
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={16} />
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>
        )}

        {/* Filters */}
        {showFilters && filters.length > 0 && (
          <div className={styles.filters}>
            <button
              onClick={() => handleFilterChange('all')}
              className={`${styles.filterButton} ${activeFilter === 'all' ? styles.filterButtonActive : ''}`}
            >
              All ({items.length})
            </button>
            {filters.map(filter => (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                className={`${styles.filterButton} ${activeFilter === filter.key ? styles.filterButtonActive : ''}`}
              >
                {filter.label} ({filter.count || 0})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {filteredItems.length > 0 ? (
          <div className={layout === 'grid' ? styles.grid : styles.list}>
            {filteredItems.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => onItemClick?.(item, index)}
              >
                {renderItem(item, index)}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              {emptyState.icon || '📝'}
            </div>
            <h4 className={styles.emptyTitle}>
              {emptyState.title || `No ${title.toLowerCase()} found`}
            </h4>
            <p className={styles.emptyMessage}>
              {emptyState.message || 
                (searchTerm 
                  ? 'Try adjusting your search criteria.'
                  : `Get started by adding your first ${title.toLowerCase().slice(0, -1)}!`
                )
              }
            </p>
            {emptyState.action && (
              <button
                onClick={emptyState.action.onClick}
                className={styles.button}
              >
                {emptyState.action.icon}
                {emptyState.action.label}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      {showStats && defaultStats.length > 0 && (
        <div className={styles.stats}>
          <div className={styles.statsGrid}>
            {defaultStats.map((stat, index) => (
              <div 
                key={index} 
                className={styles.statItem}
                style={{ '--stat-color': stat.color }}
              >
                <div className={styles.statValue}>
                  {stat.value}
                </div>
                <div className={styles.statLabel}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrollList;