const Goorm = require("./models/Goorm");

return Goorm.insertOne(
    {
        enabled: true,
        problems: [
            {
                number: 1,
                code: `for i in range(int(input())): print("*" * (i + 1))`
            },
            {
                number: 2,
                code: `for i in range(int(input()), 0, -1): print('*' * i)`
            },
            {
                number: 3,
                code: `for i in range(1, int(input()) + 1): print('*' * i if i % 2 else '#' * i)`
            },
            {
                number: 4,
                code: `start, end = map(int, input().split())\nprint([i for i in range(start, end + 1) if not i % 3 or not i % 5])`
            },
            {
                number: 5,
                code: `print([int(idx * 0.85) for idx in list(map(int, input().split())) if 1500 <= idx <= 5000])`
            },
            {
                number: 6,
                code: `n = int(input())\nprint([(a, b, c) for a in range(1, n - 1) for b in range(a + 1, n) for c in range(b + 1, n + 1) if a * a + b * b == c * c])`
            },
            {
                number: 7,
                code: `c, r, h = map(int, input().split())\nprint([[[0 for _ in range(c)] for _ in range(r)] for _ in range(h)])`
            },
            {
                number: 8,
                code: `r, c = map(int, input().split())\nprint([[0] * c for _ in range(r)])`
            },
            {
                number: 9,
                code: `print([[0] * i for i in list(map(int, input().split()))])`
            },
            {
                number: 10,
                code: `a = [list(map(int, input().split())) for _ in range(2)]\nb = [list(map(int, input().split())) for _ in range(2)]\n\nprint([[a[i][0] * b[0][j] + a[i][1] * b[1][j] for j in range(2)] for i in range(2)])`
            },
            {
                number: 11,
                code: `data = input().strip().split('/')\ndata = [idx.strip() for idx in data]\n\nprint("이름: " + ' '.join([idx[0].upper() + idx[1:].lower() for idx in data[0].split()]))\nprint("이메일: " + data[1].lower())\nprint("주소: " + ' '.join([idx[0].upper() + idx[1:].lower() for idx in data[2].split()]))`
            }
        ]
    },
    {
        upsert: true,
        new: true
    }
);
