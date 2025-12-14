/**
 * State Management (Store)
 * Acts as the single source of truth for the application.
 */

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

    // Update Role
    setRole(role) {
        this.state.user.role = role;
        console.log(`[Store] Role updated to: ${role}`);
        this.notify();
    }

    // Add a MEP (TMA)
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

export const store = new Store();
