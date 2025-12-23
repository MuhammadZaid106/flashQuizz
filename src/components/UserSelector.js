import React, { useState, useEffect, useRef } from 'react';
import { getUsers, saveUsers, getCurrentUser, setCurrentUser } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

const UserSelector = ({ currentUser, onChange }) => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const handleCreate = () => {
    if (!name) return;
    const normalized = name.trim();
    if (!normalized) return;
    const updated = Array.from(new Set([normalized, ...users]));
    saveUsers(updated);
    setUsers(updated);
    setName('');
    setCurrentUser(normalized);
    onChange(normalized);
    setOpen(false);
  };

  const handleSelect = (u) => {
    setCurrentUser(u);
    onChange(u);
    setOpen(false);
  };

  const displayName = currentUser && currentUser !== 'default' ? currentUser : 'Default';
  const auth = useAuth();
  const authUser = auth && auth.currentUser ? auth.currentUser : null;
  const displayNameFinal = authUser && authUser.displayName ? authUser.displayName : displayName;
  const initial = displayNameFinal && displayNameFinal[0] ? displayNameFinal[0].toUpperCase() : 'U';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex items-center space-x-2 px-2 py-1 bg-transparent rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-semibold">{initial}</div>
        <span className="text-sm text-gray-800 dark:text-gray-100 hidden sm:inline">{displayNameFinal}</span>
        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-50">
          {authUser ? (
            <div className="space-y-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">Signed in as</div>
              <div className="font-medium">{displayNameFinal}</div>
              <div className="pt-2">
                <button
                  onClick={async () => {
                    if (auth && auth.logout) {
                      try { await auth.logout(); } catch (e) { /* ignore */ }
                    }
                    // revert to default local user
                    setCurrentUser('default');
                    onChange('default');
                    setOpen(false);
                  }}
                  className="w-full px-3 py-2 bg-red-500 text-white rounded-md text-sm"
                >Sign out</button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Choose user</label>
              <select
                value={currentUser}
                onChange={(e) => handleSelect(e.target.value)}
                className="w-full mb-2 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded-md bg-transparent text-sm"
              >
                <option value="default">Default</option>
                {users.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>

              <div className="flex items-center space-x-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="New user"
                  className="flex-1 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
                />
                <button onClick={handleCreate} className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm">Add</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSelector;
