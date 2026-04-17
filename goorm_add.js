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
                code: `import sys
inputs = sys.stdin.readlines()

arr = list(map(int, inputs[0].split()))
arr.append(int(inputs[1]))
arr.extend(list(map(int, inputs[3].split())))
arr.insert(*list(map(int, inputs[4].split())))
arr = [i for i in arr if i != int(inputs[5])]
arr.sort()

print(f"{int(inputs[6])} 재고 수량: {arr.count(int(inputs[6]))}")
print(f"{int(inputs[7])}의 인덱스: {arr.index(int(inputs[7]))}")
print(f"최종 재고: {arr[::-1]}")
arr.clear()
print(f"재고 초기화: {arr}")`
            },
            {
                number: 2,
                code: `x, w, z = map(int, input().split())
print(f"{(8 * (2 * x ** 3 + 5 * x + 2) / (7 * w - 3 / z) - z) / (4 * (3 + x) / 7):.2f}")`
            },
            {
                number: 3,
                code: `n, res = int(input()), 0
for i in range(1, 10):
    res += i * n
print(res)`
            },
            {
                number: 4,
                code: `n, idx = int(input()), 0
while idx < n:
    idx += 1
    if any(i in str(idx) for i in ['3', '6', '9']):
        print('x', end=' ')
    else:
        print(idx, end=' ')`
            },
            {
                number: 5,
                code: `print(sum([i for i in range(int(input())) if not i % 3 or not i % 5]))`
            },
            {
                number: 6,
                code: `n, k = map(int, input().split())
for i in range(n, k + 1):
    if not i % 5: print('Fizz', end='')
    if not i % 7: print('Buzz', end='')
    if i % 5 and i % 7: print(i, end='')
    print()`
            },
            {
                number: 7,
                code: `n, turn = input().split()
board = [0] * 10
for _ in range(int(n)):
    pos, player = input().split()
    board[int(pos)] = 1 if player == 'O' else -1

win = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]]
res = []
for line in win:
    if board[line[0]] + board[line[1]] + board[line[2]] == (2 if turn == 'O' else -2):
        res.append(*[i for i in line if not board[i]])

if not res:
    print('Keep going')
else:
    print(*sorted(res))`
            },
            {
                number: 8,
                code: `n, board = int(input()), [0] * 10

if not n:
    print(1, 2, 3, 4, 5, 6, 7, 8, 9)
else:
    for i in map(int, input().split()):
        board[int(i)] = 1
    
    win = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]]
    res = []
    for i in range(1, 10):
        if board[i]:
            continue
    
        escape = False
        for line in win:
            if i in line and board[line[0]] + board[line[1]] + board[line[2]] >= 2:
                escape = True
                break
    
        if not escape:
            res.append(i)
    
    if res:
        print(*res)
    else:
        print('GiveUp')`
            },
            {
                number: 9,
                code: `scores = dict(zip(['A+', 'A0', 'B+', 'B0', 'C+', 'C0', 'D+', 'D0', 'F'], [4.5, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0.0]))
credit_sum, score_sum = 0, 0
for _ in range(int(input())):
    name, credit, score = input().split()
    if score != 'P':
        credit_sum += int(credit)
        score_sum += scores[score] * int(credit)
print(f"{score_sum / credit_sum:.2f}")
print("졸업 가능" if score_sum / credit_sum >= 3.1 else "졸업 불가")`
            },
            {
                number: 10,
                code: `a, c = map(int, input().split())
res_cnt = 0
for b in range(1, 101):
    d2 = (a * b ** 2 - 100) / c
    if d2 > 0:
        d = d2 ** 0.5
        if int(d) == d:
            res_cnt += 1
            print(b, int(d))

if not res_cnt:
    print('없음')`
            }
        ]
    },
    {
        upsert: true,
        new: true
    }
);
