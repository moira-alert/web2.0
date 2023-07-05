import React from "react";
import { Config } from "../Domain/Config";

export const ConfigContext = React.createContext<Config | null>(null);
