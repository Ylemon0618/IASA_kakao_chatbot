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
                number: 1,
                code: `try:
	a, b = map(int, input().split())
	print(a / b)
except ValueError:
	print("정수만 입력 가능합니다.")
except ZeroDivisionError:
	print("0으로 나눌 수 없습니다.")`
            },
            {
                number: 2,
                code: `arr = list(map(int, input().split()))
for _ in range(int(input())):
	try:
		print(arr[int(input())])
	except IndexError:
		print("인덱스 범위를 벗어났습니다.")`
            },
            {
                number: 3,
                code: `class InvalidAgeError(Exception):
	def __init__(self, age):
		super().__init__(f"InvalidAgeError: {age}는 유효하지 않은 나이입니다.")

for _ in range(int(input())):
	age = int(input())
	try:
		assert 0 <= age <= 150, InvalidAgeError(age)
		print(f"OK: {age}")
	except Exception as e:
		print(e)`
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
