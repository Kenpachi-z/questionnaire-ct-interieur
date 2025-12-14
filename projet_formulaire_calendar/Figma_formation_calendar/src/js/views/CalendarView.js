import { store } from '../state.js';
import { router } from '../router.js';

export default {
    render: async () => {
        const { mepDates, trainings, unavailability } = store.getState();

        // Helper to check what's on a date
        const getEventsForDate = (dateStr) => {
            const evts = [];
            // Check MEP
            const mep = mepDates.find(m => m.date === dateStr);
            if (mep) evts.push({ type: 'mep', ...mep });

            // Check Trainings
            const training = trainings.filter(t => t.date === dateStr);
            training.forEach(t => evts.push({ type: 'training', ...t }));

            // Check Unavailability
            const unav = unavailability.find(u => u.date === dateStr);
            if (unav) evts.push({ type: 'unavailability', ...unav });

            return evts;
        };

        // Generate Grid (Static October 2023 for demo matching data)
        let daysHtml = '';
        for (let i = 1; i <= 31; i++) {
            const dayNum = i < 10 ? `0${i}` : i;
            const dateStr = `2023-10-${dayNum}`;
            const events = getEventsForDate(dateStr);

            let eventHtml = '';
            events.forEach(evt => {
                if (evt.type === 'mep') {
                    eventHtml += `
                        <div class="mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-700 truncate border-l-2 border-red-500 mb-1">
                            MEP: ${evt.title}
                        </div>`;
                } else if (evt.type === 'training') {
                    eventHtml += `
                        <div class="mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 truncate border-l-2 border-blue-500 mb-1">
                            ${evt.time} - ${evt.title}
                        </div>`;
                } else if (evt.type === 'unavailability') {
                    eventHtml += `
                        <div class="mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 truncate border-l-2 border-slate-400 mb-1">
                            🚫 ${evt.reason}
                        </div>`;
                }
            });

            // Styling for MEP days (blocked)
            const isMepDay = events.some(e => e.type === 'mep');
            const bgClass = isMepDay ? 'bg-red-50/30' : 'bg-white';

            daysHtml += `
                <div class="min-h-[100px] border-b border-r border-slate-200 dark:border-slate-700 p-2 relative ${bgClass} hover:bg-slate-50 transition">
                    <span class="text-sm font-bold text-slate-700 dark:text-slate-300">${i}</span>
                    <div class="mt-1">
                        ${eventHtml}
                    </div>
                </div>
            `;
        }

        return `
            <div class="h-screen flex flex-col bg-background-light dark:bg-background-dark overflow-hidden">
                <!-- Header -->
                <header class="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0">
                    <div class="flex items-center gap-4">
                        <button id="btn-back" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition">
                            <span class="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 class="text-xl font-bold text-slate-900 dark:text-white">Planning Centralisé</h1>
                    </div>
                    <div class="flex items-center gap-3">
                         <span class="text-sm font-medium text-slate-500">Octobre 2023</span>
                         <div class="flex gap-1">
                            <span class="block w-3 h-3 rounded-full bg-blue-500"></span> <span class="text-xs text-slate-500">Formation</span>
                            <span class="block w-3 h-3 rounded-full bg-red-500 ml-2"></span> <span class="text-xs text-slate-500">MEP (Bloqué)</span>
                         </div>
                    </div>
                </header>

                <!-- Calendar Content -->
                <div class="flex-1 overflow-auto p-6">
                    <div class="bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-700 flex flex-col min-h-[800px]">
                        <!-- Days Header -->
                        <div class="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                             ${['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d =>
            `<div class="py-3 text-center text-sm font-semibold text-slate-500 uppercase">${d}</div>`
        ).join('')}
                        </div>
                        
                        <!-- Grid -->
                        <div class="grid grid-cols-7 auto-rows-fr bg-white dark:bg-slate-900">
                            <!-- Padding Days (Start of Oct 2023 was a Sunday, so 6 empty slots if starting Mon) -->
                            <!-- Simply mocking grid alignment for Demo -->
                            <div class="min-h-[100px] border-b border-r border-slate-200 bg-slate-50/50"></div>
                            <div class="min-h-[100px] border-b border-r border-slate-200 bg-slate-50/50"></div>
                            <div class="min-h-[100px] border-b border-r border-slate-200 bg-slate-50/50"></div>
                            <div class="min-h-[100px] border-b border-r border-slate-200 bg-slate-50/50"></div>
                            <div class="min-h-[100px] border-b border-r border-slate-200 bg-slate-50/50"></div>
                            <div class="min-h-[100px] border-b border-r border-slate-200 bg-slate-50/50"></div>
                            
                            ${daysHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    afterRender: () => {
        document.getElementById('btn-back')?.addEventListener('click', () => {
            // Go back to the user's dashboard based on their role
            const role = store.getState().user.role;
            if (role === 'formateur') router.navigate('dashboard-formateur');
            else if (role === 'tma') router.navigate('dashboard-tma');
            else router.navigate('role-selection'); // Fallback
        });
    }
};
