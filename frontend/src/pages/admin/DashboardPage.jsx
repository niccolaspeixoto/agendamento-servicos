import { useEffect, useState } from "react";
import { getAllAppointments } from "../../services/appointmentAdminService";
import styles from "./DashboardPage.module.css";

function DashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");

  const filteredAppointments = dateFilter
    ? appointments.filter((appointment) => appointment.date.startsWith(dateFilter))
    : appointments;

  useEffect(() => {
    loadAppointments();
  }, []);

  function loadAppointments() {
    setLoading(true);
    getAllAppointments()
      .then(setAppointments)
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Agendamentos</h1>
      <input
        type="date"
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
        className={styles.dateFilter}
      />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className={styles.list}>
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className={styles.row}>
              <div>
                <p className={styles.clientName}>{appointment.clientName}</p>
                <p className={styles.details}>
                  {appointment.service.name} · {appointment.clientPhone}
                </p>
              </div>
              <span className={styles.status}>{appointment.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;