const express = require('express');
const mongoDB = require('mongodb');

const router = express.Router();

router.get('/', async function (req, res) {
    const cars = await loadCarsConnection();
    res.send(await cars.find({}).toArray());
});

router.get('/:id', async function (req, res) {
    const cars = await loadCarsConnection();
    res.send(await cars.find({_id: mongoDB.ObjectId(req.params.id)}).toArray());
});

router.post('/', async function (req, res) {
    const cars = await loadCarsConnection();
    let newCar = {
        brand: req.body.brand,
        model: req.body.model,
        price: req.body.price,
        engine: req.body.engine,
        createdAt: new Date()
    };
    await cars.insertOne(newCar, function (err) {
        if (err) {
            res.status(200).json({
                status: "error",
                error: err
            })
        } else {
            res.status(201).json({
                status: "ok",
                message: `Car ${req.body.brand} created successfully!`
            })
        }
    });
});

router.delete('/:id', async function (req, res) {
    const cars = await loadCarsConnection();
    const car = await cars.find({_id: mongoDB.ObjectId(req.params.id)}).toArray();
    if (Object.keys(car).length > 0) {
        cars.deleteOne({ _id: mongoDB.ObjectId(req.params.id)}, function (err) {
            if (err) {
                res.status(200).json({
                    status: "error",
                    error: err
                });
            } else {
                res.status(201).json({
                    status: "ok",
                    message: `Car with ID ${req.params.id} removed successfully!`
                });
            }
        });
    } else {
        res.status(200).json({
            status: "error",
            error: "No car found with ID: " + req.params.id
        });
    }

});

router.patch('/:id', async function (req, res) {
    const cars = await loadCarsConnection();
    if ((req.params.id).length > 23) {
        const car = await cars.find({_id: mongoDB.ObjectId(req.params.id)}).toArray();
        if (Object.keys(car).length > 0) {
            let newData = {
                brand: req.body.brand,
                model: req.body.model,
                price: req.body.price,
                engine: req.body.engine
            };
            await cars.updateOne({_id: mongoDB.ObjectId(req.params.id)}, {$set: newData}, function (err) {
                if (err) {
                    res.status(200).json({
                        status: "error",
                        error: err

                    })
                } else {
                    res.status(201).json({
                        status: "ok",
                        message: `Car ${req.params.id} updated successfully!`
                    })
                }
            });
        } else {
            res.status(200).json({
                status: "error",
                error: "No car found with ID: " + req.params.id
            });
        }
    } else {
        res.status(200).json({
            status: "error",
            error: `Wrong ID: ${req.params.id}. Must be 24 symbols.`
        });
    }
});

async function loadCarsConnection() {
    const client = await mongoDB.MongoClient.connect(
        'mongodb://admin:adminas1@ds253243.mlab.com:53243/cars_db', {
            useNewUrlParser: true
        }
    );
    return client.db('cars_db').collection('cars');
}

module.exports = router;