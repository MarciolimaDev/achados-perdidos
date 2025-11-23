"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MobileMenuButton } from "@/components/dashboard/MobileMenuButton";

import NewItemForm  from "@/components/dashboard/NewItemForm";
import ClaimItemSearch from "@/components/dashboard/ClaimItemSearch";
import ItemsList from "@/components/dashboard/ItemsList";

export default function PainelPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"new" | "claim" | "list">("new");
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // --- Verificação de autenticação usando localStorage ---
  useEffect(() => {
    const access = localStorage.getItem("access");

    if (!access) {
      router.push("/login");
      return;
    }

    setIsAuthChecked(true);
  }, [router]);

  if (!isAuthChecked) {
    return null; // evita piscar conteúdo não autorizado
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        
        {/* Sidebar */}
        <DashboardSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
        />

        {/* Conteúdo */}
        <main className="flex-1 p-6 overflow-auto">

          <MobileMenuButton />

          {activeTab === "new" && <NewItemForm />}
          {activeTab === "claim" && <ClaimItemSearch />}
          {activeTab === "list" && <ItemsList />}
        </main>

      </div>
    </SidebarProvider>
  );
}
