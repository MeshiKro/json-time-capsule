import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileJson } from "lucide-react";
import AdminDialog from "@/components/AdminDialog";
import UserInfoCard from "@/components/UserInfoCard";
import JsonEditorCard from "@/components/JsonEditorCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [jsonXData, setJsonXData] = useState(
    '{\n  "username": "",\n  "yourName": "",\n  "example": "JSON X data",\n  "timestamp": "2024-01-01T00:00:00Z",\n  "data": {\n    "key": "value"\n  }\n}'
  );
  const [jsonYData, setJsonYData] = useState(
    '{\n  "username": "",\n  "yourName": "",\n  "example": "JSON Y data",\n  "timestamp": "2024-01-01T00:00:00Z",\n  "data": {\n    "key": "value"\n  }\n}'
  );
  const [username, setUsername] = useState("");
  const [yourName, setYourName] = useState("");
  const [lastUpdatedX, setLastUpdatedX] = useState<Date>(new Date());
  const [lastUpdatedY, setLastUpdatedY] = useState<Date>(new Date());
  const [editingAllowed, setEditingAllowed] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

  // Update JSON X when username or name changes
  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonXData);
      parsedJson.username = username;
      parsedJson.yourName = yourName;
      const updatedJson = JSON.stringify(parsedJson, null, 2);
      setJsonXData(updatedJson);
    } catch (error) {
      // If JSON is invalid, don't update
    }
  }, [username, yourName]);

  // Update JSON Y when username or name changes
  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonYData);
      parsedJson.username = username;
      parsedJson.yourName = yourName;
      const updatedJson = JSON.stringify(parsedJson, null, 2);
      setJsonYData(updatedJson);
    } catch (error) {
      // If JSON is invalid, don't update
    }
  }, [username, yourName]);

  // Update the last updated date for JSON X
  useEffect(() => {
    const timer = setTimeout(() => {
      if (jsonXData.trim()) {
        setLastUpdatedX(new Date());
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [jsonXData]);

  // Update the last updated date for JSON Y
  useEffect(() => {
    const timer = setTimeout(() => {
      if (jsonYData.trim()) {
        setLastUpdatedY(new Date());
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [jsonYData]);

  // Parse username and name from JSON when JSON changes manually (for JSON X)
  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonXData);
      if (parsedJson.username !== username) {
        setUsername(parsedJson.username || "");
      }
      if (parsedJson.yourName !== yourName) {
        setYourName(parsedJson.yourName || "");
      }
    } catch (error) {
      // If JSON is invalid, don't update
    }
  }, [jsonXData]);

  // Parse username and name from JSON when JSON changes manually (for JSON Y)
  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonYData);
      if (parsedJson.username !== username) {
        setUsername(parsedJson.username || "");
      }
      if (parsedJson.yourName !== yourName) {
        setYourName(parsedJson.yourName || "");
      }
    } catch (error) {
      // If JSON is invalid, don't update
    }
  }, [jsonYData]);

  // Admin logic is now handled in AdminDialog. Only editingAllowed is used here.

  const handleCopy = async (data: string, type: string) => {
    try {
      await navigator.clipboard.writeText(data);
    } catch (err) {
      // Could not copy to clipboard
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const isValidJson = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  const formatJson = (
    data: string,
    setter: (value: string) => void,
    type: string
  ) => {
    try {
      const formatted = JSON.stringify(JSON.parse(data), null, 2);
      setter(formatted);
    } catch {
      // Invalid JSON, do nothing
    }
  };

  const handleJsonChange = (
    value: string,
    setter: (value: string) => void,
    type: string
  ) => {
    setter(value);
  };

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
        <UserInfoCard
          username={username}
          setUsername={setUsername}
          yourName={yourName}
          setYourName={setYourName}
        />

        <div className="grid lg:grid-cols-2 gap-6">
          <JsonEditorCard
            title="JSON X"
            jsonData={jsonXData}
            setJsonData={setJsonXData}
            lastUpdated={lastUpdatedX}
            handleCopy={handleCopy}
            formatJson={formatJson}
            handleJsonChange={handleJsonChange}
            editingAllowed={editingAllowed}
            isValidJson={isValidJson}
          />
          <JsonEditorCard
            title="JSON Y"
            jsonData={jsonYData}
            setJsonData={setJsonYData}
            lastUpdated={lastUpdatedY}
            handleCopy={handleCopy}
            formatJson={formatJson}
            handleJsonChange={handleJsonChange}
            editingAllowed={editingAllowed}
            isValidJson={isValidJson}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
