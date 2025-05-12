import { Request, Response, NextFunction } from 'express';
import { Admin } from '../models/Admin/adminModel';
import { User } from '../models/User/userModel';
import { Category } from '../models/Admin/categoryModel';
import { Lesson } from '../models/Admin/lessonModel';

export interface CustomRequest extends Request {
  user?: string | any;
  token?: string;
}

const authorizationMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const email = req.user;
    if (!email) {
      return res.status(401).json({ error: 'Unauthorized: Email not found in token.' });
    }

    const admin = await Admin.findOne({ email });
    if (admin) return next();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (req.params.categoryId) {
      const category = await Category.findById(req.params.categoryId);
      const categoryName = category?.categoryName?.toLowerCase();

      if (!user.isSubscribed && categoryName !== 'beginner') {
        return res.status(403).json({
          error: 'Access denied. Subscription required for this category.',
          actionRequired: 'subscription'
        });
      }
    }

    if (req.params.lessonId) {
      const lesson = await Lesson.findById(req.params.lessonId).populate('categoryName');
      const category = lesson?.categoryName as any;
      const categoryName = category?.categoryName?.toLowerCase();

      if (!user.isSubscribed && categoryName !== 'beginner') {
        return res.status(403).json({
          error: 'Access denied. Subscription required for this lesson.',
          actionRequired: 'subscription'
        });
      }
    }

    return next();

  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(500).json({ error: 'Internal server error during authorization.' });
  }
};

export default authorizationMiddleware;
