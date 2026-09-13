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
                number: 20,
                code: `class DeliveryRider:
\tdef __init__(self, rider_name):
\t\tself.rider_name = rider_name
\t\tself.rating = 4.5

\tdef accept_order(self, order_name):
\t\treturn f"{self.rider_name}님이 {order_name} 주문을 수락했습니다."

class SuspendedRider(DeliveryRider):
\tdef __init__(self, rider_name):
\t\tsuper().__init__(rider_name)
\t\tself.rating = 2.0

\tdef accept_order(self, order_name):
\t\treturn f"정지: {self.rider_name}님은 평점이 낮아 주문을 수락할 수 없습니다."

class PremiumRider(DeliveryRider):
\tdef __init__(self, rider_name, vehicle_type):
\t\tsuper().__init__(rider_name)
\t\tself.rating = 4.9
\t\tself.vehicle_type = vehicle_type

\tdef accept_order(self, order_name):
\t\treturn f"[{self.vehicle_type} 프리미엄 라이더] {self.rider_name}님이 {order_name} 주문을 수락했습니다."`
            },
            {
                number: 21,
                code: `class Poke:
\tdef __init__(self, name, Type):
\t\tself.name = name
\t\tself.Type = Type

\tdef print_data(self):
\t\tprint(f"이름: {self.name}, 타입: {self.Type}")

pokemon = Poke(input(), input())
pokemon.print_data()`
            },
            {
                number: 22,
                code: `class GradeAnalyzer:
\tdef __init__(self, grades):
\t\tself.grades = grades

\tdef get_period(self, grade):
\t\ttemp = []
\t\tfor i in range(len(self.grades)):
\t\t\tif self.grades[i] == grade:
\t\t\t\ttemp.append(i)
\t\tif len(temp) <= 1:
\t\t\treturn 0
\t\treturn temp[-1] - temp[0]

n = int(input())
grade = GradeAnalyzer(input())
periods = [(i, grade.get_period(i)) for i in ['A', 'B', 'C', 'D', 'F']]
periods.sort(key=lambda x: (-x[1], x[0]))
print(*periods[0])`
            },
            {
                number: 23,
                code: `class DateCourse:
\tdef __init__(self, name1, name2, love):
\t\tself.name1 = name1
\t\tself.name2 = name2
\t\tself.love = love

\tdef watch_movie(self, activity, point):
\t\tself.love += point
\t\tprint(f"{activity} 영화를 함께 보았습니다!")

\tdef eat_dinner(self, activity, point):
\t\tself.love += point
\t\tprint(f"{self.name1}와(과) {self.name2}이(가) {activity}을(를) 맛있게 먹었습니다.")

\tdef check_love(self):
\t\tprint(f"현재 호감도: {self.love}점")`
            },
            {
                number: 24,
                code: `class epl:
\tdef __init__(self, rank):
\t\tself.rank = rank
\t\tself.result_win = "not yet"
\t\tself.result_ticket = ''

\tdef result(self):
\t\tif self.rank == 1:
\t\t\tself.result_win = "premier league champions"

\t\tif 1 <= self.rank <= 4:
\t\t\tself.result_ticket = "champions league"
\t\telif self.rank == 5:
\t\t\tself.result_ticket = "europa league"
\t\telif 6 <= self.rank <= 17:
\t\t\tself.result_ticket = "premier league"
\t\telse:
\t\t\tself.result_ticket = "relegration"

\tdef print_info(self):
\t\tprint(self.result_win)
\t\tprint(self.result_ticket)`
            },
            {
                number: 25,
                code: `class Player:
\tdef __init__(self, name, back_number):
\t\tself.name = name
\t\tself.back_number = back_number

\tdef print_info(self):
\t\tprint(f"이름: {self.name}, 등번호: {self.back_number}")

class Pitcher(Player):
\tdef __init__(self, name, back_number, earned_runs, innings):
\t\tself.name = name
\t\tself.back_number = back_number
\t\tself.earned_runs = earned_runs
\t\tself.innings = innings

\tdef print_info(self):
\t\tprint(f"이름: {self.name}, 등번호: {self.back_number}, 평균자책점: {self.earned_runs * 9 / self.innings:.2f}")`
            },
            {
                number: 26,
                code: `class Station:
\tdef __init__(self, name, d1, d2, diesel, gasoline):
\t\tself.name = name
\t\tself.d1 = d1
\t\tself.d2 = d2
\t\tself.diesel = diesel
\t\tself.gasoline = gasoline

\tdef max_oiling(self, budget):
\t\treturn (budget / self.diesel, budget / self.gasoline)

class Car:
\tdef __init__(self, name, fuel, efficiency):
\t\tself.name = name
\t\tself.fuel = fuel
\t\tself.efficiency = efficiency

\tdef max_distance(self):
\t\treturn self.fuel * self.efficiency

\tdef can_arrive_station(self, station):
\t\tif station.d1 <= self.max_distance():
\t\t\treturn self.fuel - station.d1 / self.efficiency
\t\treturn False

class DieselCar(Car):
\tdef __init__(self, name, fuel, efficiency):
\t\tsuper().__init__(name, fuel, efficiency)

\tdef can_arrive_destination(self, station, budget):
\t\toil_left = self.can_arrive_station(station)
\t\tif oil_left is False:
\t\t\treturn False

\t\toil_inneed = station.d2 / self.efficiency
\t\toil_refuel = oil_inneed - oil_left
\t\tif oil_refuel <= 0:
\t\t\treturn 0
\t\tif oil_refuel > station.max_oiling(budget)[0]:
\t\t\treturn False
\t\treturn oil_refuel * station.diesel

class GasolineCar(Car):
\tdef __init__(self, name, fuel, efficiency):
\t\tsuper().__init__(name, fuel, efficiency)

\tdef can_arrive_destination(self, station, budget):
\t\toil_left = self.can_arrive_station(station)
\t\tif oil_left is False:
\t\t\treturn False

\t\toil_inneed = station.d2 / self.efficiency
\t\toil_refuel = oil_inneed - oil_left
\t\tif oil_refuel <= 0:
\t\t\treturn 0
\t\tif oil_refuel > station.max_oiling(budget)[1]:
\t\t\treturn False
\t\treturn oil_refuel * station.gasoline

def best_route(car, stations, budget):
\tans, able_station = -1, None
\tfor station in stations:
\t\toil_cost = car.can_arrive_destination(station, budget)
\t\tif oil_cost is not False and ans < budget - oil_cost:
\t\t\tans = budget - oil_cost
\t\t\table_station = station

\tif able_station:
\t\treturn f"{able_station.name} {ans:.2f}원 남음"
\treturn "따릉이 타기"

# 입출력처리 코드
budget = int(input())
N, M = map(int, input().split())

cars, order = {}, []
for _ in range(N):
\tname, fuel_type, fuel, eff = input().split()
\tcls = DieselCar if fuel_type == "경유" else GasolineCar
\tcars[name] = cls(name, int(fuel), int(eff))
\torder.append(name)

stations, by_name = [], {}
for _ in range(M):
\tname, d1, d2, diesel, gasoline = input().split()
\tst = Station(name, int(d1), int(d2), int(diesel), int(gasoline))
\tstations.append(st)
\tby_name[name] = st

for _ in range(int(input())):
\tdata = input().split()
\tquestion = ' '.join(data[1:])

\tif question == "최대 이동거리":
\t\tcar = cars[data[0]]
\t\tprint(f"{car.name} 최대 이동거리: {car.max_distance():.2f}km")
\telif question == "최대 주유량":
\t\tstation = by_name[data[0]]
\t\tdiesel, gasoline = station.max_oiling(budget)
\t\tprint(f"{station.name} 최대 주유량: 경유 {diesel:.2f}L / 휘발유 {gasoline:.2f}L")
\telif question.endswith("주유소까지"):
\t\tcar = cars[data[0]]
\t\tstation = by_name[data[1]]
\t\toil_left = car.can_arrive_station(station)
\t\tif oil_left is False:
\t\t\tprint(f"{car.name} -> {station.name}: 도달 불가")
\t\telse:
\t\t\tprint(f"{car.name} -> {station.name}: 남은 기름 {oil_left:.2f}L")
\telse:
\t\tcar = cars[data[0]]
\t\tstation = by_name[data[1]]
\t\tcost = car.can_arrive_destination(station, budget)
\t\tif cost is False:
\t\t\tprint(f"{car.name} -> {station.name} -> 도착지: 불가")
\t\telse:
\t\t\tprint(f"{car.name} -> {station.name} -> 도착지: {cost:.2f}원")

print(f"[예산 {budget}원] 주유 계획")
for name in order:
\tcar = cars[name]
\tprint(f"{car.name}: {best_route(car, stations, budget)}")`
            },
            {
                number: 27,
                code: `class Book:
\tdef __init__(self, title, author):
\t\tself.title = title
\t\tself.author = author
\t\tself.is_borrowed = False

\tdef borrow(self):
\t\tif self.is_borrowed:
\t\t\treturn "이미 대출 중입니다."
\t\tself.is_borrowed = True
\t\treturn "대출되었습니다."

\tdef return_book(self):
\t\tif not self.is_borrowed:
\t\t\treturn "대출되지 않은 책입니다."
\t\tself.is_borrowed = False
\t\treturn "반납되었습니다."

\tdef get_info(self):
\t\treturn f"{self.title} - {self.author} ({'대출중' if self.is_borrowed else '대출가능'})"`
            },
            {
                number: 28,
                code: `class VIPMember(Member):
\tdef __init__(self, name, current_books, vip_days):
\t\tsuper().__init__(name, current_books)
\t\tself.vip_days = vip_days

\tdef vip_borrow(self, amount):
\t\tlimit = 5 + self.vip_days * 10
\t\tif self.current_books + amount <= limit:
\t\t\tself.current_books += amount
\t\t\treturn f"VIP 대출 성공. 총 {self.current_books}권 대출 중입니다."
\t\telse:
\t\t\treturn "한도 초과로 대출할 수 없습니다."`
            },
            {
                number: 29,
                code: `class Character:
\tmax_level = 99
\t
\tdef __init__(self, name, level):
\t\tself.name = name
\t\tself.level = level

\t@classmethod
\tdef change_max_level(cls, new_max):
\t\tcls.max_level = new_max

\t@staticmethod
\tdef is_valid_name(name):
\t\treturn len(name) >= 2

\tdef attack(self):
\t\treturn f"{self.name}이(가) 일반 공격을 합니다!"

class Mage(Character):
\tdef __init__(self, name, level, mana):
\t\tsuper().__init__(name, level)
\t\tself.mana = mana

\tdef attack(self):
\t\treturn f"{self.name}이(가) 마법 공격을 합니다! (소모 마나: {self.mana})"`
            },
            {
                number: 30,
                code: `class bnd_member:
\tdef __init__(self, name, nicknames):
\t\tself.name = name
\t\tself.nicknames = nicknames

\tdef has_nickname(self, nickname):
\t\treturn nickname in self.nicknames

class bnd_directory:
\tdef __init__(self):
\t\tself.members = []

\tdef add_member(self, member):
\t\tself.members.append(member)

BOYNEXTDOOR = bnd_directory()
member_data = {
\t"운학": ["우나기", "눈사람"],
\t"명재현": ["명뇨리따", "명명이"],
\t"리우": ["대상혁", "애햄이", "두부 모서리"],
\t"이한": ["제로제로이하나", "물고기 아빠"],
\t"성호": ["예삐", "막기대라고 넓혀놓은 어깨 주인"],
\t"태산": ["간ZI폭풍 GIANT MOUNTAIN", "부힛부힛사르르rrr탯냥이"]
}
for key, value in member_data.items():
\tnew_member = bnd_member(key, value)
\tBOYNEXTDOOR.add_member(new_member)

nick = input()
for member in BOYNEXTDOOR.members:
\tif member.has_nickname(nick):
\t\tprint(f"{nick} -> {member.name}의 별명입니다.")
\t\tbreak
else:
\tprint("등록되지 않은 별명입니다.")
`
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
