import { useEffect, useState } from "react";
import { FiArrowUpRight, FiTrendingUp, FiX } from "react-icons/fi";
import s from "./ActivityToast.module.css";

const demoActivity = [
  ["S*** M***", "invested", 1280],
  ["A*** K***", "withdrew", 3420],
  ["J*** R***", "invested", 760],
  ["M*** T***", "withdrew", 2150],
  ["D*** L***", "invested", 4890],
  ["N*** C***", "withdrew", 930],
];

export default function ActivityToast() {
  const [activity, setActivity] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer;
    let index = Math.floor(Math.random() * demoActivity.length);

    const showActivity = () => {
      const [name, action, base] = demoActivity[index % demoActivity.length];
      setActivity({
        name,
        action,
        amount: base + Math.floor(Math.random() * 12) * 25,
      });
      setVisible(true);
      hideTimer = window.setTimeout(() => setVisible(false), 6500);
      index += 1;
    };

    const firstTimer = window.setTimeout(showActivity, 6500);
    const interval = window.setInterval(showActivity, 15500);

    return () => {
      window.clearTimeout(firstTimer);
      window.clearTimeout(hideTimer);
      window.clearInterval(interval);
    };
  }, []);

  if (!activity) return null;

  return (
    <div
      className={`${s.toast} ${visible ? s.visible : ""}`}
      role="status"
      aria-live="polite"
    >
      <span className={s.icon}>
        {activity.action === "withdrew" ? <FiArrowUpRight /> : <FiTrendingUp />}
      </span>
      <div>
        <small><i />ACTIVITY</small>
        <p><strong>{activity.name}</strong> {activity.action}</p>
        <b>${activity.amount.toLocaleString("en-US")}</b>
      </div>
      <button type="button" onClick={() => setVisible(false)} aria-label="Dismiss activity">
        <FiX />
      </button>
    </div>
  );
}
