import { FC } from "react";
import MobileHeader from "../MobileHeader/MobileHeader";
import { Sticky } from "@skbkontur/react-ui/components/Sticky";
import { getPageLink } from "../../../Domain/Global";
import { IconArrowCLeftRegular16 } from "@skbkontur/icons/IconArrowCLeftRegular16";
import SettingsContainer, { ISettingsContainerProps } from "../../../Containers/SettingsContainer";

export const MobileSettingsPage: FC<ISettingsContainerProps> = (props) => {
    return (
        <>
            <MobileHeader>
                <Sticky side="top">
                    <MobileHeader.HeaderBlock>
                        <MobileHeader.LeftButton
                            icon={<IconArrowCLeftRegular16 />}
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
