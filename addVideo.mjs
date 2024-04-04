import fs from "fs";
import readline from 'readline';
import path from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const __filename = path.basename(import.meta.url);
const __dirname = path.dirname(__filename);
const videosFilePath = path.join(__dirname, "videos.json");

function addVideo() {
  rl.question('Enter the title of the video: ', (title) => {
    rl.question('Enter the URL of the video: ', (url) => {
      rl.question('Enter the category of the video: ', (category) => {
        const newVideo = { title, url, category };
        const videosData = JSON.parse(fs.readFileSync(videosFilePath, "utf8"));
        videosData.push(newVideo);
        fs.writeFileSync(videosFilePath, JSON.stringify(videosData, null, 2));
        console.log('Video added successfully!');
        rl.close();
      });
    });
  });
}

addVideo();