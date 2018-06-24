const express = require('express');
const router = express.Router();
const Unit = require('../models/unit');
const Ticket = require('../models/ticket');
const User = require('../models/user');
const createError = require('http-errors');

router.post('/', function (req, res, next) {
    req.body.requester = req.user.profile._id
	new Ticket(req.body).save((err, ticket)=>{
        if(err) return next(err)
        ticket.populate('unit',(err,ticket)=>{
            res.json(ticket)
        })
    })
})

router.get('/search', function(req, res, next){
    Ticket.find({$text: {$search: req.query.key}}, (err, tickets)=> { 
        if (err) return next(err)
            /*tickets = tickets.filter((ticket)=>{
               return ticket.requester == req.user.profile._id
            })*/
			res.json(tickets)
    })
    .exec();
})

router.get('/:ticketId/technicians', function (req, res, next) {
	Ticket.findById(req.params.ticketId,(err,ticket)=>{
        if(err) return next(err)
        if(ticket==null) return next(createError(400, 'No Such Ticket found'))
        if(req.user.profile.post == 'SYS_ADMIN'
            || (req.user.profile.post == 'SUPERVISING_TECHNICIAN' && req.user.profile.unit == ticket.unit))
            return res.json({title: 'Technicians Assigned', technicians: ticket.technicians})
        next(createError(403, 'Unauthorized Access'))
    }).select('+technicians').populate('technicians').exec()
})

router.put('/:ticketId/status/:status', function (req, res, next) {
    if(req.user.profile.post == 'USER') return next(createError(403, 'Unauthorized Access'))
    Ticket.findById(req.params.ticketId,(err,ticket)=>{
        if(err) return next(err)
        if(ticket==null) return next(createError(400, 'No Such Ticket found'))
        User.findById(req.user.profile._id,(err,user)=>{
            if(user.post == 'TECHNICIAN' && !user.ticketsAssigned.includes(ticket._id))
                return next(createError(403, 'Unauthorized Access'))
            const update = {
                modifier: user._id,
                updateDetails: req.body.description
            }
            Ticket.findOneAndUpdate({
                _id: ticket._id
            },{
                progress: req.params.status,
                $push: {
                    updates: update
                }
            },{new: true},(err, ticket)=>{
                if(err) return next(err)
                res.json(ticket)
            })
        }).select('+ticketsAssigned')
    })
})

router.put('/:ticketId/priority/:priority', function (req, res, next) {
    if(req.user.profile.post == 'USER') return next(createError(403, 'Unauthorized Access'))
    Ticket.findById(req.params.ticketId,(err,ticket)=>{
        if(err) return next(err)
        if(ticket==null) return next(createError(400, 'No Such Ticket found'))
        User.findById(req.user.profile._id,(err,user)=>{
            if(user.post == 'TECHNICIAN' && !user.ticketsAssigned.includes(ticket._id))
                return next(createError(403, 'Unauthorized Access'))
                Ticket.findOneAndUpdate({
                    _id: ticket._id
                },{
                    priority: req.params.priority
                },{new: true},(err, ticket)=>{
                    if(err) return next(err)
                    res.json(ticket)
                })
        }).select('+ticketsAssigned')
    })
})

module.exports = router;