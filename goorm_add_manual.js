require('dotenv').config({quiet: true});
const mongoose = require('mongoose');
const Goorm = require("./models/Goorm");
const readline = require('readline');

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => rl.question(query, (ans) => {
        rl.close();
        resolve(ans.trim());
    }));
}

async function run() {
    try {
        const problems = [
            {
                number: 1,
                code: `import random

s, n, m = map(int, input().split())
random.seed(s)

arr = list(range(1, 101))
random.shuffle(arr)

max_sum, players = -1, []
for i in range(n):
\tl = sum(arr[i * m:i * m + m])
\tif max_sum == l:
\t\tplayers.append(i + 1)
\telif max_sum < l:
\t\tmax_sum = l
\t\tplayers = [i + 1]

print(*players)`
            },
            {
                number: 2,
                code: `from data.nickname import 이름, 형용사
import random

random.seed(int(input()))

def make_nickname():
\tname, adj = random.choice(이름), random.choice(형용사)
\treturn f"{adj} {name}"

result = make_nickname()
print(result)`
            },
            {
                number: 3,
                code: `import math
a, b = map(int, input().split())
print(f"{math.gcd(a, b)} {math.sqrt(a ** 2 + b ** 2):.2f} {math.lcm(a, b)}")`
            },
            {
                number: 4,
                code: `import math

class Object:
\tdef __init__(self, x, y):
\t\tself.x = x
\t\tself.y = y

\tdef distance(self, other):
\t\treturn math.sqrt((self.x - other.x) ** 2 + (self.y - other.y) ** 2)

class Angel(Object):
\tdef __init__(self, number, x, y, at):
\t\tsuper().__init__(x, y)
\t\tself.number = number
\t\tself.at = at
\t\tself.alive = True

class Junhyeok(Object):
\tdef __init__(self, energy):
\t\tsuper().__init__(0, 0)
\t\tself.energy = energy
\t\tself.order = []

\tdef current_at(self, angel, angels, R):
\t\tcnt = 0
\t\tfor i in angels:
\t\t\tif angel.distance(i) <= R and i.alive and angel != i:
\t\t\t\tcnt += 1
\t\treturn angel.at + cnt * 5

\tdef attack_cost(self, angel, angels, R):
\t\treturn math.ceil(self.distance(angel)) + self.current_at(angel, angels, R)

\tdef find_target(self, angels, R):
\t\tmin_cost, target = 10e9, None
\t\tfor angel in angels:
\t\t\tcost = self.attack_cost(angel, angels, R)
\t\t\tif cost < min_cost:
\t\t\t\ttarget = angel
\t\t\t\tmin_cost = cost
\t\treturn target, min_cost

\tdef attack(self, angel, cost):
\t\tself.x, self.y = angel.x, angel.y
\t\tself.energy -= cost
\t\tangel.alive = False
\t\tself.order.append(angel.number)

\tdef battle(self, angels, R):
\t\twhile angels or self.energy > 0:
\t\t\ttarget, cost = self.find_target(angels, R)
\t\t\tif self.energy < cost:
\t\t\t\tbreak
\t\t\tangels.remove(target)
\t\t\tself.attack(target, cost)

N, E, R = map(int, input().split())
angels = []
for i in range(N):
\tx, y, at = map(int, input().split())
\tangels.append(Angel(i + 1, x, y, at))

HYEOK = Junhyeok(E)
HYEOK.battle(angels, R)

print("FAILED" if angels else "CLEAR")
print(*HYEOK.order if HYEOK.order else "NONE")
print(HYEOK.energy)`
            },
            {
                number: 5,
                code: `import math
n, k = int(input()), int(input())
print((k - 1) * math.comb(n - k + 1, k - 1))`
            },
            {
                number: 6,
                code: `from data.yelena import *
show_face()
if int(input()):
\tchange_face()
show_face()`
            },
            {
                number: 7,
                code: `import numpy as np
import math

def check(a, b, c):
\tfor n in range(2, 11):
\t\tif a == math.pow(c, n) + b:
\t\t\treturn True
\treturn False

cnt = int(input())
seat = np.array(list(map(int, input().split())))

a, b, c = map(int, input().split())
if check(a, b, c):
\tprint(f"{c}시 예약자입니다.")
\table = seat.sum()
\tif b <= able:
\t\tprint("입장 가능")
\telse:
\t\tprint(f"입장 불가, 남은 좌석은 {able}개")
else:
\tprint("예약자가 아닙니다.")`
            },
            {
                number: 8,
                code: `import random

random.seed(42)

drinks = input().split()
icecream = input().split()
n = int(input())

class VendingMachine:
\tdef __init__(self, drinks, icecream):
\t\tself.drinks = drinks
\t\tself.icecream = icecream

\tdef buy(self):
\t\treturn random.choice(random.choice([self.drinks, self.icecream]))

sales = {}
machine = VendingMachine(drinks, icecream)

for i in range(n):
\titem = machine.buy()
\tif item in sales:
\t\tsales[item] += 1
\telse:
\t\tsales[item] = 1

print(sales)`
            },
        ]

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const command = await askQuestion('Insert new week(I) / Append existing week(A): ');

        if (command.toUpperCase() === 'I') {
            const latestGoorm = await Goorm.findOne({week: {$exists: true}}).sort({week: -1});
            const nextWeek = latestGoorm?.week ? latestGoorm.week + 1 : 1;

            console.log(`Inserted week: ${nextWeek}`);

            const inserted = await Goorm.create({
                week: nextWeek,
                problems: problems
            });

            if (inserted) {
                console.log("Answer successfully inserted");
            }
        } else if (command.toUpperCase() === 'A') {
            const weekStr = await askQuestion('Enter week number: ');
            const targetWeek = Number(weekStr);

            const result = await Goorm.updateOne(
                {week: targetWeek},
                {$push: {problems: {$each: problems}}}
            );

            if (result.matchedCount === 0) {
                console.log(`Unable to find week ${targetWeek}`);
            } else {
                console.log(`Answer successfully appended to week ${targetWeek}`);
            }
        } else {
            console.log("Invalid command! Use 'I' or 'A'.");
        }

    } catch (err) {
        console.error("Error occurred:", err.message);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

run();
