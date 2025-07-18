import { createRoot } from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ToasterProvider } from "@contexts/toaster/toasterProvidor";
import { LanguageProvider } from "@contexts/language/LanguageContext.tsx";
import ErrorBoundary from "@components/feedback/ErrorBoundary.tsx";
import PageNotFound from "@pages/pageNotFound.tsx";
import theme from "@/theme/theme.ts";

import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary fallback={<PageNotFound />}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToasterProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </ToasterProvider>
    </ThemeProvider>
  </ErrorBoundary>
);
