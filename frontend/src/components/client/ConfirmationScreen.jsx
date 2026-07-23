import styles from "./ConfirmationScreen.module.css";

function ConfirmationScreen({ appointment, serviceName }) {
  const [year, month, day] = appointment.date.split("T")[0].split("-");
  const formattedDate = new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });

  const whatsappMessage = `Olá! Meu agendamento foi confirmado: ${serviceName}, dia ${formattedDate} às ${appointment.time}.`;
  const whatsappUrl = `https://wa.me/5511952397051?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className={styles.page}>
      <div className={styles.icon}>✓</div>
      <h1 className={styles.title}>Agendamento confirmado!</h1>
      <p className={styles.summary}>
        {serviceName} · {formattedDate} às {appointment.time}
      </p>
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.whatsappButton}>
        Confirmar via WhatsApp
      </a>
    </div>
  );
}

export default ConfirmationScreen;