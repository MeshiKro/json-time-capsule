import React from 'react';
import { FileJson } from 'lucide-react';

const Header: React.FC = () => (
  <div className="text-center space-y-2">
    <div className="flex items-center justify-center gap-2 mb-4">
      <FileJson className="h-8 w-8 text-slate-600" />
      <h1 className="text-3xl font-bold text-slate-800">JSON Editor</h1>
    </div>
    <p className="text-slate-600 text-lg">
      Manage two separate JSON datasets with shared username and name fields
    </p>
  </div>
);

export default Header;
