/**
 * Main Application Entry Point
 */
import { router } from './router.js';
import { store } from './state.js';

// Import Views (We will create these next)
import RoleSelection from './views/RoleSelection.js';
import DashboardDemandeur from './views/DashboardDemandeur.js';
import DashboardFormateur from './views/DashboardFormateur.js';
import DashboardTMA from './views/DashboardTMA.js';
import DashboardAdmin from './views/DashboardAdmin.js';
import CalendarView from './views/CalendarView.js'; // Anticipating this next
import RequestForm from './views/RequestForm.js';

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[App] Initializing...');

    // Register Routes
    router.addRoute('role-selection', RoleSelection);
    router.addRoute('dashboard-demandeur', DashboardDemandeur);
    router.addRoute('dashboard-formateur', DashboardFormateur);
    router.addRoute('dashboard-tma', DashboardTMA);
    router.addRoute('dashboard-admin', DashboardAdmin);
    router.addRoute('calendar-view', CalendarView);
    router.addRoute('request-form', RequestForm);

    // Default Route
    router.navigate('role-selection');
});

// Expose navigate globally for inline onclicks (if needed, though avoid if possible)
window.navigate = (path) => router.navigate(path);
