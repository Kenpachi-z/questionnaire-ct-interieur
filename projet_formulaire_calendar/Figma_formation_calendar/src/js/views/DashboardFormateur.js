import { router } from '../router.js';
import { store } from '../state.js';

export default {
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
                            <button id="nav-home" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium text-left">
                                <span class="material-symbols-outlined">home</span>
                                <span>Accueil</span>
                            </button>
                            <!-- PROMPT REQUIREMENT: Planning Button -->
                            <button id="nav-planning" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                                <span class="material-symbols-outlined">calendar_month</span>
                                <span>Planning</span>
                            </button>
                            <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                                <span class="material-symbols-outlined">check_circle</span>
                                <span>Validation</span>
                            </button>
                             <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                                <span class="material-symbols-outlined">edit_note</span>
                                <span>Saisie Présences</span>
                            </button>
                        </div>
                        <!-- User Profile Snippet (Bottom) -->
                        <div class="p-4 border-t border-slate-100 dark:border-slate-800">
                            <div class="flex items-center gap-3">
                                <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-white dark:ring-slate-800" style='background-image: url("${user.avatar}");'>
                                </div>
                                <div class="flex flex-col flex-1 min-w-0">
                                    <p class="text-sm font-medium text-slate-900 dark:text-white truncate">${user.name}</p>
                                    <p class="text-xs text-slate-500 dark:text-slate-400 truncate">Formateur Senior</p>
                                </div>
                                <button onclick="window.navigate('role-selection')" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" title="Changer de rôle">
                                    <span class="material-symbols-outlined text-xl">logout</span>
                                </button>
                            </div>
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
                            <!-- Greeting -->
                            <div>
                                <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Bonjour, ${user.name.split(' ')[0]}</h1>
                                <p class="mt-2 text-slate-600 dark:text-slate-400">Voici vos priorités et votre planning pour aujourd'hui.</p>
                            </div>

                            <!-- Dashboard KPI Section (Simplified for MVP) -->
                             <section aria-label="Tâches en Attente">
                                <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary">notifications_active</span>
                                    Tâches en Attente
                                </h2>
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer">
                                        <div class="flex items-center gap-3 mb-2">
                                            <div class="bg-primary/10 p-2 rounded-lg text-primary">
                                                <span class="material-symbols-outlined">checklist</span>
                                            </div>
                                            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Demandes à Valider</p>
                                        </div>
                                        <p class="text-4xl font-bold text-slate-900 dark:text-white mt-2">12</p>
                                    </div>
                                    <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border-l-4 border-l-amber-500 border-y border-r border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer">
                                        <div class="flex items-center gap-3 mb-2">
                                            <div class="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg text-amber-600 dark:text-amber-400">
                                                 <span class="material-symbols-outlined">warning</span>
                                            </div>
                                            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Saisies Manquantes</p>
                                        </div>
                                         <p class="text-4xl font-bold text-slate-900 dark:text-white mt-2">3</p>
                                    </div>
                                </div>
                             </section>

                            <!-- Mini Calendar Teaser (Click to go to full calendar) -->
                             <section class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                                <div class="flex justify-between items-center mb-6">
                                    <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Aperçu du Planning</h2>
                                    <button id="btn-view-calendar" class="text-primary font-bold text-sm hover:underline">Voir tout l'agenda →</button>
                                </div>
                                <div class="h-40 bg-slate-50 dark:bg-slate-900/50 rounded flex items-center justify-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-700">
                                    <span class="flex items-center gap-2">
                                        <span class="material-symbols-outlined">calendar_month</span>
                                        Cliquez sur "Planning" pour voir le calendrier détaillé
                                    </span>
                                </div>
                             </section>
                        </div>
                    </div>
                </main>
            </div>
        `;
    },
    afterRender: () => {
        // Navigation Logic
        document.getElementById('nav-planning')?.addEventListener('click', () => {
            router.navigate('calendar-view');
        });

        document.getElementById('btn-view-calendar')?.addEventListener('click', () => {
            router.navigate('calendar-view');
        });

        // Other links can be inert or mock alerts
        document.getElementById('nav-home')?.addEventListener('click', () => {
            alert('Vous êtes déjà sur l\'accueil.');
        });
    }
};
