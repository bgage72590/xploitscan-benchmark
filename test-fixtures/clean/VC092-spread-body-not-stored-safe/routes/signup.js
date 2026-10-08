// Server-rendered signup and project creation. The request body is spread
// into objects that never reach the database as they are: form values shown
// again after a validation error (password blanked), and a payload Joi
// validates with stripUnknown, so only declared keys reach Project.create().
const express = require("express");
const Joi = require("joi");
const { body, validationResult } = require("express-validator");
const { createUser } = require("../services/users");
const { requireUser } = require("../middleware/requireUser");
const { Project } = require("../models");

const router = express.Router();

router.post("/signup", body("email").isEmail(), body("password").isLength({ min: 12 }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const locals = { ...req.body, password: "", errors: errors.array() };
    return res.status(422).render("signup", locals);
  }
  const { email, password } = req.body;
  await createUser(email, password);
  res.redirect("/welcome");
});

const projectSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().max(2000).allow(""),
  ownerId: Joi.string().required(),
});

router.post("/projects", requireUser, async (req, res, next) => {
  try {
    const payload = { ...req.body, ownerId: req.user.id };
    const value = await projectSchema.validateAsync(payload, { stripUnknown: true });
    res.status(201).json(await Project.create(value));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
