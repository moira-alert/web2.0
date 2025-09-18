import React, { useEffect } from "react";
import { Modal } from "@skbkontur/react-ui";
import { ThemeSwitch } from "../ThemeSwitch/ThemeSwitch";
import { useDispatch, useSelector } from "react-redux";
import { useThemeFeature } from "../../hooks/themes/useThemeFeature";
import { setTheme } from "../../store/Reducers/UIReducer.slice";
import { UIState } from "../../store/selectors";
import { EThemesNames } from "../../Themes/themesNames";
import { useModal } from "../../hooks/useModal";
import { useIsBrowserPrefersDarkTheme } from "../../hooks/themes/useIsBrowserPrefersDarkTheme";
import { Form, FormRow } from "../TriggerEditForm/Components/Form";
import { TriggerViewSwitcher } from "../TriggerViewSwitcher/TriggerViewSwitcher";
import UserSettings from "@skbkontur/react-icons/UserSettings";

import styles from "./UISettingsModal.module.less";

export const UISettingsModal: React.FC = () => {
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

    return (
        <>
            <button className={styles.settingsButton} onClick={toggleModal}>
                <UserSettings />
                <span>Settings</span>
            </button>
            {isModalOpen && (
                <Modal width={"500px"} onClose={toggleModal}>
                    <Modal.Header>Settings</Modal.Header>
                    <Modal.Body>
                        <Form>
                            <FormRow label="Application theme:">
                                <ThemeSwitch
                                    onThemeChange={onThemeChange}
                                    currentTheme={themeName}
                                />
                            </FormRow>
                            <FormRow useTopAlignForLabel label="Main page trigger view:">
                                <TriggerViewSwitcher style={{ paddingLeft: "28px" }} />
                            </FormRow>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};
