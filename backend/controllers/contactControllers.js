import Contact from "../models/contacted.js";


export const contactUs = async (req, res) => {
  try {
    const {name,email,communicationType,message} = req.body;
    const newContact = new Contact({name,email,communicationType,message});
    await newContact.save();
    res.status(201).json({ message: "Contact message received successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getContactmessage = async (req, res) => {
  try {
    const {id} = req.params;
    const contact = await Contact.findById(id);
    if(!contact) return res.status(404).json({message: "Contact message not found"});
    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}


