const express = require('express');

const router = express.Router();

const {
    getContacts,
    addContact,
    updateContact,
    deleteContact,
    deleteAllContact,
    uploadCSV,
} = require('../controllers/contactControllers')

router.get('/',getContacts);
router.post('/',addContact);
router.post('/upload', uploadCSV);
router.put('/:id', updateContact);
router.delete('/:id',deleteContact);
router.delete('/',deleteAllContact);

module.exports = router;