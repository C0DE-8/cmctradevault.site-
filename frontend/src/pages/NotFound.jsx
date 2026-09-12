import { Brand, Button } from "../components/UI";
import s from "./NotFound.module.css";
export default function NotFound() {
  return (
    <main className={s.page}>
      <Brand />
      <span>404</span>
      <h1>A little off course.</h1>
      <p>That page doesn’t exist. Let’s get you back on track.</p>
      <Button to="/">Back to home</Button>
    </main>
  );
}
