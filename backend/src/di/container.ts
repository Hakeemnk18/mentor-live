import { registerClassDependencies } from "./class.container.js";
import { registerCommonDependencies } from "./common.container.js";
import { registerUserDependencies } from "./user.container.js";


registerCommonDependencies()
registerUserDependencies();
registerClassDependencies()


export { container } from "tsyringe";