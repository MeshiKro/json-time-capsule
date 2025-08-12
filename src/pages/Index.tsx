import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileJson } from "lucide-react";
import AdminDialog from "@/components/AdminDialog";
import JsonManager from "@/components/JsonManager";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [editingAllowed, setEditingAllowed] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Header />
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdminDialogOpen(true)}
            className="flex items-center gap-2"
          >
            Admin Mode
          </Button>
        </div>
        <AdminDialog
          open={isAdminDialogOpen}
          onOpenChange={setIsAdminDialogOpen}
          onChangeEditingAllowed={setEditingAllowed}
        />
        <JsonManager editingAllowed={editingAllowed} />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
