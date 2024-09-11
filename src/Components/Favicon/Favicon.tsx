import React, { useEffect, useState } from "react";
import FaviconComponent from "react-favicon";
import { useSelector } from "react-redux";
import { selectPlatform } from "../../store/Reducers/ConfigReducer.slice";
import { Platform } from "../../Domain/Config";

const Favicon = () => {
    const platform = useSelector(selectPlatform);

    const [faviconUrl, setFaviconUrl] = useState<string>("../favicon.ico");

    useEffect(() => {
        if (!platform) {
            return;
        }

        switch (platform) {
            case Platform.DEV:
                setFaviconUrl("../favicon-dev.ico");
                break;
            case Platform.STAGING:
                setFaviconUrl("../favicon-staging.ico");
                break;
        }
    }, [platform]);

    return <FaviconComponent url={faviconUrl} />;
};

export default Favicon;
