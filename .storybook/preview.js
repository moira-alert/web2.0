import { addDecorator } from "@storybook/react";
import { withCreevey } from "creevey";
import "../src/style.less";

addDecorator(withCreevey({ captureElement: "#root" }));
