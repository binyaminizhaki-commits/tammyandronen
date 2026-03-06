import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AccessibilityMenu } from "./components/AccessibilityMenu";
import { LanguageProvider } from "./contexts/LanguageContext";

export default function App() {
  return (
    <LanguageProvider>
      <a href="#main-content" className="skip-link">
        דלג לתוכן הראשי
      </a>
      <RouterProvider router={router} />
      <AccessibilityMenu />
    </LanguageProvider>
  );
}