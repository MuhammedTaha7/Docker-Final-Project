import React, { useState } from 'react';
import { 
  Calendar, 
  User, 
  MapPin, 
  AlertCircle, 
  Eye, 
  Edit3, 
  Share2, 
  Trash2, 
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Presentation,
  FileText,
  Users,
  Download,
  MessageCircle,
  Zap
} from 'lucide-react';
import styles from './ScrollListItem.module.css';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const ScrollListItem = ({
  item,
  variant = 'default',
  showProgress = false,
  showActions = true,
  showFooter = true,
  showBadges = true,
  showDescription = true,
  onEdit,
  onDelete,
  onView,
  onShare,
  onClick,
  onToggleComplete,
  className = '',
  customFields = [],
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate(); 

  // Variant configurations
  const variants = {
    default: { icon: FileText, color: '#6b7280' },
    assignment: { icon: BookOpen, color: '#3b82f6' },
    test: { icon: GraduationCap, color: '#ec4899' },
    exam: { icon: GraduationCap, color: '#dc2626' },
    presentation: { icon: Presentation, color: '#8b5cf6' },
    project: { icon: FileText, color: '#10b981' },
    meeting: { icon: Users, color: '#f59e0b' },
    course: { icon: BookOpen, color: '#6366f1' },
    event: { icon: Calendar, color: '#06b6d4' },
    resource: { icon: Download, color: '#059669' },
    announcement: { icon: MessageCircle, color: '#f59e0b' }
  };

  const currentVariant = variants[variant] || variants.default;
  const VariantIcon = currentVariant.icon;

  // Date calculations
  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10b981';
    if (progress >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const daysUntil = getDaysUntilDue(item.dueDate);
  const isOverdue = daysUntil !== null && daysUntil < 0 && item.status !== 'completed';
  const isDueSoon = daysUntil !== null && daysUntil <= 2 && daysUntil >= 0;

  // Card class names
  const cardClasses = [
    styles.card,
    isHovered ? styles.cardHover : '',
    item.status === 'completed' ? styles.cardCompleted : '',
    isOverdue ? styles.cardOverdue : '',
    isDueSoon ? styles.cardDueSoon : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses}
      style={{ '--variant-color': currentVariant.color }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Border Accent */}
      <div className={styles.borderAccent} />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          {/* Type Icon */}
          <div className={styles.typeIcon}>
            <VariantIcon size={16} />
          </div>
          
          {/* Category/Course */}
          {(item.course || item.category) && (
            <span className={styles.badge}>
              {item.course || item.category}
            </span>
          )}

          {/* Type Badge */}
          {showBadges && (
            <span className={`${styles.badge} ${styles.badgeType}`}>
              {variant}
            </span>
          )}

          {/* Status Badge */}
          {showBadges && item.status && (
            <span className={`${styles.badge} ${styles.badgeStatus} ${styles[`badgeStatus${item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', '')}`]}`}>
              {item.status.replace('-', ' ')}
            </span>
          )}

          {/* Priority Badge */}
          {showBadges && item.priority && (
            <span className={`${styles.badge} ${styles.badgePriority} ${styles[`badgePriority${item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}`]}`}>
              {item.priority}
            </span>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className={`${styles.actions} ${isHovered ? styles.actionsVisible : ''}`}>
            {onView && (
              <button
                onClick={(e) => { e.stopPropagation(); onView(item); }}
                className={`${styles.actionButton} ${styles.actionView}`}
              >
                <Eye size={16} />
              </button>
            )}

            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                className={`${styles.actionButton} ${styles.actionEdit}`}
              >
                <Edit3 size={16} />
              </button>
            )}

            {onShare && (
              <button
                onClick={(e) => { e.stopPropagation(); onShare(item); }}
                className={`${styles.actionButton} ${styles.actionShare}`}
              >
                <Share2 size={16} />
              </button>
            )}

            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                className={`${styles.actionButton} ${styles.actionDelete}`}
              >
                <Trash2 size={16} />
              </button>
            )}

            {onToggleComplete && (
              <button
                onClick={(e) => { e.stopPropagation(); onToggleComplete(item.id); }}
                className={`${styles.actionButton} ${styles.actionToggle}`}
              >
                {item.status === 'completed' ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <div className={styles.checkboxEmpty} />
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Title */}
      <h4 className={`${styles.title} ${item.status === 'completed' ? styles.titleCompleted : ''}`}>
        {item.title}
        {item.priority === 'urgent' && (
          <Zap size={16} className={styles.urgentIcon} />
        )}
      </h4>

      {/* Description */}
      {showDescription && item.description && (
        <p className={styles.description}>
          {item.description}
        </p>
      )}

      {/* Details */}
      <div className={styles.details}>
        {/* Due Date */}
        {item.dueDate && (
          <div className={styles.detail}>
            <Calendar size={14} />
            Due: {new Date(item.dueDate).toLocaleDateString()}
            {item.dueTime && ` at ${item.dueTime}`}
          </div>
        )}

        {/* Instructor/Organizer */}
        {(item.instructor || item.organizer || item.teacher) && (
          <div className={styles.detail}>
            <User size={14} />
            {item.instructor || item.organizer || item.teacher}
          </div>
        )}

        {/* Location */}
        {item.location && (
          <div className={styles.detail}>
            <MapPin size={14} />
            {item.location}
          </div>
        )}

        {/* Custom Fields */}
        {customFields.map((field, index) => (
          item[field.key] && (
            <div key={index} className={styles.detail}>
              {field.icon && <field.icon size={14} />}
              {field.label ? `${field.label}: ` : ''}{item[field.key]}
            </div>
          )
        ))}
      </div>

      {/* Urgency Badge */}
      {daysUntil !== null && (
        <div className={`${styles.urgencyBadge} ${
          isOverdue ? styles.urgencyOverdue : 
          isDueSoon ? styles.urgencyDueSoon : 
          styles.urgencyNormal
        }`}>
          <AlertCircle size={14} />
          {isOverdue 
            ? `${Math.abs(daysUntil)} days overdue`
            : isDueSoon 
              ? (daysUntil === 0 ? 'Due today!' : `Due in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`)
              : `${daysUntil} days remaining`
          }
        </div>
      )}

      {/* Progress */}
      {showProgress && typeof item.progress === 'number' && (
        <div className={styles.progress}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>
              Progress
            </span>
            <span 
              className={styles.progressValue}
              style={{ color: getProgressColor(item.progress) }}
            >
              {item.progress}%
            </span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ 
                width: `${item.progress}%`,
                background: `linear-gradient(90deg, ${getProgressColor(item.progress)}, ${getProgressColor(item.progress)}dd)`
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      {showFooter && (item.semester || item.credits || item.difficulty || item.fee || item.capacity || item.downloads || item.rating) && (
        <div className={styles.footer}>
          <div className={styles.footerInfo}>
            {item.semester && (
              <span className={styles.footerItem}>
                {item.semester}
              </span>
            )}
            {item.credits && (
              <span className={styles.footerItem}>
                {item.credits} credits
              </span>
            )}
            {item.difficulty && (
              <span className={styles.footerItem}>
                {item.difficulty}
              </span>
            )}
            {item.fee && (
              <span className={styles.footerItem}>
                Fee: {item.fee}
              </span>
            )}
            {item.capacity && (
              <span className={styles.footerItem}>
                Capacity: {item.capacity}
              </span>
            )}
            {item.downloads && (
              <span className={styles.footerItem}>
                {item.downloads} downloads
              </span>
            )}
            {item.rating && (
              <span className={styles.footerItem}>
                ⭐ {item.rating}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrollListItem;
