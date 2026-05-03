const Goorm = require("./models/Goorm");
require('dotenv').config();
const mongoose = require('mongoose');

console.log(`Connecting to MongoDB with URI: ${process.env.MONGO_URI}`);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

return Goorm.insertOne(
    {
        enabled: true,
        problems: [
            {
                number: 1,
                code: `n, sqrt = int(input()), 0
while sqrt ** 2 <= n:
	sqrt += 0.001
print(f"{sqrt - 0.001:.3f}")`
            },
            {
                number: 2,
                code: `n, cnt = int(input()), 0
for x in range(-n, n + 1):
	for y in range(-n, n + 1):
		if x ** 2 + y ** 2 <= n ** 2:
			cnt += 1
print(cnt)
print(f"{cnt / n ** 2:.4f}")`
            },
            {
                number: 3,
                code: `fibo = [0, 1]
for i in range(int(input()) - 1):
	fibo.append(fibo[-1] + fibo[-2])
print(*fibo[1:])`
            },
            {
                number: 4,
                code: `fibo = [1, 1]
for _ in range(int(input()) - 2):
	fibo.append(fibo[-1] + fibo[-2])
for i in range(len(fibo) - 1):
	print(f"{fibo[i + 1] / fibo[i]:.6f}")`
            },
            {
                number: 5,
                code: `t, r, target = map(int, input().split())
level = 0
while t > target:
	level += 1
	t = t * (1 - r / 100)
	print(f"{t:.2f}", end=' ')
print(f"\n{level}")`
            },
            {
                number: 6,
                code: `dic = {idx:len(idx) for idx in input().split()}
for key, value in sorted(dic.items()):
	print(key, value)`
            },
            {
                number: 7,
                code: `arr = [input().split() for _ in range(int(input()))]
dic = {i[0]:int(i[1]) for i in arr if int(i[1]) >= 80}
if dic:
	for key, value in sorted(dic.items()):
		print(key, value)
else:
	print("없음")`
            },
            {
                number: 8,
                code: `dic = dict(zip(input().split(), input().split()))
for key, value in dic.items():
	print(key, value)`
            },
            {
                number: 9,
                code: `n = int(input())
dic = {key:value for value, key in [input().split() for _ in range(n)]}
for key, value in sorted(dic.items()):
	print(key, value)`
            },
            {
                number: 10,
                code: `arr = input().replace(' ', '')
dic = {char:arr.count(char) for char in arr}
for key, value in sorted(dic.items()):
	print(key, value)`
            },
            {
                number: 11,
                code: `print(*sorted(set(map(int, input().split()))))`
            },
            {
                number: 12,
                code: `s1, s2 = set(input().split()), set(input().split())
print(len(s1 & s2))
print(*sorted(s1 & s2))`
            },
            {
                number: 13,
                code: `students, attendant = set(input().split()), set(input().split())
not_attend = students - attendant
print(len(not_attend))
print(' '.join(sorted(not_attend)) if not_attend else "전원 참가")`
            },
            {
                number: 14,
                code: `a, b = set(input().split()), set(input().split())
print("YES" if a <= b else "NO")`
            },
            {
                number: 15,
                code: `a, b = set(input().split()), set(input().split())
print("YES" if a < b else "NO")`
            },
            {
                number: 16,
                code: `s1, s2, s3 = set(input().split()), set(input().split()), set(input().split())
s4 = (s1 | s2) - s3
print(len(s4))
print(*sorted(s4) if s4 else '')`
            },
            {
                number: 17,
                code: `s1, s2, s3 = set(input().split()), set(input().split()), set(input().split())
s4 = (s1 ^ s2) & s3
print(len(s4))
print(*sorted(s4) if s4 else '')`
            },
            {
                number: 18,
                code: `s1, s2, s3 = set(input().split()), set(input().split()), set(input().split())
s4 = ((s1 & s2) | (s2 & s3) | (s3 & s1)) - (s1 & s2 & s3)
print(len(s4))
print(*sorted(s4) if s4 else '')`
            },
            {
                number: 19,
                code: `s = [set(input().split()) for _ in range(5)]

print(len(s[0] - (s[1] | s[2] | s[3] | s[4])))

one, two = [], []
for idx in s[0] | s[1] | s[2] | s[3] | s[4]:
	cnt = 0
	for i in range(5):
		if idx in s[i]:
			cnt += 1

	if cnt == 1:
		one.append(idx)
	if cnt >= 2:
		two.append(idx)

print(*sorted(two))
print(len(one))`
            },
        ]
    },
    {
        upsert: true,
        new: true
    }
);
