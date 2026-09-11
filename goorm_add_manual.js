require('dotenv').config({quiet: true});
const mongoose = require('mongoose');
const Goorm = require("./models/Goorm");

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function run() {
    try {
        const problems = [
            {
                number: 9,
                code: `class SchoolBag:
\tdef __init__(self, items):
\t\tself.__items = items

\tdef check_item(self, item):
\t\tif item in self.__items:
\t\t\tself.__items.remove(item)
\t\t\tprint(f"{item} 챙겼습니다!")
\t\telse:
\t\t\tprint("이미 챙겼거나 없는 물건입니다.")

\tdef get_remaining(self):
\t\treturn self.__items

school_bag = SchoolBag(input().split())
for _ in range(int(input())):
\tschool_bag.check_item(input())
print(school_bag.get_remaining())`
            },
            {
                number: 10,
                code: `class Star:
\tdef __init__(self, name, magnitude, distance):
\t\tself.name = name
\t\tself.magnitude = magnitude
\t\tself.distance = distance

\tdef print_info(self):
\t\tprint(f"이름: {self.name}, 겉보기 등급: {self.magnitude}등급, 거리: {self.distance}pc")

n, m, d = input().split()
star = Star(n, float(m), float(d))
star.print_info()`
            },
            {
                number: 11,
                code: `class BasketballPlayer:
\tdef __init__(self, name):
\t\tself.name = name
\t\tself.__points = 0

\tdef score(self, points):
\t\tself.__points += points

\tdef get_points(self):
\t\treturn self.__points

name = input()
player = BasketballPlayer(name)
for _ in range(int(input())):
\tplayer.score(int(input()))

print(f"{player.name} 선수의 총 득점은 {player.get_points()}점입니다.")`
            },
            {
                number: 12,
                code: `class Hello:
\tdef __init__(self, name):
\t\tself.name = name

\tdef greet(self):
\t\tprint(f"{self.name}님, 안녕하세요!")`
            },
            {
                number: 13,
                code: `class Membership:
\ttotal_members = 0
\t
\tdef __init__(self, name):
\t\tself.name = name
\t\tself.__point = 0
\t\tself.scale = 1
\t\t
\t\tMembership.total_members += 1

\tdef add_point(self, amount):
\t\tself.__point += int(amount * self.scale)

\tdef get_point(self):
\t\treturn self.__point

\t@classmethod
\tdef get_total_members(cls):
\t\treturn cls.total_members

\tdef set_scale(self, scale):
\t\tself.scale = scale

class PremiumMember(Membership):
\tdef __init__(self, name):
\t\tsuper().__init__(name)
\t\tsuper().set_scale(1.5)`
            },
            {
                number: 14,
                code: `class Team:
\ttotal_team_goals = 0
\ttotal_team_assists = 0

\tdef __init__(self, name, goals, assists):
\t\tself.name = name
\t\tself.goals = goals
\t\tself.assists = assists
\t\t
\t\tTeam.total_team_goals += goals
\t\tTeam.total_team_assists += assists

players = []
for _ in range(int(input())):
\tname, goals, assists = input().split()
\tplayers.append(Team(name, int(goals), int(assists)))

print(Team.total_team_goals)
print(Team.total_team_assists)
print(Team.total_team_goals + Team.total_team_assists)`
            },
            {
                number: 15,
                code: `class Gem:
\tdef __init__(self, value, danger):
\t\tself.value = value
\t\tself.danger = danger

class Thief(Gem):
\tdef __init__(self, limit):
\t\tsuper().__init__(0, 0)
\t\tself.limit = limit

\tdef steal(self, gem):
\t\tif self.danger + gem.danger <= self.limit:
\t\t\tself.value += gem.value
\t\tself.danger += gem.danger

l, n = map(int, input().split())
thief = Thief(l)
for _ in range(n):
\tv, d = map(int, input().split())
\tgem = Gem(v, d)
\tthief.steal(gem)

print(thief.value)`
            },
            {
                number: 16,
                code: `class Player:
\tdef __init__(self, name, back_number):
\t\tself.name = name
\t\tself.back_number = back_number

\tdef print_info(self):
\t\tprint(f"{self.back_number}번 선수 {self.name}")

player = Player(input(), int(input()))
player.print_info()`
            },
            {
                number: 17,
                code: `class student:
\tdef __init__(self, name, english_score, science_score, math_score):
\t\tself.name = name
\t\tself.english_score = english_score
\t\tself.science_score = science_score
\t\tself.math_score = math_score

\tdef get_average(self):
\t\treturn (self.english_score + self.science_score + self.math_score) / 3

\tdef get_grade(self):
\t\taverage = self.get_average()
\t\tif average >= 90:
\t\t\treturn 'A'
\t\telif average >= 80:
\t\t\treturn 'C'
\t\telif average >= 70:
\t\t\treturn 'D'
\t\telif average >= 60:
\t\t\treturn 'X'
\t\telse:
\t\t\treturn '희중이 바보'

data = input().split()
name, scores = data[0], list(map(int, data[1:]))

s = student(name, *scores)
print(f"{s.name} {s.get_average()} {s.get_grade()}")`
            },
            {
                number: 18,
                code: `class BankAccount:
\tdef __init__(self, name, balance):
\t\tself.name = name
\t\tself.balance = balance

\tdef deposit(self, amount):
\t\tself.balance += amount

\tdef withdraw(self, amount):
\t\tself.balance -= amount

\tdef check(self):
\t\tprint(self.balance)

n, b = input().split()
bank = BankAccount(n, int(b))

for _ in range(int(input())):
\tdata = input().split()
\tif data[0] == 'deposit':
\t\tbank.deposit(int(data[1]))
\telif data[0] == 'withdraw':
\t\tbank.withdraw(int(data[1]))
\telse:
\t\tbank.check()`
            },
            {
                number: 19,
                code: `class Character:
\ttotal_characters = 0
\t
\tdef __init__(self, name, hp, gold):
\t\tself.name = name
\t\tself.hp = hp
\t\tself.__gold = gold
\t\tCharacter.total_characters += 1

\tdef get_gold(self):
\t\treturn self.__gold

\tdef add_gold(self, amount):
\t\tself.__gold += amount

\t@staticmethod
\tdef is_alive(hp):
\t\treturn hp > 0

\t@classmethod
\tdef get_total_count(cls):
\t\treturn cls.total_characters

class Wizard(Character):
\tdef __init__(self, name, hp, mp, gold):
\t\tsuper().__init__(name, hp, gold)
\t\tself.mp = mp

\tdef cast_spell(self):
\t\tprint(f"{self.name}이(가) 마법을 시전합니다! (남은 MP: {self.mp})")

data = input().split()
c = Wizard(data[0], *list(map(int, data[1:])))

c.cast_spell()
print(f"생존 여부: {c.is_alive(c.hp)}")
c.add_gold(500)
print(f"현재 소지금: {c.get_gold()} G")
print(f"생성된 총 캐릭터 수: {c.get_total_count()}명")`
            },
        ]

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        let command;
        rl.question('Insert new week(I) / Append existing week(A)', (answer) => {
            command = answer;
            rl.close();
        });

        if (command === 'I') {
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
        } else if (command === 'A') {
            rl.question('Enter week number: ', async (answer) => {
                const result = await Goorm.updateOne(
                    {week: answer},
                    {$push: {problems: problems}}
                );

                if (result.matchedCount === 0) {
                    console.log(`Unable to find week ${answer}`);
                    return false;
                }

                console.log(`Answer successfully appended`);
                return true;
            });
        }

    } catch (err) {
        console.error("Error occurred:", err.message);
    } finally {
        process.exit();
    }
}

run();
