import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import useBrowserStore from '../store/browserStore';

const TabGroupMenu = ({ onClose }) => {
  const { tabGroups, createGroup, deleteGroup } = useBrowserStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');

  const colors = [
    '#ef4444', '#f97316', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
    '#ec4899', '#f43f5e', '#6b7280'
  ];

  const handleCreateGroup = async () => {
    if (newGroupName.trim()) {
      await createGroup(newGroupName, selectedColor);
      setNewGroupName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="dropdown-menu">
      <div className="dropdown-item" style={{ fontWeight: 'bold' }}>
        Tab Groups
      </div>
      <div className="dropdown-divider" />
      
      {Array.from(tabGroups.values()).map(group => (
        <div key={group.id} className="dropdown-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span 
              style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '2px', 
                backgroundColor: group.color 
              }} 
            />
            {group.name}
          </span>
          <X 
            size={14} 
            onClick={(e) => {
              e.stopPropagation();
              deleteGroup(group.id);
            }}
            style={{ cursor: 'pointer' }}
          />
        </div>
      ))}
      
      {isCreating ? (
        <>
          <div className="dropdown-divider" />
          <div style={{ padding: '8px' }}>
            <input
              type="text"
              placeholder="Group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateGroup()}
              style={{
                width: '100%',
                padding: '4px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px',
                marginBottom: '8px'
              }}
              autoFocus
            />
            <div className="color-picker">
              {colors.map(color => (
                <div
                  key={color}
                  className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button 
                onClick={handleCreateGroup}
                style={{
                  flex: 1,
                  padding: '4px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Create
              </button>
              <button 
                onClick={() => setIsCreating(false)}
                style={{
                  flex: 1,
                  padding: '4px',
                  background: '#e5e5e5',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="dropdown-divider" />
          <div 
            className="dropdown-item"
            onClick={() => setIsCreating(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={14} />
            New Group
          </div>
        </>
      )}
    </div>
  );
};

export default TabGroupMenu;
