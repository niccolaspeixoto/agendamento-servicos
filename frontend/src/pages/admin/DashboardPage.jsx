import { useEffect, useState } from "react";
import { getAllAppointments } from "../../services/appointmentAdminService";
import styles from "./DashboardPage.module.css";
import AppointmentRow from "../../components/admin/AppointmentRow";
import { updateAppointmentStatus, deleteAppointment } from "../../services/appointmentAdminService";
import { useNavigate } from "react-router-dom";
import { clearToken } from "../../utils/auth";

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

  function handleStatusChange(id, status) {
    updateAppointmentStatus(id, status).then(loadAppointments).catch(console.error);
  }

  function handleDelete(id) {
    if (!confirm("Tem certeza que deseja excluir esse agendamento?")) return;
    deleteAppointment(id).then(loadAppointments).catch(console.error);
  }

  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    navigate("/admin/login");
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Agendamentos</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Sair
        </button>
      </div>

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
            <AppointmentRow
              key={appointment.id}
              appointment={appointment}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;