import { Account } from "./account";

export interface Client {
    id: string;
    name: string;
    firstname: string;
    address: string | null;
    created: string;
    birthday: string;
    accounts: string[] | Account[];
  }