import { OverrideField } from "../helpers/OverrideField";
import { MoiraNotificationEvent, DtoEventsList } from "./__generated__/data-contracts";
import { Status } from "./Status";

export type Event = OverrideField<MoiraNotificationEvent, "state" | "old_state", Status>;

export type EventList = OverrideField<DtoEventsList, "list", Event[]>;
