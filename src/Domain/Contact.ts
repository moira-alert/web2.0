
export interface Contact {
  id: string;
  type: string;
  user: string;
  value: string;
}

export interface ContactList {
  list: Array<Contact>;
}