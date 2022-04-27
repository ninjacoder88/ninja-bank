const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 80;

app.get("/generate", (req, res) => {
    const client = new MongoClient("mongodb://root:rootpassword@mongo:27017/");

    client.connect()
        .then(() => {
            const database = client.db("NinjaBank");
            const customers = database.collection("Customers");
            const accounts = database.collection("Accounts");

            customers.insertOne({customerName: "Kylie Beasley", emailAddress: "kbeasley@gmail.com", password: "cOgnfpe5kes7unFcOFjh", accountIds: []})
                .then(customerInsertResult => {
                    const customerId = customerInsertResult.insertedId;
                    accounts.insertOne({accountName: "Basic Checking 001", accountBalance: 1000, customerId: customerId})
                        .then(accountInsertResult => {
                            customers.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
                        });
                    accounts.insertOne({accountName: "Basic Savings 001", accountBalance: 1500, customerId: customerId})
                        .then(accountInsertResult => {
                            customers.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
                        });
                    accounts.insertOne({accountName: "Vacation", accountBalance: 250, customerId: customerId})
                        .then(accountInsertResult => {
                            customers.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
                        });
                });

            customers.insertOne({customerName: "Fardeen Shepherd", emailAddress: "fshepherd@gmail.com", password: "3FfVqdtdzHBkclN9jpSv", accountIds: []})
                .then(customerInsertResult => {
                    const customerId = customerInsertResult.insertedId;
                    accounts.insertOne({accountName: "Pay Dem Bills", accountBalance: 790, customerId: customerId})
                        .then(accountInsertResult => {
                            customers.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
                        });
                    accounts.insertOne({accountName: "Rainy Day", accountBalance: 5000, customerId: customerId})
                        .then(accountInsertResult => {
                            customers.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
                        });
                });

            customers.insertOne({customerName: "Izabella Paterson", emailAddress: "ipaterson@yahoo.com", password: "D7Yq1yJlWV0H8z8fR0RV", accountIds: []})
                .then(customerInsertResult => {
                    const customerId = customerInsertResult.insertedId;
                    accounts.insertOne({accountName: "Basic Checking 001", accountBalance: 4300, customerId: customerId})
                        .then(accountInsertResult => {
                            customers.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
                        });
                    accounts.insertOne({accountName: "Basic Savings 001", accountBalance: 12000, customerId: customerId})
                        .then(accountInsertResult => {
                            customers.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
                        });
                });

            customers.insertOne({customerName: "Suzannah Fowler", emailAddress: "sfowler@aol.com", password: "25m3NnS7Z7wurSAnEypw", accountIds: []})
                .then(customerInsertResult => {
                    const customerId = customerInsertResult.insertedId;
                    accounts.insertOne({accountName: "Basic Checking 001", accountBalance: 350, customerId: customerId})
                        .then(accountInsertResult => {
                            customers.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
                        });
                    accounts.insertOne({accountName: "Basic Savings 001", accountBalance: 900, customerId: customerId})
                        .then(accountInsertResult => {
                            customers.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
                        });
                });

            customers.insertOne({customerName: "Riley-James Keeling", emailAddress: "rjkeeling@gmail.com", password: "w6RYL9J1FaUriOJVx3dQ", accountIds: []})
                .then(customerInsertResult => {
                    const customerId = customerInsertResult.insertedId;
                    accounts.insertOne({accountName: "Basic Checking 001", accountBalance: 1275, customerId: customerId})
                        .then(accountInsertResult => {
                            customers.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
                        });
                    accounts.insertOne({accountName: "Basic Savings 001", accountBalance: 6950, customerId: customerId})
                        .then(accountInsertResult => {
                            customers.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
                        });
                });
        }).then(() => {
            res.send("Probably done");
        }).catch(error => {
            console.log(error);
        });
});

app.use(express.static("public"));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});