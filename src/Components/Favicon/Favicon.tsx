import React, { useEffect, useState } from "react";
import FaviconComponent from "react-favicon";
import { useSelector } from "react-redux";
import { selectPlatform } from "../../store/Reducers/ConfigReducer.slice";

const Favicon = () => {
    const platform = useSelector(selectPlatform);

    const [faviconUrl, setFaviconUrl] = useState<string>("../favicon.ico");

    useEffect(() => {
        const url = "../favicon-dev.ico";

        setFaviconUrl(url);
    }, [platform]);

    return <FaviconComponent url={faviconUrl} />;
};

export default Favicon;
