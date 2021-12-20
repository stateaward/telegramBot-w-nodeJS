# Node.js + express으로 telegram Bot 만들기

## 인트로

프론트 개발자이지만 `telegram Bot`을 사용하려면 백엔드를 구성해야 한다..
사실 맘같아선 프론트 서버에다가 텔레그램 봇을 올리고 싶은데, 보안적인 문제도 있고 24시간 돌아가며 대응해야 하기 때문에 그 역할을 하는지도 잘 모르겠다..

> 정말 네트워크, 서버, ... 백엔드의 영역은 너~어무 어렵다..

## 간단한 개념 정리

> 간단하게 알아본 내용을 정리했다. 잘못된 내용은 지적해주시면 빠르게 고치겠다.

-  **NodeJS**

   -  `node.JS` 는 `javascript` 를 활용한 "서버"이다.
   -  `javascript`는 브라우저에서만 사용(런타임) 할 수 있는 언어였다.
   -  하지만 `node.js` 는 그 한계를 극복하여, 브라우저 외의 런타임(구동 환경)을 가능하게 한다.
   -  ~~뭐라는거지~~.. 정확한 사실은 따로 찾아보길 권장한다.

-  **Express**

   -  `nodejs`를 위한 웹 프레임워크 중 하나

   -  `nodejs`로 웹 서버를 구성하게 되면, `라우팅`이며 `세션 관리`며 이래저래 많은 것들을 다 짜야한다.
      하지만, `express`를 사용하면 간단하게 웹 서버를 구축하도록 도와준다.
      -  예를 들면, 프론트에서 라우팅을 만들려면 `js`를 통해 신나게 만들어야 하지만
         `vue`를 사용하면 `vue-route`를 사용하여 손쉽게 `SPA`를 만들도록 도와준다.
   -  **express-generator**란?
      -  `vue create [project]` 혹은 `create-react-app` 처럼 기본 셋팅을 만들어주는 도구
      -  잘 만들어진 셋팅 환경을 사용하는 것

## 환경 셋팅하기

### 백엔드 서버 구성하기

> 🗄 IDE : VSCode
> 🗄 F/W : node.js + express
>
> npm, yarn 등의 기초 셋팅은 완료된 상태입니다.

1. `express-generator` 글로벌 설치
   -  `npm install -g express-generator`
   -  `express --version`을 통해 설치 확인
2. `express --view=pug [폴더명]` 으로 폴더 생성
3. `cd [폴더명]` -> `npm install` 으로 패키지 설치 진행

4. 아래 두 방법 중 하나로 실행
   -  `DEBUG=botserver:* npm start`
   -  `npm start`
5. http://localhost:3000 로 접속해보기

### 텔레그램 봇 생성

1. telegram 앱에서 `BotFather` 찾기
2. `/newBot` 으로 새로운 봇 생성하기
3. bot의 `name` 지정하기 `🙋‍♂️ 채팅방에서 보이는 이름`
4. bot의 `username` 지정하기 `🙋‍♂️ @username 형태의 아이디`
   -  사용된 적이 없는, 고유한 `username` 을 지정한다.
   -  username의 끝은 항상 `bot`, `Bot`으로 끝나야 한다.
5. 생성 완료되었고, `token` 이 발급되었다. \*해당 토큰이 곧 API_KEY 이다.

#### chat_id 확인하기 (1:1 대화)

1. 위의 채팅방에서 `t.me/nodeJS_w_bot` 부분을 클릭하여 대화를 시작한다.
2. 그 후 아무 메시지를 작성해서, 대화하려는 `chat id`을 알아낸다. (그룹방도 동일)
3. `https://api.telegram.org/bot{TOKEN}/getUpdates`을 URL에 치기
4. 대화하는 유저의 채팅 ID가 표기된다.
5. 해당 `chat.id` 를 활용하여 해당 id의 유저와 대화를 할 수 있다.

### node.js와 텔레그램 봇 연동하기

1. `npm i node-telegram-bot-api --save` 모듈 설치하기

2. telegram` token`과 `chatId` 를 `telegram.json`혹은 `.env` 환경변수로 저장하기

   > `.config/telegram.json`으로 생성

3. `.gitignore`에 위 파일을 추가하여 git 업로드 방지하기

4. telegram 봇을 설정할 `./bots/telegram/index.js` 파일 생성하기

5. ```javascript
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

      // .on('message')을 통해 bot이 어떤 메세지든 수신하도록 해줌
      bot.on('message', (msg) => {
         const chatId = msg.chat.id;
         console.log(chatId);
         // send a message to the chat acknowledging receipt of their message
         bot.sendMessage(chatId, '메세지 수신 완료!');
      });
   }

   module.exports = {
      start: start,
   };
   ```

   -  `const { token, chatId } = require('../../config/telegram.json');` 으로 따로 저장한 변수 설정 파일 불러오기

   -  `const TelegramBot = require('node-telegram-bot-api');` 모듈 import

   -  `function start() {...}`의 형태로 메소드를 모듈화 하여 선언

      > 레퍼런스 참고

6. `./bin/www` 파일에서 `index.js`에 선언한 텔레그램 봇 `start` 모듈 실행하기

   > 서버가 실행될 때, 자동으로 봇이 실행되도록 설정하는 부분

   ```javascript
   /**
    * Module dependencies.
    */

   var app = require('../app');
   var debug = require('debug')('botserver:server');
   var http = require('http');
   var telegramBot = require('../bots/telegram');

   /**
    * telegramBot start
    */
   telegramBot.start();

   ...
   ```

## 여러가지 생각들

-  텔레그램 봇의 메소드는 크게 세가지 (물론 더 있겠지..)
   -  `bot.on('msg', [함수])` : 어떤 형태든 메세지를 듣는, 수신하는 함수
   -  `bot.onText('match', [함수(param)])` : `'match'` 의 메세지를 수신하여 비교 및 실행하는 함수
   -  `bot.sendMessage(chatId, 'msg')` chatId의 유저에게 msg를 발송하는 함수
-  `./bin/www` 의 역할은 무엇인가?
   -  `app.js`와 `./bin/www` 중에서 최초로 실행되는, 즉 자바로 치면 `main method`는 무엇인가?
   -  `app.js` 라면, 왜 `start()` 함수를 `www`에서 선언했는가?
-  `start()` / `module.exports = {...}` 처럼 모듈화를 하면, 재사용성 및 직관성이 좋아진다.
-  `setInterval()`함수를 이용하여 서버 시작 시 30초마다 메세지가 발송되는 함수를 작성했는데, 정상 동작한다!
   최초에 기획한 자동화 챗봇을 구현할 수 있겠다.
-  firebase의 cloud funtion 없이도 시간별로 특정 기능을 수행하는 기능을 구현할 수 있겠다!
   (비용 절감)
