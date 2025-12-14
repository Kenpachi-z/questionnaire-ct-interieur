/**
 * Router Engine
 * Handles navigation between views.
 */
import { store } from './state.js';

class Router {
    constructor() {
        this.routes = {};
        this.appContainer = document.getElementById('app');
    }

    /**
     * Register a route
     * @param {string} path - The route name (e.g., 'role-selection', 'dashboard-formateur')
     * @param {object} view - The view object containing forceRender() method
     */
    addRoute(path, view) {
        this.routes[path] = view;
    }

    /**
     * Navigate to a route
     * @param {string} path - The route name
     */
    async navigate(path) {
        console.log(`[Router] Navigating to: ${path}`);

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
            view.afterRender();
        }
    }
}

export const router = new Router();
