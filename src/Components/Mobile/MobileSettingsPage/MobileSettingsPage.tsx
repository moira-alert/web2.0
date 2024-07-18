import React, { FC } from "react";
import MobileHeader from "../MobileHeader/MobileHeader";
import { Sticky } from "@skbkontur/react-ui/components/Sticky";
import { getPageLink } from "../../../Domain/Global";
import ArrowChevronLeftIcon from "@skbkontur/react-icons/ArrowChevronLeft";
import SettingsContainer, { ISettingsContainerProps } from "../../../Containers/SettingsContainer";

export const MobileSettingsPage: FC<ISettingsContainerProps> = (props) => {
    return (
        <>
            <MobileHeader>
                <Sticky side="top">
                    <MobileHeader.HeaderBlock>
                        <MobileHeader.LeftButton
                            icon={<ArrowChevronLeftIcon />}
                            linkTo={getPageLink("index")}
                        />
                        <MobileHeader.Title>Moira: Settings</MobileHeader.Title>
                    </MobileHeader.HeaderBlock>
                </Sticky>
            </MobileHeader>
            <SettingsContainer {...props} />
        </>
    );
};
