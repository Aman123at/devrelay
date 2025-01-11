"use client";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoaderProvider } from "@/contexts/LoaderContext";
import { ScrollProvider } from "@/contexts/ScrollContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();

const ContextWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <LoaderProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ScrollProvider>{children}</ScrollProvider>
        </QueryClientProvider>
      </AuthProvider>
    </LoaderProvider>
  );
};

export default ContextWrapper;
