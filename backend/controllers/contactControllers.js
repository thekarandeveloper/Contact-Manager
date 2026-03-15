const Contact = require('../models/Contact');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { parse } = require('fast-csv');

const CONTACT_TEMPLATE_FIELDS = ['name', 'email', 'phone'];

const buildTemplateContact = (index = null) => {
    if (index === null) {
        return { name: '', email: '', phone: '' };
    }

    const serial = String(index + 1).padStart(7, '0');
    return {
        name: `Contact ${serial}`,
        email: `contact${serial}@example.com`,
        phone: `900000${String(index % 10000).padStart(4, '0')}`,
    };
};

const normalizeContact = (contact = {}) => ({
    name: String(contact.name ?? '').trim(),
    email: String(contact.email ?? '').trim(),
    phone: String(contact.phone ?? '').trim(),
});

const validateContacts = (contacts) => {
    if (!Array.isArray(contacts) || contacts.length === 0) {
        throw new Error('No contacts found in the uploaded file');
    }

    const invalidContact = contacts.find((contact) => {
        const normalized = normalizeContact(contact);
        return CONTACT_TEMPLATE_FIELDS.some((field) => normalized[field] === '');
    });

    if (invalidContact) {
        throw new Error('Each contact must include non-empty name, email, and phone values');
    }

    return contacts.map(normalizeContact);
};

const parseJsonContacts = (filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(fileContent);

    if (!Array.isArray(parsed)) {
        throw new Error('JSON import expects an array of contacts');
    }

    return validateContacts(parsed);
};

const parseCsvContacts = (filePath) =>
    new Promise((resolve, reject) => {
        const contacts = [];

        fs.createReadStream(filePath)
            .pipe(parse({ headers: true, delimiter: ',' }))
            .on('data', (row) => contacts.push(row))
            .on('end', () => {
                try {
                    resolve(validateContacts(contacts));
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', reject);
    });

const parseUploadedContacts = async (filePath) => {
    const extension = path.extname(filePath).toLowerCase();

    if (extension === '.json') {
        return parseJsonContacts(filePath);
    }

    if (extension === '.csv') {
        return parseCsvContacts(filePath);
    }

    throw new Error('Only CSV and JSON files are allowed');
};

// Configure multer storage and file filter
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
});
  
const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (!['.csv', '.json'].includes(extension)) {
        return cb(new Error('Only CSV and JSON files are allowed'), false);
    }
    cb(null, true);
};
  
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
}).single('file');
  
// Route to handle CSV file upload
exports.uploadContacts = async (req, res) => {
    try {
        // Use multer to handle the file upload
        await new Promise((resolve, reject) => {
            upload(req, res, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
      
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const filePath = path.join(__dirname, '../uploads', req.file.filename);
        const contacts = await parseUploadedContacts(filePath);

        await Contact.insertMany(contacts);
        fs.unlinkSync(filePath); // Clean up the file after processing
        res.json({ msg: 'Contacts imported successfully', count: contacts.length });
    } catch (err) {
        if (req.file) {
            const filePath = path.join(__dirname, '../uploads', req.file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        res.status(500).json({ msg: 'Error processing file upload', error: err.message });
    }
};

exports.downloadJsonTemplate = (req, res) => {
    const requestedCount = Number.parseInt(req.query.count, 10);
    const recordCount = Number.isNaN(requestedCount) ? 0 : Math.max(0, requestedCount);
    const safeCount = Math.min(recordCount, 1000000);
    const isEmptyTemplate = safeCount === 0;
    const filename = isEmptyTemplate
        ? 'contacts-empty-template.json'
        : `contacts-template-${safeCount}.json`;

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    if (isEmptyTemplate) {
        res.end(JSON.stringify([buildTemplateContact(null)], null, 2));
        return;
    }

    res.write('[\n');
    for (let index = 0; index < safeCount; index += 1) {
        const contactJson = JSON.stringify(buildTemplateContact(index));
        const suffix = index === safeCount - 1 ? '\n' : ',\n';
        res.write(`  ${contactJson}${suffix}`);
    }
    res.end(']');
};




// Get All Contacts

exports.getContacts = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const skip = (page - 1) * limit;
        const searchQuery = req.query.search || '';

        // Query Object
        const query = searchQuery 
            ? {name: {$regex: searchQuery, $options: 'i'}}
            :{}


        const [contacts, total] = await Promise.all([
            Contact.find(query).skip(skip).limit(limit).exec(),
            Contact.countDocuments(query)
        ]);

        res.json({
            contacts,
            total,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error("Error fetching contacts:", err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Add New Contact

exports.addContact = async(req,res) => {
    try{
        const newContact = new Contact(req.body);
        const contact = await newContact.save();
        res.json(contact);
    } catch (err){
        res.status(400).json({msg: 'Bad Request'});
    }
}


// Find Duplicates

exports.handleDuplicates = async (req, res) => {
    try {
        // Step 1: Find duplicate phone numbers
        const duplicates = await Contact.aggregate([
            { $group: { _id: "$phone", count: { $sum: 1 }, ids: { $push: "$_id" } } },
            { $match: { count: { $gt: 1 } } }
        ]);

        // Calculate the total number of duplicate entries
        const totalDuplicates = duplicates.reduce((acc, duplicate) => acc + duplicate.count - 1, 0);

        // Check if the 'delete' parameter is true
        const shouldDelete = req.query.delete === 'true';

        if (shouldDelete) {
            // Step 2: For each duplicate, keep one and delete the others
            const deletionTasks = duplicates.map(async (duplicate) => {
                const idsToDelete = duplicate.ids.slice(1);  // Keep the first instance, delete the rest

                // Delete contacts with those IDs
                return Contact.deleteMany({ _id: { $in: idsToDelete } });
            });

            // Execute all deletions in parallel
            await Promise.all(deletionTasks);

            return res.json({ msg: 'Duplicate contacts removed successfully', totalDeleted: totalDuplicates });
        }

        // If not deleting, return the number of duplicates found
        res.json({ msg: 'Duplicates found', totalDuplicates });

    } catch (err) {
        console.error("Error handling duplicates:", err);
        res.status(500).json({ msg: 'Server Error' });
    }
};


// Update Contact

exports.updateContact = async (req,res) =>{
    try{
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.json(contact);
    } catch (err){
        res.status(400).json({msg:'Bad Request'});
    }
}

// Delete Contact

exports.deleteContact = async (req,res) =>{
    try{
        await Contact.findByIdAndDelete(req.params.id);
        res.json({msg:'Contact Deleted'});
    } catch (err){
        res.status(400).json({msg: 'Bad Request'});
    }
};


// Delete All Contacts

exports.deleteAllContact = async(req,res) => {
    try{
        await Contact.deleteMany({});
        res.status(200).json({ message: 'All contacts deleted successfully' });
    } catch (err){
        res.status(400).json({msg: "Bad Request"})
    }
};


// Bulk Delete Contacts

exports.bulkDeleteContact = async (req,res) => {
    try{
        const {ids} = req.body;
        if(!Array.isArray(ids) || ids.length === 0){
            return res.status(400).json({msg: 'Invalid request. No IDs Provided'})
        }

        const result = await Contact.deleteMany({_id:{$in:ids}});


        res.json({
            deletedCount: result.deletedCount,
            message: 'Contacts deleted successfully.'
        });

    } catch (err){
        console.error("Error deleting successfully.", err);
        res.status(500).json({msg:'Server Error'});
    }
}
