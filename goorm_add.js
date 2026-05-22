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
                code: `def solution(arr, value):
    return arr.index(value) if value in arr else -1`
            },
            {
                number: 2,
                code: `def solution(arr):
    return sum(1 for _ in arr)`
            },
            {
                number: 3,
                code: `def solution(arr):
    m = 10e9
    res = 0
    for i in range(len(arr)):
        if arr[i] < m:
            m, res = arr[i], i
    return res`
            },
            {
                number: 4,
                code: `def solution(s, c):
    solv = ''
    for i in s:
        if i != c:
            solv += i
    return solv`
            },
            {
                number: 5,
                code: `def solution(s, sub):
    solv, idx = 0, 0
    while idx <= len(s) - len(sub):
        if s[idx:idx + len(sub)] == sub:
            solv += 1
            idx += len(sub)
        else:
            idx += 1
    return solv`
            },
            {
                number: 6,
                code: `n = int(input())
arr = [input().split() for _ in range(n)]
dev = {idx[0]: max(map(int, idx[1:])) - min(map(int, idx[1:])) for idx in arr}
for key, value in sorted(dev.items(), key=lambda x: (-x[1], x[0])):
    print(f"{key}: {value}")`
            },
            {
                number: 7,
                code: `count = {}
for i in input().split():
    count[i] = count.get(i, 0) + 1
for key, value in sorted(count.items(), key=lambda x: (-x[1], x[0]))[:int(input())]:
    print(f"{key}: {value}")`
            },
            {
                number: 8,
                code: `for _ in range(int(input())):
    a, b, c = map(int, input().split())
    d = b ** 2 - 4 * a * c
    if d > 0:
        print("두 실근")
    elif d == 0:
        print("중근")
    else:
        print("허근")`
            },
            {
                number: 9,
                code: `n = int(input())
log = [input().split(':') for _ in range(n)]

l, q = 0, 0
cnt = {}
for name, content in log:
    cnt[name] = cnt.get(name, 0) + 1
arr = sorted(cnt.items(), key = lambda x: -x[1])

print(f"최다발언: {arr[0][0]}({arr[0][1]}개)")
l = len(list(filter(lambda x: x[1].count("ㅋ") >= 3, log)))
q = len(list(filter(lambda x: '?' in x[1], log)))
print(f"웃음발언: {l}개")
print(f"질문발언: {q}개")`
            },
            {
                number: 10,
                code: `n = int(input())
arr, long = [], 0
a, b, c, d = 0, 0, 0, 0

for _ in range(n):
    name, content = input().split('/')

    if "강아지" in content or "고양이" in content or "동생" in content:
        arr.append((name, "동물/가족 핑계", len(content)))
        a += 1
    elif "컴퓨터" in content or "인터넷" in content or "전기" in content:
        arr.append((name, "기계 핑계", len(content)))
        b += 1
    elif "아팠" in content or "병원" in content or "감기" in content:
        arr.append((name, "건강 핑계", len(content)))
        c += 1
    else:
        arr.append((name, "창의적 핑계", len(content)))
        d += 1

    if len(content) >= 50:
        long += 1

arr.sort(key=lambda x: -x[2])
for n, t, l in arr:
    print(f"{n}: {t} (길이{l}자)")
print(f"동물/가족:{a} 기계:{b} 건강:{c} 창의:{d} 장문:{long}")`
            },
            {
                number: 11,
                code: `def solution(**kwargs):
    print("<캐릭터 카드>")
    for i in ['이름', '직업', '레벨', '무기']:
        print(f"{i}: {kwargs[i]}")`
            }
        ]
    }
);
