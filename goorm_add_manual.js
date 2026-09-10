require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Goorm = require("./models/Goorm");

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const latestGoorm = await Goorm.findOne({ week: { $exists: true } }).sort({ week: -1 });
        const nextWeek = latestGoorm?.week ? latestGoorm.week + 1 : 1;

        console.log(`생성될 주차(week): ${nextWeek}`);

        const inserted = await Goorm.create({
            week: nextWeek,
            problems: [
                {
                    number: 1,
                    code: `class BankAccount:
\tdef __init__(self, compound, simple, current):
\t\tself.compound = compound
\t\tself.simple = simple
\t\tself.current = current

\tdef deposit(self, amount):
\t\tself.current += amount

\tdef withdraw(self, amount):
\t\tif amount > self.current:
\t\t\tprint("출금할 수 없습니다")
\t\telse:
\t\t\tself.current -= amount

\tdef print_expected(self, years):
\t\tcompound_new = BankAccount.calculator(self.compound, 0.03, years, True)
\t\tsimple_new = BankAccount.calculator(self.simple, 0.05, years, False)

\t\tprint(float(compound_new + simple_new + self.current))

\t@staticmethod
\tdef calculator(amount, rate, years, is_compound):
\t\tif is_compound:
\t\t\treturn amount * (1 + rate) ** years
\t\telse:
\t\t\treturn amount + years * rate * amount


a, b, c, d, e, f = map(int, input().split())
bank = BankAccount(a, b, c)
bank.deposit(d)
bank.withdraw(e)
bank.print_expected(f)`
                },
                {
                    number: 2,
                    code: `class Island:
    def __init__(self, idx):
        self.idx = idx
        self.bridges = []
        self.treasure = 0

    def add_bridge(self, bridge):
        self.bridges.append(bridge)

    def move(self, visited):
        for bridge in self.bridges:
            dest, cost = bridge.get_dest(self)
            if dest.idx not in visited:
                return dest, cost
        return None, None


class Bridge:
    def __init__(self, cost, *island):
        self.island = island
        self.cost = cost

    def get_dest(self, curr_island):
        dest = self.island[0] if self.island[0] != curr_island else self.island[1]
        return dest, self.cost


def simulate(n, k, islands):
    p = [islands[1].treasure] if islands[1].treasure else []
    q = [(islands[1], p, [1], k)]
    res = []

    while q:
        cur, passed, visited, coin = q.pop()
        passed, visited = passed[:], visited[:]

        if cur.idx == n:
            res.append(coin)
            continue

        nxt, cost = cur.move(visited)
        if not nxt:
            continue

        if coin < cost:
            if not passed:
                continue

            for i in range(len(passed)):
                new_passed = passed[:]
                new_coin = new_passed.pop(i)
                q.append((cur, new_passed, visited, coin + new_coin))
        else:
            visited.append(nxt.idx)
            if nxt.treasure:
                passed.append(nxt.treasure)
            q.append((nxt, passed, visited, coin - cost))

    return min(res) if res else -1


def get_input():
    n = int(input())
    m, k = map(int, input().split())

    islands = []
    for i in range(n + 1):
        islands.append(Island(i))

    for _ in range(n - 1):
        a, b, c = map(int, input().split())
        br = Bridge(c, islands[a], islands[b])
        islands[a].add_bridge(br)
        islands[b].add_bridge(br)

    for _ in range(m):
        d, g = map(int, input().split())
        islands[d].treasure = g

    return n, m, k, islands


def main():
    n, m, k, islands = get_input()

    res = simulate(n, k, islands)

    print(res)


if __name__ == '__main__':
    main()`
                },
                {
                    number: 3,
                    code: `class Medicine:
\tdef __init__(self, name, max_count):
\t\tself.count = 0
\t\tself.name = name
\t\tself.max_count = max_count

\tdef take(self):
\t\tself.count += 1
\t\tprint(f"\\n{self.name}을(를) 복용했습니다.")

\t\tif self.count == self.max_count:
\t\t\tprint("오늘 복용 완료")
\t\telse:
\t\t\tprint(f"남은 복용 횟수: {self.max_count - self.count} 회")

name, max_count = input(), int(input())
medicine = Medicine(name, max_count)

for _ in range(max_count):
\tmedicine.take()`
                },
                {
                    number: 4,
                    code: `class Book:
\tdef __init__(self, title, stock):
\t\tself.title = title
\t\tself.__stock = stock

\tdef restock(self, amount):
\t\tself.__stock += amount

\tdef sell(self, amount):
\t\tif self.__stock >= amount:
\t\t\tself.__stock -= amount
\t\t\treturn True
\t\treturn False

\tdef get_stock(self):
\t\treturn self.__stock

class EBook(Book):
\tdef __init__(self, title):
\t\tsuper().__init__(title, 999999)

\tdef sell(self, amount):
\t\treturn True

title, stock = input().rsplit(' ', 1)
book = Book(title, int(stock))

n = int(input())
for _ in range(n):
    command, amount = input().split()
    amount = int(amount)
    if command == "RESTOCK":
        book.restock(amount)
    elif command == "SELL":
        print("판매 성공" if book.sell(amount) else "판매 실패")

print(f"최종 재고: {book.get_stock()}")`
                },
                {
                    number: 5,
                    code: `class Explorer:
\tdef __init__(self, name, battery):
\t\tself.name = name
\t\tself.battery = battery

\tdef status(self):
\t\treturn "탐사 장비가 정상 작동합니다."

class Submarine(Explorer):
\tdef __init__(self, name, battery, depth):
\t\tsuper().__init__(name, battery)
\t\tself.depth = depth

\tdef dive(self):
\t\treturn f"{depth}m까지 잠수합니다."`
                },
                {
                    number: 6,
                    code: `class Person:
\tdef __init__(self, name):
\t\tself.name = name
\t\tself.ac_hours = 0

\tdef turn_on_ac(self, hours):
\t\tself.ac_hours += hours

class Household(Person):
\trate_per_hour = 1000

\tdef __init__(self, name):
\t\tsuper().__init__(name)
\t\tself.family = []

\tdef add_family(self, person):
\t\tself.family.append(person)

\tdef calculate_bill(self):
\t\thours = self.ac_hours
\t\tfor person in self.family:
\t\t\thours += person.ac_hours
\t\treturn hours * Household.rate_per_hour`
                },
                {
                    number: 7,
                    code: `class Character:
\tdef __init__(self, name):
\t\tself.name = name
\t\tself.hp = 100

\tdef attacked(self, amount):
\t\tself.hp = max(0, self.hp - amount)

\tdef heal(self, amount):
\t\tself.hp = min(100, self.hp + amount)

c, n = map(int, input().split())
characters = {name:Character(name) for name in input().split()}

for _ in range(n):
\tname, event, amount = input().split()
\tif event == 'A':
\t\tcharacters[name].attacked(int(amount))
\telse:
\t\tcharacters[name].heal(int(amount))

dead = []
for key, value in characters.items():
\tif value.hp == 0:
\t\tdead.append(key)
if dead:
\tprint(*sorted(dead), sep='\\n')
else:
\tprint('Alive')
`
                },
                {
                    number: 8,
                    code: `class Item:
\tdef __init__(self, parent, name):
\t\tself.parent = parent
\t\tself.name = name

\tdef up(self):
\t\treturn self.parent if self.parent else self

class Folder(Item):
\tdef __init__(self, parent, name):
\t\tsuper().__init__(parent, name)
\t\tself.folders = []
\t\tself.files = []

\tdef makefolder(self, name):
\t\tself.folders.append(Folder(self, name))

\tdef makefile(self, name, size):
\t\tself.files.append(File(self, name, int(size)))

\tdef down(self, name):
\t\tfor i in self.folders:
\t\t\tif i.name == name:
\t\t\t\treturn i

\tdef printsize(self):
\t\tq, size = [self], 0
\t\twhile q:
\t\t\tnow = q.pop()
\t\t\tsize += sum([i.size for i in now.files])
\t\t\tq += now.folders
\t\tprint(size)

\tdef printcount(self):
\t\tq, count = [self], 0
\t\twhile q:
\t\t\tnow = q.pop()
\t\t\tcount += len(now.files)
\t\t\tq += now.folders
\t\tprint(count)

class File(Item):
\tdef __init__(self, parent, name, size):
\t\tsuper().__init__(parent, name)
\t\tself.size = size

m = int(input())
root = Folder(None, "root")
now = root

for _ in range(m):
\tdata = input().split()
\tcommand, args = data[0], data[1:]

\tif command == "makefolder":
\t\tnow.makefolder(*args)
\telif command == "makefile":
\t\tnow.makefile(*args)
\telif command == "down":
\t\tnow = now.down(*args)
\telif command == "up":
\t\tnow = now.up(*args)
\telif command == "printsize":
\t\tnow.printsize()
\telif command == "printcount":
\t\tnow.printcount()`
                },
            ]
        });

        if (inserted) {
            console.log("Answer successfully inserted");
        }
    } catch (err) {
        console.error("Error occurred:", err.message);
    } finally {
        process.exit();
    }
}

run();
