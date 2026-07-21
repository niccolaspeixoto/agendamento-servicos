import styles from "./DayCard.module.css";

function DayCard({ day, selected, onSelect }) {
  return (
    <button
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      onClick={() => onSelect(day.date)}
    >
      <span className={styles.label}>{day.label}</span>
      <span className={styles.dayNumber}>{day.dayNumber}</span>
    </button>
  );
}

export default DayCard;