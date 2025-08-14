import React, { useState, useEffect } from "react";
import UserInfoCard from "@/components/UserInfoCard";
import JsonEditorCard from "@/components/JsonEditorCard";
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface JsonManagerProps {
  editingAllowed: boolean;
}

const JsonManager: React.FC<JsonManagerProps> = ({ editingAllowed }) => {
  const [jsonXData, setJsonXData] = useState(() => {
    const saved = localStorage.getItem('json-x-data');
    return saved || '{\n  "username": "",\n  "example": "JSON X data",\n  "timestamp": "2024-01-01T00:00:00Z",\n  "data": {\n    "key": "value"\n  }\n}';
  });
  const [jsonYData, setJsonYData] = useState(() => {
    const saved = localStorage.getItem('json-y-data');
    return saved || '{\n  "username": "",\n  "example": "JSON Y data",\n  "timestamp": "2024-01-01T00:00:00Z",\n  "data": {\n    "key": "value"\n  }\n}';
  });
  const [username, setUsername] = useState("");
  const [largeView, setLargeView] = useState<null | 'X' | 'Y' | 'Z'>(null);
  const [jsonZData, setJsonZData] = useState(() => {
    const saved = localStorage.getItem('json-z-data');
    return saved || '{\n  "username": "",\n  "example": "JSON Z data",\n  "timestamp": "2024-01-01T00:00:00Z",\n  "data": {\n    "key": "value"\n  }\n}';
  });
  const [lastUpdatedZ, setLastUpdatedZ] = useState<Date>(new Date());
  const [lastUpdatedX, setLastUpdatedX] = useState<Date>(new Date());
  const [lastUpdatedY, setLastUpdatedY] = useState<Date>(new Date());

  // Update JSON Z when username changes
  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonZData);
      parsedJson.username = username;
      if ('yourName' in parsedJson) delete parsedJson.yourName;
      const updatedJson = JSON.stringify(parsedJson, null, 2);
      setJsonZData(updatedJson);
    } catch (error) {
      // If JSON is invalid, don't update
    }
  }, [username]);

  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonXData);
      parsedJson.username = username;
      // Remove yourName if present
      if ('yourName' in parsedJson) delete parsedJson.yourName;
      const updatedJson = JSON.stringify(parsedJson, null, 2);
      setJsonXData(updatedJson);
    } catch (error) {
      // If JSON is invalid, don't update
    }
  }, [username]);

  // Update JSON Y when username changes
  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonYData);
      parsedJson.username = username;
      // Remove yourName if present
      if ('yourName' in parsedJson) delete parsedJson.yourName;
      const updatedJson = JSON.stringify(parsedJson, null, 2);
      setJsonYData(updatedJson);
    } catch (error) {
      // If JSON is invalid, don't update
    }
  }, [username]);

  // Remove auto-update of lastUpdatedX and lastUpdatedY on JSON change

  // Parse username from JSON when JSON changes manually (for JSON X)
  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonXData);
      if (parsedJson.username !== username) {
        setUsername(parsedJson.username || "");
      }
    } catch (error) {
      // If JSON is invalid, don't update
    }
  }, [jsonXData]);

  // Parse username from JSON when JSON changes manually (for JSON Z)
  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonZData);
      if (parsedJson.username !== username) {
        setUsername(parsedJson.username || "");
      }
    } catch (error) {
      // If JSON is invalid, don't update
    }
  }, [jsonZData]);
  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonYData);
      if (parsedJson.username !== username) {
        setUsername(parsedJson.username || "");
      }
    } catch (error) {
      // If JSON is invalid, don't update
    }
  }, [jsonYData]);

  const handleCopy = async (data: string, type: string) => {
    try {
      await navigator.clipboard.writeText(data);
    } catch (err) {
      // Could not copy to clipboard
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
      <div className="grid lg:grid-cols-3 gap-6">
        <div>
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
            extraButton={<button className="mt-2 w-full py-2 px-4 bg-gray-700 text-white rounded" onClick={() => setLargeView('X')}>{editingAllowed ? 'Edit' : 'View Large'}</button>}
          />
        </div>
        <div>
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
            extraButton={<button className="mt-2 w-full py-2 px-4 bg-gray-700 text-white rounded" onClick={() => setLargeView('Y')}>{editingAllowed ? 'Edit' : 'View Large'}</button>}
          />
        </div>
        <div>
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
            extraButton={<button className="mt-2 w-full py-2 px-4 bg-gray-700 text-white rounded" onClick={() => setLargeView('Z')}>{editingAllowed ? 'Edit' : 'View Large'}</button>}
          />
        </div>
      </div>
      <Dialog open={largeView !== null} onOpenChange={() => setLargeView(null)}>
        <DialogContent className="max-w-5xl">
          {largeView === 'X' && (
            <div>
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
              {editingAllowed && (
                <div className="flex gap-2 mt-4">
                  <button
                    className="py-2 px-4 bg-gray-600 text-white rounded disabled:opacity-50"
                    onClick={() => formatJson(jsonXData, setJsonXData, 'JSON X')}
                    disabled={!isValidJson(jsonXData)}
                  >
                    Format
                  </button>
                  <button
                    className="py-2 px-4 bg-blue-600 text-white rounded disabled:opacity-50 flex-1"
                    onClick={handleSaveJsonX}
                    disabled={!isValidJson(jsonXData)}
                  >
                    Save JSON X
                  </button>
                </div>
              )}
            </div>
          )}
          {largeView === 'Y' && (
            <div>
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
              {editingAllowed && (
                <div className="flex gap-2 mt-4">
                  <button
                    className="py-2 px-4 bg-gray-600 text-white rounded disabled:opacity-50"
                    onClick={() => formatJson(jsonYData, setJsonYData, 'JSON Y')}
                    disabled={!isValidJson(jsonYData)}
                  >
                    Format
                  </button>
                  <button
                    className="py-2 px-4 bg-blue-600 text-white rounded disabled:opacity-50 flex-1"
                    onClick={handleSaveJsonY}
                    disabled={!isValidJson(jsonYData)}
                  >
                    Save JSON Y
                  </button>
                </div>
              )}
            </div>
          )}
          {largeView === 'Z' && (
            <div>
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
              {editingAllowed && (
                <div className="flex gap-2 mt-4">
                  <button
                    className="py-2 px-4 bg-gray-600 text-white rounded disabled:opacity-50"
                    onClick={() => formatJson(jsonZData, setJsonZData, 'JSON Z')}
                    disabled={!isValidJson(jsonZData)}
                  >
                    Format
                  </button>
                  <button
                    className="py-2 px-4 bg-blue-600 text-white rounded disabled:opacity-50 flex-1"
                    onClick={handleSaveJsonZ}
                    disabled={!isValidJson(jsonZData)}
                  >
                    Save JSON Z
                  </button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <UserInfoCard
        username={username}
        setUsername={setUsername}
      />
    </>
  );
};

export default JsonManager;
