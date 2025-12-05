"use client";
import { HekinavConfig } from "@/app/layout";
import { createContext, ReactNode, useContext } from "react";

const Ctx = createContext({} as HekinavConfig);

export function useConfig() {
  return useContext(Ctx);
}

export default function ConfigProvider({ config, children }:{children: ReactNode, config: HekinavConfig}) {
  return <Ctx.Provider value={config}>{children}</Ctx.Provider>;
}