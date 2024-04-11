import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Do not using crypto Api cause some opensource users may use Moira in non-secure browser context
export const useIds = (initialLength: number) => {
    const [ids, setIds] = useState<string[]>(Array.from({ length: initialLength }, () => uuidv4()));

    return [ids, setIds] as const;
};
