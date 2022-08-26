const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

recordRoutes.route("/person-id/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect
        .collection("persons")
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

recordRoutes.route("/person/:user").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = {username: {$eq: req.params.user}};
    db_connect
        .collection("persons")
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

recordRoutes.route("/query-1").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { $and: [{ country: { $in: ["Colombia", "Panama"]}}, { $and: [ {register_date: { $gte: "2021-01-01"}}, {register_date: { $lt: "2022-01-01"}}] } ]};
    db_connect
        .collection("persons")
        .find(myquery)
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

recordRoutes.route("/query-2").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { $and: [ {register_date: { $gte: "2022-01-01"}},  {register_date: { $lt: "2023-01-01"}}, { answers: {$size: 0}}, {is_censored: false}] };
    db_connect
        .collection("question")
        .find(myquery)
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

recordRoutes.route("/query-3").get(function (req, res) {
    let db_connect = dbo.getDb();
    db_connect.
        collection("question")
        .aggregate([
            {
                '$match': {
                    '$and': [
                        {
                            'register_date': {
                                '$gte': '2021-01-01'
                            }
                        }, {
                            'register_date': {
                                '$lt': '2022-01-01'
                            }
                        }, {
                            'is_censored': false
                        }
                    ]
                }
            },
            {
                '$redact': {
                    '$cond': [
                        {
                            '$gte': [
                                {
                                    '$size': {
                                        '$setDifference': [
                                            {
                                                '$map': {
                                                    'input': '$answers',
                                                    'as': 'answer',
                                                    'in': {
                                                        '$cond': [
                                                            {
                                                                '$eq': [
                                                                    '$$answer.is_censored', false
                                                                ]
                                                            }, '$$answer', false
                                                        ]
                                                    }
                                                }
                                            }, [
                                                false
                                            ]
                                        ]
                                    }
                                }, 10
                            ]
                        }, '$$KEEP', '$$PRUNE'
                    ]
                }
            }
        ])
        .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
    })
});

module.exports = recordRoutes;
