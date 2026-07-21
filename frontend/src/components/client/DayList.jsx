import DayCard from "./DayCard";
import styles from "./DayList.module.css";

function DayList({ days, selectedDate, onSelect }) {
  return (
    <div className={styles.list}>
      {days.map((day) => (
        <DayCard
          key={day.date}
          day={day}
          selected={day.date === selectedDate}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default DayList;