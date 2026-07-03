const requestValidator = (schema, source = 'query') => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        error: { message: errorMessage },
      });
    }

    req[source] = value;
    next();
  };
};

module.exports = requestValidator;
