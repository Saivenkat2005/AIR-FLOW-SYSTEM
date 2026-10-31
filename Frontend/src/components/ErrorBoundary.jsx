import React from 'react';

export default class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('Frontend rendering error', error, info);
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-slate-950 p-6 text-center">
                <div className="max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8">
                    <h1 className="text-2xl font-bold text-white">We hit a temporary issue</h1>
                    <p className="mt-3 text-slate-400">
                        Your booking data is safe. Reload the page to continue.
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-6 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
                    >
                        Reload page
                    </button>
                </div>
            </main>
        );
    }
}
