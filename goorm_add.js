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
                code: `class Animal:
\tdef __init__(self, name, age):
\t\tself.name = name
\t\tself.age = age

\tdef sound(self):
\t\treturn "동물이 소리를 냅니다."

class Dog(Animal):
\tdef __init__(self, name, age, breed):
\t\tsuper().__init__(name, age)
\t\tself.breed = breed

\tdef bark(self):
\t\treturn "멍멍!"
`
            },
            {
                number: 2,
                code: `class Vehicle:
\tdef __init__(self, brand, speed):
\t\tself.brand = brand
\t\tself.speed = speed

\tdef describe(self):
\t\treturn f"이 차량은 시속 {self.speed}km로 이동합니다."

class Car(Vehicle):
\tdef __init__(self, brand, speed, fuel):
\t\tsuper().__init__(brand, speed)
\t\tself.fuel = fuel

\tdef fuel_info(self):
\t\treturn f"연료 종류: {self.fuel}"
`
            },
            {
                number: 3,
                code: `class BankAccount:
\tdef __init__(self, balance):
\t\tself.__balance = balance

\tdef deposit(self, amount):
\t\tself.__balance += amount

\tdef get_balance(self):
\t\treturn self.__balance
`
            },
            {
                number: 4,
                code: `class User:
\tdef __init__(self, password):
\t\tself.__password = password

\tdef check_password(self, password):
\t\treturn self.__password == password

\tdef change_password(self, old_password, new_password):
\t\tchangeable = self.check_password(old_password)
\t\tif changeable:
\t\t\tself.__password = new_password
\t\treturn changeable
`
            },
            {
                number: 5,
                code: `class ClubMember:
\ttotal_count = 0

\t@classmethod
\tdef __init__(cls, name):
\t\tcls.total_count += 1

\t@staticmethod
\tdef is_valid_name(name):
\t\treturn 2 <= len(name) <= 10

\t@classmethod
\tdef get_total_count(cls):
\t\treturn cls.total_count
`
            },
        ]
    }
);
