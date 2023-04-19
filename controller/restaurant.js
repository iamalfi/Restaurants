const restaurantModel = require("../model/restaurant");

exports.createReastaurant = async (req, res) => {
    const data = req.body;
    if (data.location.type !== "Point") {
        return res
            .status(400)
            .json({ message: "location type must be 'Point' " });
    }
    const restaurant = await restaurantModel.create(data);
    res.status(201).json({
        message: "Restaurant Created Successfully!",
        restaurant,
    });
};

exports.updateRestaurant = async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    if (data.location.type !== "Point") {
        return res
            .status(400)
            .json({ message: "location type must be 'Point' " });
    }
    const restaurant = await restaurantModel.findByIdAndUpdate(id, data, {
        new: true,
    });
    res.status(200).json({
        message: "Restaurant Updated Successfully!",
        restaurant,
    });
};
exports.deleteRestaurant = async (req, res) => {
    const id = req.params.id;
    const restaurant = await restaurantModel.findByIdAndDelete(id);
    res.status(200).json({
        message: "Restaurant Deleted Successfully!",
        restaurant,
    });
};
exports.restaurantById = async (req, res) => {
    const id = req.params.id;
    const restaurant = await restaurantModel.findById(id);
    res.status(200).json({
        message: "Restaurant details fetched Successfully!",
        restaurant,
    });
};
exports.getByQuery = async (req, res) => {
    const { latitude, longitude, radius } = req.query;

    // Ensure required query parameters are present
    if (!latitude || !longitude || !radius) {
        return res
            .status(400)
            .send(
                "Latitude, longitude, and radius are required query parameters"
            );
    }

    // Convert radius to meters and create geospatial query
    const metersPerDegree = 111320; // meters per degree of latitude
    const radiusInMeters = radius * 1000;
    const query = {
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)],
                },
                $maxDistance: radiusInMeters / metersPerDegree,
            },
        },
    };

    try {
        const restaurants = await restaurantModel.find(query);

        // Format restaurant data to match desired output
        const formattedRestaurants = restaurants.map((restaurant) => ({
            name: restaurant.name,
            description: restaurant.description,
            location: {
                latitude: restaurant.location.coordinates[1],
                longitude: restaurant.location.coordinates[0],
            },
            averageRating:
                restaurant.ratings.length > 0
                    ? restaurant.ratings.reduce((a, b) => a + b) /
                      restaurant.ratings.length
                    : 0,
            numRatings: restaurant.ratings.length,
        }));

        res.json(formattedRestaurants);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
};
