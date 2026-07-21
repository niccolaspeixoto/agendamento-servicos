import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentFormSchema } from "../../schemas/appointmentSchema";
import styles from "./AppointmentForm.module.css";

function AppointmentForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(appointmentFormSchema),//conecta o zod com o react-hook-form
    });

    function onSubmit(data) {
        console.log("Formulário válido, dados:", data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.field}>
                <label htmlFor="clientName">Nome completo</label>
                <input
                    id="clientName"
                    type="text"
                    placeholder="Como podemos te chamar"
                    {...register("clientName")}
                />
                {errors.clientName && <span className={styles.error}>{errors.clientName.message}</span>}
            </div>

            <div className={styles.field}>
                <label htmlFor="clientPhone">Telefone</label>
                <input
                    id="clientPhone"
                    type="tel"
                    placeholder="11987654321"
                    {...register("clientPhone")}
                />
                {errors.clientPhone && <span className={styles.error}>{errors.clientPhone.message}</span>}
            </div>

            <button type="submit" className={styles.submitButton}>
                Confirmar agendamento
            </button>
        </form>
    );
}

export default AppointmentForm;