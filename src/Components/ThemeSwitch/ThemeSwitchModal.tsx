import React, { useEffect } from "react";
import { Modal } from "@skbkontur/react-ui";
import { ThemeSwitch } from "./ThemeSwitch";
import { useDispatch, useSelector } from "react-redux";
import { useThemeFeature } from "../../hooks/themes/useThemeFeature";
import { setTheme } from "../../store/Reducers/UIReducer.slice";
import { UIState } from "../../store/selectors";
import { EThemesNames } from "../../Themes/themesNames";
import { useBrowserThemeDetector } from "../../hooks/themes/useBrowserThemeDetector";
import { useModal } from "../../hooks/useModal";
import { ThemeSwitchIcon } from "./Components/ThemeSwitchIcon/ThemeSwitchIcon";

export const ThemeSwitchModal: React.FC = () => {
    const { theme: themeName } = useSelector(UIState);
    const dispatch = useDispatch();

    const [localThemeName, setLocalTheme] = useThemeFeature();
    const [isBrowserDarkThemeEnabled] = useBrowserThemeDetector();
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
            <ThemeSwitchIcon currentTheme={localThemeName} onToggleThemeModal={toggleModal} />

            {isModalOpen && (
                <Modal width={"500px"} onClose={toggleModal}>
                    <Modal.Header>Choose Theme</Modal.Header>
                    <Modal.Body>
                        <ThemeSwitch onThemeChange={onThemeChange} currentTheme={themeName} />
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};
