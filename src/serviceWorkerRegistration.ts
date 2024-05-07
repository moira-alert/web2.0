export function register(onUpdate: () => void) {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker
                .register("/service-worker.js")
                .catch(console.error)
                .then((registration) => {
                    setInterval(() => {
                        (registration as ServiceWorkerRegistration).update();
                        console.log("Checked for update...");
                    }, 1000 * 10 * 1);
                    (registration as ServiceWorkerRegistration).onupdatefound = () => {
                        const installingWorker = (registration as ServiceWorkerRegistration)
                            .installing;
                        if (installingWorker) {
                            installingWorker.onstatechange = () => {
                                if (installingWorker.state === "installed") {
                                    if (navigator.serviceWorker.controller) {
                                        console.log("updated");
                                        if (onUpdate) onUpdate();
                                    }
                                }
                            };
                        }
                    };
                })
                .catch((error) => {
                    console.error("Error during service worker registration:", error);
                });
        });
    }
}
