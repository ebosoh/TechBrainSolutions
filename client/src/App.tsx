import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import TermsPage from "@/pages/terms";
import PolicyPage from "@/pages/policy";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/policy" component={PolicyPage} />
      <Route path="/dashboard" component={() => import("@/pages/dashboard")} />
      <Route path="/careers" component={() => import("@/pages/careers")} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
