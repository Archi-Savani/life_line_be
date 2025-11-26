const Contact = require("../models/contactModel");

const requiredFields = ["name", "email", "phone", "gender", "message"];

const missingFieldsMessage = (body) =>
  requiredFields.filter((field) => !body[field]);

// Create new contact entry
const createContact = async (req, res) => {
  try {
    const missingFields = missingFieldsMessage(req.body);

    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const contact = await Contact.create(req.body);
    return res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to submit contact request.",
    });
  }
};

// Fetch all contact submissions
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch contact submissions.",
    });
  }
};

module.exports = {
  createContact,
  getContacts,
};

