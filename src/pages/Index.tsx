import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Copy, FileJson, Calendar, User, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [jsonXData, setJsonXData] = useState('{\n  "username": "",\n  "yourName": "",\n  "example": "JSON X data",\n  "timestamp": "2024-01-01T00:00:00Z",\n  "data": {\n    "key": "value"\n  }\n}');
  const [jsonYData, setJsonYData] = useState('{\n  "username": "",\n  "yourName": "",\n  "example": "JSON Y data",\n  "timestamp": "2024-01-01T00:00:00Z",\n  "data": {\n    "key": "value"\n  }\n}');
  const [username, setUsername] = useState('');
  const [yourName, setYourName] = useState('');
  const [lastUpdatedX, setLastUpdatedX] = useState<Date>(new Date());
  const [lastUpdatedY, setLastUpdatedY] = useState<Date>(new Date());
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const { toast } = useToast();

  // Define authorized admin username
  const AUTHORIZED_ADMIN = 'admin';

  // Load username, name, and admin mode from localStorage on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('json-editor-username');
    const savedYourName = localStorage.getItem('json-editor-yourname');
    const savedAdminMode = localStorage.getItem('json-editor-admin-mode');
    const savedAdminUsername = localStorage.getItem('json-editor-admin-username');
    
    if (savedUsername) {
      setUsername(savedUsername);
    }
    if (savedYourName) {
      setYourName(savedYourName);
    }
    if (savedAdminUsername) {
      setAdminUsername(savedAdminUsername);
    }
    if (savedAdminMode && savedAdminUsername === AUTHORIZED_ADMIN) {
      setIsAdminMode(savedAdminMode === 'true');
    }
  }, []);

  // Save username to localStorage when it changes
  useEffect(() => {
    if (username) {
      localStorage.setItem('json-editor-username', username);
    }
  }, [username]);

  // Save yourName to localStorage when it changes
  useEffect(() => {
    if (yourName) {
      localStorage.setItem('json-editor-yourname', yourName);
    }
  }, [yourName]);

  // Save admin username to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('json-editor-admin-username', adminUsername);
  }, [adminUsername]);

  // Save admin mode to localStorage when it changes (only if authorized)
  useEffect(() => {
    if (adminUsername === AUTHORIZED_ADMIN) {
      localStorage.setItem('json-editor-admin-mode', isAdminMode.toString());
    } else {
      localStorage.setItem('json-editor-admin-mode', 'false');
    }
  }, [isAdminMode, adminUsername]);

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
        setUsername(parsedJson.username || '');
      }
      if (parsedJson.yourName !== yourName) {
        setYourName(parsedJson.yourName || '');
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
        setUsername(parsedJson.username || '');
      }
      if (parsedJson.yourName !== yourName) {
        setYourName(parsedJson.yourName || '');
      }
    } catch (error) {
      // If JSON is invalid, don't update
    }
  }, [jsonYData]);

  // Check if current user is authorized admin
  const isAuthorizedAdmin = adminUsername === AUTHORIZED_ADMIN;
  // Editing allowed only when admin mode is enabled by authorized admin
  const editingAllowed = isAdminMode && isAuthorizedAdmin;
  
  const handleAdminModeToggle = (checked: boolean) => {
    if (!isAuthorizedAdmin) {
      toast({
        title: "Access Denied",
        description: "Only authorized administrators can enable admin mode",
        variant: "destructive",
      });
      return;
    }
    setIsAdminMode(checked);
  };

  const handleCopy = async (data: string, type: string) => {
    try {
      await navigator.clipboard.writeText(data);
      toast({
        title: "Copied!",
        description: `${type} data has been copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
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

  const formatJson = (data: string, setter: (value: string) => void, type: string) => {
    if (!isAdminMode) {
      toast({
        title: "Access Denied",
        description: "Admin mode required to format JSON",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const formatted = JSON.stringify(JSON.parse(data), null, 2);
      setter(formatted);
      toast({
        title: "Formatted!",
        description: `${type} has been formatted with proper indentation`,
      });
    } catch {
      toast({
        title: "Format failed",
        description: "Invalid JSON cannot be formatted",
        variant: "destructive",
      });
    }
  };

  const handleJsonChange = (value: string, setter: (value: string) => void, type: string) => {
    if (!isAdminMode) {
      toast({
        title: "Access Denied",
        description: "Admin mode required to edit JSON",
        variant: "destructive",
      });
      return;
    }
    setter(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileJson className="h-8 w-8 text-slate-600" />
            <h1 className="text-3xl font-bold text-slate-800">JSON Editor</h1>
          </div>
          <p className="text-slate-600 text-lg">
            Manage two separate JSON datasets with shared username and name fields
          </p>
        </div>

        {/* Shared Username and Name Fields */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-700">
              <User className="h-5 w-5" />
              Shared User Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <User className="h-4 w-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yourName" className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <User className="h-4 w-4" />
                  Your Name
                </Label>
                <Input
                  id="yourName"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  placeholder="Enter your name"
                  className="text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* JSON X Card */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-slate-700">
                  <FileJson className="h-5 w-5" />
                  JSON X
                </CardTitle>
                <Button
                  onClick={() => handleCopy(jsonXData, 'JSON X')}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2 px-6 py-3"
                >
                  <Copy className="h-5 w-5" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <textarea
                  value={jsonXData}
                  onChange={(e) => handleJsonChange(e.target.value, setJsonXData, 'JSON X')}
                  className={`w-full min-h-[300px] p-4 rounded-lg border-2 font-mono text-sm leading-relaxed resize-y transition-colors ${
                    editingAllowed
                      ? (isValidJson(jsonXData)
                          ? 'border-green-200 focus:border-green-400 bg-green-50/50'
                          : 'border-red-200 focus:border-red-400 bg-red-50/50')
                      : 'border-slate-200 focus:border-slate-300 bg-white'
                  } focus:outline-none ${
                    editingAllowed
                      ? (isValidJson(jsonXData) ? 'focus:ring-2 focus:ring-offset-2 focus:ring-green-300' : 'focus:ring-2 focus:ring-offset-2 focus:ring-red-300')
                      : ''
                  } ${!editingAllowed ? 'cursor-not-allowed opacity-60' : ''}`}
                  placeholder="Enter JSON X data here..."
                  spellCheck={false}
                  readOnly={!editingAllowed}
                />
                {editingAllowed && (
                  <div className="absolute top-2 right-2">
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        isValidJson(jsonXData)
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      {isValidJson(jsonXData) ? 'Valid JSON' : 'Invalid JSON'}
                    </div>
                  </div>
                )}
              </div>

              <Card className="bg-slate-50 border border-slate-200">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">Last Updated:</span>
                    <span className="text-sm font-mono bg-white px-2 py-1 rounded border">
                      {formatDate(lastUpdatedX)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => formatJson(jsonXData, setJsonXData, 'JSON X')}
                  variant="outline"
                  size="sm"
                  className="text-slate-600"
                  disabled={!isValidJson(jsonXData) || !(isAdminMode && isAuthorizedAdmin)}
                >
                  Format
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* JSON Y Card */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-slate-700">
                  <FileJson className="h-5 w-5" />
                  JSON Y
                </CardTitle>
                <Button
                  onClick={() => handleCopy(jsonYData, 'JSON Y')}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2 px-6 py-3"
                >
                  <Copy className="h-5 w-5" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <textarea
                  value={jsonYData}
                  onChange={(e) => handleJsonChange(e.target.value, setJsonYData, 'JSON Y')}
                  className={`w-full min-h-[300px] p-4 rounded-lg border-2 font-mono text-sm leading-relaxed resize-y transition-colors ${
                    editingAllowed
                      ? (isValidJson(jsonYData)
                          ? 'border-green-200 focus:border-green-400 bg-green-50/50'
                          : 'border-red-200 focus:border-red-400 bg-red-50/50')
                      : 'border-slate-200 focus:border-slate-300 bg-white'
                  } focus:outline-none ${
                    editingAllowed
                      ? (isValidJson(jsonYData) ? 'focus:ring-2 focus:ring-offset-2 focus:ring-green-300' : 'focus:ring-2 focus:ring-offset-2 focus:ring-red-300')
                      : ''
                  } ${!editingAllowed ? 'cursor-not-allowed opacity-60' : ''}`}
                  placeholder="Enter JSON Y data here..."
                  spellCheck={false}
                  readOnly={!editingAllowed}
                />
                {editingAllowed && (
                  <div className="absolute top-2 right-2">
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        isValidJson(jsonYData)
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      {isValidJson(jsonYData) ? 'Valid JSON' : 'Invalid JSON'}
                    </div>
                  </div>
                )}
              </div>

              <Card className="bg-slate-50 border border-slate-200">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">Last Updated:</span>
                    <span className="text-sm font-mono bg-white px-2 py-1 rounded border">
                      {formatDate(lastUpdatedY)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => formatJson(jsonYData, setJsonYData, 'JSON Y')}
                  variant="outline"
                  size="sm"
                  className="text-slate-600"
                  disabled={!isValidJson(jsonYData) || !(isAdminMode && isAuthorizedAdmin)}
                >
                  Format
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Administrator Mode Toggle - Moved to bottom */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-700">
              <Shield className="h-5 w-5" />
              Administrator Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-username" className="text-sm font-medium text-slate-600">
                Admin Username
              </Label>
              <Input
                id="admin-username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="Enter admin username"
                className="text-sm"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Switch
                id="admin-mode"
                checked={isAdminMode && isAuthorizedAdmin}
                onCheckedChange={handleAdminModeToggle}
                disabled={!isAuthorizedAdmin}
              />
              <Label htmlFor="admin-mode" className="text-sm font-medium text-slate-600">
                {isAuthorizedAdmin 
                  ? (isAdminMode ? 'Admin mode enabled - JSON editing allowed' : 'Admin mode disabled - JSON editing restricted')
                  : 'Enter valid admin username to enable admin mode'
                }
              </Label>
            </div>
            {!isAuthorizedAdmin && adminUsername && (
              <p className="text-sm text-red-600">Invalid admin username. Access denied.</p>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>Each JSON editor tracks changes independently • Shared username and name fields • Copy functionality included</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
