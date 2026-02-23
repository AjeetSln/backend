const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''));

const validate = (rules) => (req, res, next) => {
  const errors = [];

  for (const rule of rules) {
    const value = req.body[rule.field];

    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push({ field: rule.field, message: `${rule.field} is required` });
      continue;
    }

    if (value !== undefined && value !== null && rule.type === 'email' && !isEmail(value)) {
      errors.push({ field: rule.field, message: `${rule.field} must be a valid email` });
    }

    if (value !== undefined && value !== null && rule.type === 'number' && Number.isNaN(Number(value))) {
      errors.push({ field: rule.field, message: `${rule.field} must be a number` });
    }

    if (value !== undefined && value !== null && rule.minLength && String(value).length < rule.minLength) {
      errors.push({
        field: rule.field,
        message: `${rule.field} must be at least ${rule.minLength} characters`,
      });
    }

    if (value !== undefined && value !== null && rule.min !== undefined && Number(value) < rule.min) {
      errors.push({ field: rule.field, message: `${rule.field} must be >= ${rule.min}` });
    }
  }

  if (errors.length) {
    return res.status(422).json({ success: false, message: 'Validation failed', data: errors });
  }

  next();
};

module.exports = { validate };
