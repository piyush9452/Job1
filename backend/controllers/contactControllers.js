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

