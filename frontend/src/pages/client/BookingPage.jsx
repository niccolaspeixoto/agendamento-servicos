import { useEffect, useState } from "react";
import styles from "./BookingPage.module.css";
import { getServices } from "../../services/serviceService";
import ServiceList from "../../components/client/ServiceList";
import DayList from "../../components/client/DayList";
import { getNextDays } from "../../utils/date";
import TimeSlotGrid from "../../components/client/TimeSlotGrid";
import { getAvailableSlots } from "../../services/appointmentService";


function BookingPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  const days = getNextDays(7);

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    getAvailableSlots(selectedDate)
      .then(setAvailableSlots)
      .catch((error) => console.error(error));
  }, [selectedDate]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Agendar horário</h1>
        <p className={styles.subtitle}>Escolha o serviço, dia e horário</p>
      </header>

      {loading ? (
        <p>Carregando serviços...</p>
      ) : (
        <ServiceList
          services={services}
          selectedServiceId={selectedServiceId}
          onSelect={setSelectedServiceId}
        />
      )}

      <DayList
        days={days}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
      />

      {selectedDate && (
        <TimeSlotGrid
          slots={availableSlots}
          selectedTime={selectedTime}
          onSelect={setSelectedTime}
        />
      )}
    </div>
  );
}

export default BookingPage;