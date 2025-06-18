import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectPlatform } from "../../store/Reducers/ConfigReducer.slice";
import { Platform } from "../../Domain/Config";

const Favicon = () => {
    const platform = useSelector(selectPlatform);

    useEffect(() => {
        if (!platform) return;

        let href: string;

        switch (platform) {
            case Platform.DEV:
                href = "../favicon-dev.ico";
                break;
            case Platform.STAGING:
                href = "../favicon-staging.ico";
                break;
            default:
                href = "../favicon.ico";
        }

        const existingIcons = document.querySelectorAll("link[rel='icon']");
        existingIcons.forEach((icon) => icon.parentNode?.removeChild(icon));

        const link = document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "icon";
        link.href = href;
        document.head.appendChild(link);
    }, [platform]);

    return null;
};

export default Favicon;
