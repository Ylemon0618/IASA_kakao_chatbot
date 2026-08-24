const Goorm = require("./models/Goorm");
require('dotenv').config();
const mongoose = require('mongoose');

console.log(`Connecting to MongoDB with URI: ${process.env.MONGO_URI}`);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

Goorm.findOneAndUpdate(
    { enabled: true },
    {
        $set: { enabled: false }
    },
    { upsert: true }
);

return Goorm.insertOne(
    {
        enabled: true,
        problems: [
            {
                number: 1,
                code: `class Student:
\tdef __init__(self, name, id):
\t\tself.name = name
\t\tself.id = id

\tdef print_info(self):
\t\tprint(f"이름: {self.name}, 학번: {self.id}")`
            },
            {
                number: 2,
                code: `class Rectangle:
\tdef __init__(self, width, height):
\t\tself.width = width
\t\tself.height = height

\tdef get_area(self):
\t\treturn self.width * self.height

\tdef get_perimeter(self):
\t\treturn 2 * (self.width + self.height)`
            },
            {
                number: 3,
                code: `class Calculator:
\tdef __init__(self, n1, n2):
\t\tself.n1 = n1
\t\tself.n2 = n2

\tdef add(self):
\t\treturn self.n1 + self.n2

\tdef subtract(self):
\t\treturn self.n1 - self.n2`
            },
            {
                number: 4,
                code: `class BankAccount:
\tdef __init__(self, owner, balance):
\t\tself.owner = owner
\t\tself.balance = balance

\tdef deposit(self, amount):
\t\tself.balance += amount

\tdef withdraw(self, amount):
\t\tself.balance -= amount`
            },
            {
                number: 5,
                code: `class Counter:
\tdef __init__(self):
\t\tself.count = 0

\tdef increment(self):
\t\tself.count += 1

\tdef decrement(self):
\t\tself.count -= 1

\tdef get_count(self):
\t\treturn self.count`
            },
        ]
    }
);
