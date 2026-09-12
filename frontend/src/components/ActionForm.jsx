import { useState } from "react";
import { api } from "../api/client";
import { Button, Status } from "./UI";
import s from "./ActionForm.module.css";
export default function ActionForm({
  endpoint,
  client = api,
  method = "post",
  multipart = false,
  children,
  label = "Submit request",
  onSuccess,
  review = false,
  reviewText,
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [pending, setPending] = useState(null);
  async function send(body, form) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await client[method](endpoint, body);
      setMessage(result.message || "Your request was submitted successfully.");
      setPending(null);
      form?.reset();
      onSuccess?.(result);
    } catch (err) {
      setError(err.message);
      setPending(null);
    } finally {
      setBusy(false);
    }
  }
  function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = multipart ? fd : Object.fromEntries(fd);
    if (
      fd.has("confirm_password") &&
      fd.get("confirm_password") !== fd.get("new_password")
    ) {
      setError("Passwords must match.");
      return;
    }
    if (!multipart) delete body.confirm_password;
    if (review) {
      setError("");
      setMessage("");
      setPending({ body, form });
      return;
    }
    send(body, form);
  }
  return (
    <form onSubmit={submit} className={s.form}>
      <fieldset disabled={busy || !!pending}>{children}</fieldset>
      <Status error={error} />
      {message && (
        <p className={s.success} role="status">
          {message}
        </p>
      )}
      {pending ? (
        <div className={s.review} role="region" aria-label="Review request">
          <h3>Review your request</h3>
          {reviewText && <p>{reviewText}</p>}
          <dl>
            {Object.entries(pending.body)
              .filter(
                ([key]) => !["pin", "password", "new_password"].includes(key),
              )
              .map(([key, value]) => (
                <div key={key}>
                  <dt>{key.replaceAll("_", " ")}</dt>
                  <dd>{String(value)}</dd>
                </div>
              ))}
          </dl>
          <div>
            <Button
              type="button"
              secondary
              onClick={() => setPending(null)}
              disabled={busy}
            >
              Go back
            </Button>
            <Button
              type="button"
              disabled={busy}
              onClick={() => send(pending.body, pending.form)}
            >
              {busy ? "Submitting…" : "Confirm & submit"}
            </Button>
          </div>
        </div>
      ) : (
        <Button type="submit" disabled={busy}>
          {busy ? "Submitting…" : label}
        </Button>
      )}
    </form>
  );
}
