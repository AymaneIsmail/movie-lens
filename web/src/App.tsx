import { DashboardPage } from "@/pages/dashboard-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      placeholderData: (prev: unknown) => prev,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardPage />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
