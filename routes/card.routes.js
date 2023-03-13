const express = require('express'),
    multer = require('multer'),
    mongoose = require('mongoose'),
    uuidv4 = require('uuid/v4'),
    router = express.Router();

const DIR = './public/'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR)
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-')
        cb(null, `${uuidv4()}-${fileName}`)
    }
});

let upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg files are allowed.'))
        }
    }
});

const Card = require('../models/Card')
router.post('/add-card', upload.single('image'), async (req, res, next) => {

    console.log({req: req.body})

    const url = `${req.protocol}://${req.get('host')}`
    const card = new Card({
        type: req.body.type,
        title: req.body.title,
        subtitle: req.body.subtitle,
        text: req.body.text,
        image: req?.file?.filename ? `${url}/public/${req.file.filename}` : ''
    });

    const savedCard = await card.save()

    try {
        res.status(201).json({
            message: "Card saved successfully",
            cardCreated: {
                _id: savedCard.id,
                type: savedCard.type,
                title: savedCard.title,
                subtitle: savedCard.subtitle,
                text: savedCard.text,
                image: savedCard.cardImg
            }
        })
    } catch (err) {
        console.log({ err }),
        res.status(500).json({
            error: err
        })
    }
})

router.get('/cards', async (req, res, next) => {
    const cards = await Card.find()
    res.status(200).json({
        message: "Cards list retrieved.",
        cards
    })
})

module.exports = router