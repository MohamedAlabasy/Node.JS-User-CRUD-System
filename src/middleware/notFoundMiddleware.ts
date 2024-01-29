import { Request, Response, NextFunction } from 'express';

const notFound = (request: Request, response: Response, next: NextFunction) => {
    response.status(404).json({ message: 'Not Found' })
}
export default notFound;