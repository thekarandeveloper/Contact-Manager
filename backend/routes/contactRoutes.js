const express = require('express');

const router = express.Router();

const {
    getContacts,
    addContact,
    updateContact,
    deleteContact,
    deleteAllContact,
    uploadContacts,
    handleDuplicates,
    bulkDeleteContact,
    downloadJsonTemplate,
} = require('../controllers/contactControllers')

router.get('/',getContacts);
router.get('/template-json', downloadJsonTemplate);
router.get('/handle-duplicates', handleDuplicates)
router.post('/',addContact);
router.post('/upload', uploadContacts);
router.put('/:id', updateContact);
router.delete('/:id',deleteContact);
router.delete('/',deleteAllContact);
router.delete('/bulk-delete',bulkDeleteContact);

module.exports = router;
