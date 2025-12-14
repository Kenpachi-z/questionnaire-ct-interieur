import { router } from '../router.js';
import { store } from '../state.js';

export default {
    render: async () => {
        const user = store.getState().user;
        return `
            <div class="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-[#111318] dark:text-white transition-colors duration-200">
                <header class="sticky top-0 z-50 w-full border-b border-[#f0f2f4] dark:border-[#2a3441] bg-surface-light dark:bg-surface-dark shadow-sm">
                    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div class="flex items-center gap-4">
                            <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <span class="material-symbols-outlined text-2xl">school</span>
                            </div>
                            <h1 class="text-lg font-bold tracking-tight text-[#111318] dark:text-white hidden sm:block">Intranet Formation</h1>
                        </div>
                        <nav class="hidden md:flex items-center gap-8">
                            <a class="text-sm font-medium text-[#111318] dark:text-gray-200 hover:text-primary transition-colors cursor-pointer">Accueil</a>
                            <a class="text-sm font-bold text-primary cursor-pointer">Mes Demandes</a>
                            <a class="text-sm font-medium text-[#111318] dark:text-gray-200 hover:text-primary transition-colors cursor-pointer">Planning Global</a>
                        </nav>
                        <div class="flex items-center gap-4">
                             <div class="hidden md:flex flex-col items-end">
                                <span class="text-sm font-semibold text-[#111318] dark:text-white">${user.name}</span>
                                <span class="text-xs text-[#616f89] dark:text-gray-400">Demandeur (Région Nord)</span>
                            </div>
                            <button onclick="window.navigate('role-selection')" class="relative size-10 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 hover:ring-2 hover:ring-primary transition" title="Changer de rôle">
                                <img alt="User Avatar" class="h-full w-full object-cover" src="${user.avatar}"/>
                            </button>
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
                             <!-- Background Blurs -->
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
                                
                                <!-- CTA Button: Create Request -->
                                <button id="btn-create-request" class="group relative flex items-center justify-center gap-3 whitespace-nowrap rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:bg-primary-hover hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-[0.98] w-full sm:w-auto">
                                    <span class="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
                                    Créer une Nouvelle Demande de Formation
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

                        <!-- Content Grid -->
                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                             <!-- Requests Table (Simplified HTML port) -->
                             <div class="lg:col-span-8 flex flex-col rounded-2xl bg-surface-light dark:bg-surface-dark border border-[#e5e7eb] dark:border-[#2a3441] shadow-md h-full min-h-[400px]">
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
                                </div>
                                <div class="p-6 text-center text-slate-400 italic">
                                    (Liste des demandes - statique pour MVP)
                                </div>
                             </div>

                             <!-- Sidebar Stats -->
                             <div class="lg:col-span-4 flex flex-col rounded-2xl bg-surface-light dark:bg-surface-dark border border-[#e5e7eb] dark:border-[#2a3441] shadow-md h-full min-h-[400px]">
                                <div class="flex items-center justify-between border-b border-[#f0f2f4] dark:border-[#2a3441] px-6 py-5">
                                    <h3 class="text-lg font-bold">Planning Global</h3>
                                </div>
                                <div class="p-6 text-center text-slate-400 italic">
                                    (Mini Calendrier - statique pour MVP)
                                </div>
                             </div>
                        </div>
                    </div>
                </main>
            </div>
        `;
    },
    afterRender: () => {
        // Navigation Logic
        document.getElementById('btn-create-request')?.addEventListener('click', () => {
            router.navigate('request-form');
        });
    }
};
