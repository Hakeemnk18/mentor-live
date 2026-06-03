import "reflect-metadata";
import { env } from "./config/env.js";
import app from "./core/app.js";
import { connectDB } from "./config/db.js";
import type { Application } from "express";
import registerUserModule from "./modules/user/user.module.js";
import registerClassModule from "./modules/class/class.module.js";
import registerSyllabusModule from "./modules/syllabus/syllabus.module.js";
import registerSubjectModule from "./modules/subject/subject.module.js";
import registerSubjectVariantModule from "./modules/subject-variant/subject.variant.module.js";
import registerChapterModule from "./modules/chapter/chapter.module.js";
import registerFacultyModule from "./modules/faculty/faculty.module.js";
import registerMediaModule from "./modules/media/media.module.js";
import registerBookingModule from "./modules/booking/booking.module.js";
import registerStudentsModule from "./modules/student/student.module.js";
import registerBannerModule from "./modules/banner/banner.module.js";
import registerTestimonialModule from "./modules/testimonial/testimonial.module.js";
import registerBlogModule from "./modules/blog/blog.module.js";
import registerAnalysisModule from "./modules/analysis/analysis.module.js";
import registerLeadModule from "./modules/lead/lead.module.js";

const PORT = env.PORT;

const startServer = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    //console.log("Database connected successfully.");

    const expressApp: Application = app;

    registerUserModule(expressApp);
    registerMediaModule(expressApp);
    registerClassModule(expressApp);
    registerSyllabusModule(expressApp);
    registerSubjectModule(expressApp);
    registerSubjectVariantModule(expressApp);
    registerChapterModule(expressApp);
    registerFacultyModule(expressApp);
    registerBookingModule(expressApp);
    registerStudentsModule(expressApp);
    registerBannerModule(expressApp);
    registerTestimonialModule(expressApp);
    registerBlogModule(expressApp);
    registerAnalysisModule(expressApp);
    registerLeadModule(expressApp);

    expressApp.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      console.error(error.stack);
    } else {
      console.error("An unknown error occurred", error);
    }
    process.exit(1);
  }
};

startServer();
