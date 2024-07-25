const Contact = require('../models/Contact');

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

