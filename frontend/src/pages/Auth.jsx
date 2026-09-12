import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiShield } from "react-icons/fi";
import { api, session } from "../api/client";
import { Brand, Button, Field, Status } from "../components/UI";
import s from "./Auth.module.css";
export default function Auth({ register = false }) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await api.post(
        register ? "/register" : "/login",
        Object.fromEntries(new FormData(e.currentTarget)),
      );
      if (!data.token)
        throw new Error(
          data.message ||
            "Unable to sign in. Please contact the platform administrator.",
        );
      session.set(data.token);
      navigate("/app");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={s.page}>
      <aside>
        <Brand />
        <div>
          <span>YOUR NEXT CHAPTER</span>
          <h1>
            A little vision.
            <br />A bigger <em>future.</em>
          </h1>
          <p>
            One space for your investments.
            <br />A clearer perspective on what’s next.
          </p>
          <div className={s.art}>
            <FiArrowUpRight />
          </div>
        </div>
        <small>
          <FiShield /> Built around your next move.
        </small>
      </aside>
      <main>
        <Link to="/" className={s.back}>
          ← Back to home
        </Link>
        <div className={s.formWrap}>
          <span className={s.eyebrow}>
            {register ? "LET’S GET YOU STARTED" : "GOOD TO SEE YOU AGAIN"}
          </span>
          <h2>{register ? "Make room for your future." : "Welcome back."}</h2>
          <p>
            {register
              ? "Create your account to explore the possibilities."
              : "Sign in to your investment workspace."}
          </p>
          <form onSubmit={submit} className={register ? s.register : ""}>
            {register ? (
              <>
                <Field
                  label="Full name"
                  name="full_name"
                  autoComplete="name"
                  required
                />
                <Field
                  label="Username"
                  name="username"
                  autoComplete="username"
                  required
                />
                <Field
                  label="Email address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
                <Field
                  label="Phone number"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                />
                <Field
                  label="Street address"
                  name="address"
                  autoComplete="street-address"
                  required
                />
                <Field
                  label="City"
                  name="city"
                  autoComplete="address-level2"
                  required
                />
                <Field
                  label="Country"
                  name="country"
                  autoComplete="country-name"
                  required
                />
                <Field
                  label="Postal code (optional)"
                  name="zipcode"
                  autoComplete="postal-code"
                />
              </>
            ) : (
              <Field
                label="Email or username"
                name="identifier"
                autoComplete="username"
                required
              />
            )}
            <Field
              label="Password"
              name="password"
              type="password"
              minLength={register ? 8 : undefined}
              autoComplete={register ? "new-password" : "current-password"}
              required
            />
            <div className={s.full}>
              <Status error={error} />
              {register && (
                <>
                  <label className={s.consent}>
                    <input
                      name="risk_acknowledged"
                      type="checkbox"
                      value="yes"
                      required
                    />
                    <span>
                      I understand investments involve risk and returns are not
                      guaranteed.
                    </span>
                  </label>
                  <label className={s.consent}>
                    <input
                      name="terms_acknowledged"
                      type="checkbox"
                      value="yes"
                      required
                    />
                    <span>
                      I have read and agree to the{" "}
                      <Link
                        to="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms &amp; Investment Policy
                      </Link>
                      , including responsible-use rules.
                    </span>
                  </label>
                </>
              )}
              <Button disabled={busy} type="submit">
                {busy
                  ? "Please wait…"
                  : register
                    ? "Create account"
                    : "Sign in"}
                <FiArrowUpRight />
              </Button>
            </div>
          </form>
          <p className={s.switch}>
            {register
              ? "Already have an account?"
              : "New to Valthera Investments?"}{" "}
            <Link to={register ? "/login" : "/register"}>
              {register ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
