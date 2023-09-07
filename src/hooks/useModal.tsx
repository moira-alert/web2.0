import { useState } from "react";

export const useModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return { isModalOpen, setIsModalOpen, openModal, closeModal } as const;
};
