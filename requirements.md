# MediStock PWA: Minimal MVP Requirements

## 1. Project Overview
A simplified, mobile-first inventory tracker for shared medical supplies. Focused on speed of development and core utility.

## 2. Core Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS + Lucide Icons
- **Backend/Auth:** Supabase (PostgreSQL + Google OAuth)
- **Deployment:** Vercel (PWA enabled)

## 3. Database Schema (Supabase)
### profiles
- `id` (uuid, references auth.users)
- `email` (text)

### inventories
- `id` (uuid, primary key)
- `name` (text)
- `invite_code` (text, unique) - Simple string for instant joining.

### inventory_members
- `inventory_id` (uuid, fk)
- `user_id` (uuid, fk)

### medicines
- `id` (uuid, primary key)
- `inventory_id` (uuid, fk)
- `name` (text)
- `category` (text) - e.g., 'Pill', 'Syrup', 'First Aid'
- `quantity` (int)
- `threshold` (int) - The "Low Stock" trigger level.
- `expiry_date` (date, optional)

## 4. Key Features (MVP Scope)
### A. Instant Collaboration
- Users join an inventory by entering a unique `invite_code`.
- No approval workflow; possession of the code equals access.

### B. Stock Tracking
- Simple list view of medicines.
- **Visual Status Logic:**
    - **CRITICAL:** `quantity == 0` (Red)
    - **LOW:** `quantity <= threshold` (Yellow)
    - **OK:** `quantity > threshold` (Green)
- Quick-action buttons: `[ + ]` and `[ - ]` to adjust quantity from the dashboard.

### C. Automated Shopping List
- A dedicated view that displays all items where `quantity <= threshold`.
- No separate table needed; just a filtered query of the `medicines` table.

### D. PWA Support
- Offline view capability.
- "Add to Home Screen" shortcut.

## 5. Implementation Roadmap
1. **Setup:** Supabase project + Vite/Tailwind boilerplate.
2. **Auth:** Google OAuth login + user profile creation.
3. **Inventory:** Create inventory and "Join by Code" logic.
4. **Medicines:** Basic CRUD for adding/editing medicine items.
5. **Dashboard:** Status-colored list with quick +/- buttons.
6. **Shopping:** Filtered "Shopping List" view.
7. **PWA:** Manifest and Service Worker via `vite-plugin-pwa`.