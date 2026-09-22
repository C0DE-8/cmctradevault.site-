import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShield, FiArrowUpRight } from "react-icons/fi";
import { adminApi, adminSession } from "../api/admin";
import { Brand, Button, Field, Status } from "../components/UI";
import s from "./AdminLogin.module.css";
export default function AdminLogin() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await adminApi.post(
        "/login",
        Object.fromEntries(new FormData(e.currentTarget)),
      );
      if (!data.token) throw new Error("Unable to sign in");
      adminSession.set(data.token);
      await adminApi.get("/me");
      navigate("/admin");
    } catch (err) {
      adminSession.clear();
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className={s.page}>
      <Brand />
      <section>
        <div className={s.icon}>
          <FiShield />
        </div>
        <span>CMC TRADEVAULT · ADMINISTRATION</span>
        <h1>Your control room.</h1>
        <p>
          Sign in to manage investors, review requests, and follow account
          activity.
        </p>
        <form onSubmit={submit}>
          <Field
            label="Admin email"
            name="email"
            type="email"
            autoComplete="username"
            required
          />
          <Field
            label="Admin password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          <Status error={error} />
          <Button disabled={busy}>
            {busy ? "Signing in…" : "Sign in as admin"}
            <FiArrowUpRight />
          </Button>
        </form>
        <Link to="/login">Go to investor sign in</Link>
      </section>
    </main>
  );
}
