import { Request, Response } from 'express';
import infoService from '../services/info.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getProjectInfo = asyncHandler(async (req: Request, res: Response) => {
  const info = await infoService.getProjectInfo();
  
  res.json({
    success: true,
    data: info
  });
});

export const updateProjectInfo = asyncHandler(async (req: Request, res: Response) => {
  const info = await infoService.updateProjectInfo(req.body);
  
  res.json({
    success: true,
    message: 'Project information updated successfully',
    data: info
  });
});