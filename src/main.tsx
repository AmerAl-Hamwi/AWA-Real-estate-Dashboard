import { createRoot } from "react-dom/client";
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToasterProvider } from "@contexts/toaster/toasterProvidor";
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
        <App />
      </ToasterProvider>
    </ThemeProvider>
  </ErrorBoundary>
);
