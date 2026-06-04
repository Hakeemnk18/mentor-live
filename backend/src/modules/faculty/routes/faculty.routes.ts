import { Router } from "express";
import { container } from "tsyringe";
import { Authenticate } from "../../../infrastructure/middileware/auth.middleware.js";
import { authorizeRoles } from "../../../infrastructure/middileware/role.middleware.js";
import { FacultyController } from "../controller/faculty.controller.js";




const router = Router({ mergeParams: true });

const authenticate = container.resolve(Authenticate);
const facultyController = container.resolve(FacultyController);


// create faculty
router.post('/',
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => facultyController.createFaculty(req, res)
)

// get all faculty for admin with search and pagination
router.get('/',
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => facultyController.GetAllFacultyForAdmin(req, res)
)

// get all faculty for user
router.get('/list',
  (req, res) => facultyController.findAllFacultyForUser(req, res)
)

// get faculty details for admin
router.get('/:id',
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => facultyController.getFacultyDetailsForAdmin(req, res)
)

// get faculty details by chapter
router.get('/:id/chapter',
  (req, res) => facultyController.getFacultyDetailsByChapter(req, res)
)

// get faculty details by slot
router.get('/:id/slot',
  (req, res) => facultyController.getFacultyDetailsBySlot(req, res)
)

// get available slots for a faculty
router.get('/:id/available-slots',
  (req, res) => facultyController.getAvailableSlots(req, res)
)

// edit faculty
router.put('/:id',
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => facultyController.editFaculty(req, res)
)

// add slots for faculty
router.post('/:id/slots',
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => facultyController.facultyAddSlots(req, res)
);

// add chapter slots for faculty
router.post('/:id/chapterSlots',
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => facultyController.facultyAddChapterSlots(req, res)
);

// block faculty
router.patch(
  "/:id/block",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => facultyController.blockFaculty(req, res),
);

// unblock faculty
router.patch(
  "/:id/unblock",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => facultyController.unblockFaculty(req, res),
);

// update slot availability
router.patch(
  "/:facultyId/slots/:slotId",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => facultyController.updateSlotAvailability(req, res),
);

// update chapter slot availability
router.patch(
  "/:facultyId/chapter-slots/:chapterId",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => facultyController.updateChapterSlotAvailability(req, res),
);

// get user slot details
router.get(
  "/:id/slot-details",
  authenticate.authenticate,
  authorizeRoles("admin"),
  (req, res) => facultyController.getUserSlotDetails(req, res),
);






export default router;