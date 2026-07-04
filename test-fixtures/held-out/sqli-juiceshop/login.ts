// Adapted from juice-shop/juice-shop routes/login.ts (MIT). See NOTICE.
import { type Request, type Response, type NextFunction } from 'express'
import * as models from '../models/index'
const security = require('../lib/insecurity')
export function login () {
  return (req: Request, res: Response, next: NextFunction) => {
    models.sequelize.query(
      `SELECT * FROM Users WHERE email = '${req.body.email || ''}' AND password = '${security.hash(req.body.password || '')}' AND deletedAt IS NULL`,
      { model: models.User, plain: true }
    ).then((authenticatedUser: any) => {
      res.json({ authentication: authenticatedUser })
    })
  }
}
