import React, { useMemo } from "react";
import FaviconComponent from "react-favicon";
import { useSelector } from "react-redux";
import { selectPlatform } from "../../store/Reducers/ConfigReducer.slice";
import { Platform } from "../../Domain/Config";

const Favicon = () => {
    const platform = useSelector(selectPlatform);

    const faviconUrl = useMemo(() => {
        if (!platform) return null;

        switch (platform) {
            case Platform.DEV:
                return "../favicon-dev.ico";
            case Platform.STAGING:
                return "../favicon-staging.ico";
            default:
                return "../favicon.ico";
        }
    }, [platform]);

    if (!faviconUrl) return null;

    return <FaviconComponent url={faviconUrl} />;
};

export default Favicon;
