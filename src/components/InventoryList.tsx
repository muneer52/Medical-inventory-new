import React, { useState, useEffect } from 'react';
import { Folder, AlertCircle, Users } from 'lucide-react';
import { listUserInventories, Inventory } from '../lib/inventory';

interface InventoryListProps {
  onSelectInventory?: (id: string) => void;
  refreshTrigger?: number;
}

/**
 * InventoryList Component
 * Displays owned and approved inventories
 */
export function InventoryList({ onSelectInventory, refreshTrigger }: InventoryListProps) {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInventories = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listUserInventories();
        setInventories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load inventories');
      } finally {
        setLoading(false);
      }
    };

    loadInventories();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6 text-center">
        <p className="text-slate-400">Loading inventories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/50 p-6 text-red-300">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  if (inventories.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6 text-center">
        <Folder className="mx-auto h-12 w-12 text-slate-500 mb-3" />
        <p className="text-slate-400">No inventories yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {inventories.map((inv) => (
        <div
          key={inv.id}
          onClick={() => onSelectInventory?.(inv.id)}
          className="group rounded-2xl border border-slate-700 bg-slate-900/50 p-4 hover:border-cyan-500 hover:bg-slate-900 transition cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-100 group-hover:text-cyan-300">{inv.name}</h3>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                <Users className="h-4 w-4" />
                <span className="capitalize">{inv.role || 'member'}</span>
              </div>
            </div>
            <div className="text-xs text-slate-500">{new Date(inv.created_at).toLocaleDateString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
