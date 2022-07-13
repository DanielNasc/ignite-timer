// arquivo exclusivo para definição de tipos

import "styled-components";
import { defaultTheme } from "../styles/themes/default";

type Theme = typeof defaultTheme;

declare module "styled-components" {
  // faz o DefaultTheme ter o tipo de Theme
  export interface DefaultTheme extends Theme {}
}
