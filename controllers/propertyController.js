import Property from '../models/Property.js';

export const createProperty = async (req, res, next) => {
    try {
        const property = await Property.create({ ...req.body, owner: req.user.id });
        res.status(201).json(property);
    } catch (error) {
        next(error);
    }
};

export const getProperties = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, location } = req.query;
        const query = location ? { location: new RegExp(location, 'i') } : {};
        
        const properties = await Property.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        
        res.status(200).json(properties);
    } catch (error) {
        next(error);
    }
};

export const getProperty = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            res.status(404);
            throw new Error('Property not found');
        }
        res.status(200).json(property);
    } catch (error) {
        next(error);
    }
};