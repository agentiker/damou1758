import * as runtime from "react/jsx-runtime";
import { mdxComponents } from "./index";

/** 把 Velite 编译出的 MDX 代码串还原成 React 组件。 */
function useMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
}

export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <Component components={mdxComponents} />;
}
