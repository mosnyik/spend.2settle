declare module "*.css" {}

declare module "html-react-parser" {
  import { ReactNode } from "react";
  function parse(htmlString: string): ReactNode;
  export = parse;
}

declare module "react-element-to-jsx-string" {
  import { ReactNode } from "react";
  function elementToJSXString(element: ReactNode): string;
  export = elementToJSXString;
}
