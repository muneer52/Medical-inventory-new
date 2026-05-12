import React, { useState } from 'react';
import { Cloud } from 'lucide-react';
import { AuthProvider, useAuth } from './lib/auth';
import { InventoryCreate } from './components/InventoryCreate';
import { InventoryList } from './components/InventoryList';
import { InventoryDetailsView } from './components/InventoryDetails';
import { JoinInventory } from './components/JoinInventory';
import { ApprovalDashboard } from './components/ApprovalDashboard';

type PageView = 'dashboard' | 'inventory-details' | 'approval-dashboard';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<PageView>('dashboard');
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectInventory = (id: string) => {
    setSelectedInventoryId(id);
    setCurrentView('inventory-details');
  };

  const handleViewApprovalDashboard = (id: string) => {
    setSelectedInventoryId(id);
    setCurrentView('approval-dashboard');
  };

  const handleBack = () => {
    setSelectedInventoryId(null);
    setCurrentView('dashboard');
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6 py-12">
        <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-10 text-center">
          <p className="text-xl font-semibold text-slate-100">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/80">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cloud className="h-8 w-8 text-cyan-400" />
            <h1 className="text-2xl font-bold">MediStock</h1>
          </div>
          <div className="text-sm">
            <p className="text-slate-400">Signed in as</p>
            <p className="font-medium">{user?.email ?? 'Guest User'}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-100 mb-2">Inventory Management</h2>
              <p className="text-slate-400">Create, join, and manage your shared inventories</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Sidebar: Create & Join */}
              <div className="space-y-6">
                <InventoryCreate onSuccess={handleRefresh} />
                <JoinInventory onSuccess={handleRefresh} />
              </div>

              {/* Main: Inventory List */}
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-slate-100">Your Inventories</h3>
                </div>
                <InventoryList
                  onSelectInventory={handleSelectInventory}
                  refreshTrigger={refreshTrigger}
                />
              </div>
            </div>
          </div>
        )}

        {currentView === 'inventory-details' && selectedInventoryId && (
          <InventoryDetailsView
            inventoryId={selectedInventoryId}
            onBack={handleBack}
          />
        )}

        {currentView === 'approval-dashboard' && selectedInventoryId && (
          <ApprovalDashboard
            inventoryId={selectedInventoryId}
            onBack={handleBack}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-12">
        <div className="mx-auto max-w-4xl px-6 py-6 text-center text-sm text-slate-500">
          <p>MediStock Phase 2 - Inventory & Collaboration Management</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
