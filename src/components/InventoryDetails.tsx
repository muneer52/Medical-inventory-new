import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, ChevronLeft, Lock } from 'lucide-react';
import { getInventoryDetails, InventoryDetails } from '../lib/inventory';
import MedicineList from './MedicineList';
import ShoppingList from './ShoppingList';

interface InventoryDetailsViewProps {
  inventoryId: string;
  onBack?: () => void;
}

/**
 * InventoryDetails Component
 * Displays inventory information and member list
 */
export function InventoryDetailsView({ inventoryId, onBack }: InventoryDetailsViewProps) {
  const [details, setDetails] = useState<InventoryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getInventoryDetails(inventoryId);
        setDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load inventory details');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [inventoryId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6 text-center">
        <p className="text-slate-400">Loading inventory details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/50 p-6 text-red-300">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!details) return null;

  const { inventory, members, is_owner } = details;

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
      >
        <ChevronLeft className="h-5 w-5" />
        Back to Inventories
      </button>

      <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
        <h2 className="text-3xl font-bold text-slate-100">{inventory.name}</h2>
        <p className="mt-2 text-sm text-slate-400">
          Created {new Date(inventory.created_at).toLocaleDateString()}
        </p>

        {is_owner && (
          <div className="mt-4 inline-block rounded-lg bg-cyan-950/50 px-3 py-1 text-sm text-cyan-300">
            You are the owner of this inventory
          </div>
        )}

        <div className="mt-5 rounded-2xl border border-slate-700/60 bg-slate-950/60 p-4">
          <p className="text-sm font-medium text-slate-300">Invite Code</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <code className="rounded-lg bg-slate-900 px-3 py-2 text-cyan-300 font-mono text-sm">
              {inventory.invite_code}
            </code>
            <span className="text-sm text-slate-500">
              Share this code with collaborators. Joining by code grants instant access.
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-5 w-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-slate-100">Members</h3>
        </div>

        {members.length === 0 ? (
          <p className="text-slate-400">No members yet</p>
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/30 p-3"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-100">{member.email || 'Unknown'}</p>
                  <p className="text-xs text-slate-500">
                    Joined {new Date(member.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-sm text-slate-400">
                  {member.status === 'approved' && (
                    <span className="text-green-400">Approved</span>
                  )}
                  {member.status === 'pending' && (
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Lock className="h-3 w-3" />
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <MedicineList inventoryId={inventory.id} isOwner={is_owner} />
        <ShoppingList inventoryId={inventory.id} />
      </div>
    </div>
  );
}
