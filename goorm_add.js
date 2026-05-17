const Goorm = require("./models/Goorm");
require('dotenv').config();
const mongoose = require('mongoose');

console.log(`Connecting to MongoDB with URI: ${process.env.MONGO_URI}`);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

await Goorm.findOneAndUpdate(
	{ enabled: true },
	{
		$set: { enabled: false }
	},
	{ upsert: false }
);

return Goorm.insertOne(
    {
        enabled: true,
        problems: [
            {
                number: 1,
                code: `print(open('data/test.txt').read())`
            },
            {
                number: 2,
                code: `with open('test.txt', 'w') as f:
f.write(input())
with open('test.txt', 'r') as f:
    print(f.read())`
            },
            {
                number: 3,
                code: `n = int(input())
with open('numbers.txt', 'w') as f:
\tfor i in range(n):
\t\tf.write(input() + '\\n')
with open('numbers.txt', 'r') as f:
\tnum = list(map(int, f.read().split('\\n')[:-1]))
print(max(num))`
            },
            {
                number: 4,
                code: `n = int(input())
with open('scores.txt', 'w') as f:
\tfor _ in range(n):
\t\tf.write(input() + '\\n')
with open('scores.txt', 'r') as f:
\tarr = list(map(int, f.read().split('\\n')[:-1]))
print(f"합계: {sum(arr)}")
print(f"평균: {sum(arr) / n:.2f}")`
            },
            {
                number: 5,
                code: `n = int(input())
num = list(map(int, open("data/randomInt.txt").read().split()))
cnt = 0
for i in num:
\tif i > n:
\t\tcnt += 1
print(cnt)`
            },
            {
                number: 6,
                code: `students = []
for line in open('data/noseTouch.txt').readlines():
\ta, b = line.split()
\tstudents.append(int(b))
n = int(input())
res = 0
for cnt in students:
\tif cnt >= n:
\t\tres += 1
print(res)`
            },
            {
                number: 7,
                code: `i, j = map(int, input().split())
                with open('data/numA.txt', 'r') as f:
lines = f.read().split('\\n')
a = int(lines[i - 1])
with open('data/numB.txt', 'r') as f:
    lines = f.read().split('\\n')
b = int(lines[j - 1])
print(a + b)`
            },
            {
                number: 8,
                code: `n, m = map(int, input().split())
with open('data/numbers.txt', 'r') as f:
\tlines = list(map(int, f.read().split('\\n')[:-1]))
print(sum(lines[n - 1:m]))`
            },
            {
                number: 9,
                code: `s, n = input(), int(input())
print(*[s[i:i + n] for i in range(len(s) - n + 1)], sep='\\n')`
            },
            {
                number: 10,
                code: `s, n = input(), int(input())
dic = {}
for i in range(len(s) - n + 1):
\tgram = s[i:i + n]
\tdic[gram] = dic.get(gram, 0) + 1
for key, value in sorted(dic.items()):
\tprint(key, value)`
            },
            {
                number: 11,
                code: `s, n = input(), int(input())
dic = {}
for i in range(len(s) - n + 1):
\tgram = s[i:i+n]
\tdic[gram] = dic.get(gram, 0) + 1
print(sorted(dic.items(), key=lambda x:(-x[1], x[0]))[0][0])`
            },
            {
                number: 12,
                code: `s, n = input().split(), int(input())
grams = list(zip(*[s[i:] for i in range(n)]))
print(*[' '.join(idx) for idx in grams], sep='\\n')`
            },
            {
                number: 13,
                code: `a, b, n = input(), input(), int(input())
grams_a = set(zip(*[a[i:] for i in range(n)]))
grams_b = set(zip(*[b[i:] for i in range(n)]))
both = sorted(list(grams_a & grams_b))
if both:
\tfor i in both:
\t\tprint(*i, sep='')
else:
\tprint("NONE")`
            },
            {
                number: 14,
                code: `def is_palindrome(word):
\tfor i in range(len(word) // 2):
\t\tif word[i] != word[-(i + 1)]:
\t\t\treturn False
\treturn True

with open('data/words.txt', 'r') as f:
\tarr = f.read().split('\\n')
n, m = map(int, input().split())
palin = [idx for idx in arr[n - 1:m] if is_palindrome(idx)]
if palin:
\tprint(*palin, sep='\\n')
else:
\tprint("NONE")`
            },
            {
                number: 15,
                code: `def solution(a, b):
\treturn a + b`
            },
            {
                number: 16,
                code: `def solution(name):
\tprint(f"안녕, {name}!")`
            },
            {
                number: 17,
                code: `def solution(lang):
\tif lang == "Korean":
\t\tprint("안녕하세요!")
\telif lang == "English":
\t\tprint("Hello!")
\telif lang == "Japanese":
\t\tprint("こんにちは!")
\telse:
\t\tprint("???")`
            },
            {
                number: 18,
                code: `def solution(n):
\treturn (n // 2) * (n // 2 + 1)`
            },
            {
                number: 19,
                code: `def solution(a, b):
\treturn a + b, a - b, a * b, a // b`
            },
            {
                number: 20,
                code: `def solution(s):
\treturn s[::-1]`
            },
            {
                number: 21,
                code: `def solution(n):
\tfor i in range(n):
\t\tprint('*' * (i * 2 + 1))`
            },
            {
                number: 22,
                code: `def is_prime(num):
\tn = num
\ti = 2
\twhile n > 1:
\t\tif i == num:
\t\t\treturn True
\t\telif i == n:
\t\t\treturn False
\t\t
\t\tif n / i == n // i:
\t\t\tn //= i
\t\t\ti = 2
\t\telse:
\t\t\ti += 1

def solution(a, b):
\tans = 0
\tfor i in range(a, b + 1):
\t\tif is_prime(i):
\t\t\tans += 1
\treturn ans`
            },
            {
                number: 23,
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
\tprice = get_total(*[menu[key] * value for key, value in order.items()])
\tdiscounted = get_discount(price, discount_rate)
\tprint(f"손님: {name}")
\tprint("---")
\tprint(f"합계: {price}원")
\tprint(f"할인({discount_rate}%): -{discounted}원")
\tprint(f"최종: {price - discounted}원")`
            }
        ]
    }
);
