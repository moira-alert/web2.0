export function register(onUpdate: () => void) {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", async () => {
            try {
                const registration = await navigator.serviceWorker.register("/service-worker.js");

                setInterval(async () => {
                    try {
                        await registration.update();
                    } catch (error) {
                        console.error("Error updating service worker:", error);
                    }
                }, 1000 * 60);

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
