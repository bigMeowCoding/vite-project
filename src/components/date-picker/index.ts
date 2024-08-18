import { withInstall } from "element-plus/lib/utils";
import DatePicker from "./src/date-picker";

import type { SFCWithInstall } from "element-plus/lib/utils";

export const BwDatePicker: SFCWithInstall<typeof DatePicker> =
  withInstall(DatePicker);

export default BwDatePicker;
export * from "./src/constants";
export * from "./src/props/date-picker";
export type { DatePickerInstance } from "./src/instance";
