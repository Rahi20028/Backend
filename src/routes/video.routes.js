import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { publishVideo , getVideo, updateVideo, deleteVideo} from "../controllers/video.controller.js";

const router = Router()

router.route("/createVideo").post(
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),

  publishVideo
);
router.route("/c/getvideo/:videoId").get(getVideo)
router.route("/c/:videoId").patch(upload.single("videoFile"), updateVideo)
router.route("/c/:videoId").delete(deleteVideo)

export default router