import "./styles.css";
import { mountApp } from "./render";

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("App root was not found.");
}

mountApp(root);

