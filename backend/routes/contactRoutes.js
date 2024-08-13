const express = require('express');

const router = express.Router();

const {
    getContacts,
    addContact,
    updateContact,
    deleteContact,
    deleteAllContact,
} = require('../controllers/contactControllers')

router.get('/',getContacts);
router.post('/',addContact);
router.put('/:id', updateContact);
router.delete('/:id',deleteContact);
router.delete('/',deleteAllContact);

module.exports = router;