import type { FC } from "react";
import { useEffect } from "react";
import { Modal } from "@skbkontur/react-ui";
import { RowStack, Fixed, Fill } from "@skbkontur/react-stack-layout";
import { ThemeSwitch } from "../ThemeSwitch/ThemeSwitch";
import { useDispatch, useSelector } from "react-redux";
import { useThemeFeature } from "../../hooks/themes/useThemeFeature";
import { setTheme } from "../../store/Reducers/UIReducer.slice";
import { UIState } from "../../store/selectors";
import { EThemesNames } from "../../Themes/themesNames";
import { useModal } from "../../hooks/useModal";
import { useIsBrowserPrefersDarkTheme } from "../../hooks/themes/useIsBrowserPrefersDarkTheme";
import { TriggerViewSwitcher } from "../TriggerViewSwitcher/TriggerViewSwitcher";
import { IconPeople1GearRegular16 } from "@skbkontur/icons/IconPeople1GearRegular16";
import { ColorBlindThemeSwitcher } from "../ColorBlindThemeSwitcher/ColorBlindThemeSwitcher";
import { Flexbox } from "../Flexbox/FlexBox";

import styles from "./UISettingsModal.module.less";

export const UISettingsModal: FC = () => {
    const { theme: themeName } = useSelector(UIState);
    const dispatch = useDispatch();

    const [localThemeName, setLocalTheme] = useThemeFeature();
    const isBrowserDarkThemeEnabled = useIsBrowserPrefersDarkTheme();
    const { isModalOpen, closeModal, openModal } = useModal();

    const toggleModal = () => (isModalOpen ? closeModal() : openModal());

    const onThemeChange = (newThemeName: EThemesNames) => {
        setLocalTheme(newThemeName);
        dispatch(setTheme(newThemeName));
    };

    useEffect(() => {
        onThemeChange(localThemeName);
    }, [isBrowserDarkThemeEnabled]);

    const labelWidth = 200;

    return (
        <>
            <button className={styles.settingsButton} onClick={toggleModal}>
                <IconPeople1GearRegular16 />
                <span>Settings</span>
            </button>
            {isModalOpen && (
                <Modal key={themeName} width={"500px"} onClose={toggleModal}>
                    <Modal.Header>Settings</Modal.Header>
                    <Modal.Body>
                        <Flexbox gap={18}>
                            <RowStack verticalAlign="center" block>
                                <Fixed width={labelWidth}>Application theme:</Fixed>
                                <Fill>
                                    <ThemeSwitch
                                        onThemeChange={onThemeChange}
                                        currentTheme={themeName}
                                    />
                                </Fill>
                            </RowStack>

                            <RowStack verticalAlign="center" block>
                                <Fixed width={labelWidth}>Main page trigger view:</Fixed>
                                <Fill>
                                    <TriggerViewSwitcher />
                                </Fill>
                            </RowStack>

                            <RowStack verticalAlign="center" block>
                                <Fixed width={labelWidth}>Color blind theme:</Fixed>
                                <Fill>
                                    <ColorBlindThemeSwitcher />
                                </Fill>
                            </RowStack>
                        </Flexbox>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};
