import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import JsonEditorCard from "@/components/JsonEditorCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface JsonManagerProps {
  editingAllowed: boolean;
  subName: string;
}

const JsonManager: React.FC<JsonManagerProps> = ({ editingAllowed, subName }) => {
  // When subName changes, update it in all JSONs and persist
  useEffect(() => {
    if (typeof subName !== 'string') return;
    const updateJson = (json: string) => {
      try {
        const parsed = JSON.parse(json);
        parsed.subName = subName;
        if ('yourName' in parsed) delete parsed.yourName;
        return JSON.stringify(parsed, null, 2);
      } catch {
        return json;
      }
    };
    setJsonXData(j => {
      const updated = updateJson(j);
      fetch('/data/json-x.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: updated,
      });
      localStorage.setItem('json-x-data', updated);
      return updated;
    });
    setJsonYData(j => {
      const updated = updateJson(j);
      fetch('/data/json-y.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: updated,
      });
      localStorage.setItem('json-y-data', updated);
      return updated;
    });
    setJsonZData(j => {
      const updated = updateJson(j);
      fetch('/data/json-z.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: updated,
      });
      localStorage.setItem('json-z-data', updated);
      return updated;
    });
  }, [subName]);
  const [jsonXData, setJsonXData] = useState<string>("");
  const [jsonYData, setJsonYData] = useState<string>("");
  const [jsonZData, setJsonZData] = useState<string>("");

  // Load JSON files from data directory on mount if not in localStorage
  useEffect(() => {
    const loadJson = async (file: string, storageKey: string, setter: (v: string) => void) => {
      try {
        // Fetch from public/data, not src/data
        const res = await fetch(`/src/data/${file}`);
        if (res.ok) {
          const text = await res.text();
          setter(text);
        }
      } catch {}
    };
    loadJson('json-x.json', 'json-x-data', setJsonXData);
    loadJson('json-y.json', 'json-y-data', setJsonYData);
    loadJson('json-z.json', 'json-z-data', setJsonZData);
  }, []);
  const [lastUpdatedZ, setLastUpdatedZ] = useState<Date>(new Date());
  const [lastUpdatedX, setLastUpdatedX] = useState<Date>(new Date());
  const [lastUpdatedY, setLastUpdatedY] = useState<Date>(new Date());

  // Parse subName from JSON when JSON changes manually (for JSON X)
  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonXData);
  // subName is controlled from parent, do not update here
    } catch (error) {
      // If JSON is invalid, don't update
    }
  }, [jsonXData]);

  // Parse subName from JSON when JSON changes manually (for JSON Z)
  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonZData);
  // subName is controlled from parent, do not update here
    } catch (error) {
      // If JSON is invalid, don't update
    }
  }, [jsonZData]);
  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonYData);
  // subName is controlled from parent, do not update here
    } catch (error) {
      // If JSON is invalid, don't update
    }
  }, [jsonYData]);

  const { toast } = useToast();
  const handleCopy = async (data: string, type: string) => {
    try {
      await navigator.clipboard.writeText(data);
      toast({
        title: 'Copied!',
        description: `${type} copied to clipboard.`,
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard.',
        variant: 'destructive',
        duration: 2000,
      });
    }
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

  // Save handlers
  const handleSaveJsonX = () => {
    localStorage.setItem('json-x-data', jsonXData);
    setLastUpdatedX(new Date());
  };
  const handleSaveJsonY = () => {
    localStorage.setItem('json-y-data', jsonYData);
    setLastUpdatedY(new Date());
  };
  const handleSaveJsonZ = () => {
    localStorage.setItem('json-z-data', jsonZData);
    setLastUpdatedZ(new Date());
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto">
        <Tabs defaultValue="x" className="w-full">
          <TabsList className="grid grid-cols-3 bg-white rounded-lg shadow mb-4">
            <TabsTrigger value="x">JSON X</TabsTrigger>
            <TabsTrigger value="y">JSON Y</TabsTrigger>
            <TabsTrigger value="z">JSON Z</TabsTrigger>
          </TabsList>
          <TabsContent value="x">
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
          </TabsContent>
          <TabsContent value="y">
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
          </TabsContent>
          <TabsContent value="z">
            <JsonEditorCard
              title="JSON Z"
              jsonData={jsonZData}
              setJsonData={setJsonZData}
              lastUpdated={lastUpdatedZ}
              handleCopy={handleCopy}
              formatJson={formatJson}
              handleJsonChange={handleJsonChange}
              editingAllowed={editingAllowed}
              isValidJson={isValidJson}
            />
          </TabsContent>
        </Tabs>
      </div>
  {/* Removed Dialog/largeView feature as Dialog import was removed */}
     
    </>
  );
};

export default JsonManager;
