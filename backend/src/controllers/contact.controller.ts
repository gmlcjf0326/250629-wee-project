import { Request, Response, NextFunction } from 'express';
import { Contact } from '../types';

// Mock storage - will be replaced with database
const contacts: Contact[] = [];

export const createContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: name, email, subject, message'
      });
    }

    const newContact: Contact = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      subject,
      message,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    contacts.push(newContact);

    return res.status(201).json({
      success: true,
      message: 'Contact inquiry submitted successfully',
      data: newContact
    });
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement admin authentication check
    
    const { status, page = 1, limit = 10 } = req.query;
    
    let filteredContacts = contacts;
    
    if (status) {
      filteredContacts = contacts.filter(c => c.status === status);
    }
    
    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedContacts = filteredContacts.slice(startIndex, endIndex);
    
    return res.json({
      success: true,
      data: paginatedContacts,
      pagination: {
        total: filteredContacts.length,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(filteredContacts.length / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const contact = contacts.find(c => c.id === id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    return res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement admin authentication check
    
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, reviewed, or resolved'
      });
    }
    
    const contactIndex = contacts.findIndex(c => c.id === id);
    
    if (contactIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    contacts[contactIndex].status = status;
    contacts[contactIndex].updatedAt = new Date();
    
    return res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: contacts[contactIndex]
    });
  } catch (error) {
    next(error);
  }
};