import React, { ReactElement } from "react";
import ArrowChevronLeftIcon from "@skbkontur/react-icons/ArrowChevronLeft";
import { getPageLink } from "../Domain/Global";
import MobileHeader from "../Components/Mobile/MobileHeader/MobileHeader";

export default function MobileErrorContainer(): ReactElement {
    return (
        <>
            <MobileHeader>
                <MobileHeader.HeaderBlock>
                    <MobileHeader.LeftButton
                        icon={<ArrowChevronLeftIcon />}
                        linkTo={getPageLink("index")}
                    />
                    <MobileHeader.Title>Moira</MobileHeader.Title>
                </MobileHeader.HeaderBlock>
            </MobileHeader>
            <main style={{ padding: "0 20px" }}>
                <h1>404</h1>
                <p>Page not found</p>
            </main>
        </>
    );
}
