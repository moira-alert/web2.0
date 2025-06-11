export function register(onUpdate: () => void) {
    if ("serviceWorker" in navigator && process.env.NODE_ENV !== "production") {
        window.addEventListener("load", async () => {
            try {
                const registration = await navigator.serviceWorker.register("/service-worker.js");

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
