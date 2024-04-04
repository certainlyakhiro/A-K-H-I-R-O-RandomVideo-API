import fs from "fs";
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const apiKeys = ["AkhiroAPI"];
const secret = "ruicoal";

const loadMemory = () => JSON.parse(fs.readFileSync(path.join(__dirname, "videos.json"), "utf8"));
const memory = loadMemory();

function needApiKey(req, res, next) {
    if (req.path.startsWith('/randomVideo')) {
        const apiKey = req.query.key;
        if (!apiKeys.includes(apiKey)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    next();
}

app.use(express.static(path.join(__dirname, 'RandomDB', 'system', 'web')));
app.use(needApiKey);
app.use(express.json());

app.get('/randomVideo', needApiKey, (req, res) => {
    const apiKey = req.query.key;
    if (!apiKeys.includes(apiKey)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const randomVideo = memory[Math.floor(Math.random() * memory.length)];
    const { title, url, category } = randomVideo;
    const responseData = { data: { title, url, category } };
    res.json(responseData);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'RandomDB', 'system', 'web.html')); 
});

app.get('/addVideo', (req, res) => {
    res.sendFile(path.join(__dirname, 'RandomDB', 'system', 'addVideo.html')); 
});

app.get('/json', (req, res) => {
    res.json(memory);
});

app.get('/api/addVideo', (req, res) => {
    const { title, url, category, secret: requestSecret } = req.query;
    if (requestSecret !== secret) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const newVideo = { title, url, category };
    memory.push(newVideo);
    fs.writeFile(path.join(__dirname, 'videos.json'), JSON.stringify(memory, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ message: 'Video added successfully' });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});