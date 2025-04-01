
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface AdminModeToggleProps {
  isAdmin: boolean;
  onToggle: (isAdmin: boolean) => void;
}

const AdminModeToggle: React.FC<AdminModeToggleProps> = ({ isAdmin, onToggle }) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="admin-mode" 
        checked={isAdmin} 
        onCheckedChange={onToggle} 
      />
      <Label htmlFor="admin-mode" className="text-xs">
        {isAdmin ? 'Admin Mode' : 'Client Mode'}
      </Label>
    </div>
  );
};

export default AdminModeToggle;
