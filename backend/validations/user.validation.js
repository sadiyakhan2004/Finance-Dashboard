import Joi from "joi"

const createUserValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.min": "Name must be at least 3 characters",
        "string.max": "Name cannot exceed 50 characters",
        "any.required": "Name is required"
      }),

    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.email": "Please provide a valid email",
        "any.required": "Email is required"
      }),

    password: Joi.string()
      .min(8)
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters",
        "any.required": "Password is required"
      }),

    role: Joi.string()
      .valid("admin", "analyst", "viewer")
      .required()
      .messages({
        "any.only": "Role must be admin, analyst or viewer",
        "any.required": "Role is required"
      })
  })

  const { error } = schema.validate(req.body, { abortEarly: false })

  if (error) {
    const errors = error.details.map((err) => err.message)
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    })
  }

  next()
}

const updateUserValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(50)
      .messages({
        "string.min": "Name must be at least 3 characters",
        "string.max": "Name cannot exceed 50 characters"
      }),

    role: Joi.string()
      .valid("admin", "analyst", "viewer")
      .messages({
        "any.only": "Role must be admin, analyst or viewer"
      }),

    status: Joi.string()
      .valid("active", "inactive")
      .messages({
        "any.only": "Status must be active or inactive"
      })
  })

  const { error } = schema.validate(req.body, { abortEarly: false })

  if (error) {
    const errors = error.details.map((err) => err.message)
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    })
  }

  next()
}

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.email": "Please provide a valid email",
        "any.required": "Email is required"
      }),

    password: Joi.string()
      .required()
      .messages({
        "any.required": "Password is required"
      })
  })

  const { error } = schema.validate(req.body, { abortEarly: false })

  if (error) {
    const errors = error.details.map((err) => err.message)
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    })
  }

  next()
}

export { createUserValidation, updateUserValidation, loginValidation }