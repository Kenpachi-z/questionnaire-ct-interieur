/**
 * View: Role Selection
 * The landing page after mock SSO.
 */
import { router } from '../router.js';
import { store } from '../state.js';

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
                
                <!-- Card: Demandeur -->
                <div id="card-demandeur" class="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-primary hover:shadow-md transition cursor-pointer">
                    <div class="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition">
                        <span class="material-symbols-outlined text-blue-600 text-2xl group-hover:text-white transition">edit_document</span>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 mb-1">Demandeur</h3>
                    <p class="text-sm text-slate-500">Régions / Entités</p>
                    <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span class="text-xs font-medium text-slate-400">Accès Standard</span>
                        <span class="material-symbols-outlined text-slate-300 group-hover:text-primary transition">arrow_forward</span>
                    </div>
                </div>

                <!-- Card: Formateur -->
                <div id="card-formateur" class="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-primary hover:shadow-md transition cursor-pointer">
                    <div class="h-12 w-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition">
                        <span class="material-symbols-outlined text-emerald-600 text-2xl group-hover:text-white transition">school</span>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 mb-1">Formateur</h3>
                    <p class="text-sm text-slate-500">Planification & Validation</p>
                    <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span class="text-xs font-medium text-slate-400">Accès Gestionnaire</span>
                        <span class="material-symbols-outlined text-slate-300 group-hover:text-primary transition">arrow_forward</span>
                    </div>
                </div>

                <!-- Card: TMA -->
                <div id="card-tma" class="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-primary hover:shadow-md transition cursor-pointer">
                    <div class="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition">
                        <span class="material-symbols-outlined text-purple-600 text-2xl group-hover:text-white transition">engineering</span>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 mb-1">TMA</h3>
                    <p class="text-sm text-slate-500">Maintenance & MEP</p>
                    <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span class="text-xs font-medium text-slate-400">Accès Technique</span>
                        <span class="material-symbols-outlined text-slate-300 group-hover:text-primary transition">arrow_forward</span>
                    </div>
                </div>

                <!-- Card: Admin -->
                <div id="card-admin" class="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-primary hover:shadow-md transition cursor-pointer">
                    <div class="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-800 transition">
                        <span class="material-symbols-outlined text-slate-600 text-2xl group-hover:text-white transition">shield_person</span>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 mb-1">Administrateur</h3>
                    <p class="text-sm text-slate-500">Supervision Globale</p>
                    <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span class="text-xs font-medium text-slate-400">Accès Complet</span>
                        <span class="material-symbols-outlined text-slate-300 group-hover:text-primary transition">arrow_forward</span>
                    </div>
                </div>

            </div>
            
            <p class="mt-12 text-xs text-slate-400">© 2025 PDGF - Intranet Sécurisé</p>
        </div>
        `;
    },

    afterRender: () => {
        // Event Listeners for Role Selection
        document.getElementById('card-demandeur').addEventListener('click', () => {
            store.setRole('demandeur');
            router.navigate('dashboard-demandeur');
        });

        document.getElementById('card-formateur').addEventListener('click', () => {
            store.setRole('formateur');
            router.navigate('dashboard-formateur');
        });

        document.getElementById('card-tma').addEventListener('click', () => {
            store.setRole('tma');
            router.navigate('dashboard-tma');
        });

        document.getElementById('card-admin').addEventListener('click', () => {
            store.setRole('admin');
            router.navigate('dashboard-admin');
        });
    }
};

export default RoleSelection;
