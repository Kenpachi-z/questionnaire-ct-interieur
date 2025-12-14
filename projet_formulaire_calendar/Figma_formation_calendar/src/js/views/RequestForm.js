export default {
    render: async () => `
        <div class="min-h-screen bg-slate-50 flex flex-col">
            <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
                <div class="flex items-center gap-4">
                     <button onclick="window.navigate('dashboard-demandeur')" class="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition">
                        <span class="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 class="text-xl font-bold text-slate-900">Nouvelle Demande de Formation</h1>
                </div>
            </header>
            
            <main class="flex-1 p-8 max-w-3xl mx-auto w-full">
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                     <div class="flex flex-col gap-6">
                        <!-- Step Indicator -->
                        <div class="flex items-center gap-4 mb-4">
                            <span class="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
                            <span class="font-medium text-slate-900">Informations Générales</span>
                            <span class="h-px bg-slate-200 flex-1"></span>
                            <span class="bg-slate-100 text-slate-400 w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span>
                        </div>

                        <!-- Mock Form Fields -->
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Intitulé de la formation</label>
                            <input type="text" class="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary" placeholder="Ex: React Avancé">
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                             <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Date Souhaitée</label>
                                <input type="date" class="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary">
                            </div>
                             <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Nombre de participants estimate</label>
                                <input type="number" class="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary" placeholder="10">
                            </div>
                        </div>

                        <!-- Import Participants Mock -->
                         <div class="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition cursor-pointer">
                            <span class="material-symbols-outlined text-4xl text-slate-400 mb-2">upload_file</span>
                            <p class="text-sm font-medium text-slate-600">Glissez-déposez votre liste de participants (CSV/Excel)</p>
                            <p class="text-xs text-slate-400 mt-1">ou cliquez pour parcourir</p>
                        </div>

                        <div class="pt-4 flex justify-end gap-3">
                            <button onclick="window.navigate('dashboard-demandeur')" class="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium">Annuler</button>
                            <button class="px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-blue-700 shadow-sm">Suivant</button>
                        </div>
                     </div>
                </div>
            </main>
        </div>
    `
};
