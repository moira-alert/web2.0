import { getPageLink } from "../Domain/Global";
import { History } from "history";
import { Trigger, triggerClientToPayload } from "../Domain/Trigger";
import { useAddTriggerMutation, useSetTriggerMutation } from "../services/TriggerApi";

export const useSaveTrigger = (history: History<unknown>) => {
    const [setTrigger] = useSetTriggerMutation();
    const [addTrigger] = useAddTriggerMutation();

    return async (trigger?: Partial<Trigger>) => {
        if (!trigger) {
            return;
        }

        const triggerPayload = triggerClientToPayload(trigger);

        const triggerID = triggerPayload.id;
        const action = triggerID
            ? () => setTrigger({ id: triggerID, data: triggerPayload }).unwrap()
            : () => addTrigger(triggerPayload).unwrap();
        const { id } = await action();
        history.push(getPageLink("trigger", id));
    };
};
