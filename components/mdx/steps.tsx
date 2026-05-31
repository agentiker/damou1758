import type { ReactNode } from "react";

/** 步骤容器：内部每个 ### 标题自动编号（样式见 globals.css 的 .steps）。 */
export function Steps({ children }: { children: ReactNode }) {
  return <div className="steps">{children}</div>;
}
