import { useState } from 'react';

export default function RoleSwitcher({ onRoleChange }) {
  const [activeRole, setActiveRole] = useState('student');
  
  const handleToggle = async (role) => {
    setActiveRole(role);
    if (onRoleChange) {
      onRoleChange(role);
    }
    

  };
  
  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 z-50">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700"></span>
        <div className="flex bg-gray-200 rounded-lg">
          
          
        </div>
      </div>
    </div>
  );
}