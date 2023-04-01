
const contacts = require("../models/contacts");
const HttpError = require('../helpers/HttpError');
const ctrlWrapper = require('../helpers/ctrlWrapper');



const getAll = async (req, res) => {
   
    const result = await contacts.listContacts();
    res.json(result);
};
    

const getContactById = async (req, res) => {
    
        const { id } = req.params;
        const result = await contacts.getContactById(id);
        if (!result) {
            throw HttpError(404, `Not found`);
        }
        res.json(result);
    
    };

const addContact = async (req, res) => {
  
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  
    
};

const removeContact = async (req, res) => {
  
        const { id } = req.params;
        const result = await contacts.removeContact(id);
        if (!result) {
            throw HttpError(404, `Not found`);
        }

        res.json({
            message: "contact deleted",
        });
    
    };

const updateContact = async (req, res) => {
    
        const { id } = req.params;
        const result = await contacts.updateContact(id, req.body);
        if (!result) {
            throw HttpError(400, `Not found`);
        }
        res.json(result);
      
};

module.exports = {
    getAll: ctrlWrapper(getAll),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    removeContact: ctrlWrapper(removeContact),
    updateContact: ctrlWrapper(updateContact),


}