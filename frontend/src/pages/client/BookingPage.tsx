import styles from './BookingPage.module.css'
import { useEffect, useState } from "react";
import { getServices } from "../../services/serviceService";
import type { Service } from "../../types/service";
import ServiceList from "../../components/client/ServiceList";

function BookingPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

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
    </div>
  );
}

export default BookingPage;