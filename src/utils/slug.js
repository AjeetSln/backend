const Website = require('../models/Website');

const toSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const generateUniqueSlug = async (businessName) => {
  const base = toSlug(businessName);
  let slug = base;
  let count = 1;

  while (await Website.exists({ slug })) {
    slug = `${base}-${count}`;
    count += 1;
  }

  return slug;
};

module.exports = { toSlug, generateUniqueSlug };
