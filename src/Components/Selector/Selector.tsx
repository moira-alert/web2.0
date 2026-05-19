import React, { useRef, useState } from "react";
import { TagDropdown } from "../TagDropdownSelect/Components/TagDropdown";
import { TagInput } from "../TagDropdownSelect/Components/TagInput";
import { RenderLayer } from "@skbkontur/react-ui/internal/RenderLayer";
import { useGetUserTeamsQuery } from "../../services/TeamsApi";
import { DropdownMenu } from "@skbkontur/react-ui/components/DropdownMenu";
import ArrowChevronDown from "@skbkontur/react-icons/ArrowChevronDown";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import { MenuItem } from "@skbkontur/react-ui/components/MenuItem";
import { MenuHeader } from "@skbkontur/react-ui/components/MenuHeader";
import { useNavigate, useLocation } from "react-router";
import qs from "qs";
import styles from "./Selector.module.less";

type Props = {
    search: string;
    tokens: string[];
    renderToken: (token: string) => React.ReactNode;
    children: (closeDropdown: () => void) => React.ReactNode;
    onEnterKeyDown: () => void;
    onBackspaceKeyDown: () => void;
    onInputChange: (value: string) => void;
};

const Selector: React.FC<Props> = ({
    search,
    tokens,
    renderToken,
    children,
    onEnterKeyDown,
    onBackspaceKeyDown,
    onInputChange,
}) => {
    const [focused, setFocused] = useState(false);
    const dropdownAnchorRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const openDropdown = () => {
        if (!focused) {
            setFocused(true);
        }
    };

    const closeDropdown = () => {
        if (focused) {
            searchInputRef.current?.blur();
            setFocused(false);
        }
    };

    const handleInputKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === "Enter") {
            onEnterKeyDown();
            closeDropdown();
        }

        if (
            evt.key === "Backspace" &&
            evt.currentTarget.selectionStart === 0 &&
            tokens.length !== 0
        ) {
            onBackspaceKeyDown();
        }
    };
    const { data: teams } = useGetUserTeamsQuery();

    const query = qs.parse(location.search, { ignoreQueryPrefix: true });
    const teamId = typeof query.teamID === "string" ? query.teamID : undefined;

    const selectTeam = (id?: string) => {
        const current = qs.parse(location.search, { ignoreQueryPrefix: true });

        const next = {
            ...current,
            teamID: id ?? null,
        };

        navigate(`?${qs.stringify(next, { encode: true, skipNulls: true })}`, {
            replace: true,
        });
    };
    return (
        <RenderLayer onFocusOutside={closeDropdown} onClickOutside={closeDropdown} active={focused}>
            <div className={styles.container} ref={dropdownAnchorRef}>
                <TagInput
                    focused={focused}
                    value={tokens}
                    inputValue={search}
                    renderToken={renderToken}
                    onValueChange={onInputChange}
                    onKeyDown={handleInputKeyDown}
                    onFocus={openDropdown}
                    useScrollContainer={false}
                    minHeight="40px"
                    inputLineHeight="32px"
                    ref={searchInputRef}
                />
                {teams && teams?.length > 0 && (
                    <div
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className={styles.teamFilter}
                    >
                        <DropdownMenu
                            positions={["bottom right"]}
                            caption={
                                teamId ? (
                                    <DeleteIcon
                                        size={30}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            selectTeam(undefined);
                                        }}
                                    />
                                ) : (
                                    <ArrowChevronDown size={30} />
                                )
                            }
                        >
                            <MenuHeader>Team</MenuHeader>
                            {teams?.map((team) => (
                                <MenuItem
                                    key={team.id}
                                    state={teamId === team.id ? "selected" : undefined}
                                    onClick={() => selectTeam(team.id)}
                                >
                                    {team.name}
                                </MenuItem>
                            ))}
                        </DropdownMenu>
                    </div>
                )}

                {focused && (
                    <TagDropdown anchor={dropdownAnchorRef.current}>
                        {children(closeDropdown)}
                    </TagDropdown>
                )}
            </div>
        </RenderLayer>
    );
};

export default Selector;
