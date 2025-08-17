import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import JsonEditorCard from "@/components/JsonEditorCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface JsonManagerProps {
  editingAllowed: boolean;
  subName: string;
}

const JsonManager: React.FC<JsonManagerProps> = ({ editingAllowed, subName }) => {
  const [jsonXData, setJsonXData] = useState(() => {
    const saved = localStorage.getItem('json-x-data');
    return saved || '{\n  "subName": "",\n  "example": "JSON X data",\n  "timestamp": "2024-01-01T00:00:00Z",\n  "data": {\n    "key": "value"\n  }\n}';
  });
  const [jsonYData, setJsonYData] = useState(() => {
    const saved = localStorage.getItem('json-y-data');
    return saved || '{\n  "subName": "",\n  "example": "JSON Y data",\n  "timestamp": "2024-01-01T00:00:00Z",\n  "data": {\n    "key": "value"\n  }\n}';
  });
  // subName is now passed as a prop from parent
  const [jsonZData, setJsonZData] = useState(() => {
    const saved = localStorage.getItem('json-z-data');
    return saved || '{\n  "subName": "",\n  "example": "JSON Z data",\n  "timestamp": "2024-01-01T00:00:00Z",\n  "data": {\n    "key": "value"\n  }\n}';
  });
  const [lastUpdatedZ, setLastUpdatedZ] = useState<Date>(new Date());
  const [lastUpdatedX, setLastUpdatedX] = useState<Date>(new Date());
  const [lastUpdatedY, setLastUpdatedY] = useState<Date>(new Date());

  // Update all JSONs when subName changes
  useEffect(() => {
    if (typeof subName !== 'string') return;
    try {
      const updateJson = (json: string) => {
        const parsed = JSON.parse(json);
        parsed.subName = subName;
        if ('yourName' in parsed) delete parsed.yourName;
        return JSON.stringify(parsed, null, 2);
      };
      setJsonXData(j => updateJson(j));
      setJsonYData(j => updateJson(j));
      setJsonZData(j => updateJson(j));
    } catch {}
  }, [subName]);

  // Remove auto-update of lastUpdatedX and lastUpdatedY on JSON change

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
