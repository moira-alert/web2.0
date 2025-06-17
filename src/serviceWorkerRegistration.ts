export function register(onUpdate: () => void) {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", async () => {
            try {
                // удалить позже
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const reg of registrations) {
                    if (reg.active && reg.active.scriptURL.includes("service-worker.js")) {
                        await reg.unregister();
                    }
                }

                const cacheNames = await caches.keys();
                for (const cacheName of cacheNames) {
                    if (cacheName === "html-pages") {
                        await caches.delete(cacheName);
                    }
                }
                //
                const registration = await navigator.serviceWorker.register("/sw.js", {
                    scope: "/assets/",
                });

                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    if (installingWorker) {
                        installingWorker.onstatechange = () => {
                            if (
                                installingWorker.state === "installed" &&
                                navigator.serviceWorker.controller
                            ) {
                                onUpdate && onUpdate();
                            }
                        };
                    }
                };
            } catch (error) {
                console.error("Error during service worker registration:", error);
            }
        });
    }
}
