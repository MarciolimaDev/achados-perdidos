"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "../ui/sidebar";

export function MobileMenuButton() {
    const { toggleSidebar } = useSidebar();

    return (
        <div className="md:hidden p-2">
            <Button 
                variant="outline"
                size="icon" 
                onClick={toggleSidebar}
            >                
            <Menu className="w-5 h-5" />
            </Button>

        </div>
    );
};