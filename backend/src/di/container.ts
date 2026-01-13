import { registerClassDependencies } from "./class.container.js";
import { registerCommonDependencies } from "./common.container.js";
import { registerSyllabusDependencies } from "./syllabus.container.js";
import { registerUserDependencies } from "./user.container.js";


registerCommonDependencies()
registerUserDependencies();
registerClassDependencies()
registerSyllabusDependencies()


export { container } from "tsyringe";