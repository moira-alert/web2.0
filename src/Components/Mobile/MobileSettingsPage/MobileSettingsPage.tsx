import React, { FC } from "react";
import MobileHeader from "../MobileHeader/MobileHeader";
import { Sticky } from "@skbkontur/react-ui/components/Sticky";
import { getPageLink } from "../../../Domain/Global";
import ArrowChevronLeftIcon from "@skbkontur/react-icons/ArrowChevronLeft";
import SettingsContainer from "../../../Containers/SettingsContainer";
import MoiraApi from "../../../Api/MoiraApi";
import { RouteComponentProps } from "react-router";

interface ISettingsContainerProps extends RouteComponentProps<{ teamId?: string }> {
    moiraApi: MoiraApi;
}

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
