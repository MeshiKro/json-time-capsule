
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, FileJson, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [jsonData, setJsonData] = useState('{\n  "example": "Enter your JSON data here",\n  "timestamp": "2024-01-01T00:00:00Z",\n  "data": {\n    "key": "value"\n  }\n}');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { toast } = useToast();

  // Update the last updated date whenever JSON data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (jsonData.trim()) {
        setLastUpdated(new Date());
      }
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timer);
  }, [jsonData]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonData);
      toast({
        title: "Copied!",
        description: "JSON data has been copied to clipboard",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileJson className="h-8 w-8 text-slate-600" />
            <h1 className="text-3xl font-bold text-slate-800">JSON Editor</h1>
          </div>
          <p className="text-slate-600 text-lg">
            Paste, edit, and manage your JSON data with automatic timestamp tracking
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-slate-700">
                <FileJson className="h-5 w-5" />
                JSON Data
              </CardTitle>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* JSON Input Field */}
            <div className="relative">
              <textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                className={`w-full min-h-[400px] p-4 rounded-lg border-2 font-mono text-sm leading-relaxed resize-y transition-colors ${
                  isValidJson(jsonData)
                    ? 'border-green-200 focus:border-green-400 bg-green-50/50'
                    : 'border-red-200 focus:border-red-400 bg-red-50/50'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isValidJson(jsonData) ? 'focus:ring-green-300' : 'focus:ring-red-300'
                }`}
                placeholder="Enter your JSON data here..."
                spellCheck={false}
              />
              <div className="absolute top-2 right-2">
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    isValidJson(jsonData)
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}
                >
                  {isValidJson(jsonData) ? 'Valid JSON' : 'Invalid JSON'}
                </div>
              </div>
            </div>

            {/* Last Updated Section */}
            <Card className="bg-slate-50 border border-slate-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Last Updated:</span>
                  <span className="text-sm font-mono bg-white px-2 py-1 rounded border">
                    {formatDate(lastUpdated)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setJsonData('')}
                variant="outline"
                size="sm"
                className="text-slate-600"
              >
                Clear
              </Button>
              <Button
                onClick={() => {
                  try {
                    const formatted = JSON.stringify(JSON.parse(jsonData), null, 2);
                    setJsonData(formatted);
                    toast({
                      title: "Formatted!",
                      description: "JSON has been formatted with proper indentation",
                    });
                  } catch {
                    toast({
                      title: "Format failed",
                      description: "Invalid JSON cannot be formatted",
                      variant: "destructive",
                    });
                  }
                }}
                variant="outline"
                size="sm"
                className="text-slate-600"
                disabled={!isValidJson(jsonData)}
              >
                Format
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>Changes are automatically timestamped • Copy functionality included</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
