const express = require('express');
const router = express.Router();
const Unit = require('../models/unit');
const Ticket = require('../models/ticket');
const User = require('../models/user');
const createError = require('http-errors');

router.get('/:unitId/technicians',(req, res, next)=>{
    if((req.user.profile.post == 'SUPERVISING_TECHNICIAN' && req.user.profile.unit == req.params.unitId)
        || req.user.profile.post == 'SYS_ADMIN')
        User.find({
            unit: req.params.unitId,
            $or: [{
                post: 'SUPERVISING_TECHNICIAN'
            },
            {
                post: 'TECHNICIAN'
            }]
        },(err, result)=>{
            if(err) return next(err)
            res.json(result)
        });
    else
        next(createError(403, 'Unauthorized Access'))
})

router.get('/:unitId/tickets',(req, res, next)=>{
    if((req.user.profile.post == 'SUPERVISING_TECHNICIAN')
        || req.user.profile.post == 'SYS_ADMIN')
        Ticket.find({
            unit: req.params.unitId
        },(err, result)=>{
            if(err) return next(err)
            res.json(result)
        });
    else
        next(createError(403, 'Unauthorized Access'))
})

router.get('/' ,(req, res, next)=>{
    Unit.find({},(err, result)=>{
        if(err) return next(err)
        res.json(result)
    })
})

module.exports = router;