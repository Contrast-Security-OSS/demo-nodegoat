#!/usr/bin/env nodejs

"use strict";

const { MongoClient } = require("mongodb");
const { db } = require("../config/config");

const USERS_TO_INSERT = [
    {
        "_id": 1,
        "userName": "admin",
        "firstName": "Node Goat",
        "lastName": "Admin",
        "password": "Admin_123",
        //"password" : "$2a$10$8Zo/1e8KM8QzqOKqbDlYlONBOzukWXrM.IiyzqHRYDXqwB3gzDsba", // Admin_123
        "isAdmin": true
    }, {
        "_id": 2,
        "userName": "user1",
        "firstName": "John",
        "lastName": "Doe",
        "benefitStartDate": "2030-01-10",
        "password": "User1_123"
        // "password" : "$2a$10$RNFhiNmt2TTpVO9cqZElb.LQM9e1mzDoggEHufLjAnAKImc6FNE86",// User1_123
    }, {
        "_id": 3,
        "userName": "user2",
        "firstName": "Will",
        "lastName": "Smith",
        "benefitStartDate": "2025-11-30",
        "password": "User2_123"
        //"password" : "$2a$10$Tlx2cNv15M0Aia7wyItjsepeA8Y6PyBYaNdQqvpxkIUlcONf1ZHyq", // User2_123
    }];

const parseResponse = (err, res, comm) => {
    if (err) {
        console.log("ERROR:");
        console.log(comm);
        console.log(JSON.stringify(err));
        process.exit(1);
    }
    console.log(comm);
    console.log(JSON.stringify(res));
};

async function main() {
    const client = new MongoClient(db);

    try {
        await client.connect();
        console.log(`Connected to the database: ${db}`);

        const database = client.db();

        // remove existing data (if any), we don't want to look for errors here
        const collections = ['users', 'allocations', 'contributions', 'memos', 'counters'];
        for (const collection of collections) {
            const coll = database.collection(collection);
            const collExists = await coll.countDocuments({}, { limit: 1 }) !== 0;
            if (collExists) {
                await coll.drop();
            }
        }

        const usersCol = database.collection("users");
        const allocationsCol = database.collection("allocations");
        const countersCol = database.collection("counters");

        // reset unique id counter
        await countersCol.insertOne({
            _id: "userId",
            seq: 4
        });

        // insert admin and test users
        console.log("Users to insert:");
        USERS_TO_INSERT.forEach((user) => console.log(JSON.stringify(user)));

        let data;
        try {
            data = await usersCol.insertMany(USERS_TO_INSERT);
            parseResponse(null, data, "users.insertMany");
        } catch (err) {
            console.error('An error occurred during insertMany:', err);
        }

        console.log("data.insertedIds:");
        console.log(data.insertedIds);

        console.log("Preparing allocations...");
        const finalAllocations = [];
        const userIds = Object.values(data.insertedIds);
        userIds.forEach((userId) => {
            console.log("user:");
            console.log(userId);
            const stocks = Math.floor((Math.random() * 40) + 1);
            const funds = Math.floor((Math.random() * 40) + 1);

            finalAllocations.push({
                userId: userId,
                stocks: stocks,
                funds: funds,
                bonds: 100 - (stocks + funds)
            });
        });

        console.log("Allocations prepared.");
        console.log("Allocations to insert:");
        finalAllocations.forEach(allocation => console.log(JSON.stringify(allocation)));

        console.log("Inserting allocations...");
        const finalData = await allocationsCol.insertMany(finalAllocations);

        parseResponse(null, finalData, "allocations.insertMany");

        console.log("Database reset performed successfully");
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

main().catch(console.error);