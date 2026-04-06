import Joi from "joi"

const createTransactionValidation = (req, res, next) => {
  const schema = Joi.object({
    amount: Joi.number()
      .positive()
      .required()
      .messages({
        "number.positive": "Amount must be a positive number",
        "any.required": "Amount is required"
      }),

    type: Joi.string()
      .valid("income", "expense")
      .required()
      .messages({
        "any.only": "Type must be income or expense",
        "any.required": "Type is required"
      }),

    category: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        "string.min": "Category must be at least 2 characters",
        "string.max": "Category cannot exceed 50 characters",
        "any.required": "Category is required"
      }),

    date: Joi.date()
      .required()
      .messages({
        "date.base": "Please provide a valid date",
        "any.required": "Date is required"
      }),

    notes: Joi.string()
      .max(200)
      .optional()
      .allow("")
      .messages({
        "string.max": "Notes cannot exceed 200 characters"
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

const updateTransactionValidation = (req, res, next) => {
  const schema = Joi.object({
    amount: Joi.number()
      .positive()
      .messages({
        "number.positive": "Amount must be a positive number"
      }),

    type: Joi.string()
      .valid("income", "expense")
      .messages({
        "any.only": "Type must be income or expense"
      }),

    category: Joi.string()
      .min(2)
      .max(50)
      .messages({
        "string.min": "Category must be at least 2 characters",
        "string.max": "Category cannot exceed 50 characters"
      }),

    date: Joi.date()
      .messages({
        "date.base": "Please provide a valid date"
      }),

    notes: Joi.string()
      .max(200)
      .optional()
      .allow("")
      .messages({
        "string.max": "Notes cannot exceed 200 characters"
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

export { createTransactionValidation, updateTransactionValidation }