const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");
const bodyParser = require("body-parser");

const app = express();
const port = 80;

function getMongoClient(){
    return new MongoClient("mongodb://root:rootpassword@mongo:27017/");
}

const customerNames = ["Lee Rodriquez", "Beth Jensen", "Seamus Gardner", "Walid Molina", "Morris Pike", "Caleb Davila", "Kerys Rayner", "Tammy Krueger", "Lukas Gay", "Kaylie Macleod", "Pia Hatfield", "Bodhi Mcmahon", "Annalise Powers", "Amir Saunders", "Cherish Firth", "Sumayyah Lin", "Gracie-Mai Pope", "Joyce Cannon", "Janet Conrad", "Romeo Chamberlain", "Aleesha Fritz", "Vivaan Macfarlane", "Roxie Russo", "Huseyin Patterson", "Eli Mair"];
function getCustomerName(){
    const index = Math.floor(Math.random() * customerNames.length);
    return customerNames.splice(index, 1)[0];
}

app.get("/customers", (req, res) => {
    const client = getMongoClient();
    const database = client.db("NinjaBank");
    const customersCollection = database.collection("Customers");

    client.connect()
        .then(() => {
            const cursor = customersCollection.find({});
            return cursor.toArray();
        }).then(documents => {
            res.send(documents);
        }).catch(error => {
            console.log(error);
            res.sendStatus(500);
        });
});

app.post("/customers", (req, res) => {
    const client = getMongoClient();
    const database = client.db("NinjaBank");
    const customersCollection = database.collection("Customers");
    const customerName = getCustomerName();
    client.connect()
        .then(() => {        
            return customersCollection.insertOne({customerName: customerName, accounts: []});
        }).then(insertResult => {
            res.send({_id: insertResult.insertedId, customerName: customerName});
        }).catch(error => {
            console.log(error);
            res.sendStatus(500);
        });
});

app.post("/accounts", bodyParser.json(), (req, res) => {
    const client = getMongoClient();
    const database = client.db("NinjaBank");
    const customersCollection = database.collection("Customers");
    const accountsCollection = database.collection("Accounts");
    console.log(req.body);

    let partialAccount = {accountName: "Checking", customerId: req.body.customerId};
    client.connect()
        .then(() => {
            partialAccount.accountBalance = (Math.random() * 1000).toFixed(2);
            return accountsCollection.insertOne(partialAccount);
        }).then(insertResult => {
            partialAccount._id = insertResult.insertedId;
            partialAccount.transactions = [];
            return customersCollection.updateOne({"_id": new ObjectID(req.body.customerId)}, {$push: {"accounts": partialAccount}});
        }).then(() => {
            res.send(partialAccount);
        }).catch(error => {
            console.log(error);
            res.sendStatus(500);
        });
});

app.get("/transactions", (req, res) => {
    const client = getMongoClient();
    const database = client.db("NinjaBank");
    const transactionsCollection = database.collection("Transactions");

    client.connect()
        .then(() => {
            const cursor = transactionsCollection.find({});
            return cursor.toArray();
        }).then((transactions) => {
            res.send(transactions);
        }).catch(error => {
            console.log(error);
            res.sendStatus(500);
        });
});

app.post("/transactions", (req, res) => {
    const client = getMongoClient();
    const database = client.db("NinjaBank");
    const accountsCollection = database.collection("Accounts");
    const transactionsCollection = database.collection("Transactions");
    const customersCollection = database.collection("Customers");

    const partialTransaction = {};
    client.connect()
        .then(() => {
            const cursor = accountsCollection.find({});
            return cursor.toArray();
        }).then(accounts => {
            // generate random transaction
            const x = Math.floor(Math.random() * accounts.length);
            const y = Math.floor(Math.random() * accounts.length);
            const transactionAmount = (Math.random() * 10).toFixed(2);

            partialTransaction.sourceAccountId = accounts[x]._id;
            partialTransaction.destinationAccountId = accounts[y]._id;
            partialTransaction.transactionAmount = transactionAmount;

            return transactionsCollection.insertOne(partialTransaction);
        }).then((insertResult) => {
            // add transaction to customer.account

            // accountsCollection.findOne({"_id": partialTransaction.sourceAccountId})
            //     .then(account => {
            //         customersCollection.updateOne({"_id": new ObjectID(account.customerId)}, {$push: {"account.transactions": partialTransaction}});
            //     }).then(customer => {
                    
            //     });


            // accountsCollection.updateOne({_id: new ObjectID(x._id)}, {$push: {"transactions": insertResult}});
            // accountsCollection.updateOne({_id: new ObjectID(y._id)}, {$push: {"transactions": insertResult}});
            res.send(insertResult.insertedId);
        }).catch(error => {
            console.log(error);
            res.sendStatus(500);
        });
});

// app.get("/generate", (req, res) => {
//     const client = getMongoClient();

//     client.connect()
//         .then(() => {
//             const database = client.db("NinjaBank");
//             const customersCollection = database.collection("Customers");
//             const accountsCollection = database.collection("Accounts");

//             customersCollection.insertOne({customerName: "Kylie Beasley", emailAddress: "kbeasley@gmail.com", password: "cOgnfpe5kes7unFcOFjh", accountIds: []})
//                 .then(customerInsertResult => {
//                     const customerId = customerInsertResult.insertedId;
//                     accountsCollection.insertOne({accountName: "Basic Checking 001", accountBalance: 1000, customerId: customerId})
//                         .then(accountInsertResult => {
//                             customersCollection.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
//                         });
//                     accountsCollection.insertOne({accountName: "Basic Savings 001", accountBalance: 1500, customerId: customerId})
//                         .then(accountInsertResult => {
//                             customersCollection.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
//                         });
//                     accountsCollection.insertOne({accountName: "Vacation", accountBalance: 250, customerId: customerId})
//                         .then(accountInsertResult => {
//                             customersCollection.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
//                         });
//                 });

//             customersCollection.insertOne({customerName: "Fardeen Shepherd", emailAddress: "fshepherd@gmail.com", password: "3FfVqdtdzHBkclN9jpSv", accountIds: []})
//                 .then(customerInsertResult => {
//                     const customerId = customerInsertResult.insertedId;
//                     accountsCollection.insertOne({accountName: "Pay Dem Bills", accountBalance: 790, customerId: customerId})
//                         .then(accountInsertResult => {
//                             customersCollection.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
//                         });
//                     accountsCollection.insertOne({accountName: "Rainy Day", accountBalance: 5000, customerId: customerId})
//                         .then(accountInsertResult => {
//                             customersCollection.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
//                         });
//                 });

//             customersCollection.insertOne({customerName: "Izabella Paterson", emailAddress: "ipaterson@yahoo.com", password: "D7Yq1yJlWV0H8z8fR0RV", accountIds: []})
//                 .then(customerInsertResult => {
//                     const customerId = customerInsertResult.insertedId;
//                     accountsCollection.insertOne({accountName: "Basic Checking 001", accountBalance: 4300, customerId: customerId})
//                         .then(accountInsertResult => {
//                             customersCollection.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
//                         });
//                     accountsCollection.insertOne({accountName: "Basic Savings 001", accountBalance: 12000, customerId: customerId})
//                         .then(accountInsertResult => {
//                             customersCollection.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
//                         });
//                 });

//             customersCollection.insertOne({customerName: "Suzannah Fowler", emailAddress: "sfowler@aol.com", password: "25m3NnS7Z7wurSAnEypw", accountIds: []})
//                 .then(customerInsertResult => {
//                     const customerId = customerInsertResult.insertedId;
//                     accountsCollection.insertOne({accountName: "Basic Checking 001", accountBalance: 350, customerId: customerId})
//                         .then(accountInsertResult => {
//                             customersCollection.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
//                         });
//                     accountsCollection.insertOne({accountName: "Basic Savings 001", accountBalance: 900, customerId: customerId})
//                         .then(accountInsertResult => {
//                             customersCollection.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
//                         });
//                 });

//             customersCollection.insertOne({customerName: "Riley-James Keeling", emailAddress: "rjkeeling@gmail.com", password: "w6RYL9J1FaUriOJVx3dQ", accountIds: []})
//                 .then(customerInsertResult => {
//                     const customerId = customerInsertResult.insertedId;
//                     accountsCollection.insertOne({accountName: "Basic Checking 001", accountBalance: 1275, customerId: customerId})
//                         .then(accountInsertResult => {
//                             customersCollection.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
//                         });
//                     accountsCollection.insertOne({accountName: "Basic Savings 001", accountBalance: 6950, customerId: customerId})
//                         .then(accountInsertResult => {
//                             customersCollection.updateOne({_id: customerId}, {$push: {"accountIds": accountInsertResult.insertedId}});
//                         });
//                 });
//         }).then(() => {
//             res.send("Probably done");
//         }).catch(error => {
//             console.log(error);
//         });
// });

// app.get("/accounts/customer/:customerId", (req, res) => {
//     const client = getMongoClient();

//     client.connect()
//         .then(() => {
//             const database = client.db("NinjaBank");
//             const accountsCollection = database.collection("Accounts");

//             const cursor = accountsCollection.find({customerId: new ObjectID(req.params.customerId)});
        
//             cursor.toArray()
//                 .then(accounts => {
//                     res.send(accounts);
//                 }).catch(error => {
//                     console.log(error);
//                 });
//         }).catch(error => {
//             console.log(error);
//         });;
// });



//app.use(express.json());
app.use(express.static("public"));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});