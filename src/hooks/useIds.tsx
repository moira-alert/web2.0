import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

export const useIds = (initialLength: number) => {
    const [ids, setIds] = useState<string[]>(
        Array(initialLength)
            .fill(0)
            .map(() => uuidv4())
    );

    return [ids, setIds] as const;
};
