import styles from "./TimeSlotGrid.module.css";

function TimeSlotGrid({ slots, selectedTime, onSelect }) {
  if (slots.length === 0) {
    return <p className={styles.empty}>Nenhum horário disponível nesse dia.</p>;
  }

  return (
    <div className={styles.grid}>
      {slots.map((time) => (
        <button
          key={time}
          className={`${styles.slot} ${time === selectedTime ? styles.selected : ""}`}
          onClick={() => onSelect(time)}
        >
          {time}
        </button>
      ))}
    </div>
  );
}

export default TimeSlotGrid;