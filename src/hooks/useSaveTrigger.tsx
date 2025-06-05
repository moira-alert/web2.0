import { useNavigate } from "react-router-dom";
import { getPageLink } from "../Domain/Global";
import { Trigger, triggerClientToPayload } from "../Domain/Trigger";
import { useAddTriggerMutation, useSetTriggerMutation } from "../services/TriggerApi";

export const useSaveTrigger = () => {
    const navigate = useNavigate();
    const [setTrigger] = useSetTriggerMutation();
    const [addTrigger] = useAddTriggerMutation();

    return async (trigger?: Partial<Trigger>) => {
        if (!trigger) return;

        const triggerPayload = triggerClientToPayload(trigger);

        const triggerID = triggerPayload.id;
        const action = triggerID
            ? () => setTrigger({ id: triggerID, data: triggerPayload }).unwrap()
            : () => addTrigger(triggerPayload).unwrap();

        try {
            const result = await action();
            const { id } = result;
            navigate(getPageLink("trigger", id));
        } catch {
            return;
        }
    };
};
