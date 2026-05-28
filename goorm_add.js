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
                code: `arr = input().split('/')
                print("이름:", *[idx[0].upper() + idx[1:].lower() for idx in arr[0].strip().split()], sep=' ')
print(f"이메일: {arr[1].strip().lower()}")
print("주소:", *[idx[0].upper() + idx[1:].lower() for idx in arr[2].strip().split()], sep=' ')`
            },
            {
                number: 2,
                code: `n = int(input())
res = 0
while res ** 2 <= n:
\tres += 0.001
print(f"{res - 0.001:.3f}")`
            },
            {
                number: 3,
                code: `n, cnt = int(input()), 0
for x in range(-n, n + 1):
\tfor y in range(-n, n + 1):
\t\tif x ** 2 + y ** 2 <= n ** 2:
\t\t\tcnt += 1
print(cnt)
print(f"{cnt / n ** 2:.4f}")`
            },
            {
                number: 4,
                code: `n = int(input())
arr = [1, 1]
for i in range(n - 2):
\tarr.append(arr[-1] + arr[-2])
print(*arr[:n], sep=' ')`
            },
            {
                number: 5,
                code: `n = int(input())
arr = [1, 1]
for i in range(n - 2):
\tarr.append(arr[-1] + arr[-2])
for i in range(n - 1):
\tprint(f"{arr[i + 1] / arr[i]:.6f}")
`
            },
            {
                number: 6,
                code: `def renew(step, t, r, target):
\tif step:
\t\tprint(f"{t:.2f}", end=' ')
\tif t <= target:
\t\tprint(f"\\n{step}")
\t\treturn
\treturn renew(step + 1, t * (1 - r / 100), r , target)

renew(0, *list(map(int, input().split())))`
            },
            {
                number: 7,
                code: `a, b = set(input().split()), set(input().split())
print(len(a - b))
if not a - b:
\tprint("전원 참가")
else:
\tprint(*sorted(a - b))`
            },
            {
                number: 8,
                code: `a, b = set(input().split()), set(input().split())
print("YES" if a < b else "NO")`
            },
            {
                number: 9,
                code: `a, b, c = set(input().split()), set(input().split()), set(input().split())
d = (a | b) - c
print(len(d))
print(*sorted(d) if d else '')`
            },
            {
                number: 10,
                code: `a, b, c = set(input().split()), set(input().split()), set(input().split())
d = (a ^ b) & c
print(len(d))
print(*sorted(d) if d else '')`
            },
            {
                number: 11,
                code: `arr = []
for _ in range(5):
\tarr.append(set(input().split()))

a = arr[0] - (arr[1] | arr[2] | arr[3] | arr[4])
cnt = {}
for i in arr:
\tfor j in i:
\t\tcnt[j] = cnt.get(j, 0) + 1
b = [key for key, value in cnt.items() if value >= 2]
c = [key for key, value in cnt.items() if value == 1]

print(len(a))
print(*sorted(b))
print(len(c))`
            },
            {
                number: 12,
                code: `i, j = map(int, input().split())
with open('data/numA.txt', 'r') as f:
\tnum_a = list(map(int, f.read().split('\\n')[:-1]))
with open('data/numB.txt', 'r') as f:
\tnum_b = list(map(int, f.read().split('\\n')[:-1]))
print(num_a[i - 1] + num_b[j - 1])`
            },
            {
                number: 13,
                code: `a, b, n = input(), input(), int(input())
a_gram = [a[i:i + n] for i in range(len(a) - n + 1)]
b_gram = [b[i:i + n] for i in range(len(b) - n + 1)]
inter = set(a_gram) & set(b_gram)
if inter:
\tprint(*sorted(inter), sep='\\n')
else:
\tprint("NONE")`
            },
            {
                number: 14,
                code: `def solution(n):
\tfor i in range(n):
\t\tprint('*' * (2 * i + 1))`
            },
            {
                number: 15,
                code: `def solution(a, b):
\tcnt = 0
\tfor n in range(a, b + 1):
\t\tis_prime = True
\t\tfor i in range(2, n):
\t\t\tif not n % i:
\t\t\t\tis_prime = False
\t\t\t\tbreak

\t\tif is_prime and n != 1:
\t\t\tcnt += 1
\treturn cnt`
            },
            {
                number: 16,
                code: `menu = {
\t"떡볶이": 4000,
\t"순대": 3000,
\t"튀김": 2500,
\t"김밥": 3500,
\t"라면": 4500,
}

def get_total(*prices):
\treturn sum(prices)

def get_discount(total, rate=10):
\treturn int(total * (rate / 100))

def print_receipt(name, discount_rate, order):
\tt = get_total(*[menu[key] * value for key, value in order.items()])
\td = get_discount(t, discount_rate)

\tprint(f"손님: {name}")
\tprint("---")
\tprint(f"합계: {t}원")
\tprint(f"할인({discount_rate}%): -{d}원")
\tprint(f"최종: {t - d}원")`
            },
            {
                number: 17,
                code: `def solution(s, c):
\treturn ''.join([i for i in s if i != c])`
            },
            {
                number: 18,
                code: `n = int(input())
deviation = {}
for _ in range(n):
\traw = input().split()
\tname, scores = raw[0], list(map(int, raw[1:]))
\tdeviation[name] = max(scores) - min(scores)

for key, value in sorted(deviation.items(), key = lambda x: (-x[1], x[0])):
\tprint(f"{key}: {value}")`
            },
            {
                number: 19,
                code: `n = int(input())
cnt, l, q = {}, 0, 0
for _ in range(n):
\tname, s = input().split(':')
\tcnt[name] = cnt.get(name, 0) + 1
\tif s.count('ㅋ') >= 3:
\t\tl += 1
\tif s.endswith('?'):
\t\tq += 1
cnt_sorted = sorted(cnt.items(), key=lambda x: -x[1])

print(f"최다발언: {cnt_sorted[0][0]}({cnt_sorted[0][1]}개)")
print(f"웃음발언: {l}개")
print(f"질문발언: {q}개")`
            },
            {
                number: 20,
                code: `def is_in(string, array):
\tfor i in array:
\t\tif i in string:
\t\t\treturn True
\treturn False

n = int(input())
arr = []
a, b, c, d, e = 0, 0, 0, 0, 0
for _ in range(n):
\tname, s = input().split('/')

\tif is_in(s, ["강아지", "고양이", "동생"]):
\t\tarr.append((name, "동물/가족 핑계", len(s)))
\t\ta += 1
\telif is_in(s, ["컴퓨터", "인터넷", "전기"]):
\t\tarr.append((name, "기계 핑계", len(s)))
\t\tb += 1
\telif is_in(s, ["아팠", "병원", "감기"]):
\t\tarr.append((name, "건강 핑계", len(s)))
\t\tc += 1
\telse:
\t\tarr.append((name, "창의적 핑계", len(s)))
\t\td += 1

\tif len(s) >= 50:
\t\te += 1

for i, j, k in sorted(arr, key=lambda x: -x[2]):
\tprint(f"{i}: {j} (길이{k}자)")
print(f"동물/가족:{a} 기계:{b} 건강:{c} 창의:{d} 장문:{e}")`
            }
        ]
    }
);
