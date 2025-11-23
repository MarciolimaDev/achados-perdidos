"use client";

import { LogOut, Package, Search, List } from "lucide-react";
import { toast } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "../ui/sidebar";

interface DashboardSidebarProps {
  activeTab: "new" | "claim" | "list";
  onTabChange: (tab: "new" | "claim" | "list") => void;
}

export function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  
  const handleLogout = () => {
    try {
      // limpa tokens
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      toast.success("Logout realizado com sucesso!");

      // redirecionar para login
      window.location.href = "/login";

    } catch {
      toast.error("Erro ao fazer logout");
    }
  };

  const menuItems = [
    { id: "new" as const, title: "Cadastrar Item", icon: Package },
    { id: "claim" as const, title: "Dar Baixa", icon: Search },
    { id: "list" as const, title: "Todos os Itens", icon: List },
  ];

  return (
    <Sidebar className="border-r border-border">
      
      {/* Cabeçalho */}
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-2">
            <Package className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground">
              Achados e Perdidos
            </h2>
            <p className="text-xs text-sidebar-foreground/70">
              Sistema de Gerenciamento
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Conteúdo */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className="w-full"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Rodapé */}
      <SidebarFooter className="border-t border-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
