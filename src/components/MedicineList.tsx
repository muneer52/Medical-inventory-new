import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { listMedicines, deleteMedicine, updateMedicine, Medicine } from '../lib/inventory';
import MedicineForm from './MedicineForm';

interface MedicineListProps {
  inventoryId: string;
  isOwner: boolean;
}

const statusColors = {
  CRITICAL: 'border-red-500 bg-slate-950 text-red-300',
  LOW: 'border-amber-500 bg-slate-950 text-amber-300',
  OK: 'border-emerald-500 bg-slate-950 text-emerald-300',
};

const MedicineList: React.FC<MedicineListProps> = ({ inventoryId, isOwner }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  useEffect(() => {
    loadMedicines();
  }, [inventoryId]);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      const data = await listMedicines(inventoryId);
      setMedicines(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (medicineId: string) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;

    try {
      await deleteMedicine(medicineId);
      setMedicines(medicines.filter(m => m.id !== medicineId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete medicine');
    }
  };

  const handleAdjustQuantity = async (medicine: Medicine, delta: number) => {
    const newQuantity = Math.max(0, medicine.quantity + delta);
    try {
      const updated = await updateMedicine(medicine.id, { quantity: newQuantity });
      setMedicines(medicines.map(m => m.id === medicine.id ? updated : m));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    setEditingMedicine(null);
    await loadMedicines();
  };

  if (loading) {
    return <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 text-center text-slate-400">Loading medicines...</div>;
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-100">Medicines</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-500 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Medicine
        </button>
      </div>

      {error && (
        <div className="bg-rose-950 border border-rose-600 text-rose-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
          <MedicineForm
            inventoryId={inventoryId}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingMedicine(null);
            }}
            initialMedicine={editingMedicine}
          />
        </div>
      )}

      {medicines.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p>No medicines yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {medicines.map(medicine => (
            <div
              key={medicine.id}
              className={`border-l-4 rounded-lg p-4 ${statusColors[medicine.status || 'OK']}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-100">{medicine.name}</h3>
                    <span className="text-sm bg-slate-800 px-2 py-1 rounded text-slate-300">
                      {medicine.category}
                    </span>
                    <span className="text-sm font-bold px-2 py-1 rounded bg-slate-950 text-slate-200">
                      {medicine.status}
                    </span>
                  </div>
                  <p className="text-sm mt-1">
                    Threshold: {medicine.threshold} | Quantity: {medicine.quantity}
                  </p>
                  {medicine.expiry_date && (
                    <p className="text-sm">
                      Expires: {new Date(medicine.expiry_date).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Quick adjustment buttons */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleAdjustQuantity(medicine, -1)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-100 px-2 py-1 rounded"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 min-w-12 text-center font-semibold">
                      {medicine.quantity}
                    </span>
                    <button
                      onClick={() => handleAdjustQuantity(medicine, 1)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-100 px-2 py-1 rounded"
                    >
                      +
                    </button>
                  </div>

                  {/* Edit and Delete buttons */}
                  <button
                    onClick={() => {
                      setEditingMedicine(medicine);
                      setShowForm(true);
                    }}
                    className="text-cyan-300 hover:text-cyan-100 p-2"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(medicine.id)}
                    className="text-rose-400 hover:text-rose-200 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicineList;
