const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const moment = require('moment');
const path = require('path');
const axios = require('axios');
var request = require('requests');

const connectDB = require('./utils/db');

const SerialResponse = require('./models/SerialResponse.model');
const Unit = require('./models/Unit.model');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
require('dotenv').config();


connectDB();


// TEST ROUTE
app.get('/api/test', (req, res) => {
    res.send('<h1>Hello world. Version : 5.2 . Branch : master</h1>');
});

// INJECT DATA FROM MICROCONTROLLER
app.post('/api/serial-data', async (req, res) => {
    try {
        let { mcId } = req.body;
        let serObject = req.body;
        serObject['serverDate'] = moment().utcOffset("+05:30").format('DD-MM-YY');
        serObject['serverTime'] = moment().utcOffset("+05:30").format('HH:mm:ss');
        console.log('Serial Reponse : ', serObject);

        let unitObj = await Unit.findById(mcId);
        serObject['mcId'] = mcId;
        let serialObj = await SerialResponse.create(serObject);
        delete serObject['mcId'];

        if(unitObj) {   
            unitObj.set(serObject);
            await unitObj.save();
            return res.status(200).json({
                success: true
            });
        }
        else {
            serObject['_id'] = mcId;
            let newUnit = await Unit.create(serObject);
            return res.status(200).json({
                success: true
            });
        }
    } catch (err) {
        console.log('error !', err);
        return res.status(503).json({
            success: false,
            error: err
        })
    }
});


// GET SPECIFIC MICROCONTROLLER'S ALL SERIAL REPONSES
app.get('/api/v2/get-data-historic/:mcId', async (req, res) => {
    try {
        const serialObjects = await SerialResponse.find({mcId : req.params.mcId});
        return res.status(200).json({
            success: true,
            count: serialObjects.length,
            data: serialObjects
        });
    } catch (err) {
        console.log('error !', err);
        return res.status(503).json({
            success: false,
            error: err
        })
    }
});


// GET LATEST MICROCONTROLLER SERIAL REPONSES
app.get('/api/v2/get-data-latest/:mcId', async (req, res) => {
    try {
        const srObj = await Unit.findById(req.params.mcId).lean();

        return res.status(200).json({
            success: true,
            data: srObj
        });
    } catch (err) {
        console.log('error !', err);
        return res.status(503).json({
            success: false,
            error: err
        })
    }
});

// GET LIST OF ALL UNITS
app.get('/api/get-units', async (req, res) => {
    try {
        const units = await Unit.find().lean();

        return res.status(200).json({
            success: true,
            count: units.length,
            data: units
        });
    } catch (err) {
        console.log('error !', err);
        return res.status(503).json({
            success: false,
            error: err
        })
    }
});

server.listen(process.env.PORT || 3000, () => {
    let port = process.env.PORT || 3000;
    console.log(`listening on localhost:${port}`);
});
