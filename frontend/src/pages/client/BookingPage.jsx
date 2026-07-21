import { useEffect, useState } from "react";
import styles from "./BookingPage.module.css";
import { getServices } from "../../services/serviceService";
import ServiceList from "../../components/client/ServiceList";
import DayList from "../../components/client/DayList";
import { getNextDays } from "../../utils/date";
import TimeSlotGrid from "../../components/client/TimeSlotGrid";
import { getAvailableSlots } from "../../services/appointmentService";
import AppointmentForm from "../../components/client/AppointmentForm";
import { createAppointment } from "../../services/appointmentService";
import ConfirmationScreen from "../../components/client/ConfirmationScreen";


function BookingPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  //estados para controlar o fluxo de envio do form
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  const days = getNextDays(7);

  const selectedService = services.find((service) => service.id === selectedServiceId);

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


  async function handleFormSubmit(formData) {
    const appointmentData = {
      ...formData,
      serviceId: selectedServiceId,
      date: selectedDate,
      time: selectedTime,
    };

    setSubmitting(true);
    setSubmitError(null);

    try {
      const appointment = await createAppointment(appointmentData);
      setConfirmedAppointment(appointment);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  }


  if (confirmedAppointment) {
    return(
       <ConfirmationScreen
      appointment={confirmedAppointment}
      serviceName={selectedService.name}
    />
    )
  }

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

      {selectedServiceId && (
        <DayList
          days={days}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />)}


      {selectedDate && (
        <TimeSlotGrid
          slots={availableSlots}
          selectedTime={selectedTime}
          onSelect={setSelectedTime}
        />
      )}

      {selectedTime && (
        <AppointmentForm
          onSubmitSuccess={handleFormSubmit}
          submitting={submitting}
          submitError={submitError}
        />
      )}
    </div>
  )
}

export default BookingPage;