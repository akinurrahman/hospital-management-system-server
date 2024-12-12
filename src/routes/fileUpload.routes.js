import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const router = Router();

router.route("/single").post(upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No File Uploaded" });
    const fileUrl = await uploadOnCloudinary(req.file.path);

    if (fileUrl) {
      return res.status(200).json({ url: fileUrl.url });
    }
    return res.status(500).json({ message: "Failed to upload" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
