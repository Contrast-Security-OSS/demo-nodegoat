const UserDAO = require("./user-dao").UserDAO;

function ContributionsDAO(db) {
    "use strict";

    if (false === (this instanceof ContributionsDAO)) {
        console.log("Warning: ContributionsDAO constructor called without 'new' operator");
        return new ContributionsDAO(db);
    }

    const contributionsDB = db.collection("contributions");
    const userDAO = new UserDAO(db);

    this.update = (userId, preTax, afterTax, roth, callback) => {
        const parsedUserId = parseInt(userId);

        const contributions = {
            userId: parsedUserId,
            preTax: preTax,
            afterTax: afterTax,
            roth: roth
        };

        contributionsDB.update(
            { userId },
            { $set: contributions },
            { upsert: true },
            err => {
                if (!err) {
                    console.log("Updated contributions");
                    userDAO.getUserById(parsedUserId, (err, user) => {

                        if (err) return callback(err, null);

                        contributions.userName = user.userName;
                        contributions.firstName = user.firstName;
                        contributions.lastName = user.lastName;
                        contributions.userId = userId;

                        return callback(null, contributions);
                    });
                } else {
                    return callback(err, null);
                }
            }
        );
    };

    this.getByUserId = (userId, callback) => {
        contributionsDB.findOne(
            { userId: userId },
            (err, contributions) => {
                if (err) return callback(err, null);

                contributions = contributions || {
                    preTax: 2,
                    afterTax: 2,
                    roth: 2
                };

                userDAO.getUserById(userId, (err, user) => {

                    if (err) return callback(err, null);
                    contributions.userName = user.userName;
                    contributions.firstName = user.firstName;
                    contributions.lastName = user.lastName;
                    contributions.userId = userId;

                    callback(null, contributions);
                });
            }
        );
    };
}

module.exports = { ContributionsDAO };
