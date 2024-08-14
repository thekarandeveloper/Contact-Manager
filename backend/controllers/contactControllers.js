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

exports.getContacts = async (req,res) =>{
    try{
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err){
        res.status(500).json({msg: 'Server Error'});
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
