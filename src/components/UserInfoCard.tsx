import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

interface UserInfoCardProps {
  username: string;
  setUsername: (value: string) => void;
}


const UserInfoCard: React.FC<UserInfoCardProps> = ({ username, setUsername }) => (
  <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm max-w-md">
    <CardHeader className="pb-2 pt-3">
      <CardTitle className="flex items-center gap-2 text-slate-700 text-sm">
        <User className="h-4 w-4" />
        Shared User Information
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0 pb-3">
      <div className="space-y-1">
        <Label htmlFor="username" className="flex items-center gap-1 text-xs font-medium text-slate-600">
          <User className="h-3 w-3" />
          Username
        </Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="text-xs h-8"
        />
      </div>
    </CardContent>
  </Card>
);

export default UserInfoCard;
