import { getColors } from "@skbkontur/colors/get-colors";
import { MOIRA_BRAND_COLOR } from "../Constants/moiraBrandColor";

export const injectKonturColors = () => {
    if (document.getElementById("kontur-colors")) {
        return;
    }

    const css = getColors({
        brand: MOIRA_BRAND_COLOR,
        accent: "gray",
        theme: "all",
        output: "css",
    });

    const style = document.createElement("style");
    style.id = "kontur-colors";
    style.innerHTML = css;

    document.head.appendChild(style);
};
