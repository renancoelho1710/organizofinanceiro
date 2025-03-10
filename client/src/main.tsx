import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set up global number formatting
const locale = navigator.language || "pt-BR";
if (Intl && Intl.NumberFormat) {
  // Ensure we have proper number formatting for the app
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  });
}

createRoot(document.getElementById("root")!).render(<App />);
