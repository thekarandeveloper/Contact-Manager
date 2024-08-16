const express = require('express');

const router = express.Router();

const {
    getContacts,
    addContact,
    updateContact,
    deleteContact,
    deleteAllContact,
    uploadCSV,
    handleDuplicates,
    bulkDeleteContact,
} = require('../controllers/contactControllers')

router.get('/',getContacts);
router.get('/handle-duplicates', handleDuplicates)
router.post('/',addContact);
router.post('/upload', uploadCSV);
router.put('/:id', updateContact);
router.delete('/:id',deleteContact);
router.delete('/',deleteAllContact);
router.delete('/bulk-delete',bulkDeleteContact);

module.exports = router;