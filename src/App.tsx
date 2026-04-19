import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index.tsx";
import Reserve from "./pages/Reserve.tsx";
import Recipes from "./pages/Recipes.tsx";
import RecipeDetail from "./pages/RecipeDetail.tsx";
import NotFound from "./pages/NotFound.tsx";
import FAQ from "./pages/FAQ.tsx";
import ThankYou from "./pages/ThankYou.tsx";

const queryClient = new QueryClient();

const HomeRoute = () => {
  const location = useLocation();
  const rawSearch = location.search.startsWith("?") ? location.search.slice(1) : location.search;

  if (rawSearch.startsWith("/thank-you")) {
    const [, ...redirectQueryParts] = rawSearch.split("&");
    const redirectQuery = redirectQueryParts.join("&");

    return <Navigate to={`/thank-you${redirectQuery ? `?${redirectQuery}` : ""}`} replace />;
  }

  const params = new URLSearchParams(rawSearch);
  const isSuccessfulReturn = !params.has("payment") && (
    params.has("payment_intent") ||
    params.has("redirect_status") ||
    params.has("session_id")
  );

  if (isSuccessfulReturn && params.get("redirect_status") !== "failed") {
    return <Navigate to={`/thank-you${rawSearch ? `?${rawSearch}` : ""}`} replace />;
  }

  return <Index />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/reserve/:slug" element={<Reserve />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:slug" element={<RecipeDetail />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/thank-you" element={<ThankYou />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
