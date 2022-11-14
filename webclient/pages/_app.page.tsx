import "@webclient/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { fetcher } from "@core/services/fetcher/index";
import { mockDashboardFetch } from "@core/hooks/data/use-dashboard-fetch";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { mockMetricsAllFetch } from "@webclient/../core/src/hooks/data/use-metrics-all-fetch";

// Initialize fetcher
fetcher.setBaseUrl(process.env.NEXT_PUBLIC_FRONTEND_BASE_URL);

if (process.env.NODE_ENV === "development") {
  // data mocks
  mockDashboardFetch();
  mockMetricsAllFetch();
}

if (!("fetcher" in globalThis)) {
  globalThis.fetcher = fetcher;
}

function DatapadApp({ Component, pageProps }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <Component {...pageProps} />
      </ThemeProvider>
    </DndProvider>
  );
}

export default DatapadApp;
