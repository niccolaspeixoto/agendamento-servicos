import type { Service } from "../../types/service";
import styles from "./ServiceCard.module.css";

interface ServiceCardProps {
  service: Service;
  selected: boolean;
  onSelect: (serviceId: string) => void;
}

function ServiceCard({ service, selected, onSelect }: ServiceCardProps) {
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