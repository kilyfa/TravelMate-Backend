const { nanoid } = require('nanoid');
const locations = require('./location');

const addLocationHandler = (request, h) => {
    const { name, description, city, price, rating, address, comentar } = request.payload;
    const id  = nanoid(16);

    const insertedAt = new Date().toISOString();

    const addLocation = {
        id, name, description, city, price, rating, address, comentar, insertedAt
    }

    locations.push(addLocation);

    return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            id: id
        }
    }).code(201);
}

const getAllLocation = (request, h) => {
    return h.response({
        status: 'success',
        location: locations,
    }).code(200);
}

const getLocationById = (request, h) => {
    const { locId } = request.params;

    const location = locations.find((item) => item.id === locId);
    
    if (!location) {
        return h.response({
            status: 'fail',
            message: 'location not found'
        }).code(404);
    }

    return h.response({
        status: 'success',
        data: location
    }).code(200);
}

module.exports = { addLocationHandler, getAllLocation, getLocationById };