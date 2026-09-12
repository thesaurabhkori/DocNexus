import imageToPdfService from "./service.js";

/**
 * Controller to handle image-to-PDF conversion requests.
 */
export const handleImageToPdfController = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files provided for conversion.",
      });
    }

    const generatedFileName = await imageToPdfService.convertImagesToPdf(
      req.files,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Image files successfully converted to PDF",
      fileName: generatedFileName,
      pdfUrl: `/converted/${generatedFileName}`,
      files: [generatedFileName],
    });
  } catch (error) {
    next(error);
  }
};