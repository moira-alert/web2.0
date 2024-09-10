import React, { useEffect, useState } from "react";
import FaviconComponent from "react-favicon";
import { useSelector } from "react-redux";
import { selectPlatform } from "../../store/Reducers/ConfigReducer.slice";
import { Platform } from "../../Domain/Config";

const Favicon = () => {
    const platform = useSelector(selectPlatform);

    const [faviconUrl, setFaviconUrl] = useState<string>("../favicon.ico");

    useEffect(() => {
        let url = "../favicon.ico";
        if (platform === Platform.DEV) {
            url = "../favicon-dev.ico";
        }
        setFaviconUrl(url);
    }, [platform]);

    return <FaviconComponent url={faviconUrl} />;
};

export default Favicon;
