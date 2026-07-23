import styles from "./AppointmentRow.module.css";

const STATUS_OPTIONS = ["AGENDADO", "CONFIRMADO", "CONCLUIDO", "CANCELADO"];

function AppointmentRow({ appointment, onStatusChange, onDelete }) {
  return (
    <div className={styles.row}>
      <div>
        <p className={styles.clientName}>{appointment.clientName}</p>
        <p className={styles.details}>
          {appointment.service.name} · {appointment.clientPhone} ·{" "}
          {appointment.date.split("T")[0].split("-").reverse().join("/")} às {appointment.time}
        </p>
      </div>

      <div className={styles.actions}>
        <select
          value={appointment.status}
          onChange={(e) => onStatusChange(appointment.id, e.target.value)}
          className={styles.statusSelect}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <button onClick={() => onDelete(appointment.id)} className={styles.deleteButton}>
          Excluir
        </button>
      </div>
    </div>
  );
}

export default AppointmentRow;