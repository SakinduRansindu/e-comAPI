// seller routes

const express = require('express');
const router = express.Router();
const passport = require('passport');

const { Seller, Session } = require('../models');
const { createSession } = require('../utils/session');

router.post('/login', passport.authenticate('local', { session: false }), async (req, res) => {
    const { uname, role } = req.user;
    const jwt = createSession(uname, role);
    res.json({ jwt });
    });

router.post('/register', async (req, res) => {
    const { uname, password, role } = req.body;
    try {
        const seller = await Seller.create({ uname, password, role });
        res.json(seller);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/profile', async (req, res) => {
    const { uname } = req.user;
    const seller = await Seller.findOne({ where: { uname } });
    res.json(seller);
});


