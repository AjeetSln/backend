const Product = require('../models/Product');
const Website = require('../models/Website');
const { sendResponse } = require('../utils/response');

const addProduct = async (req, res, next) => {
  try {
    const { websiteId, title, price, description, image } = req.body;

    const website = await Website.findOne({ _id: websiteId, userId: req.user._id });
    if (!website) {
      return sendResponse(res, 404, false, 'Website not found');
    }

    const product = await Product.create({ websiteId, title, price, description, image });
    return sendResponse(res, 201, true, 'Product added successfully', product);
  } catch (error) {
    next(error);
  }
};

const getProductsByWebsite = async (req, res, next) => {
  try {
    const products = await Product.find({ websiteId: req.params.websiteId }).sort({ createdAt: -1 });
    return sendResponse(res, 200, true, 'Products fetched successfully', products);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { title, price, description, image } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return sendResponse(res, 404, false, 'Product not found');
    }

    const website = await Website.findOne({ _id: product.websiteId, userId: req.user._id });
    if (!website) {
      return sendResponse(res, 403, false, 'Not allowed to update this product');
    }

    product.title = title ?? product.title;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.image = image ?? product.image;

    await product.save();
    return sendResponse(res, 200, true, 'Product updated successfully', product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return sendResponse(res, 404, false, 'Product not found');
    }

    const website = await Website.findOne({ _id: product.websiteId, userId: req.user._id });
    if (!website) {
      return sendResponse(res, 403, false, 'Not allowed to delete this product');
    }

    await Product.findByIdAndDelete(req.params.id);

    return sendResponse(res, 200, true, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { addProduct, getProductsByWebsite, updateProduct, deleteProduct };
