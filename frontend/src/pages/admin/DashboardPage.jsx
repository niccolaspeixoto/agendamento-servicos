import { useEffect, useState } from "react";
import { getAllAppointments } from "../../services/appointmentAdminService";
import styles from "./DashboardPage.module.css";

function DashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className={styles.list}>
          {appointments.map((appointment) => (
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