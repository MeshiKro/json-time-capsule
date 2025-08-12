import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

interface UserInfoCardProps {
  username: string;
  setUsername: (value: string) => void;
  yourName: string;
  setYourName: (value: string) => void;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ username, setUsername, yourName, setYourName }) => (
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
);

export default UserInfoCard;
