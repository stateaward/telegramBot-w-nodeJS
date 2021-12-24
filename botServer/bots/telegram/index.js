// API KEY 값 import
const { token, chatId } = require('../../config/telegram.json');
// telegram Bot 선언
const TelegramBot = require('node-telegram-bot-api');

// 텔레그램 봇을 생성하고, polling 방식으로 메세지를 가져옴
const bot = new TelegramBot(token, { polling: true });

function start() {
   // '/echo' 라는 명령어가 오면, 로직 수행 후 => 따라 말한다.
   bot.onText(/\/echo (.+)/, (msg, match) => {
      // 'msg' : 텔레그램으로 부터 수신한 메세지
      // 'match' : 정규식을 실행한 결과

      const chatId = msg.chat.id;
      const resp = '따라하기 : ' + match[1];

      bot.sendMessage(chatId, resp);
   });

   bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      goInterval();

      bot.sendMessage(chatId, '인터벌을 실행합니다.');
   });

   bot.onText(/\/stop/, (msg) => {
      const chatId = msg.chat.id;
      stopInterval();

      bot.sendMessage(chatId, '인터벌을 정지합니다.');
   });

   // .on('message')을 통해 bot이 어떤 메세지든 수신하도록 해줌
   bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      console.log(chatId);
      // send a message to the chat acknowledging receipt of their message
      bot.sendMessage(chatId, '메세지 수신 완료!');
   });
}

function sendMessage(msg) {
   bot.sendMessage(chatId, msg);
}

var isStop = false;

var interval = setInterval(() => {
   if (!isStop) {
      let today = new Date();
      let month = today.getMonth() + 1; // 월
      let date = today.getDate(); // 날짜
      let hours = today.getHours(); // 시
      let minutes = today.getMinutes(); // 분
      let seconds = today.getSeconds(); // 초

      var now = month + '/' + date + '  ' + hours + ':' + minutes + ':' + seconds;
      console.log('실행 :  ' + now);

      sendMessage(now + '🥰');
   } else {
      console.log('정지');
      clearInterval(interval);
   }
}, 30000);

function goInterval() {
   isStop = false;
}

function stopInterval() {
   isStop = true;
}

module.exports = {
   start: start,
   sendMessage: sendMessage,
   interval: interval,
};
