// require("dotenv").config;
const express = require('express');

const ctrl = require('../../controllers/contacts');

const validateBody = require("../../utils/validateBody");
const {authenticate, isValidId} = require("../../middlewares");

const { addContactsSchema,
        updateFavoriteSchema,
} = require("../../schemas/contacts");

const router = express.Router();

router.get('/', authenticate, ctrl.getAll)

router.get('/:id', authenticate, isValidId, ctrl.getById);

router.post('/', authenticate, validateBody(addContactsSchema), ctrl.add);

router.delete('/:id', authenticate, isValidId, ctrl.deleteById);

router.put('/:id', authenticate, isValidId, validateBody(addContactsSchema), ctrl.updateById)

router.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  validateBody(updateFavoriteSchema),
  ctrl.updateStatusContact
);

module.exports = router;