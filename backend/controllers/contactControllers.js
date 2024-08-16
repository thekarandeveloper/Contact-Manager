const Contact = require('../models/Contact');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { parse } = require('fast-csv');

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
    if (!file.originalname.endsWith('.csv')) {
        return cb(new Error('Only CSV files are allowed'), false);
    }
    cb(null, true);
};
  
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
}).single('file');
  
// Route to handle CSV file upload
exports.uploadCSV = async (req, res) => {
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
        const contacts = [];

        fs.createReadStream(filePath)
            .pipe(parse({ headers: true, delimiter: ',' }))
            .on('data', (row) => contacts.push(row))
            .on('end', async () => {
                try {
                    await Contact.insertMany(contacts);
                    fs.unlinkSync(filePath); // Clean up the file after processing
                    res.json({ msg: 'Contacts imported successfully', count: contacts.length });
                } catch (err) {
                    res.status(500).json({ msg: 'Error importing contacts', error: err.message });
                }
            })
            .on('error', (err) => {
                res.status(500).json({ msg: 'Error reading CSV file', error: err.message });
            });
    } catch (err) {
        res.status(500).json({ msg: 'Error processing file upload', error: err.message });
    }
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