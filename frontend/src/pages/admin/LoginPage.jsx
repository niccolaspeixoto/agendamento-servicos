import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../../services/authService";
import { saveToken } from "../../utils/auth";
import styles from "./LoginPage.module.css";

function LoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(data) {
    setSubmitting(true);
    setError(null);

    try {
      const token = await login(data.email, data.password);
      saveToken(token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Bem-vindo de volta</h1>
      <p className={styles.subtitle}>Entre para gerenciar os horários</p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" placeholder="voce@email.com" {...register("email")} />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Senha</label>
          <input id="password" type="password" placeholder="••••••••" {...register("password")} />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.submitButton} disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;