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
                code: `class Note:
\tdef __init__(self):
\t\tself.content = ''

\tdef write_content(self, content):
\t\tself.content += content

\tdef remove_content(self):
\t\tself.content = ''

\tdef __str__(self):
\t\treturn self.content

class Notebook:
\tdef __init__(self, title):
\t\tself.title = title
\t\tself.page_number = 0
\t\tself.notes = {}

\tdef add_note(self, note):
\t\tif self.page_number == 300:
\t\t\tprint("더 이상 노트를 추가할 수 없습니다.")
\t\telse:
\t\t\tself.page_number += 1
\t\t\tself.notes[self.page_number] = note`
            },
            {
                number: 2,
                code: `from abc import *
class Post(ABC):
\ttotal_posts = 0

\tdef __init__(self, author):
\t\tself.author = author
\t\tPost.total_posts += 1

\t@abstractmethod
\tdef preview(self):
\t\tpass

\t@classmethod
\tdef count(cls):
\t\treturn cls.total_posts

\t@staticmethod
\tdef is_valid_tag(tag):
\t\treturn tag.startswith('#') and len(tag) >= 

class TextPost(Post):
\tdef __init__(self, author, text):
\t\tsuper().__init__(author)
\t\tself.text = text

\tdef preview(self):
\t\treturn f"[글] {self.author}: {self.text[:10]}..."

class PhotoPost(Post):
\tdef __init__(self, author, photo_count):
\t\tsuper().__init__(author)
\t\tself.photo_count = photo_count

\tdef preview(self):
\t\treturn f"[사진] {self.author}: 사진 {self.photo_count}장"`
            },
        ]
    }
);
