import styles from "./ServiceCard.module.css";

function ServiceCard({ service, selected, onSelect }) {
  return (
    <button
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      onClick={() => onSelect(service.id)}
    >
      <span className={styles.name}>{service.name}</span>
      {selected && <span className={styles.badge}>Selecionado</span>}
    </button>
  );
}

export default ServiceCard;