const Website = require('../models/Website');
const { sendResponse } = require('../utils/response');
const { generateUniqueSlug } = require('../utils/slug');

const createWebsite = async (req, res, next) => {
  try {
    const { businessName, description, logo, whatsappNumber, upiId, themeColor } = req.body;

    const slug = await generateUniqueSlug(businessName);

    const website = await Website.create({
      userId: req.user._id,
      businessName,
      description,
      logo,
      whatsappNumber,
      upiId,
      themeColor,
      slug,
    });

    return sendResponse(res, 201, true, 'Website created successfully', website);
  } catch (error) {
    next(error);
  }
};

const getMyWebsites = async (req, res, next) => {
  try {
    const websites = await Website.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return sendResponse(res, 200, true, 'Websites fetched successfully', websites);
  } catch (error) {
    next(error);
  }
};

const updateWebsite = async (req, res, next) => {
  try {
    const { websiteId, businessName, description, logo, whatsappNumber, upiId, themeColor } = req.body;

    const website = await Website.findOne({ _id: websiteId, userId: req.user._id });
    if (!website) {
      return sendResponse(res, 404, false, 'Website not found');
    }

    if (businessName && businessName !== website.businessName) {
      website.slug = await generateUniqueSlug(businessName);
      website.businessName = businessName;
    }

    website.description = description ?? website.description;
    website.logo = logo ?? website.logo;
    website.whatsappNumber = whatsappNumber ?? website.whatsappNumber;
    website.upiId = upiId ?? website.upiId;
    website.themeColor = themeColor ?? website.themeColor;

    await website.save();

    return sendResponse(res, 200, true, 'Website updated successfully', website);
  } catch (error) {
    next(error);
  }
};

const getWebsiteBySlug = async (req, res, next) => {
  try {
    const website = await Website.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    ).select('-upiId');

    if (!website) {
      return sendResponse(res, 404, false, 'Published website not found');
    }

    return sendResponse(res, 200, true, 'Website fetched successfully', website);
  } catch (error) {
    next(error);
  }
};

const publishWebsite = async (req, res, next) => {
  try {
    const { websiteId } = req.body;
    const website = await Website.findOne({ _id: websiteId, userId: req.user._id });

    if (!website) {
      return sendResponse(res, 404, false, 'Website not found');
    }

    website.isPublished = true;
    await website.save();

    return sendResponse(res, 200, true, 'Website published successfully', website);
  } catch (error) {
    next(error);
  }
};

module.exports = { createWebsite, getMyWebsites, updateWebsite, getWebsiteBySlug, publishWebsite };
