import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { getLowStockMedicines, Medicine } from '../lib/inventory';

interface ShoppingListProps {
  inventoryId: string;
}

const statusColors = {
  CRITICAL: 'border-red-500 bg-slate-950 text-rose-300',
  LOW: 'border-amber-500 bg-slate-950 text-amber-300',
  OK: 'border-emerald-500 bg-slate-950 text-emerald-300',
};

const ShoppingList: React.FC<ShoppingListProps> = ({ inventoryId }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLowStockMedicines();
  }, [inventoryId]);

  const loadLowStockMedicines = async () => {
    try {
      setLoading(true);
      const data = await getLowStockMedicines(inventoryId);
      setMedicines(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shopping list');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 text-center text-slate-400">Loading shopping list...</div>;
  }

  return (
<div className="space-y-4 rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
      <div className="flex items-center gap-2">
        <ShoppingCart className="text-cyan-400" size={24} />
        <h2 className="text-2xl font-bold text-slate-100">Shopping List</h2>
      </div>

      {error && (
        <div className="bg-rose-950 border border-rose-600 text-rose-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {medicines.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p>All medicines are in stock! ✓</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {medicines.map(medicine => (
            <div
              key={medicine.id}
              className={`border-l-4 rounded-lg p-4 ${statusColors[medicine.status || 'LOW']}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">{medicine.name}</h3>
                  <p className="text-sm mt-1 text-slate-300">
                    Category: {medicine.category} | Current: {medicine.quantity} | Needed: {medicine.threshold}
                  </p>
                  {medicine.status === 'CRITICAL' && (
                    <p className="text-sm font-bold text-red-700 mt-1">
                      ⚠️ Out of stock - needs immediate replenishment
                    </p>
                  )}
                </div>
                <span className="bg-slate-950 px-3 py-1 rounded font-semibold text-slate-100">
                  {medicine.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
        <p className="text-sm text-slate-300">
          <strong>Legend:</strong> Items on this list have quantity below or equal to their threshold.
          <br />
          <strong className="text-rose-300">CRITICAL</strong> = Quantity is 0
          <br />
          <strong className="text-amber-300">LOW</strong> = Quantity ≤ Threshold
        </p>
      </div>
    </div>
  );
};

export default ShoppingList;
