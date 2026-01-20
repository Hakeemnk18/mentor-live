import { Router } from "express";
import { container } from "tsyringe";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
import { FacultyController } from "../controller/faculty.controller.js";




const router = Router({ mergeParams: true });

const authenticate = container.resolve(Authenticate);
const facultyController = container.resolve(FacultyController);



router.post('/',
  (req,res) => facultyController.createFaculty(req, res)
)

router.get('/',
  (req, res)=> facultyController.GetAllFacultyForAdmin(req, res)
)

router.get('/list',
  (req, res) => facultyController.findAllFacultyForUser(req, res)
)

router.get('/:id',
  (req, res) => facultyController.getFacultyDetailsForAdmin(req, res)
)
router.get('/:id/chapter',
  (req,res)=> facultyController.getFacultyDetailsByChapter(req,res)
)

router.get('/:id/slot',
  (req,res)=> facultyController.getFacultyDetailsBySlot(req,res)
)

router.put('/:id',
  (req, res)=> facultyController.editFaculty(req, res)
)

router.post('/:id/slots',
  (req, res) => facultyController.facultyAddSlots(req, res)
);

router.post('/:id/chapterSlots',
  (req, res) => facultyController.facultyAddChapterSlots(req, res)
);





export default router;