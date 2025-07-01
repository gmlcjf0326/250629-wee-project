import { Request, Response } from 'express';
import serviceService from '../services/service.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getServices = asyncHandler(async (req: Request, res: Response) => {
  const services = await serviceService.getServices();
  
  res.json({
    success: true,
    data: services
  });
});

export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const service = await serviceService.getServiceById(id);
  
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }
  
  res.json({
    success: true,
    data: service
  });
});

export const createService = asyncHandler(async (req: Request, res: Response) => {
  const service = await serviceService.createService(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Service created successfully',
    data: service
  });
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const service = await serviceService.updateService(id, req.body);
    
    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error: any) {
    if (error.message === 'Service not found') {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    throw error;
  }
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    await serviceService.deleteService(id);
    
    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error: any) {
    if (error.message === 'Service not found') {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    throw error;
  }
});