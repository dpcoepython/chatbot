const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const { NlpManager } = require("node-nlp");
const { Chat } = require("./model/chats.model");
require("./config/db");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

var manager = new NlpManager({ languages: ["en"], ner: { useDuckling: true } });
app.use(express.static(__dirname));
//train the chatbot

const allchats = {};
const admins = [];
async function trainbot(manager) {
  manager.addDocument("en", "hello", "greetings.hello");
  manager.addDocument("en", "hi there", "greetings.hello");
  manager.addDocument("en", "hello", "greetings.hello");
  manager.addDocument("en", "howdy", "greetings.hello");
  manager.addDocument("en", "hiya", "greetings.hello");
  manager.addDocument("en", "hi-ya", "greetings.hello");
  manager.addDocument("en", "howdy-do", "greetings.hello");
  manager.addDocument("en", "aloha", "greetings.hello");
  manager.addDocument("en", "hey", "greetings.hello");

  manager.addDocument("en", "How are you", "user.asking");
  manager.addDocument("en", "How are you doing", "user.asking");
  manager.addDocument("en", "How are you doing today", "user.asking");

  manager.addDocument("en", "I'm fine", "user.replying");
  manager.addDocument("en", "I'm good", "user.replying");
  manager.addDocument("en", "I'm doing good", "user.replying");
  manager.addDocument("en", "I'm doing great", "user.replying");
  manager.addDocument("en", "I'm doing well", "user.replying");
  manager.addDocument("en", "I'm doing alright", "user.replying");

  manager.addDocument("en", "goodbye for now", "greetings.bye");
  manager.addDocument("en", "bye bye take care", "greetings.bye");
  manager.addDocument("en", "okay see you later", "greetings.bye");
  manager.addDocument("en", "bye for now", "greetings.bye");
  manager.addDocument("en", "i must go", "greetings.bye");

  manager.addDocument("en", "good day", "greetings.goodDay");
  manager.addDocument("en", "good night", "greetings.goodNight");
  manager.addDocument("en", "good morning", "greetings.goodMorning");
  manager.addDocument("en", "good evening", "greetings.goodevening");
  manager.addDocument("en", "good afternoon", "greetings.goodafternoon");

  // About Liiftsocial questions
  manager.addDocument("en", "what is liiftsocial", "about.liiftsocial");
  manager.addDocument("en", "what is liftsocial?", "about.liiftsocial");
  manager.addDocument("en", "liiftsocial", "about.liiftsocial");
  manager.addDocument("en", "liftsocial", "about.liiftsocial");
  manager.addDocument("en", "About", "about.liiftsocial");
  manager.addDocument(
    "en",
    "what can you tell me about liiftsocial.",
    "about.liiftsocial"
  );
  manager.addDocument(
    "en",
    "what can you tell me about liftsocial.",
    "about.liiftsocial"
  );
  manager.addDocument("en", "tell me about liiftsocial", "about.liiftsocial");
  manager.addDocument("en", "tell me about liftsocial", "about.liiftsocial");
  manager.addDocument("en", "what is this website for ?", "about.liiftsocial");
  //features questions
  manager.addDocument(
    "en",
    "what features do you offer",
    "features.liiftsocial"
  );
  manager.addDocument(
    "en",
    "what features do you provide",
    "features.liiftsocial"
  );
  manager.addDocument(
    "en",
    "what features do you have",
    "features.liiftsocial"
  );
  manager.addDocument(
    "en",
    "what features do you have available",
    "features.liiftsocial"
  );
  manager.addDocument("en", "features", "features.liiftsocial");

  //feature customize post questions
  manager.addDocument(
    "en",
    "how do I customize my post",
    "features.customizepost"
  );
  manager.addDocument("en", "customize post", "features.customizepost");
  manager.addDocument("en", "customize my post", "features.customizepost");
  manager.addDocument("en", "customize", "features.customizepost");
  manager.addDocument("en", "custompost", "features.customizepost");
  manager.addDocument("en", "custom", "features.customizepost");
  manager.addDocument("en", "postcustomize", "features.customizepost");
  manager.addDocument("en", "postcustom", "features.customizepost");
  manager.addDocument("en", "post customize", "features.customizepost");
  manager.addDocument("en", "post custom", "features.customizepost");

  //feature Bulk upload via Excel questions
  manager.addDocument(
    "en",
    "how do I bulk upload via excel",
    "features.bulkuploadviaexcel"
  );
  manager.addDocument(
    "en",
    "bulk upload via excel",
    "features.bulkuploadviaexcel"
  );
  manager.addDocument("en", "bulk upload excel", "features.bulkuploadviaexcel");
  manager.addDocument("en", "bulk upload", "features.bulkuploadviaexcel");
  manager.addDocument("en", "bulk excel", "features.bulkuploadviaexcel");
  manager.addDocument("en", "bulk", "features.bulkuploadviaexcel");
  manager.addDocument("en", "upload excel", "features.bulkuploadviaexcel");
  manager.addDocument("en", "upload", "features.bulkuploadviaexcel");
  manager.addDocument("en", "excel upload", "features.bulkuploadviaexcel");
  manager.addDocument("en", "excel", "features.bulkuploadviaexcel");

  //feature Calendar View Mode questions
  manager.addDocument(
    "en",
    "how do I use calendar view mode",
    "features.calendarviewmode"
  );
  manager.addDocument("en", "calendar view mode", "features.calendarviewmode");
  manager.addDocument("en", "calendar view", "features.calendarviewmode");
  manager.addDocument("en", "calendar", "features.calendarviewmode");
  manager.addDocument("en", "view mode", "features.calendarviewmode");
  manager.addDocument("en", "view", "features.calendarviewmode");
  manager.addDocument("en", "mode", "features.calendarviewmode");

  //feature Quick Re-post questions
  manager.addDocument(
    "en",
    "how do I use quick re-post",
    "features.quickrepost"
  );
  manager.addDocument("en", "quick re-post", "features.quickrepost");
  manager.addDocument("en", "quick repost", "features.quickrepost");
  manager.addDocument("en", "quick", "features.quickrepost");
  manager.addDocument("en", "repost", "features.quickrepost");
  manager.addDocument("en", "re post", "features.quickrepost");
  manager.addDocument("en", "re-post", "features.quickrepost");

  //feature Recurring Posts
  manager.addDocument(
    "en",
    "how do I use recurring posts",
    "features.recurringposts"
  );
  manager.addDocument("en", "recurring posts", "features.recurringposts");
  manager.addDocument("en", "recurring", "features.recurringposts");
  manager.addDocument("en", "recurring post", "features.recurringposts");
  manager.addDocument("en", "post recurring", "features.recurringposts");

  // pricing questions
  manager.addDocument("en", "what is the pricing", "pricing.liiftsocial");
  manager.addDocument(
    "en",
    "what is the pricing for liiftsocial",
    "pricing.liiftsocial"
  );
  manager.addDocument(
    "en",
    "what is the pricing for liftsocial",
    "pricing.liiftsocial"
  );
  manager.addDocument("en", "pricing", "pricing.liiftsocial");

  //pricing standard plan questions
  manager.addDocument(
    "en",
    "what is the standard plan",
    "pricing.standardplan"
  );
  manager.addDocument(
    "en",
    "what is the standard plan for liiftsocial",
    "pricing.standardplan"
  );
  manager.addDocument(
    "en",
    "what is the standard plan for liftsocial",
    "pricing.standardplan"
  );
  manager.addDocument("en", "standard plan", "pricing.standardplan");
  manager.addDocument("en", "standard", "pricing.standardplan");

  //pricing Professional Plan questions
  manager.addDocument(
    "en",
    "what is the professional plan",
    "pricing.professionalplan"
  );
  manager.addDocument(
    "en",
    "what is the professional plan for liiftsocial",
    "pricing.professionalplan"
  );
  manager.addDocument(
    "en",
    "what is the professional plan for liftsocial",
    "pricing.professionalplan"
  );
  manager.addDocument("en", "professional plan", "pricing.professionalplan");
  manager.addDocument("en", "professional", "pricing.professionalplan");

  //pricing Pro-Premium Plan questions
  manager.addDocument(
    "en",
    "what is the pro-premium plan",
    "pricing.propremiumplan"
  );
  manager.addDocument(
    "en",
    "what is the pro-premium plan for liiftsocial",
    "pricing.propremiumplan"
  );
  manager.addDocument(
    "en",
    "what is the pro-premium plan for liftsocial",
    "pricing.propremiumplan"
  );
  manager.addDocument("en", "pro-premium plan", "pricing.propremiumplan");
  manager.addDocument("en", "pro-premium", "pricing.propremiumplan");
  manager.addDocument("en", "pro premium plan", "pricing.propremiumplan");
  manager.addDocument("en", "pro premium", "pricing.propremiumplan");
  manager.addDocument("en", "premium plan", "pricing.propremiumplan");
  manager.addDocument("en", "premium", "pricing.propremiumplan");

  //help center questions
  manager.addDocument("en", "help center", "helpcenter.liiftsocial");
  manager.addDocument("en", "help", "helpcenter.liiftsocial");

  // help center for Facebook
  manager.addDocument("en", "help center for facebook", "helpcenter.facebook");
  manager.addDocument("en", "help center for fb", "helpcenter.facebook");
  manager.addDocument(
    "en",
    "help center for facebook ads",
    "helpcenter.facebook"
  );
  manager.addDocument("en", "facebook", "helpcenter.facebook");
  manager.addDocument("en", "fb", "helpcenter.facebook");

  // help center for Instagram
  manager.addDocument(
    "en",
    "help center for instagram",
    "helpcenter.instagram"
  );
  manager.addDocument("en", "help center for insta", "helpcenter.instagram");
  manager.addDocument(
    "en",
    "help center for instagram ads",
    "helpcenter.instagram"
  );
  manager.addDocument("en", "instagram", "helpcenter.instagram");
  manager.addDocument("en", "insta", "helpcenter.instagram");

  // help center for LinkedIn
  manager.addDocument("en", "help center for linkedin", "helpcenter.linkedin");
  manager.addDocument(
    "en",
    "help center for linkedin ads",
    "helpcenter.linkedin"
  );
  manager.addDocument("en", "linkedin", "helpcenter.linkedin");

  // help center for Twitter
  manager.addDocument("en", "help center for twitter", "helpcenter.twitter");
  manager.addDocument(
    "en",
    "help center for twitter ads",
    "helpcenter.twitter"
  );
  manager.addDocument("en", "twitter", "helpcenter.twitter");

  // contact us questions
  manager.addDocument("en", "contact us", "contactus.liiftsocial");
  manager.addDocument("en", "contact", "contactus.liiftsocial");
  manager.addDocument("en", "contact us for help", "contactus.liiftsocial");
  manager.addDocument("en", "contact us for support", "contactus.liiftsocial");
  manager.addDocument(
    "en",
    "contact us for assistance",
    "contactus.liiftsocial"
  );

  //***********************************************************************************//
  //************************************************************************************//
  //************************************************************************************//
  //************************************************************************************//
  //************************************************************************************//
  //************************************************************************************//
  //************************************************************************************//
  // Train also the NLG..........Train it to answer
  manager.addAnswer("en", "greetings.hello", "Hey there!");
  manager.addAnswer("en", "greetings.hello", "Hey buddy!");

  manager.addAnswer("en", "user.asking", "I am doing good! what about you?");
  manager.addAnswer(
    "en",
    "user.replying",
    "Nice to Know :) How can I help you ?"
  );

  manager.addAnswer("en", "greetings.goodNight", "Good Night.");
  manager.addAnswer("en", "greetings.goodDay", "Good Day!");
  manager.addAnswer(
    "en",
    "greetings.goodMorning",
    "Have a very happy Morning!"
  );
  manager.addAnswer("en", "greetings.goodevening", "Good evening.");
  manager.addAnswer("en", "greetings.goodafternoon", "Good afternoon.");

  manager.addAnswer("en", "user.details", "Nice to know that!");
  manager.addAnswer("en", "user.mobile", "Thank you for your mobile num!");
  manager.addAnswer("en", "user.mobile", "We will call you soon");

  manager.addAnswer("en", "my.name", "You can call me Sam");
  manager.addAnswer("en", "my.name", "I prefer to be called Phil :)");
  manager.addAnswer(
    "en",
    "my.address",
    "I live in this beautiful world created by nature"
  );
  manager.addAnswer("en", "my.me", "I am a friend of yours.");

  manager.addAnswer("en", "greetings.bye", "Till next time :)");
  manager.addAnswer("en", "greetings.bye", "see you soon!");

  // About Liiftsocial answers
  manager.addAnswer(
    "en",
    "about.liiftsocial",
    `👉  Liiftsocial is a smart social media management tool that world deserves schedule, publish, analyze your content in just few clicks.`
  );

  // features answers
  manager.addAnswer(
    "en",
    "features.liiftsocial",
    `The features of the liiftsocial account are: <br>👉 Customize Post <br>👉 Bulk upload via Excel <br>👉 Calendar View Mode <br>👉 Quick Re-post <br>👉 Recurring Posts`
  );

  // feature customize post answers
  manager.addAnswer(
    "en",
    "features.customizepost",
    `👉  You can customize your post. By previewing the post before scheduling it, you can make all your desired changes before it goes live.`
  );

  // feature Bulk upload via Excel answers
  manager.addAnswer(
    "en",
    "features.bulkuploadviaexcel",
    `👉  Easily upload excel and schedule your social media posts without the hassle of uploading the posts daily.`
  );

  // feature Calendar View Mode answers
  manager.addAnswer(
    "en",
    "features.calendarviewmode",
    `👉  Keep track of both the future & past posts, filter through posts, schedule new content right from within the calendar.`
  );

  // feature Quick Re-post answers
  manager.addAnswer(
    "en",
    "features.quickrepost",
    `👉  Re-post with just one click if you're planning to reuse them again in the future, or if they're not ready to get published yet.`
  );

  // feature Recurring Posts answers
  manager.addAnswer(
    "en",
    "features.recurringposts",
    `👉  Easily schedule the same post to go out every two days, every Friday, every three months, and so on. The options are limitless.`
  );

  // pricing answers
  manager.addAnswer(
    "en",
    "pricing.liiftsocial",
    `The pricing that we provide includes 14 days free trial: <br>👉 Standard Plan @9.99$ per month <br>👉 Professional Plan @19.99$ per month <br>👉 Pro-Premium Plan @29.99$ per month`
  );

  // pricing standard plan answers
  manager.addAnswer(
    "en",
    "pricing.standardplan",
    `✔ 4 Social Accounts <br>✔ Unlimited Pending Scheduled Posts <br>✔ 3 Days Posts History <br>✔ Unlimited Bulk Upload <br>✔ Free Tier Support`
  );

  // pricing professional plan answers
  manager.addAnswer(
    "en",
    "pricing.professionalplan",
    `✔ 8 Social Accounts <br>✔ Unlimited Pending Scheduled Posts <br>✔ 7 Days Posts History <br>✔ Unlimited Bulk Upload <br>✔ Silver Tier Support`
  );

  // pricing pro-premium plan answers
  manager.addAnswer(
    "en",
    "pricing.propremiumplan",
    `✔ 12 Social Accounts <br>✔ Unlimited Pending Scheduled Posts <br>✔ 15 Days Posts History <br>✔ Unlimited Bulk Upload <br>✔ Gold Tier Support`
  );

  // help center answers
  manager.addAnswer(
    "en",
    "helpcenter.liiftsocial",
    `For which social media account you need help: <br>👉 Facebook <br>👉 Instagram <br>👉 Twitter <br>👉 LinkedIn <br>👉 For other help center related queries please visit <br><a href="https://www.liiftsocial.com/help-center" style="color:#fff ; text-decoration:none
    ; cursor: pointer;" target="_blank">https://www.liiftsocial.com/help-center</a>`
  );

  // help center for Facebook answers
  manager.addAnswer(
    "en",
    "helpcenter.facebook",
    `For facebook related queries you can visit this page: 🎇 <a href="https://www.liiftsocial.com/help-center/how-to-connect-facebook-pages" style="color:#fff ; text-decoration:none
; cursor: pointer;" target="_blank">https://www.liiftsocial.com/help-center/how-to-connect-facebook-pages</a>`
  );

  // help center for Instagram answers
  manager.addAnswer(
    "en",
    "helpcenter.instagram",
    `For instagram related queries you can visit this page: 🎇<a href="https://www.liiftsocial.com/help-center/how-to-connect-instagram-account" style="color:#fff ; text-decoration:none
; cursor: pointer;" target="_blank">https://www.liiftsocial.com/help-center/how-to-connect-instagram-account</a>`
  );

  // help center for LinkedIn answers
  manager.addAnswer(
    "en",
    "helpcenter.linkedin",
    `For linkedin related queries you can visit this page: 🎇 <a href="https://www.liiftsocial.com/help-center/how-to-connect-linkedin-profile" style="color:#fff ; text-decoration:none
; cursor: pointer;" target="_blank">https://www.liiftsocial.com/help-center/how-to-connect-linkedin-profile</a> `
  );

  // help center for Twitter answers
  manager.addAnswer(
    "en",
    "helpcenter.twitter",
    `For twitter related queries you can visit this page: 🎇 <a href="https://www.liiftsocial.com/help-center/how-to-connect-twitter-account" style="color:#fff ; text-decoration:none
; cursor: pointer;" target="_blank">https://www.liiftsocial.com/help-center/how-to-connect-twitter-account</a>`
  );

  // contact us answers
  manager.addAnswer(
    "en",
    "contactus.liiftsocial",
    `You can contact us at: <br>👉 Email: contact@liiftsocial.com <br>👉 Phone: <br>India +917859963186 <br>USA +14242591872 <br>👉 Schedule a meet: <br>✔ <a style="color:#fff ; text-decoration:none
; cursor: pointer;" href="https://calendly.com/liiftsocial" target="_blank">
https://calendly.com/liiftsocial
</a>`
  );
  await manager.train();
  manager.save();
}
trainbot(manager);

async function botstr(findStr) {
  var response = await manager.process("en", findStr);
  return response.answer;
}

app.get("/", function (req, res) {
  res.render("chatbot", { admins: admins });
});
io.on("connection", (socket) => {
  socket.on("user-info", (data) => {
    console.log("a user connected");
    allchats[socket.id] = {};
    allchats[socket.id].chat = [];
    allchats[socket.id].chating_with_bot = true;
    allchats[socket.id].name = data.name;
    allchats[socket.id].email = data.email;
  });
  socket.on("userinput", (message) => {
    if (allchats[socket.id].chating_with_bot) {
      allchats[socket.id].chat.push(allchats[socket.id].name + " : " + message);
      botstr(message).then(function (result) {
        if (result == null) {
          allchats[socket.id].chat.push(
            "Bot : " +
              `Sorry I didn't get you <br>You can contact us at: <br>👉 Email: contact@liiftsocial.com <br>👉 Phone: <br>India +917859963186 <br>USA +14242591872 <br>👉 Schedule a meet: <br>✔ <a style="color:#fff ; text-decoration:none
; cursor: pointer;" href="https://calendly.com/liiftsocial" target="_blank">
https://calendly.com/liiftsocial
</a>`
          );
          socket.emit(
            "botreply",
            `Sorry I didn't get you <br>You can contact us at: <br>👉 Email: contact@liiftsocial.com <br>👉 Phone: <br>India +917859963186 <br>USA +14242591872 <br>👉 Schedule a meet: <br>✔ <a style="color:#fff ; text-decoration:none
; cursor: pointer;" href="https://calendly.com/liiftsocial" target="_blank">
https://calendly.com/liiftsocial
</a>`
          );
        } else {
          allchats[socket.id].chat.push("Bot : " + result);
          socket.emit("botreply", result);
        }
      });
    } else {
      allchats[socket.id].chat.push(allchats[socket.id].name + " : " + message);
      socket.emit("usertoadmin", message);
    }
  });
  socket.on("adminconnect", () => {
    console.log("admin connected");
    admins.push(socket.id);
    socket.emit("adminconnect", { id: socket.id });
  });
  socket.on("userreqtoadmin", (data) => {
    console.log("user request to admin");
    io.to(data.id).emit("letstalktoadmin", {
      id: socket.id,
      name: allchats[socket.id].name,
      email: allchats[socket.id].email,
    });
  });
  socket.on("adminreply", (data) => {
    allchats[data.userid].chat.push("Admin : " + data.adminreply);
    io.to(data.userid).emit("botreply", data.adminreply);
  });
  socket.on("stopbot", (id) => {
    allchats[id].chating_with_bot = false;
  });
  socket.on("disconnect", async () => {
    if (allchats.hasOwnProperty(socket.id)) {
      let chat = "";
      for (let i = 0; i < allchats[socket.id].chat.length; i++) {
        chat += allchats[socket.id].chat[i] + " | ";
      }
      var newchat = new Chat({
        chatId: socket.id,
        chat: chat,
        chatCreated: new Date(),
        userName: allchats[socket.id].name,
        Email: allchats[socket.id].email,
      });
      await newchat.save();
      delete allchats[socket.id];
      console.log("user disconnected");
    } else if (admins.includes(socket.id)) {
      console.log("Admin Disconnected");
      admins.splice(admins.indexOf(socket.id), 1);
    } else {
      console.log("Unknown user disconnected");
    }
  });
});

app.get("/admin/:id", (req, res) => {
  res.render("showchat", {
    id: String(req.params.id),
    chat: allchats[req.params.id].chat,
    name: allchats[req.params.id].name,
    email: allchats[req.params.id].email,
  });
});

// })
app.get("/admin", (req, res) => {
  Chat.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.render("admin", { allchats: allchats, chats: result });
    }
  });
});
app.get("/admin/seechat/:id", async (req, res) => {
  var socketid = req.params.id;
  var userchat = await Chat.findOne({ chatId: socketid });
  res.render("seechat", {
    id: String(socketid),
    chat: userchat.chat,
    name: userchat.userName,
    email: userchat.Email,
  });
});
server.listen(3000, () => {
  console.log("Server started on port 3000");
});
