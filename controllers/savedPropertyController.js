import SavedProperty from '../models/SavedProperty.js';

export const saveProperty = async (req, res, next) => {
    try {
        const { propertyId } = req.body;
        const saved = await SavedProperty.create({ user: req.user.id, property: propertyId });
        res.status(201).json(saved);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400);
            return next(new Error('Property already saved'));
        }
        next(error);
    }
};

export const getSavedProperties = async (req, res, next) => {
    try {
        const saved = await SavedProperty.find({ user: req.user.id }).populate('property');
        res.status(200).json(saved);
    } catch (error) {
        next(error);
    }
};

export const removeSavedProperty = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await SavedProperty.findOneAndDelete({ _id: id, user: req.user.id });
        if (!deleted) {
            res.status(404);
            throw new Error('Saved property not found');
        }
        res.status(200).json({ message: 'Property removed from saved list' });
    } catch (error) {
        next(error);
    }
};