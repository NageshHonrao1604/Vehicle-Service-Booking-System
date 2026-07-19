# AutoCare Pro — Vehicle Service Booking System

AutoCare Pro is a premium, end-to-end vehicle service booking and management system built with Next.js, TypeScript, and Tailwind CSS. The application connects customers, technicians, and dispatchers into a single synchronized real-time operation flow.

---

## 🚀 Key Modules & Features

### 👤 1. Customer Portal
* **Multi-Vehicle Profiles:** Register and manage multiple vehicles (make, model, year, registration plate numbers).
* **Live Scheduler:** Pick service categories, preferred appointment dates, and time slots.
* **Service Status Tracker:** Real-time visual progress monitoring from disassembly to inspection and collection.
* **Digital Invoices:** Download itemized PDF-style receipts detailing service bases, parts list, labor hours, and taxes.

### 🔧 2. Technician Workspace
* **Interactive Job Card Queue:** Mechanics view jobs assigned to their active repair repair bays.
* **Progress Pipeline Control:** Update status checkpoints from diagnostic phases to completion.
* **Itemized Logging:** Log specific parts used, quantities, and input actual technician labor hours.

### 📊 3. Dispatch Operations Hub (Admin)
* **Real-time Overview:** Monitor active booking statistics, bay occupancy rates, and daily revenue metrics.
* **Technician Assignment Schedulers:** Assign jobs and pair pending bookings with available garage bays and mechanics.
* **Financial Oversight:** Centralized logs tracking service category details and job invoices.

---

## 🛠️ Technology Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (v4) & Vanilla CSS
* **Icons:** Lucide React
* **State Management:** Custom persistent state sync store
* **Components:** Custom Shadcn-style layout widgets

---

## 💻 Local Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/NageshHonrao1604/Vehicle-Service-Booking-System.git
cd Vehicle-Service-Booking-System
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for production
```bash
npm run build
npm start
```
