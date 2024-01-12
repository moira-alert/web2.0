import { useState } from "react";

export const useIds = (initialLength: number) => {
    const [ids, setIds] = useState<string[]>(
        Array.from({ length: initialLength }, () => crypto.randomUUID())
    );

    return [ids, setIds] as const;
};
