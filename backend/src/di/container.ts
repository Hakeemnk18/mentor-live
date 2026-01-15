import { registerChapterDependencies } from "./chapter.container.js";
import { registerClassDependencies } from "./class.container.js";
import { registerCommonDependencies } from "./common.container.js";
import { registerSubjectDependencies } from "./subject.container.js";
import { registerSubjectVariantDependencies } from "./subject.variant.container.js";
import { registerSyllabusDependencies } from "./syllabus.container.js";
import { registerUserDependencies } from "./user.container.js";


registerCommonDependencies()
registerUserDependencies();
registerClassDependencies()
registerSyllabusDependencies()
registerSubjectDependencies()
registerSubjectVariantDependencies()
registerChapterDependencies()


export { container } from "tsyringe";