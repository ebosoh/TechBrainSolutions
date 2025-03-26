import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import TermsPage from "@/pages/terms";
import PolicyPage from "@/pages/policy";
import Dashboard from "@/pages/dashboard";
import Careers from "@/pages/careers";

// Import dashboard related pages
import DashboardCareers from "@/pages/dashboard/careers";
import DashboardContent from "@/pages/dashboard/content";
import DashboardEnquiries from "@/pages/dashboard/enquiries";

// Lazy load components dynamically
const LazyComponent = (importFunc: () => Promise<any>) => {
  const LazyComp = (props: any) => {
    const [Component, setComponent] = React.useState<React.ComponentType | null>(null);
    
    React.useEffect(() => {
      const loadComponent = async () => {
        try {
          const module = await importFunc();
          // Get the default export from the module
          setComponent(() => module.default);
        } catch (error) {
          console.error("Error loading component:", error);
        }
      };
      
      loadComponent();
    }, []);
    
    if (!Component) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    
    return <Component {...props} />;
  };
  
  return LazyComp;
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/policy" component={PolicyPage} />
      <Route path="/careers" component={Careers} />
      
      {/* Dashboard routes */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/careers" component={DashboardCareers} />
      <Route path="/dashboard/content" component={DashboardContent} />
      <Route path="/dashboard/enquiries" component={DashboardEnquiries} />
      <Route path="/dashboard/users" component={Dashboard} />
      <Route path="/dashboard/settings" component={Dashboard} />
      
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
