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
                number: 9,
                code: `import math

class StageLight:
\tdef __init__(self, n, r, k, c):
\t\tself.n = n
\t\tself.r = r
\t\tself.k = k
\t\tself.c = c

\tdef calculate(self):
\t\tangle = math.pi / self.n
\t\tlength = 2 * self.r * math.sin(angle)
\t\tprint(math.ceil(length / self.k) * self.k * self.n * self.c)

n, r, k, c = map(int, input().split())
light = StageLight(n, r, k, c)
light.calculate()`
            },
            {
                number: 10,
                code: `import numpy as np

def rotate(theta):
\treturn np.array([[np.cos(theta), -np.sin(theta)], [np.sin(theta), np.cos(theta)]])

t = float(input())
theta1 = 2 * np.pi * t / 1
theta2 = 2 * np.pi * t / 1.881

earth = (rotate(theta1) @ np.array([1.000, 0]).T).T
mars = (rotate(theta2) @ np.array([1.524, 0]).T).T

print(f"{earth[0]:.4f} {earth[1]:.4f}")
print(f"{mars[0]:.4f} {mars[1]:.4f}")
print(f"{((earth[0] - mars[0]) ** 2 + (earth[1] - mars[1]) ** 2) ** 0.5:.4f}")`
            },
            {
                number: 11,
                code: `import math
import random
random.seed(42)

n, k = map(int, input().split())
cnt = 0
for _ in range(k):
\tnum = random.randint(1, n)
\tsqrt = math.sqrt(num)
\tif int(sqrt) == sqrt:
\t\tcnt += 1

print(f"{cnt / k:.5f}")`
            },
            {
                number: 12,
                code: `def assign_cleaning_duty(students, num_weeks, seed):
\trandom.seed(seed)
\tduty = []
\tfor _ in range(num_weeks):
\t\tnew = random.choice(students)
\t\tstudents.remove(new)
\t\tduty.append(new)
\treturn duty

def duty_probability(total, num_weeks):
\treturn int(math.comb(total - 1, num_weeks - 1) * 100 / math.comb(total, num_weeks))`
            },
            {
                number: 13,
                code: `import math

def calc_R(n, p):
\tsigma = (n * p * (1 - p)) ** 0.5
\tR = 2 * sigma * (math.pi ** 0.5)
\treturn R

n, p1, p2, m = map(float, input().split())
R1, R2 = calc_R(n, p1), calc_R(n, p2)
R = R1 * R2
L = math.comb(int(m), 2) / R
P = 1 - math.e ** (-L)
print(f"{P:.4f}")`
            },
            {
                number: 14,
                code: `import random
random.seed(42)

n = int(input())
arr = [input() for _ in range(n)]
random.shuffle(arr)

cnt = n // 4
print(f"경기 수: {cnt}")
for i in range(cnt):
\tprint(f"{i + 1}번 경기: {arr[i * 4]} {arr[i * 4 + 1]} vs {arr[i * 4 + 2]} {arr[i * 4 + 3]}")
if cnt * 4 == n:
\tprint("대기자 없음")
else:
\tprint("대기자:", *arr[cnt * 4:], sep='\\n')`
            },
            {
                number: 15,
                code: `import random
random.seed(42)

A, C = map(int, input().split())
damage = 0
for i in range(1, 50001):
\tif random.random() < C / 100:
\t\tdamage += 2 * A
\telse:
\t\tdamage += A
\tif not i % 6:
\t\tdamage += A * (0.6 + C / 100)

print(damage / 50000)`
            },
            {
                number: 16,
                code: `import datetime
from dateutil.relativedelta import relativedelta

date1 = datetime.date(*list(map(int, input().split())))
date2 = datetime.date(*list(map(int, input().split())))
print(f"만 {relativedelta(date2, date1).years}세")`
            },
            {
                number: 17,
                code: `import numpy as np
arr = np.array(list(map(int, input().split())))
print(f"평균: {np.mean(arr):.2f}, 최대: {np.max(arr)}, 최소: {np.min(arr)}")`
            },
            {
                number: 18,
                code: `import math
import statistics

l, n = map(float, input().split())
data = list(map(float, input().split()))
mean = statistics.mean(data)
angle = math.radians(mean / 2)
d = n * l / (2 * math.sin(angle))
print(f"{mean:.4f}")
print(f"{d:.4f}")`
            },
            {
                number: 19,
                code: `import math
def minji_ang(r):
\treturn 2 * math.pi * r`
            },
            {
                number: 20,
                code: `import numpy as np

n, learning_rate = 16, 0.02
raw_data, raw_real_value = [], []
for _ in range(n):
\ttemp = list(map(float, input().split()))
\traw_data.append(temp[:3])
\traw_real_value.append(temp[3])

data = np.array(raw_data)
real_value = np.array(raw_real_value)
weight = np.array([1, 1, 1])
for _ in range(1000):
\tprediction = data @ weight
\terror = prediction - real_value
\tgradient = 2 / n * data.T @ error
\tweight = weight - learning_rate * gradient

prediction = data @ weight
error = prediction - real_value
loss = np.sum(error ** 2) / n
test_data = np.array(list(map(float, input().split())))

print(f"Weight: {weight[0]:.5f} {weight[1]:.5f} {weight[2]:.5f}")
print(f"Loss: {loss:.5f}")
print(f"Prediction: {test_data @ weight:.5f}")`
            },
            {
                number: 21,
                code: `import random
random.seed(42)

singers = ['방탄소년단', '세븐틴', '보이넥스트도어', '투모로우바이투게더']
songs = {
\t'방탄소년단': ['Magic Shop', 'No More Dream', '작은 것들을 위한 시', 'DNA', 'Save Me'],
\t'세븐틴': ['Shining Diamond', 'CALL CALL CALL!', '손오공', '247', 'Lucky'],
\t'보이넥스트도어': ['Adios', 'Count to Love', 'SAY CHEESE', 'Boom Boom Boom', '네가 생각난단 말이야'],
\t'투모로우바이투게더': ['9와 4분의 3 승강장에서 너를 기다려', '어느 날 머리에서 뿔이 자랐다', 'Sugar Rush Ride', '하루에 하루만 더', 'Deja Vu']
}

n = int(input())
singer = random.choice(singers)
songs_selected = sorted(random.sample(songs[singer], n))
print(f"[{singer}]의 노래:", *songs_selected)`
            },
            {
                number: 22,
                code: `import numpy as np

def policy1():
\tnew = zone.copy()
\tnew[pos_x][pos_y] *= 2
\treturn new

def policy2():
\tnew = zone.copy()
\tnew[pos_y] += 5
\treturn new

def policy3():
\tnew = zone.copy()
\tr_min, r_max = max(0, pos_x - 2), min(r, pos_x + 3)
\tc_min, c_max = max(0, pos_y - 2), min(c, pos_y + 3)
\tnew[r_min:r_max, c_min:c_max] += 2
\treturn new

def policy4():
\tnew = zone.copy()
\tavg = new.mean()
\tnew[new < int(avg / 2)] = int(avg / 2)
\treturn new

r, c = map(int, input().split())
zone = [list(map(int, input().split())) for _ in range(r)]
zone = np.array(zone)
pos_x, pos_y = map(int, input().split())

ans = []
for _ in range(int(input())):
\tpolicies = [[1, policy1()], [2, policy2()], [3, policy3()], [4, policy4()]]
\tif ans:
\t\tpolicies.pop(ans[-1] - 1)
\tif 1 in ans and policies[0][0] == 1:
\t\tpolicies.pop(0)
\t
\tpolicies.sort(key = lambda x: -np.sum(x[1]))
\tzone = policies[0][1]
\tans.append(policies[0][0] )

print(zone.sum())
print(*ans)`
            },
            {
                number: 23,
                code: `import math
p, q = map(int, input().split())
print(f"{p * math.pi + q * math.e:.5f}")`
            },
            {
                number: 24,
                code: `import math

n = int(input())
a = math.isqrt(n)
while n % a:
\ta -= 1
b = n // a

if a >= 2 and b >= 2:
\tprint(b - a)
else:
\tprint(-1)`
            },
            {
                number: 25,
                code: `import random
import math

random.seed(int(input()))
a, b = random.randint(1, 100), random.randint(1, 100)
operator = random.choice(['+', '-', '*', '/'])
if operator == '+':
\tans = a + b
elif operator == '-':
\tans = a - b
elif operator == '*':
\tans = a * b
else:
\tans = math.floor(a / b)

print(f"{a} {operator} {b} = ?")
print(ans)`
            },
            {
                number: 26,
                code: `import math
n = int(input())
cnt = math.ceil(math.sqrt(math.factorial(n)))
print(f"흔드는 횟수: {cnt}")
print("결과: 희중이가 깨어났다!" if cnt >= 50 else "결과: 귀마개 끼고 참는 중...")`
            },
            {
                number: 27,
                code: `import numpy as 랆4qZ꾥Fa
data = [list(map(int, input().split())) for _ in range(3)]
arr = 랆4qZ꾥Fa.array(data)
print(*랆4qZ꾥Fa.sum(arr, axis=1))
print(*list(map(int, 랆4qZ꾥Fa.mean(arr, axis=0))))`
            }
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