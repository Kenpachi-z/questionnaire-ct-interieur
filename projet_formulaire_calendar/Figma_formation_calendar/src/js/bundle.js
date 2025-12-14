/**
 * PDGF BUNDLE (No-Build / File Protocol Version)
 * Combines all logic to avoid CORS 'ES Module' errors when running on file://
 */

// ==========================================
// 1. STATE MANAGEMENT (Store)
// ==========================================
const initialState = {
    user: {
        role: null, // 'demandeur', 'formateur', 'tma', 'admin'
        name: "Robert Kaba",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhuab6yJ2Yf1kbJErRNfK-1vyGfTvyQ3ps2Zfz7nUP2d6GfaqYlw0WBIONZZufEsd8MRBOQujRcIjUY656SdWEzBHSpchRNC46gZLtmWLY22OmQMr-8SJClQGpV9aoc9OXvbKKzf2fD4VShS4nsYfdaSAKNuOApChpV_8CpxWfGEI2m-3H419xNip7gsI6dHzy6h0FSWfWGYlmXK2g4HM1Xq0YLpEQI5R4ba9tHwoJvy6jpe4ImGyU06cEvFCIxljBCeMbrjLUxGJx"
    },
    // Mock Data for Calendar
    mepDates: [
        { date: '2023-10-06', title: 'MEP Major - Q4', type: 'MEP' },
        { date: '2023-10-20', title: 'Patch Security', type: 'MEP' }
    ],
    trainings: [
        { id: 1, date: '2023-10-09', time: '10:00 - 12:30', title: 'UI Design System', type: 'formation', status: 'validée', room: 'Salle 204' },
        { id: 2, date: '2023-10-09', time: '14:00 - 17:00', title: 'Workshop UX', type: 'formation', status: 'validée', room: 'Salle 204' },
        { id: 3, date: '2023-10-02', time: '09:00 - 12:00', title: 'React Basics', type: 'formation', status: 'validée', room: 'Salle 102' }
    ],
    // Formateur Unavailability
    unavailability: [
        { date: '2023-10-05', reason: 'Congés' }
    ]
};

class Store {
    constructor() {
        this.state = initialState;
        this.listeners = [];
    }

    getState() {
        return this.state;
    }

    setRole(role) {
        this.state.user.role = role;
        console.log(`[Store] Role updated to: ${role}`);
        this.notify();
    }

    addMep(date, title) {
        this.state.mepDates.push({ date, title, type: 'MEP' });
        this.notify();
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }
}

// Global Store Instance
const store = new Store();


// ==========================================
// 2. ROUTER ENGINE
// ==========================================
class Router {
    constructor() {
        this.routes = {};
        this.appContainer = null; // Will define on init
    }

    init() {
        this.appContainer = document.getElementById('app');
    }

    addRoute(path, view) {
        this.routes[path] = view;
    }

    async navigate(path) {
        console.log(`[Router] Navigating to: ${path}`);
        if (!this.appContainer) this.init();

        const view = this.routes[path];

        if (!view) {
            console.error(`[Router] Route not found: ${path}`);
            this.appContainer.innerHTML = `<div class="p-10 text-red-500">Error: Route ${path} not found</div>`;
            return;
        }

        // Clear Content
        this.appContainer.innerHTML = '';

        // Inject HTML
        const html = await view.render();
        this.appContainer.innerHTML = html;

        // Hydrate functionality (EventListeners)
        if (view.afterRender) {
            // Small timeout to ensure DOM is ready
            setTimeout(() => {
                view.afterRender();
            }, 0);
        }
    }
}

// Global Router Instance
const router = new Router();
// Expose for inline onclicks
window.navigate = (path) => router.navigate(path);

// Global Helper for adding rows
window.addParticipantRow = () => {
    const tbody = document.querySelector('tbody');
    const rowCount = tbody.querySelectorAll('tr').length + 1;
    // Create new row
    const tr = document.createElement('tr');
    tr.className = 'group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-l-2 border-transparent hover:border-primary';
    tr.innerHTML = `
        <td class="py-3 px-6 text-center text-xs text-slate-400 font-mono">${rowCount}</td>
        <td class="py-3 px-4"><input class="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-mono" placeholder="Nouveau matricule" type="text"/></td>
        <td class="py-3 px-4"><input class="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition" placeholder="Nom complet" type="text"/></td>
        <td class="py-3 px-4"><select class="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm py-2 px-3 text-slate-500"><option>Sélectionner...</option><option>Développeur</option><option>Tech Lead</option></select></td>
        <td class="py-3 px-4"><select class="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm py-2 px-3 text-slate-500"><option>Sélectionner...</option><option>IT / Dev</option><option>RH</option></select></td>
        <td class="py-3 px-4 text-center">
             <button onclick="this.closest('tr').remove()" class="text-slate-300 hover:text-red-500 transition p-1 rounded-md hover:bg-red-50" title="Supprimer"><span class="material-symbols-outlined text-[18px]">delete</span></button>
        </td>
    `;
    // Append before the last empty row or just append
    // In our case we just append to tbody
    tbody.appendChild(tr);
};


// ==========================================
// 3. VIEWS
// ==========================================

// --- RoleSelection ---
const RoleSelection = {
    render: async () => {
        return `
        <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div class="mb-8 text-center">
                <div class="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span class="material-symbols-outlined text-primary text-4xl">admin_panel_settings</span>
                </div>
                <h1 class="text-3xl font-bold text-slate-900">Bienvenue, Robert</h1>
                <p class="text-slate-500 mt-2">Veuillez sélectionner votre profil pour cette session</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                <div id="card-demandeur" class="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-primary hover:shadow-md transition cursor-pointer">
                    <div class="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition">
                        <span class="material-symbols-outlined text-blue-600 text-2xl group-hover:text-white transition">edit_document</span>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 mb-1">Demandeur</h3>
                    <p class="text-sm text-slate-500">Régions / Entités</p>
                </div>

                <div id="card-formateur" class="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-primary hover:shadow-md transition cursor-pointer">
                    <div class="h-12 w-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition">
                        <span class="material-symbols-outlined text-emerald-600 text-2xl group-hover:text-white transition">school</span>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 mb-1">Formateur</h3>
                    <p class="text-sm text-slate-500">Planification</p>
                </div>

                <div id="card-tma" class="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-primary hover:shadow-md transition cursor-pointer">
                    <div class="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition">
                        <span class="material-symbols-outlined text-purple-600 text-2xl group-hover:text-white transition">engineering</span>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 mb-1">TMA</h3>
                    <p class="text-sm text-slate-500">Maintenance</p>
                </div>

                <div id="card-admin" class="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-primary hover:shadow-md transition cursor-pointer">
                    <div class="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-800 transition">
                        <span class="material-symbols-outlined text-slate-600 text-2xl group-hover:text-white transition">shield_person</span>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 mb-1">Administrateur</h3>
                    <p class="text-sm text-slate-500">Supervision</p>
                </div>
            </div>
             <p class="mt-12 text-xs text-slate-400">© 2025 PDGF - Intranet Sécurisé (Mode Local)</p>
        </div>`;
    },
    afterRender: () => {
        document.getElementById('card-demandeur').addEventListener('click', () => { store.setRole('demandeur'); window.navigate('dashboard-demandeur'); });
        document.getElementById('card-formateur').addEventListener('click', () => { store.setRole('formateur'); window.navigate('dashboard-formateur'); });
        document.getElementById('card-tma').addEventListener('click', () => { store.setRole('tma'); window.navigate('dashboard-tma'); });
        document.getElementById('card-admin').addEventListener('click', () => { store.setRole('admin'); window.navigate('dashboard-admin'); });
    }
};

// --- Dashboard Formateur ---
const DashboardFormateur = {
    render: async () => {
        const user = store.getState().user;
        return `
            <div class="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
                <!-- Sidebar Navigation -->
                <aside class="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between hidden md:flex transition-all duration-300">
                    <div class="flex flex-col h-full">
                        <!-- Logo Area -->
                        <div class="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
                            <div class="w-8 h-8 rounded bg-primary flex items-center justify-center text-white mr-3">
                                <span class="material-symbols-outlined text-xl">school</span>
                            </div>
                            <div>
                                <h1 class="text-slate-900 dark:text-white text-base font-bold leading-none">Formateur</h1>
                                <p class="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1">Intranet RH</p>
                            </div>
                        </div>
                        <!-- Menu Items -->
                        <div class="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
                            <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium cursor-pointer" onclick="window.navigate('dashboard-formateur')">
                                <span class="material-symbols-outlined">home</span>
                                <span>Accueil</span>
                            </a>
                            <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" onclick="window.navigate('validation-details')">
                                <span class="material-symbols-outlined">check_circle</span>
                                <span>Validation</span>
                            </a>
                            <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" onclick="window.navigate('attendance-sheet')">
                                <span class="material-symbols-outlined">edit_note</span>
                                <span>Saisie Présences</span>
                            </a>
                            <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" onclick="window.navigate('calendar-view')">
                                <span class="material-symbols-outlined">event_busy</span>
                                <span>Planning & Indispo.</span>
                            </a>
                            <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                <span class="material-symbols-outlined">bar_chart</span>
                                <span>Reporting</span>
                            </a>
                        </div>
                        <!-- User Profile Snippet (Bottom) -->
                        <div class="p-4 border-t border-slate-100 dark:border-slate-800">
                             <button onclick="window.navigate('role-selection')" class="flex items-center gap-2 text-slate-500 hover:text-primary w-full"><span class="material-symbols-outlined">logout</span> Changer de rôle</button>
                        </div>
                    </div>
                </aside>
                
                <!-- Main Content -->
                <main class="flex-1 flex flex-col h-full overflow-hidden relative">
                    <!-- Mobile Header -->
                    <header class="md:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary">school</span>
                            <span class="font-bold text-lg">Formateur</span>
                        </div>
                        <button class="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                            <span class="material-symbols-outlined">menu</span>
                        </button>
                    </header>
                    
                    <!-- Scrollable Content Area -->
                    <div class="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
                        <div class="max-w-7xl mx-auto space-y-8">
                            <!-- Breadcrumbs & Date -->
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <nav class="flex text-sm text-slate-500 dark:text-slate-400">
                                    <a class="hover:text-primary transition-colors cursor-pointer" onclick="window.navigate('role-selection')">Accueil</a>
                                    <span class="mx-2">/</span>
                                    <span class="text-slate-900 dark:text-white font-medium">Tableau de bord</span>
                                </nav>
                                <div class="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full shadow-sm">
                                    <span class="material-symbols-outlined text-lg">calendar_today</span>
                                    <span>Mardi, 24 Octobre 2023</span>
                                </div>
                            </div>
                            
                            <!-- Greeting -->
                            <div>
                                <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Bonjour, ${user.name.split(' ')[0]}</h1>
                                <p class="mt-2 text-slate-600 dark:text-slate-400">Voici vos priorités et votre planning pour aujourd'hui.</p>
                            </div>

                            <!-- Widget 1: Immediate Actions (KPIs) -->
                            <section aria-label="Tâches en Attente">
                                <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary">notifications_active</span>
                                    Tâches en Attente
                                </h2>
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <!-- Card 1: Validations -->
                                    <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer" onclick="window.navigate('validation-details')">
                                        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <span class="material-symbols-outlined text-8xl text-primary">check_circle</span>
                                        </div>
                                        <div class="relative z-10 flex flex-col h-full justify-between">
                                            <div>
                                                <div class="flex items-center gap-3 mb-2">
                                                    <div class="bg-primary/10 p-2 rounded-lg text-primary">
                                                        <span class="material-symbols-outlined">checklist</span>
                                                    </div>
                                                    <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Demandes à Valider</p>
                                                </div>
                                                <p class="text-4xl font-bold text-slate-900 dark:text-white mt-2">12</p>
                                            </div>
                                            <div class="mt-6">
                                                <button class="w-full bg-primary hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                                                    <span>Accéder au module</span>
                                                    <span class="material-symbols-outlined text-sm">arrow_forward</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Card 2: Missing Attendance (Urgent) -->
                                    <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border-l-4 border-l-amber-500 border-y border-r border-slate-100 dark:border-slate-700 relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onclick="window.navigate('attendance-sheet')">
                                        <div class="relative z-10 flex flex-col h-full justify-between">
                                            <div>
                                                <div class="flex items-center gap-3 mb-2">
                                                    <div class="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg text-amber-600 dark:text-amber-400">
                                                        <span class="material-symbols-outlined">warning</span>
                                                    </div>
                                                    <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Saisies de Présence Manquantes</p>
                                                </div>
                                                <div class="flex items-baseline gap-2 mt-2">
                                                    <p class="text-4xl font-bold text-slate-900 dark:text-white">3</p>
                                                    <span class="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">Urgent</span>
                                                </div>
                                            </div>
                                            <div class="mt-6">
                                                <button class="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                                                    <span>Régulariser</span>
                                                    <span class="material-symbols-outlined text-sm">edit</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Card 3: Quick Stats -->
                                    <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
                                        <div>
                                            <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Performance du Mois</h3>
                                            <div class="flex items-center gap-6">
                                                <!-- Radial Progress Representation -->
                                                <div class="relative size-20 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700" style="background: conic-gradient(#135bec 85%, #e2e8f0 0);">
                                                    <div class="absolute inset-2 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                                                        <span class="text-lg font-bold text-slate-900 dark:text-white">85%</span>
                                                    </div>
                                                </div>
                                                <div class="flex flex-col gap-1">
                                                    <p class="text-2xl font-bold text-slate-900 dark:text-white">Excellent</p>
                                                    <p class="text-xs text-slate-500 dark:text-slate-400">Taux de réalisation</p>
                                                    <p class="text-xs text-emerald-600 font-medium flex items-center mt-1">
                                                        <span class="material-symbols-outlined text-sm mr-1">trending_up</span>
                                                        +4% vs Sept.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between text-xs text-slate-500">
                                            <span>Formations: 24</span>
                                            <span>Heures: 142h</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            
                            <!-- Widget 2: Agenda Preview (Simplified for dashboard) -->
                            <section aria-label="Aperçu Agenda" class="mt-8">
                                <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex items-center justify-between">
                                    <div>
                                        <h2 class="text-lg font-semibold text-slate-900 mb-1">Planning du jour</h2>
                                        <p class="text-slate-500 text-sm">Vous avez 2 formations prévues aujourd'hui.</p>
                                    </div>
                                    <button onclick="window.navigate('calendar-view')" class="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition">
                                        Voir l'agenda complet
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        `;
    },
    afterRender: () => { }
};

// --- Calendar View ---
// --- Calendar View (Duplicate Removed) ---
// The correct CalendarView is defined later in the file.


// --- Dashboard Demandeur ---
const DashboardDemandeur = {
    render: async () => {
        const user = store.getState().user; // Get dynamic user data
        return `
        <div class="min-h-screen bg-background-light dark:bg-background-dark text-[#111318] dark:text-white transition-colors duration-200 font-display">
            <div class="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <header class="sticky top-0 z-50 w-full border-b border-[#f0f2f4] dark:border-[#2a3441] bg-surface-light dark:bg-surface-dark shadow-sm">
                    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div class="flex items-center gap-4">
                            <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <span class="material-symbols-outlined text-2xl">school</span>
                            </div>
                            <h1 class="text-lg font-bold tracking-tight text-[#111318] dark:text-white hidden sm:block">Intranet Formation</h1>
                        </div>
                        <nav class="hidden md:flex items-center gap-8">
                            <a class="text-sm font-medium text-[#111318] dark:text-gray-200 hover:text-primary transition-colors cursor-pointer" onclick="window.navigate('dashboard-demandeur')">Accueil</a>
                            <a class="text-sm font-medium text-[#111318] dark:text-gray-200 hover:text-primary transition-colors cursor-pointer" onclick="window.navigate('my-requests')">Mes Demandes</a>
                            <a class="text-sm font-medium text-[#111318] dark:text-gray-200 hover:text-primary transition-colors cursor-pointer" onclick="alert('Module Planning Global en cours de développement')">Planning Global</a>
                        </nav>
                        <div class="flex items-center gap-4">
                             <button onclick="window.navigate('role-selection')" class="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition">
                                <span class="material-symbols-outlined text-lg">logout</span> <span class="hidden sm:inline">Changer de rôle</span>
                            </button>
                            <div class="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>
                            <div class="hidden md:flex flex-col items-end">
                                <span class="text-sm font-semibold text-[#111318] dark:text-white">${user.name}</span>
                                <span class="text-xs text-[#616f89] dark:text-gray-400">Demandeur (Région Nord)</span>
                            </div>
                            <div class="relative size-10 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100">
                                <img alt="User Avatar" class="h-full w-full object-cover" src="${user.avatar}"/>
                            </div>
                        </div>
                    </div>
                </header>
                
                <div class="w-full bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/20">
                    <div class="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8 text-center">
                        <p class="text-sm font-medium text-primary dark:text-blue-300 flex items-center justify-center gap-2">
                            <span class="material-symbols-outlined text-lg">verified_user</span>
                            Vous êtes connecté en tant que Demandeur.
                        </p>
                    </div>
                </div>

                <main class="flex-1 py-10 px-4 sm:px-6 lg:px-8">
                    <div class="mx-auto max-w-7xl flex flex-col gap-8">
                        <!-- Hero Section -->
                        <section class="relative overflow-hidden rounded-3xl bg-surface-light dark:bg-surface-dark shadow-lg border border-[#e5e7eb] dark:border-[#2a3441] py-12 px-6 sm:px-16 text-center">
                            <div class="absolute top-0 right-0 -mt-16 -mr-16 h-80 w-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
                            <div class="absolute bottom-0 left-0 -mb-16 -ml-16 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl pointer-events-none"></div>
                            <div class="relative z-10 flex flex-col items-center justify-center max-w-3xl mx-auto space-y-8">
                                <div class="space-y-3">
                                    <h2 class="text-3xl font-black tracking-tight text-[#111318] dark:text-white md:text-4xl leading-tight">
                                        Zone d'Action Prioritaire
                                    </h2>
                                    <p class="text-lg text-[#616f89] dark:text-gray-300 max-w-2xl mx-auto">
                                        Initialisez vos besoins en formation. Saisie manuelle ou import de masse disponible.
                                    </p>
                                </div>
                                <button onclick="window.navigate('request-participants')" class="group relative flex items-center justify-center gap-3 whitespace-nowrap rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:bg-primary-hover hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-[0.98] w-full sm:w-auto">
                                    <span class="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
                                    Créer une Nouvelle Demande
                                </button>
                                <div class="flex items-center gap-6 text-sm text-[#616f89] dark:text-gray-400">
                                    <div class="flex items-center gap-1.5">
                                        <span class="material-symbols-outlined text-base">description</span>
                                        <span>Formulaire unifié</span>
                                    </div>
                                    <div class="flex items-center gap-1.5">
                                        <span class="material-symbols-outlined text-base">upload_file</span>
                                        <span>Import Excel supporté</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            <!-- Recent Requests List -->
                            <div class="lg:col-span-8 flex flex-col rounded-2xl bg-surface-light dark:bg-surface-dark border border-[#e5e7eb] dark:border-[#2a3441] shadow-md h-full">
                                <div class="flex items-center justify-between border-b border-[#f0f2f4] dark:border-[#2a3441] px-6 py-5">
                                    <div class="flex items-center gap-3">
                                        <div class="flex size-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary">
                                            <span class="material-symbols-outlined">toc</span>
                                        </div>
                                        <div>
                                            <h3 class="text-lg font-bold text-[#111318] dark:text-white leading-none">Mes Demandes en Cours</h3>
                                            <p class="text-xs text-[#616f89] dark:text-gray-400 mt-1">Suivi en temps réel</p>
                                        </div>
                                    </div>
                                    <button onclick="window.navigate('my-requests')" class="text-sm font-semibold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                        Voir Tout <span class="material-symbols-outlined text-base">arrow_forward</span>
                                    </button>
                                </div>
                                
                                <div class="flex-1 overflow-x-auto custom-scrollbar">
                                    <table class="w-full text-left text-sm">
                                        <thead class="bg-[#f8f9fa] dark:bg-[#1f2937] text-[#616f89] dark:text-gray-400 border-b border-[#e5e7eb] dark:border-[#2a3441]">
                                            <tr>
                                                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Intitulé</th>
                                                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Date Souhaitée</th>
                                                <th class="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Statut</th>
                                                <th class="px-6 py-4 font-semibold w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-[#f0f2f4] dark:divide-[#2a3441]">
                                            <tr class="hover:bg-gray-50 dark:hover:bg-[#252e3e] transition-colors group cursor-pointer" onclick="window.navigate('request-details')">
                                                <td class="px-6 py-4 font-medium text-[#111318] dark:text-white">
                                                    Formation Excel Avancé
                                                    <span class="block text-xs font-normal text-gray-500 mt-0.5">Ref: #REQ-2023-894</span>
                                                </td>
                                                <td class="px-6 py-4 text-[#616f89] dark:text-gray-400">15 Nov 2023</td>
                                                <td class="px-6 py-4">
                                                    <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                                        <span class="material-symbols-outlined text-[14px]">sync</span>
                                                        En Validation
                                                    </span>
                                                </td>
                                                <td class="px-6 py-4 text-right">
                                                    <span class="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">chevron_right</span>
                                                </td>
                                            </tr>
                                            <tr class="hover:bg-gray-50 dark:hover:bg-[#252e3e] transition-colors group cursor-pointer">
                                                <td class="px-6 py-4 font-medium text-[#111318] dark:text-white">
                                                    Management d'équipe
                                                    <span class="block text-xs font-normal text-gray-500 mt-0.5">Ref: #REQ-2023-820</span>
                                                </td>
                                                <td class="px-6 py-4 text-[#616f89] dark:text-gray-400">02 Déc 2023</td>
                                                <td class="px-6 py-4">
                                                    <span class="inline-flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-900/30 px-2.5 py-1 text-xs font-semibold text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                                                        <span class="material-symbols-outlined text-[14px]">check_circle</span>
                                                        Validée
                                                    </span>
                                                </td>
                                                <td class="px-6 py-4 text-right">
                                                    <span class="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">chevron_right</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Calendar Widget -->
                            <div class="lg:col-span-4 flex flex-col rounded-2xl bg-surface-light dark:bg-surface-dark border border-[#e5e7eb] dark:border-[#2a3441] shadow-md h-full">
                                <div class="flex items-center justify-between border-b border-[#f0f2f4] dark:border-[#2a3441] px-6 py-5">
                                    <div class="flex items-center gap-3">
                                        <div class="flex size-10 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                                            <span class="material-symbols-outlined">calendar_month</span>
                                        </div>
                                        <div>
                                            <h3 class="text-lg font-bold text-[#111318] dark:text-white leading-none">Planning</h3>
                                            <p class="text-xs text-[#616f89] dark:text-gray-400 mt-1">Octobre 2023</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-6">
                                     <!-- Simplified Calendar Grid -->
                                    <div class="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                                        <div class="text-[#616f89] font-bold">L</div><div class="text-[#616f89] font-bold">M</div><div class="text-[#616f89] font-bold">M</div><div class="text-[#616f89] font-bold">J</div><div class="text-[#616f89] font-bold">V</div><div class="text-[#616f89] font-bold">S</div><div class="text-[#616f89] font-bold">D</div>
                                    </div>
                                    <div class="grid grid-cols-7 gap-1 text-center text-sm">
                                        <div class="text-gray-300 py-2">25</div><div class="text-gray-300 py-2">26</div><div class="text-gray-300 py-2">27</div><div class="text-gray-300 py-2">28</div><div class="text-gray-300 py-2">29</div>
                                        <div class="text-slate-800 py-2">1</div><div class="text-slate-800 py-2">2</div><div class="text-slate-800 py-2">3</div><div class="text-slate-800 py-2">4</div>
                                        <div class="relative text-white font-bold py-2 bg-primary rounded-lg">5</div>
                                        <div class="text-slate-800 py-2">6</div><div class="text-slate-800 py-2">7</div><div class="text-slate-800 py-2">8</div><div class="text-slate-800 py-2">9</div>
                                        <div class="text-green-700 bg-green-50 font-bold py-2 rounded-lg">10</div>
                                    </div>
                                    <div class="mt-4 text-xs text-center text-gray-500">
                                        Vue simplifiée. Voir le planning complet pour plus de détails.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        `;
    },
    afterRender: () => { }
};

// --- My Requests (List) ---
// Global state for MyRequests to handle filtering and pagination without full re-renders of the page structure
window.myRequestsState = {
    data: [],
    currentPage: 1,
    itemsPerPage: 10,
    filters: {
        search: '',
        status: '',
        startDate: '',
        endDate: ''
    }
};

// Helper: Generate Mock Data
const generateMockRequests = () => {
    const statuses = ['submitted', 'submitted', 'pending', 'pending', 'approved', 'approved', 'rejected'];
    const titles = [
        'Formation Management Agile', 'Perfectionnement Anglais B2', 'Sécurité Incendie - Niveau 1',
        'Soft Skills : Leadership', 'React Advanced Patterns', 'Docker & Kubernetes Mastery',
        'Gestion de Conflits', 'Excel Expert', 'Cybersécurité : Les bases', 'Communication Non-Violente',
        'Python pour la Data Science', 'Certification AWS Cloud Practitioner', 'Scrum Master Certification',
        'Lean Six Sigma Green Belt', 'Intelligence Artificielle Generative'
    ];

    // Generate 55 items for -> ~6 pages
    return Array.from({ length: 55 }, (_, i) => {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const title = titles[Math.floor(Math.random() * titles.length)];

        // Random date in 2023-2024
        const year = Math.random() > 0.5 ? 2023 : 2024;
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1;
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        let statusLabel = '';
        let statusColor = '';

        switch (status) {
            case 'submitted': statusLabel = 'Soumise'; statusColor = 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'; break;
            case 'pending': statusLabel = 'En Validation'; statusColor = 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'; break;
            case 'approved': statusLabel = 'Validée'; statusColor = 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'; break;
            case 'rejected': statusLabel = 'Refusée'; statusColor = 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800'; break;
        }

        return {
            id: `REQ-${2023000 + i}`,
            title: title,
            ref: `REF-${Math.floor(Math.random() * 9000) + 1000}`,
            date: dateStr,
            status: status,
            statusLabel: statusLabel,
            statusColor: statusColor
        };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Init Data once
if (window.myRequestsState.data.length === 0) {
    window.myRequestsState.data = generateMockRequests();
}

// Global Filter Handler
window.updateMyRequestsFilter = (type, value) => {
    window.myRequestsState.filters[type] = value;
    window.myRequestsState.currentPage = 1; // Reset to page 1 on filter change
    renderMyRequestsTable();
};

// Global Page Handler
window.changeMyRequestsPage = (newPage) => {
    window.myRequestsState.currentPage = newPage;
    renderMyRequestsTable();
};

// Internal Render Function for the Table part
const renderMyRequestsTable = () => {
    const state = window.myRequestsState;
    const tbody = document.getElementById('my-requests-tbody');
    const paginationContainer = document.getElementById('my-requests-pagination');
    const countLabel = document.getElementById('my-requests-count');

    if (!tbody || !paginationContainer) return; // Guard clause

    // Filter Data
    let filtered = state.data.filter(item => {
        const matchSearch = item.title.toLowerCase().includes(state.filters.search.toLowerCase()) || item.ref.toLowerCase().includes(state.filters.search.toLowerCase());
        const matchStatus = state.filters.status === '' || item.status === state.filters.status;

        // Date Logic
        let matchDate = true;
        if (state.filters.startDate) matchDate = matchDate && item.date >= state.filters.startDate;
        if (state.filters.endDate) matchDate = matchDate && item.date <= state.filters.endDate;

        return matchSearch && matchStatus && matchDate;
    });

    // Pagination Logic
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / state.itemsPerPage);
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + state.itemsPerPage);

    // Render Rows
    tbody.innerHTML = paginated.map(item => `
        <tr class="group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary shrink-0">
                        <span class="material-symbols-outlined">school</span>
                    </div>
                    <div>
                        <p class="font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">${item.title}</p>
                        <p class="text-xs text-slate-500">${item.ref}</p>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 text-slate-600 dark:text-slate-300">
                ${new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
            </td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${item.statusColor}">
                    <span class="size-1.5 rounded-full bg-current opacity-50"></span>
                    ${item.statusLabel}
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                <button onclick="window.navigate('request-details')" class="text-slate-400 hover:text-primary transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700" title="Voir les détails">
                    <span class="material-symbols-outlined">visibility</span>
                </button>
            </td>
        </tr>
    `).join('');

    if (paginated.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center py-8 text-slate-500">Aucune demande trouvée pour ces critères.</td></tr>`;
    }

    // Render Pagination Controls
    let pagesHtml = '';

    // Prev
    pagesHtml += `
        <button onclick="changeMyRequestsPage(${state.currentPage - 1})" 
            class="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
            ${state.currentPage === 1 ? 'disabled' : ''}>
            <span class="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
    `;

    // Page Numbers (Simple logic: show all or localized range - here simple mostly)
    // To safe space let's show Max 5 buttons logic or just all if < 7
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= state.currentPage - 1 && i <= state.currentPage + 1)) {
            const isActive = i === state.currentPage;
            pagesHtml += `
                <button onclick="changeMyRequestsPage(${i})" 
                    class="size-9 flex items-center justify-center rounded-lg ${isActive ? 'bg-primary text-white font-medium' : 'border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'} text-sm transition-colors">
                    ${i}
                </button>
            `;
        } else if (i === state.currentPage - 2 || i === state.currentPage + 2) {
            pagesHtml += `<span class="size-9 flex items-center justify-center text-slate-400">...</span>`;
        }
    }

    // Next
    pagesHtml += `
        <button onclick="changeMyRequestsPage(${state.currentPage + 1})" 
            class="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            ${state.currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}>
            <span class="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
    `;

    paginationContainer.innerHTML = pagesHtml;

    // Update Label
    if (countLabel) {
        countLabel.innerHTML = `Affichage de <span class="font-medium text-slate-900 dark:text-white">${totalItems > 0 ? startIndex + 1 : 0}</span> à <span class="font-medium text-slate-900 dark:text-white">${Math.min(startIndex + state.itemsPerPage, totalItems)}</span> sur <span class="font-medium text-slate-900 dark:text-white">${totalItems}</span> résultats`;
    }
};


const MyRequests = {
    render: async () => {
        const user = store.getState().user;
        // Trigger initial render after a brief timeout to allow DOM insertion
        setTimeout(renderMyRequestsTable, 50);

        return `
        <!-- Root: h-full to fit in #app, flex-col for layout -->
        <div class="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 h-full flex flex-col">
            <!-- Top Navigation: Fixed height/Shrink-0 -->
            <header class="shrink-0 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 lg:px-10 py-3 z-50">
                <div class="flex items-center gap-4 text-slate-900 dark:text-white">
                    <div class="size-8 text-primary">
                        <span class="material-symbols-outlined text-[32px]">school</span>
                    </div>
                    <h2 class="text-lg font-bold leading-tight tracking-tight">Intranet Formation</h2>
                </div>
                <div class="hidden md:flex flex-1 justify-end gap-8">
                    <nav class="flex items-center gap-6">
                        <a onclick="window.navigate('dashboard-demandeur')" class="cursor-pointer text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal">Dashboard</a>
                        <a onclick="alert('Catalogue en développement')" class="cursor-pointer text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal">Catalogue</a>
                        <a onclick="window.navigate('my-requests')" class="cursor-pointer text-primary font-bold text-sm leading-normal">Mes Demandes</a>
                        <a onclick="alert('Profil en développement')" class="cursor-pointer text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal">Mon Profil</a>
                    </nav>
                    <div class="flex items-center gap-4">
                        <button class="flex items-center justify-center rounded-full size-10 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
                            <span class="material-symbols-outlined">notifications</span>
                        </button>
                        <div class="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-slate-100 dark:ring-slate-800" style='background-image: url("${user.avatar}");'></div>
                    </div>
                </div>
                <!-- Mobile Menu Icon (Placeholder) -->
                <button class="md:hidden text-slate-900 dark:text-white">
                    <span class="material-symbols-outlined">menu</span>
                </button>
            </header>

            <!-- Main Content: Scrollable Area -->
            <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-8 bg-slate-50 dark:bg-black/20">
                <div class="max-w-7xl mx-auto flex flex-col gap-8">
                    <!-- Breadcrumbs -->
                    <div class="flex items-center gap-2 text-sm">
                        <a onclick="window.navigate('dashboard-demandeur')" class="cursor-pointer text-slate-500 hover:text-primary transition-colors">Dashboard</a>
                        <span class="text-slate-400">/</span>
                        <span class="font-medium text-slate-900 dark:text-white">Mes Demandes</span>
                    </div>
                    
                    <!-- Page Heading -->
                    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div class="flex flex-col gap-2">
                            <h1 class="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Mes Demandes</h1>
                            <p class="text-slate-500 dark:text-slate-400 text-base max-w-2xl">
                                Suivez l'état de vos demandes de formation en cours et passées. Consultez le statut et les détails de chaque dossier.
                            </p>
                        </div>
                        <button onclick="window.navigate('request-form')" class="flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white text-sm font-bold h-12 px-6 rounded-lg transition-colors shadow-sm shadow-blue-200 dark:shadow-none whitespace-nowrap">
                            <span class="material-symbols-outlined text-[20px]">add</span>
                            <span>Nouvelle Demande</span>
                        </button>
                    </div>

                    <!-- Filters & Search Bar -->
                    <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
                        <!-- Search -->
                        <div class="relative flex-1 w-full">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined">search</span>
                            <input oninput="window.updateMyRequestsFilter('search', this.value)" class="w-full pl-11 pr-4 h-12 rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:border-primary focus:ring-primary text-sm" placeholder="Rechercher par intitulé ou référence..." type="text"/>
                        </div>
                        <!-- Filters Group -->
                        <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            <!-- Status Filter -->
                            <div class="relative w-full sm:w-48">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">filter_list</span>
                                <select onchange="window.updateMyRequestsFilter('status', this.value)" class="w-full pl-10 pr-8 h-12 rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:border-primary focus:ring-primary text-sm appearance-none cursor-pointer">
                                    <option value="">Tous les statuts</option>
                                    <option value="submitted">Soumise</option>
                                    <option value="pending">En Validation</option>
                                    <option value="approved">Validée</option>
                                    <option value="rejected">Refusée</option>
                                </select>
                                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined pointer-events-none text-[20px]">expand_more</span>
                            </div>
                            <!-- Date Range -->
                            <div class="relative w-full sm:w-auto flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg h-12 px-3 gap-2">
                                <span class="text-slate-400 material-symbols-outlined text-[20px]">calendar_today</span>
                                <input onchange="window.updateMyRequestsFilter('startDate', this.value)" class="bg-transparent border-none p-0 w-24 text-sm focus:ring-0 text-slate-600 dark:text-slate-300" onblur="(this.type='text')" onfocus="(this.type='date')" placeholder="Date début" type="text"/>
                                <span class="text-slate-300">–</span>
                                <input onchange="window.updateMyRequestsFilter('endDate', this.value)" class="bg-transparent border-none p-0 w-24 text-sm focus:ring-0 text-slate-600 dark:text-slate-300" onblur="(this.type='text')" onfocus="(this.type='date')" placeholder="Date fin" type="text"/>
                            </div>
                        </div>
                    </div>

                    <!-- Data Table -->
                    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-sm">
                                <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th class="px-6 py-4 font-semibold text-slate-900 dark:text-white w-2/5">Intitulé de la formation</th>
                                        <th class="px-6 py-4 font-semibold text-slate-900 dark:text-white">Date Souhaitée</th>
                                        <th class="px-6 py-4 font-semibold text-slate-900 dark:text-white">Statut Actuel</th>
                                        <th class="px-6 py-4 font-semibold text-slate-900 dark:text-white text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="my-requests-tbody" class="divide-y divide-slate-100 dark:divide-slate-700">
                                    <!-- Populated by JS -->
                                    <tr><td colspan="4" class="text-center py-8 text-slate-400">Chargement des données...</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <!-- Pagination -->
                        <div class="px-6 py-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p id="my-requests-count" class="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
                                Chargement...
                            </p>
                            <div id="my-requests-pagination" class="flex gap-2">
                                <!-- Populated by JS -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Help Section -->
                    <div class="bg-blue-50 dark:bg-slate-800/50 rounded-xl p-6 border border-blue-100 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4 mb-8">
                        <div class="flex gap-4">
                            <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <span class="material-symbols-outlined">help_outline</span>
                            </div>
                            <div>
                                <h3 class="font-bold text-slate-900 dark:text-white">Besoin d'aide ?</h3>
                                <p class="text-slate-600 dark:text-slate-400 text-sm mt-1">Consultez la FAQ ou contactez le support RH pour toute question concernant vos demandes.</p>
                            </div>
                        </div>
                        <a class="text-primary font-bold text-sm hover:underline cursor-pointer" onclick="alert('Module FAQ en développement')">Accéder à l'aide</a>
                    </div>
                </div>
            </main>
        </div>
        `
    }
};

// --- Request Details ---
const RequestDetails = {
    render: async () => `
        <div class="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
             <header class="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3">
                <div class="flex items-center gap-4">
                     <button onclick="window.history.back()" class="p-2 rounded-full hover:bg-slate-100 transition"><span class="material-symbols-outlined">arrow_back</span></button>
                     <h1 class="font-bold text-lg">Détails #TR-2023-849</h1>
                </div>
             </header>
             <main class="max-w-5xl mx-auto px-4 py-8">
                <!-- Status Bar -->
                <div class="mb-8">
                     <div class="flex items-center justify-between mb-4">
                        <h1 class="text-3xl font-black">Gestion de Projet Avancée</h1>
                        <span class="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-bold border border-orange-200">En Validation</span>
                     </div>
                     <div class="w-full bg-slate-200 rounded-full h-2">
                        <div class="bg-primary h-2 rounded-full w-1/2"></div>
                     </div>
                     <div class="flex justify-between text-xs text-slate-500 mt-2">
                        <span>Soumise (28/09)</span>
                        <span class="text-primary font-bold">En Validation</span>
                        <span>Validée</span>
                     </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Main Info -->
                    <div class="md:col-span-2 space-y-6">
                        <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 class="font-bold border-b pb-2 mb-4">Informations</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div><p class="text-sm text-slate-500">Date</p><p class="font-bold">12 Octobre 2023</p></div>
                                <div><p class="text-sm text-slate-500">Type</p><p class="font-bold">Management</p></div>
                            </div>
                            <div class="mt-4">
                                <p class="text-sm text-slate-500">Objectif</p>
                                <p class="text-sm bg-slate-50 p-2 rounded border border-slate-100 mt-1">Maîtriser les concepts clés des méthodologies Agiles (Scrum, Kanban).</p>
                            </div>
                        </section>
                        
                        <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                             <h3 class="font-bold border-b pb-2 mb-4">Participants (4)</h3>
                             <ul>
                                <li class="py-2 border-b flex justify-between"><span>Jean Dupont</span> <span class="text-slate-500 text-sm">Chef de Projet</span></li>
                                <li class="py-2 border-b flex justify-between"><span>Alice Martin</span> <span class="text-slate-500 text-sm">Développeuse</span></li>
                             </ul>
                        </section>
                    </div>

                    <!-- Sidebar -->
                    <div class="space-y-6">
                        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h4 class="font-bold text-slate-500 text-sm uppercase mb-4">Statut Actuel</h4>
                            <div class="flex items-center gap-4">
                                <div class="bg-orange-100 p-3 rounded text-orange-600"><span class="material-symbols-outlined">hourglass_top</span></div>
                                <div>
                                    <p class="font-bold">En Attente</p>
                                    <p class="text-xs text-slate-500">Validateur: Thomas Dubois</p>
                                </div>
                            </div>
                        </div>
                        <button class="w-full py-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold">Annuler la demande</button>
                    </div>
                </div>
             </main>
        </div>
    `
};

// --- Request Form (Real HTML from Figma) ---
const RequestForm = {
    render: async () => `
        <div class="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
             <header class="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 shadow-sm">
                <div class="flex items-center gap-4">
                     <button onclick="window.navigate('dashboard-demandeur')" class="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition"><span class="material-symbols-outlined">arrow_back</span> Retour au tableau de bord</button>
                </div>
                 <div class="flex items-center gap-3">
                    <span class="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">Nouvelle Demande</span>
                </div>
            </header>

            <main class="max-w-7xl mx-auto px-6 py-8">
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Nouvelle Demande de Formation</h1>
                    <p class="text-slate-500 dark:text-gray-400 max-w-2xl">Remplissez le formulaire ci-dessous pour soumettre votre demande. Les dates seront soumises à validation.</p>
                </div>

                <div class="mb-8 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div class="flex justify-between items-center mb-2">
                        <div class="flex items-center gap-2">
                            <span class="flex items-center justify-center size-6 rounded-full bg-primary text-white text-xs font-bold">1</span>
                            <span class="text-sm font-bold text-primary">Saisie & Planification</span>
                        </div>
                        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Étape 1 sur 2</span>
                    </div>
                    <div class="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div class="h-full bg-primary w-1/2 rounded-full transition-all duration-500"></div>
                    </div>
                </div>

                <div class="grid lg:grid-cols-12 gap-8">
                    <!-- Left: Form Fields -->
                    <div class="lg:col-span-7 flex flex-col gap-6">
                        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                                <span class="material-symbols-outlined text-primary">description</span>
                                <h3 class="text-lg font-bold text-slate-900 dark:text-white">Informations Générales</h3>
                            </div>
                            <div class="space-y-6">
                                <label class="block group">
                                    <span class="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1.5 block group-focus-within:text-primary transition-colors">Titre de la formation</span>
                                    <input class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-11 px-4 text-sm" placeholder="Ex: Formation React Avancée" type="text"/>
                                </label>
                                <div class="grid sm:grid-cols-2 gap-6">
                                    <label class="block group">
                                        <span class="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1.5 block group-focus-within:text-primary transition-colors">Type de formation</span>
                                        <div class="relative">
                                            <select class="w-full appearance-none rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-11 px-4 pr-10 text-sm transition-all">
                                                <option>Technique</option>
                                                <option>Soft Skills</option>
                                                <option>Management</option>
                                                <option>Langues</option>
                                            </select>
                                            <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
                                        </div>
                                    </label>
                                    <label class="block group">
                                        <span class="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1.5 block group-focus-within:text-primary transition-colors">Niveau requis</span>
                                        <div class="relative">
                                            <select class="w-full appearance-none rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-11 px-4 pr-10 text-sm transition-all">
                                                <option>Débutant</option>
                                                <option>Intermédiaire</option>
                                                <option>Avancé</option>
                                                <option>Expert</option>
                                            </select>
                                            <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
                                        </div>
                                    </label>
                                </div>
                                <label class="block group">
                                    <span class="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1.5 block group-focus-within:text-primary transition-colors">Objectif pédagogique</span>
                                    <textarea class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[140px] p-4 resize-y text-sm transition-all" placeholder="Décrivez les compétences visées et les résultats attendus..."></textarea>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Calendar Selection -->
                    <div class="lg:col-span-5 flex flex-col gap-6">
                         <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 h-full flex flex-col">
                            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                                <span class="material-symbols-outlined text-primary">calendar_month</span>
                                <h3 class="text-lg font-bold text-slate-900 dark:text-white">Dates souhaitées</h3>
                            </div>
                            
                            <div class="flex items-center justify-between mb-6 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                                <button class="size-8 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-primary shadow-sm transition"><span class="material-symbols-outlined text-sm">chevron_left</span></button>
                                <h4 class="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">Novembre 2023</h4>
                                <button class="size-8 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-primary shadow-sm transition"><span class="material-symbols-outlined text-sm">chevron_right</span></button>
                            </div>

                            <div class="grid grid-cols-7 mb-2 text-center">
                                <span class="text-[10px] font-bold text-slate-400 uppercase">Lun</span>
                                <span class="text-[10px] font-bold text-slate-400 uppercase">Mar</span>
                                <span class="text-[10px] font-bold text-slate-400 uppercase">Mer</span>
                                <span class="text-[10px] font-bold text-slate-400 uppercase">Jeu</span>
                                <span class="text-[10px] font-bold text-slate-400 uppercase">Ven</span>
                                <span class="text-[10px] font-bold text-slate-400 uppercase">Sam</span>
                                <span class="text-[10px] font-bold text-slate-400 uppercase">Dim</span>
                            </div>

                            <div class="grid grid-cols-7 gap-2 mb-6 flex-1">
                                <div></div><div></div>
                                <button class="aspect-square rounded-md flex items-center justify-center text-sm font-medium text-slate-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition">1</button>
                                <button class="aspect-square rounded-md flex items-center justify-center text-sm font-medium text-slate-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition">2</button>
                                <button class="aspect-square rounded-md flex items-center justify-center text-sm font-medium text-slate-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition">3</button>
                                <button class="aspect-square rounded-md flex items-center justify-center text-sm font-medium text-slate-300 cursor-not-allowed bg-slate-50 dark:bg-slate-900">4</button>
                                <button class="aspect-square rounded-md flex items-center justify-center text-sm font-medium text-slate-300 cursor-not-allowed bg-slate-50 dark:bg-slate-900">5</button>
                                <button class="aspect-square rounded-md flex items-center justify-center text-sm font-medium text-slate-300 cursor-not-allowed bg-slate-100 dark:bg-slate-800 border border-transparent" title="Indisponible">6</button>
                                <button class="aspect-square rounded-md flex items-center justify-center text-sm font-medium text-slate-300 cursor-not-allowed bg-slate-100 dark:bg-slate-800 border border-transparent" title="Indisponible">7</button>
                                <button class="aspect-square rounded-md flex items-center justify-center text-sm font-medium text-slate-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition">8</button>
                                <button class="aspect-square rounded-md flex items-center justify-center text-sm font-medium text-slate-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition">9</button>
                                <button class="aspect-square rounded-md flex items-center justify-center text-sm font-bold text-white bg-primary shadow-md shadow-primary/20 ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-800">10</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col-reverse md:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                    <button onclick="window.navigate('dashboard-demandeur')" class="w-full md:w-auto px-6 h-11 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm">
                        Annuler la demande
                    </button>
                    <div class="flex items-center gap-4 w-full md:w-auto">
                        <button class="flex-1 md:flex-none px-6 h-11 rounded-lg text-primary font-semibold hover:bg-primary/5 transition-colors text-sm">
                            Enregistrer en brouillon
                        </button>
                        <button onclick="window.navigate('request-participants')" class="flex-1 md:flex-none px-8 h-11 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm transform active:scale-[0.98]">
                            Suivant
                            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    `
};

// --- Request Participants (Step 2) ---
const RequestParticipants = {
    render: async () => {
        const user = store.getState().user;
        return `
        <div class="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
             <!-- Sidebar Navigation (Demandeur) -->
             <aside class="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between hidden md:flex transition-all duration-300">
                <div class="flex flex-col h-full">
                    <!-- Logo Area -->
                    <div class="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
                        <div class="w-8 h-8 rounded bg-primary flex items-center justify-center text-white mr-3">
                            <span class="material-symbols-outlined text-xl">school</span>
                        </div>
                        <div>
                            <h1 class="text-slate-900 dark:text-white text-base font-bold leading-none">Intranet</h1>
                            <p class="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1">Formation</p>
                        </div>
                    </div>
                    <!-- Menu Items -->
                    <div class="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
                        <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" onclick="window.navigate('dashboard-demandeur')">
                            <span class="material-symbols-outlined">home</span>
                            <span>Accueil</span>
                        </a>
                        <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" onclick="alert('Module en développement')">
                            <span class="material-symbols-outlined">menu_book</span>
                            <span>Catalogue</span>
                        </a>
                        <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium cursor-pointer" onclick="window.navigate('my-requests')">
                            <span class="material-symbols-outlined">description</span>
                            <span>Mes Demandes</span>
                        </a>
                        <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" onclick="window.navigate('calendar-view')">
                            <span class="material-symbols-outlined">calendar_month</span>
                            <span>Planning</span>
                        </a>
                         <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" onclick="alert('Module en développement')">
                            <span class="material-symbols-outlined">bar_chart</span>
                            <span>Reporting</span>
                        </a>
                         <div class="my-4 border-t border-slate-100 dark:border-slate-800"></div>
                         <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" onclick="window.navigate('dashboard-admin')">
                            <span class="material-symbols-outlined">settings</span>
                            <span>Administration</span>
                        </a>
                    </div>
                    <!-- User Profile Snippet (Bottom) -->
                    <div class="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                         <div class="relative size-9 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100">
                            <img alt="User Avatar" class="h-full w-full object-cover" src="${user.avatar}"/>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-slate-900 dark:text-white truncate">${user.name}</p>
                             <p class="text-xs text-slate-500 truncate">Manager IT</p>
                        </div>
                         <button onclick="window.navigate('role-selection')" class="text-slate-400 hover:text-primary transition"><span class="material-symbols-outlined">logout</span></button>
                    </div>
                </div>
            </aside>

            <!-- Main Content Area -->
            <main class="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50 dark:bg-black/20">
                <!-- Header -->
                <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-6 sm:px-8">
                     <div class="flex items-center gap-4">
                         <nav class="flex text-sm text-slate-500 dark:text-slate-400">
                            <span class="hover:text-primary transition-colors cursor-pointer">Accueil</span>
                            <span class="mx-2">/</span>
                            <span class="hover:text-primary transition-colors cursor-pointer">Mes Demandes</span>
                            <span class="mx-2">/</span>
                            <span class="text-slate-900 dark:text-white font-medium">Saisie des Participants</span>
                        </nav>
                     </div>
                     <div class="flex items-center gap-3">
                         <button onclick="window.history.back()" class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm font-medium">
                            <span class="material-symbols-outlined text-[18px]">arrow_back</span> Retour
                        </button>
                         <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm font-medium">
                            <span class="material-symbols-outlined text-[18px]">save</span> Brouillon
                        </button>
                    </div>
                </header>

                <!-- Scrollable Content -->
                <div class="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
                    <div class="max-w-6xl mx-auto">
                        <div class="mb-8">
                             <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Saisie des Participants</h1>
                             <div class="flex items-center gap-3">
                                <span class="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded border border-blue-200 flex items-center gap-1">
                                    <span class="material-symbols-outlined text-[14px]">school</span> Advanced Java Spring Boot
                                </span>
                                <span class="text-xs text-slate-400">#REQ-2024-089</span>
                             </div>
                        </div>

                        <div class="flex flex-col gap-8">
                            <!-- Option 1: Import -->
                            <section class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                                    <h2 class="text-sm font-extrabold text-slate-700 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                        <span class="material-symbols-outlined text-slate-400">upload_file</span> Option 1 : Import de masse
                                    </h2>
                                    <button onclick="alert('Téléchargement du modèle...')" class="text-xs font-bold text-primary hover:text-blue-700 flex items-center gap-1 transition-colors">
                                        <span class="material-symbols-outlined text-[16px]">download</span> Télécharger le modèle (.xlsx)
                                    </button>
                                </div>
                                <div class="p-6">
                                     <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div class="md:col-span-2">
                                            <div class="h-48 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/30 flex flex-col items-center justify-center group hover:border-primary/50 hover:bg-blue-50/30 transition-all cursor-pointer relative">
                                                <div class="size-12 rounded-full bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                    <span class="material-symbols-outlined text-primary dark:text-blue-400 text-[24px]">cloud_upload</span>
                                                </div>
                                                <p class="text-slate-900 dark:text-white text-sm font-bold mb-1">Cliquez ou glissez-déposez votre fichier</p>
                                                <p class="text-slate-500 dark:text-slate-400 text-xs mb-4">Formats acceptés : .csv, .xlsx (Max 5Mo)</p>
                                                <button class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold shadow-sm hover:border-primary/50 transition-colors">Parcourir</button>
                                                <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" onchange="alert('Simulation: Fichier chargé avec succès !')">
                                            </div>
                                        </div>
                                        <div class="md:col-span-1 space-y-3">
                                            <h3 class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Historique d'import</h3>
                                            
                                            <!-- Success Item -->
                                            <div class="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/20 rounded-lg p-3">
                                                 <div class="flex items-start gap-2">
                                                    <span class="material-symbols-outlined text-emerald-600 text-[18px] mt-0.5">check_circle</span>
                                                    <div>
                                                        <p class="text-xs font-bold text-slate-800 dark:text-white">Import réussi</p>
                                                        <p class="text-[10px] text-slate-500 mt-0.5">12 lignes traitées - <i>participants_java_v1.xlsx</i></p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <!-- Warning Item -->
                                            <div class="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 rounded-lg p-3">
                                                 <div class="flex items-start gap-2">
                                                    <span class="material-symbols-outlined text-amber-600 text-[18px] mt-0.5">warning</span>
                                                    <div>
                                                        <p class="text-xs font-bold text-slate-800 dark:text-white">Import partiel</p>
                                                        <p class="text-[10px] text-slate-500 mt-0.5">2 lignes rejetées</p>
                                                        <div class="mt-1.5 p-1.5 bg-amber-100/50 dark:bg-black/20 rounded text-[9px] font-mono text-amber-800 dark:text-amber-200">
                                                            Ligne 4: Matricule manquant<br>
                                                            Ligne 8: Rôle invalide
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div class="relative flex py-2 items-center">
                                <div class="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                                <span class="flex-shrink-0 mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">OU</span>
                                <div class="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                            </div>

                            <!-- Option 2: Saisie Manuelle -->
                            <section class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
                                <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                                    <div class="flex items-center gap-3">
                                        <span class="material-symbols-outlined text-slate-400">edit_note</span>
                                        <h2 class="text-sm font-extrabold text-slate-700 dark:text-white uppercase tracking-wider">Option 2 : Saisie manuelle</h2>
                                    </div>
                                    <span class="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">12 participants</span>
                                </div>
                                <div class="overflow-x-auto">
                                    <table class="w-full text-left border-collapse">
                                        <thead>
                                            <tr class="bg-slate-50/50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                                                <th class="py-3 px-6 w-12 text-center text-[10px] uppercase font-bold tracking-wider">#</th>
                                                <th class="py-3 px-4 text-xs font-bold uppercase tracking-wider w-40">Matricule <span class="text-red-500">*</span></th>
                                                <th class="py-3 px-4 text-xs font-bold uppercase tracking-wider">Nom & Prénom</th>
                                                <th class="py-3 px-4 text-xs font-bold uppercase tracking-wider w-48">Rôle</th>
                                                <th class="py-3 px-4 text-xs font-bold uppercase tracking-wider w-48">Secteur</th>
                                                <th class="py-3 px-4 w-12 text-center"></th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                                            <tr class="group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                <td class="py-3 px-6 text-center text-xs text-slate-400 font-mono">1</td>
                                                <td class="py-3 px-4"><input class="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-mono font-medium" placeholder="Ex: M12345" type="text" value="M89221"/></td>
                                                <td class="py-3 px-4"><input class="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition" placeholder="Nom complet" type="text" value="Thomas Bernard"/></td>
                                                <td class="py-3 px-4">
                                                    <select class="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition"><option>Tech Lead</option><option>Développeur</option></select>
                                                </td>
                                                <td class="py-3 px-4">
                                                    <select class="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition"><option>IT / Dev</option><option>RH</option></select>
                                                </td>
                                                <td class="py-3 px-4 text-center">
                                                    <button class="text-slate-300 hover:text-red-500 transition p-1 rounded-md hover:bg-red-50" title="Supprimer"><span class="material-symbols-outlined text-[18px]">delete</span></button>
                                                </td>
                                            </tr>
                                             <tr class="group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                <td class="py-3 px-6 text-center text-xs text-slate-400 font-mono">2</td>
                                                <td class="py-3 px-4"><input class="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-mono font-medium" placeholder="Ex: M12345" type="text" value="M99012"/></td>
                                                <td class="py-3 px-4"><input class="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition" placeholder="Nom complet" type="text" value="Sarah Croche"/></td>
                                                <td class="py-3 px-4">
                                                    <select class="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition"><option>Développeur</option></select>
                                                </td>
                                                <td class="py-3 px-4">
                                                    <select class="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition"><option>IT / Dev</option></select>
                                                </td>
                                                <td class="py-3 px-4 text-center">
                                                    <button class="text-slate-300 hover:text-red-500 transition p-1 rounded-md hover:bg-red-50" title="Supprimer"><span class="material-symbols-outlined text-[18px]">delete</span></button>
                                                </td>
                                            </tr>
                                             <!-- Empty Row -->
                                            <tr class="group bg-blue-50/30 hover:bg-blue-50/60 transition-colors border-l-2 border-primary">
                                                <td class="py-3 px-6 text-center text-xs text-primary font-bold font-mono">3</td>
                                                <td class="py-3 px-4"><input class="w-full rounded-md border-primary/30 bg-white dark:bg-slate-900 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-mono" placeholder="Nouveau matricule" type="text"/></td>
                                                <td class="py-3 px-4"><input class="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition" placeholder="Nom complet" type="text"/></td>
                                                <td class="py-3 px-4"><select class="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm py-2 px-3 text-slate-500"><option>Sélectionner...</option></select></td>
                                                <td class="py-3 px-4"><select class="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm py-2 px-3 text-slate-500"><option>Sélectionner...</option></select></td>
                                                <td class="py-3 px-4 text-center"></td>
                                                <td class="py-3 px-4"><select class="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm py-2 px-3 text-slate-500"><option>Sélectionner...</option><option>Tech Lead</option><option>Développeur</option></select></td>
                                                <td class="py-3 px-4"><select class="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm py-2 px-3 text-slate-500"><option>Sélectionner...</option><option>IT / Dev</option><option>RH</option></select></td>
                                                <td class="py-3 px-4 text-center">
                                                    <button class="text-slate-300 hover:text-red-500 transition p-1 rounded-md hover:bg-red-50" title="Supprimer" onclick="this.closest('tr').remove()"><span class="material-symbols-outlined text-[18px]">delete</span></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 rounded-b-xl flex justify-center">
                            <button onclick="window.addParticipantRow()" class="flex items-center gap-2 px-4 py-2 text-primary hover:bg-white border border-dashed border-primary/40 rounded-lg text-sm font-bold transition-all hover:shadow-sm">
                                <span class="material-symbols-outlined text-[20px]">add</span> Ajouter une ligne
                            </button>
                        </div>
                            </section>
                            
                            <div class="flex items-center justify-end pt-8">
                                 <div class="flex items-center gap-2 text-sm text-slate-500 mr-auto">
                                    <span onclick="window.navigate('request-form')" class="hover:text-slate-800 hover:underline cursor-pointer transition">Annuler la demande</span>
                                 </div>
                                 <button onclick="window.navigate('request-validation')" class="bg-[#0f4c81] hover:bg-[#0d4270] text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all transform active:scale-[0.98]">
                                    <span class="material-symbols-outlined">check_circle</span> Valider la liste des participants
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `
    }
};

// --- Validation View (Demo Step 3 - Validator Role) ---
const RequestValidation = {
    render: async () => `
        <div class="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
             <header class="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 shadow-sm">
                <div class="flex items-center gap-4">
                     <button onclick="window.history.back()" class="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition"><span class="material-symbols-outlined">arrow_back</span> Retour aux demandes</button>
                </div>
                 <div class="flex items-center gap-3">
                    <span class="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">En attente de validation</span>
                    <span class="font-mono text-slate-400 text-xs">Réf: #REQ-2023-894</span>
                </div>
            </header>
            
            <main class="max-w-7xl mx-auto px-6 py-8">
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Validation Demande de Formation</h1>
                    <p class="text-slate-500 dark:text-gray-400">Veuillez examiner la demande ci-dessous et confirmer votre disponibilité pour animer cette session.</p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Left: Request Summary -->
                    <div class="lg:col-span-2 space-y-6">
                        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <div class="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                                <span class="material-symbols-outlined text-primary text-2xl">description</span>
                                <h2 class="text-lg font-bold">Synthèse de la demande</h2>
                                <span class="ml-auto text-xs text-slate-400">Soumis le 10 Nov 2023</span>
                            </div>
                            
                            <h3 class="text-xl font-bold mb-2">Formation React Avancée</h3>
                            <p class="text-slate-500 dark:text-gray-400 mb-6">Amélioration des compétences front-end de l'équipe produit.</p>

                            <div class="grid grid-cols-2 gap-8 mb-6">
                                <div>
                                    <p class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Type de formation</p>
                                    <p class="font-semibold flex items-center gap-2"><span class="material-symbols-outlined text-sm">code</span> Technique</p>
                                </div>
                                <div>
                                    <p class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Niveau Requis</p>
                                    <p class="font-semibold flex items-center gap-2"><span class="material-symbols-outlined text-sm">bar_chart</span> Expert / Avancé</p>
                                </div>
                            </div>

                            <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                <p class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Objectif Pédagogique</p>
                                <p class="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                                    À l'issue de cette formation, les participants seront capables de maîtriser les hooks complexes, d'optimiser les performances de rendu avec React.memo et useMemo, et de mettre en place une architecture d'état global robuste. La formation inclura également un module sur les tests unitaires avec Jest.
                                </p>
                            </div>
                        </div>

                         <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                             <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <h3 class="font-bold flex items-center gap-2"><span class="material-symbols-outlined text-primary">group</span> Participants (4)</h3>
                            </div>
                            <div class="divide-y divide-slate-100 dark:divide-slate-700">
                                <div class="px-6 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                    <div class="flex items-center gap-3">
                                        <div class="size-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">SM</div>
                                        <div>
                                            <p class="font-bold text-sm text-slate-900 dark:text-white">Sophie Martin</p>
                                            <p class="text-xs text-slate-500">Lead Developer</p>
                                        </div>
                                    </div>
                                    <span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Inscrit</span>
                                </div>
                                <div class="px-6 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                    <div class="flex items-center gap-3">
                                        <div class="size-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">MC</div>
                                        <div>
                                            <p class="font-bold text-sm text-slate-900 dark:text-white">Michael Chen</p>
                                            <p class="text-xs text-slate-500">Frontend Developer</p>
                                        </div>
                                    </div>
                                    <span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Inscrit</span>
                                </div>
                                 <div class="px-6 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                    <div class="flex items-center gap-3">
                                        <div class="size-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">AD</div>
                                        <div>
                                            <p class="font-bold text-sm text-slate-900 dark:text-white">Alexandre Dumas</p>
                                            <p class="text-xs text-slate-500">Junior Developer</p>
                                        </div>
                                    </div>
                                    <span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Inscrit</span>
                                </div>
                            </div>
                         </div>
                    </div>

                    <!-- Right: Action Card -->
                    <div class="space-y-6">
                        <!-- Session Planned -->
                        <div class="bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 p-6">
                            <h4 class="font-bold text-primary dark:text-blue-300 flex items-center gap-2 mb-4 uppercase text-xs tracking-wider">
                                <span class="material-symbols-outlined text-lg">calendar_month</span> Session Planifiée
                            </h4>
                            <div class="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                                <div class="flex flex-col items-center justify-center bg-red-50 text-red-600 rounded px-3 py-1 border border-red-100">
                                    <span class="text-[10px] font-bold uppercase">Nov</span>
                                    <span class="text-xl font-bold leading-none">10</span>
                                    <span class="text-[10px]">2023</span>
                                </div>
                                <div>
                                    <p class="font-bold text-slate-900 dark:text-white">Vendredi</p>
                                    <p class="text-xs text-slate-500 flex items-center gap-1"><span class="material-symbols-outlined text-[10px]">schedule</span> 09:00 - 17:00</p>
                                    <p class="text-xs text-slate-500 flex items-center gap-1"><span class="material-symbols-outlined text-[10px]">location_on</span> M421 (Etage 2)</p>
                                </div>
                            </div>
                             <div class="mt-4 flex gap-2 items-start text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-100/50">
                                <span class="material-symbols-outlined text-sm mt-0.5">info</span>
                                <p>Cette date a été pré-validée par le système en fonction de votre calendrier Outlook.</p>
                            </div>
                        </div>

                        <!-- Action Required -->
                        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sticky top-24">
                            <h3 class="font-bold text-lg mb-6">Action requise</h3>
                            
                            <div class="mb-4">
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Motif du refus</label>
                                    <span class="text-[10px] text-slate-400">(Obligatoire si refus)</span>
                                </div>
                                <textarea class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm p-3 focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-24" placeholder="Veuillez indiquer la raison du refus (ex: Indisponibilité imprévue, pré-requis non satisfaits)..."></textarea>
                            </div>

                            <div class="flex flex-col gap-3">
                                <button onclick="alert('Session validée ! Notification envoyée aux participants.'); window.navigate('dashboard-formateur')" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                                    <span class="material-symbols-outlined">check_circle</span> Valider & Confirmer
                                </button>
                                <button onclick="alert('Session refusée.'); window.navigate('dashboard-formateur')" class="w-full bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                    <span class="material-symbols-outlined">cancel</span> Refuser la demande
                                </button>
                            </div>
                            <p class="text-[10px] text-center text-slate-400 mt-4 leading-tight">
                                En validant, une convocation sera automatiquement envoyée aux participants.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `
};

const ValidationDetails = {
    render: async () => `
        <div class="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
             <header class="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3">
                <div class="flex items-center gap-4">
                     <button onclick="window.history.back()" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"><span class="material-symbols-outlined">arrow_back</span></button>
                     <h1 class="font-bold text-lg">Détails Formation</h1>
                </div>
             </header>
             <main class="max-w-6xl mx-auto px-4 py-8">
                <!-- Header -->
                <div class="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                    <div>
                        <div class="flex items-center gap-3">
                            <h1 class="text-3xl font-black">Sécurité Incendie - Niveau 1</h1>
                            <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 border border-green-200">
                                <span class="material-symbols-outlined text-sm">check_circle</span> Validée
                            </span>
                        </div>
                        <p class="text-slate-500 font-medium">Référence: SEC-2023-LVL1-084</p>
                    </div>
                    <button onclick="window.navigate('attendance-sheet')" class="bg-primary text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                        <span class="material-symbols-outlined">fact_check</span> Saisir les Présences
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Main Content -->
                    <div class="lg:col-span-2 space-y-6">
                        <!-- Stats -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 shadow-sm">
                                <p class="text-slate-500 text-sm font-semibold uppercase">Date</p>
                                <p class="text-xl font-bold">12 Oct 2023</p>
                            </div>
                            <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 shadow-sm">
                                <p class="text-slate-500 text-sm font-semibold uppercase">Lieu</p>
                                <p class="text-xl font-bold">Salle Bâtiment A</p>
                            </div>
                        </div>

                         <!-- Participants -->
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div class="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 font-bold flex justify-between">
                                <span>Liste des Participants (12)</span>
                                <button class="text-primary text-sm flex items-center gap-1"><span class="material-symbols-outlined text-sm">download</span> Exporter</button>
                            </div>
                            <table class="w-full text-left text-sm">
                                <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                                    <tr class="hover:bg-slate-50"><td class="p-4 font-bold">Sophie Martin</td><td class="p-4 text-slate-500">RH</td></tr>
                                    <tr class="hover:bg-slate-50"><td class="p-4 font-bold">Thomas Leroy</td><td class="p-4 text-slate-500">IT</td></tr>
                                    <tr class="hover:bg-slate-50"><td class="p-4 font-bold">Alain Dubois</td><td class="p-4 text-slate-500">Logistique</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div class="space-y-6">
                        <div class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 class="font-bold border-b pb-3 mb-4">Actions</h3>
                            <div class="space-y-3">
                                <button onclick="window.navigate('attendance-sheet')" class="w-full bg-primary text-white font-bold py-3 rounded-lg flex justify-center gap-2 items-center">
                                    <span class="material-symbols-outlined">fact_check</span> Saisir Présences
                                </button>
                                <button class="w-full border border-slate-300 font-medium py-2 rounded-lg hover:bg-slate-50">Modifier</button>
                                <button class="w-full text-red-600 font-medium py-2 rounded-lg hover:bg-red-50">Annuler</button>
                            </div>
                        </div>
                    </div>
                </div>
             </main>
        </div>
    `
};

// --- Attendance Sheet (Formateur) ---
const AttendanceSheet = {
    render: async () => `
        <div class="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
             <header class="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3">
                <div class="flex items-center gap-4">
                     <button onclick="window.history.back()" class="p-2 rounded-full hover:bg-slate-100 transition"><span class="material-symbols-outlined">arrow_back</span></button>
                     <h1 class="font-bold text-lg">Saisie des Présences</h1>
                </div>
             </header>
             <main class="max-w-4xl mx-auto px-4 py-8">
                <div class="flex justify-between items-end border-b border-slate-200 pb-6 mb-6">
                    <div>
                        <h1 class="text-3xl font-black">Excel Avancé - Session 4</h1>
                        <p class="text-slate-500">24 Octobre 2023 • Salle Réunion A</p>
                    </div>
                    <span class="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Terminée</span>
                </div>

                <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                    <div class="flex justify-between items-center p-4 bg-slate-50 border-b border-slate-200">
                        <h3 class="font-bold">Emargement</h3>
                        <span class="bg-slate-200 text-xs font-bold px-2 py-1 rounded">5 Inscrits</span>
                    </div>
                    <table class="w-full text-left text-sm">
                        <thead class="bg-slate-50 text-slate-500 uppercase text-xs">
                            <tr><th class="p-4">Participant</th><th class="p-4 text-center">Présent ?</th></tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr>
                                <td class="p-4 font-bold">Jean Dupont</td>
                                <td class="p-4 text-center"><input type="checkbox" checked class="w-5 h-5 text-primary rounded focus:ring-primary"></td>
                            </tr>
                            <tr>
                                <td class="p-4 font-bold">Marie Curie</td>
                                <td class="p-4 text-center"><input type="checkbox" checked class="w-5 h-5 text-primary rounded focus:ring-primary"></td>
                            </tr>
                            <tr>
                                <td class="p-4 font-bold">Pierre Martin</td>
                                <td class="p-4 text-center"><input type="checkbox" class="w-5 h-5 text-primary rounded focus:ring-primary"></td>
                            </tr>
                             <tr>
                                <td class="p-4 font-bold">Sophie Durand</td>
                                <td class="p-4 text-center"><input type="checkbox" checked class="w-5 h-5 text-primary rounded focus:ring-primary"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="bg-blue-50 border border-blue-100 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <p class="font-bold text-slate-800">Validation</p>
                        <p class="text-sm text-slate-600">Confirmez 3 présents sur 5 inscrits.</p>
                    </div>
                    <div class="flex gap-4">
                        <button onclick="window.history.back()" class="px-4 py-2 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-50">Annuler</button>
                        <button onclick="alert('Présences validées !'); window.navigate('dashboard-formateur')" class="px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-blue-700 shadow-lg">Clôturer</button>
                    </div>
                </div>
             </main>
        </div>
    `
};

// --- Calendar View (Planning) ---
const CalendarView = {
    render: async () => {
        const user = store.getState().user;

        // Mock Events Data (2025-2026)
        const events = [
            { type: 'formation', title: 'Formation Java Advanced', date: '2025-11-10', color: 'bg-blue-100 text-blue-800 border-blue-200' },
            { type: 'mep', title: 'MEP Production V2.4', date: '2025-11-15', color: 'bg-purple-100 text-purple-800 border-purple-200' },
            { type: 'conge', title: 'Congé Formateur (Thomas)', date: '2025-11-20', color: 'bg-orange-100 text-orange-800 border-orange-200' },
            { type: 'formation', title: 'React Basics', date: '2025-12-05', color: 'bg-blue-100 text-blue-800 border-blue-200' },
            { type: 'mep', title: 'MEP Hotfix Security', date: '2025-12-12', color: 'bg-purple-100 text-purple-800 border-purple-200' },
            { type: 'conge', title: 'Congé Noël', date: '2025-12-25', color: 'bg-orange-100 text-orange-800 border-orange-200' },
            { type: 'formation', title: 'Angular Migration', date: '2026-01-15', color: 'bg-blue-100 text-blue-800 border-blue-200' },
            { type: 'mep', title: 'MEP Q1 Release', date: '2026-03-30', color: 'bg-purple-100 text-purple-800 border-purple-200' }
        ];

        // Helper to generate calendar days
        // Defaulting to November 2025 for demo purposes as requested range is 2025-2026
        const currentYear = 2025;
        const currentMonth = 10; // November (0-indexed)

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // Sunday=0

        // Adjust grid start (Monday as start of week)
        const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        let calendarGridHTML = '';

        // Empty cells for offset
        for (let i = 0; i < startOffset; i++) {
            calendarGridHTML += `<div class="h-32 bg-slate-50/50 border border-slate-100 dark:border-slate-800 dark:bg-slate-900/50"></div>`;
        }

        // Days with events
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.date === dateStr);

            let eventsHTML = dayEvents.map(e => `
                <div class="${e.color} text-[10px] px-1.5 py-1 rounded border mb-1 truncate font-medium cursor-pointer hover:opacity-80 transition" title="${e.title}">
                    ${e.title}
                </div>
            `).join('');

            calendarGridHTML += `
                <div class="h-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 flex flex-col hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors relative group">
                    <span class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 w-7 h-7 flex items-center justify-center rounded-full group-hover:bg-primary group-hover:text-white transition-colors">${day}</span>
                    <div class="flex-1 overflow-y-auto custom-scrollbar">
                        ${eventsHTML}
                    </div>
                    ${day === 15 ? '<div class="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-4 ring-red-100 dark:ring-red-900/30"></div>' : ''}
                </div>
            `;
        }

        return `
        <div class="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
             <!-- Sidebar Navigation (Reused) -->
             <aside class="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between hidden md:flex">
                <div class="flex flex-col h-full">
                    <div class="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800 gap-3">
                         <div class="w-8 h-8 rounded bg-primary flex items-center justify-center text-white">
                            <span class="material-symbols-outlined text-xl">school</span>
                        </div>
                        <h1 class="font-bold text-lg">Intranet</h1>
                    </div>
                    <div class="flex-1 py-6 px-3 flex flex-col gap-1">
                         <a onclick="window.navigate('dashboard-demandeur')" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"><span class="material-symbols-outlined">home</span> Accueil</a>
                         <a onclick="window.navigate('my-requests')" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"><span class="material-symbols-outlined">description</span> Mes Demandes</a>
                         <a onclick="window.navigate('calendar-view')" class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium cursor-pointer"><span class="material-symbols-outlined">calendar_month</span> Planning</a>
                    </div>
                     <div class="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                         <div class="size-9 rounded-full bg-slate-200 overflow-hidden"><img src="${user.avatar}" class="w-full h-full object-cover"></div>
                         <div class="flex-1 min-w-0"><p class="text-sm font-medium truncate">${user.name}</p></div>
                         <button onclick="window.navigate('role-selection')" class="text-slate-400 hover:text-primary"><span class="material-symbols-outlined">logout</span></button>
                    </div>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 flex flex-col h-full overflow-hidden relative">
                <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-6">
                    <h1 class="text-xl font-bold">Planning des Formations</h1>
                    <div class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button class="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition"><span class="material-symbols-outlined text-sm">chevron_left</span></button>
                        <span class="text-sm font-semibold px-4 min-w-[140px] text-center">Novembre 2025</span>
                        <button class="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition"><span class="material-symbols-outlined text-sm">chevron_right</span></button>
                    </div>
                    <div>
                         <select class="text-sm border-slate-200 dark:border-slate-700 rounded-md bg-transparent"><option>Vue Mois</option><option>Vue Semaine</option></select>
                    </div>
                </header>
                
                <div class="bg-slate-50 dark:bg-black/20 flex-1 overflow-y-auto p-4 md:p-6 text-slate-800 dark:text-slate-200">
                    <div class="bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800 p-4">
                        <!-- Days Header -->
                        <div class="grid grid-cols-7 mb-2">
                             ${['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(d =>
            `<div class="text-center text-xs font-bold text-slate-500 uppercase py-2">${d}</div>`
        ).join('')}
                        </div>
                        <!-- Calendar Grid -->
                        <div class="grid grid-cols-7 border-t border-l border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 gap-px">
                            ${calendarGridHTML}
                        </div>
                    </div>
                    
                    <div class="mt-6 flex flex-wrap gap-4 justify-center">
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-blue-500"></span>
                            <span class="text-sm font-medium">Formation (Présentiel)</span>
                        </div>
                         <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-purple-500"></span>
                            <span class="text-sm font-medium">MEP (Mise en Production)</span>
                        </div>
                         <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-orange-500"></span>
                            <span class="text-sm font-medium">Congés / Absence</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        `;
    }
};
const DashboardTMA = {
    render: async () => `
        <div class="min-h-screen bg-slate-50 p-8 font-display">
            <header class="flex justify-between items-center mb-8">
                <div class="flex items-center gap-4">
                     <span class="material-symbols-outlined text-purple-600 text-3xl">engineering</span>
                     <h1 class="text-2xl font-bold text-slate-800">Espace TMA</h1>
                </div>
                <button onclick="window.navigate('role-selection')" class="flex items-center gap-2 text-slate-500 hover:text-primary transition">
                    <span class="material-symbols-outlined">logout</span> Changer de rôle
                </button>
            </header>
            <div class="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
                <div class="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-purple-600 text-3xl">construction</span>
                </div>
                <h2 class="text-xl font-bold text-slate-800">Tableau de Bord TMA</h2>
                <p class="text-slate-500 mt-2 mb-6">Le module de gestion des Mises en Production (MEP) est en cours d'intégration.</p>
                <button class="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition" disabled>Bientôt disponible</button>
            </div>
        </div>
    `
};

const DashboardAdmin = {
    render: async () => `
        <div class="min-h-screen bg-slate-50 p-8 font-display">
            <header class="flex justify-between items-center mb-8">
                <div class="flex items-center gap-4">
                     <span class="material-symbols-outlined text-slate-700 text-3xl">shield_person</span>
                     <h1 class="text-2xl font-bold text-slate-800">Administration</h1>
                </div>
                <button onclick="window.navigate('role-selection')" class="flex items-center gap-2 text-slate-500 hover:text-primary transition">
                    <span class="material-symbols-outlined">logout</span> Changer de rôle
                </button>
            </header>
            <div class="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
                <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-slate-600 text-3xl">admin_panel_settings</span>
                </div>
                <h2 class="text-xl font-bold text-slate-800">Console Admin</h2>
                <p class="text-slate-500 mt-2 mb-6">Les fonctionnalités de supervision sont en cours d'intégration.</p>
                <button class="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition" disabled>Bientôt disponible</button>
            </div>
        </div>
    `
};

// ==========================================
// 4. APP INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[Bundle] Initializing App...');

    // Register Routes
    router.addRoute('role-selection', RoleSelection);
    router.addRoute('dashboard-demandeur', DashboardDemandeur);
    router.addRoute('dashboard-formateur', DashboardFormateur);
    router.addRoute('dashboard-tma', DashboardTMA);
    router.addRoute('dashboard-admin', DashboardAdmin);
    router.addRoute('calendar-view', CalendarView);
    router.addRoute('request-form', RequestForm);
    router.addRoute('my-requests', MyRequests);
    router.addRoute('request-details', RequestDetails);
    router.addRoute('request-participants', RequestParticipants);
    router.addRoute('request-validation', RequestValidation);

    // New Formateur Routes
    router.addRoute('validation-details', ValidationDetails);
    router.addRoute('attendance-sheet', AttendanceSheet);

    // Start
    window.navigate('role-selection');
});
