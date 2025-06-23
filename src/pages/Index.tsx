import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, FileJson, Calendar, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [jsonXData, setJsonXData] = useState('{\n  "username": "",\n  "yourName": "",\n  "example": "JSON X data",\n  "timestamp": "2024-01-01T00:00:00Z",\n  "data": {\n    "key": "value"\n  }\n}');
  const [jsonYData, setJsonYData] = useState('{\n  "username": "",\n  "yourName": "",\n  "example": "JSON Y data",\n  "timestamp": "2024-01-01T00:00:00Z",\n  "data": {\n    "key": "value"\n  }\n}');
  const [username, setUsername] = useState('');
  const [yourName, setYourName] = useState('');
  const [lastUpdatedX, setLastUpdatedX] = useState<Date>(new Date());
  const [lastUpdatedY, setLastUpdatedY] = useState<Date>(new Date());
  const { toast } = useToast();

  // Load username and name from localStorage on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('json-editor-username');
    const savedYourName = localStorage.getItem('json-editor-yourname');
    
    if (savedUsername) {
      setUsername(savedUsername);
    }
    if (savedYourName) {
      setYourName(savedYourName);
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
                  onChange={(e) => setJsonXData(e.target.value)}
                  className={`w-full min-h-[300px] p-4 rounded-lg border-2 font-mono text-sm leading-relaxed resize-y transition-colors ${
                    isValidJson(jsonXData)
                      ? 'border-green-200 focus:border-green-400 bg-green-50/50'
                      : 'border-red-200 focus:border-red-400 bg-red-50/50'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isValidJson(jsonXData) ? 'focus:ring-green-300' : 'focus:ring-red-300'
                  }`}
                  placeholder="Enter JSON X data here..."
                  spellCheck={false}
                />
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
                  disabled={!isValidJson(jsonXData)}
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
                  onChange={(e) => setJsonYData(e.target.value)}
                  className={`w-full min-h-[300px] p-4 rounded-lg border-2 font-mono text-sm leading-relaxed resize-y transition-colors ${
                    isValidJson(jsonYData)
                      ? 'border-green-200 focus:border-green-400 bg-green-50/50'
                      : 'border-red-200 focus:border-red-400 bg-red-50/50'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isValidJson(jsonYData) ? 'focus:ring-green-300' : 'focus:ring-red-300'
                  }`}
                  placeholder="Enter JSON Y data here..."
                  spellCheck={false}
                />
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
                  disabled={!isValidJson(jsonYData)}
                >
                  Format
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>Each JSON editor tracks changes independently • Shared username and name fields • Copy functionality included</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
