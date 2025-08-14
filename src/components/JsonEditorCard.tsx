import React, { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, FileJson, Calendar } from "lucide-react";

interface JsonEditorCardProps {
  title: string;
  jsonData: string;
  setJsonData: (value: string) => void;
  lastUpdated: Date;
  handleCopy: (data: string, type: string) => void;
  formatJson: (
    data: string,
    setter: (value: string) => void,
    type: string
  ) => void;
  handleJsonChange: (
    value: string,
    setter: (value: string) => void,
    type: string
  ) => void;
  editingAllowed: boolean;
  isValidJson: (str: string) => boolean;
  extraButton?: ReactNode;
}

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

const JsonEditorCard: React.FC<JsonEditorCardProps> = ({
  title,
  jsonData,
  setJsonData,
  lastUpdated,
  handleCopy,
  formatJson,
  handleJsonChange,
  editingAllowed,
  isValidJson,
  extraButton,
}) => (
  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-slate-700">
          <FileJson className="h-5 w-5" />
          {title}
        </CardTitle>
        <Button
          onClick={() => handleCopy(jsonData, title)}
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
          value={jsonData}
          onChange={(e) => handleJsonChange(e.target.value, setJsonData, title)}
          className={`w-full min-h-[300px] p-4 rounded-lg border-2 font-mono text-sm leading-relaxed resize-y transition-colors
            ${
              editingAllowed
                ? isValidJson(jsonData)
                  ? "border-green-200 focus:border-green-400 bg-green-50/50 text-black"
                  : "border-red-200 focus:border-red-400 bg-red-50/50 text-black"
                : "border-slate-200 focus:border-slate-300 text-black bg-white"
            }
            focus:outline-none
            ${
              editingAllowed
                ? isValidJson(jsonData)
                  ? "focus:ring-2 focus:ring-offset-2 focus:ring-green-300"
                  : "focus:ring-2 focus:ring-offset-2 focus:ring-red-300"
                : ""
            }
           `}
          placeholder={`Enter ${title} data here...`}
          spellCheck={false}
          readOnly={!editingAllowed}
        />
        {editingAllowed && (
          <div className="absolute top-2 right-2">
            <div
              className={`px-2 py-1 rounded text-xs font-medium ${
                isValidJson(jsonData)
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {isValidJson(jsonData) ? "Valid JSON" : "Invalid JSON"}
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
              {formatDate(lastUpdated)}
            </span>
          </div>
        </CardContent>
      </Card>
      {extraButton && <div className="pt-2">{extraButton}</div>}
    </CardContent>
  </Card>
);

export default JsonEditorCard;
