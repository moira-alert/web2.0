
import { Contact } from "./Contact";
import { Subscription } from "./Subscription";

export interface Settings {
  login: string;
  contacts: Array<Contact>;
  subscriptions: Array<Subscription>;
}