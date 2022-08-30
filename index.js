import * as dotenv from "dotenv";
import axios from "axios";
// import * as qrcode from "qrcode-terminal";
import qrcode from "qrcode-terminal";

// const { Client, Buttons, List } = require("whatsapp-web.js");
import pkg from "whatsapp-web.js";
const { Client, List, LocalAuth } = pkg;
// const client = new Client();
dotenv.config();

const client = new Client({
  authStrategy: new LocalAuth(),
});

// QR GENRATION
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();

client.on("message", async (message) => {
  console.log(message.body);
  if (message.body === "!ping") {
    console.log("replying ping..");
    message.reply("pong");
  } else if (message.body === "!list") {
    console.log(" > !list command detected..");

    let sections = [
      {
        title: "Acknowledment?",
        rows: [
          { title: "Acknowledged" },
          // { title: "Acknowledged", description: "desc" },
          { title: "No, I won't be able to attend" },
        ],
      },
    ];
    console.log(" > sendign lists..");

    let list = new List(
      "Meet Up Announcement",
      "Do you Acknowledge?",
      sections,
      "Title",
      "footer"
    );

    client.sendMessage(message.from, list);
    console.log(" > list send..");
  } else if (message.body.split(" ")[0] === "!result") {
    message.reply(`Sending Result of  ${message.body.split(" ")[1]}`);
    const resultMsgsList = await getResults(message.body.split(" ")[1]);
    for (var i = 0; i < resultMsgsList.length; i++) {
      message.reply(resultMsgsList[i]);
    }
  } else if (message.body === "result") {
    message.reply(
      `Please send the request in this format " !result 04796203120 "`
    );
  } else if (message.body.split(" ")[0] === "result") {
    message.reply(`You've selected ${message.body}`);
  }
});

// Env config
const API_URL = process.env.API_URL;
// Demo API routes
const demoRollNo = "04796203120";

// Basic axios get

const getResults = async (rollNumber) => {
  // Will return msgs list
  const resultURL = API_URL + "results/" + rollNumber;
  var resultMsgsList = [];
  await axios.get(resultURL).then((res) => {
    const result = res.data.data;

    const introMsg = `ROLL NUMBER : ${result.rollNumber}
NAME	: ${result.name}
PROGRAMME : ${result.programme.name}
INSTITUTION	: ${result.institution.name}
BATCH	: ${result.batch}
AGGREGATE PERCENTAGE : ${result.aggregatePercentage}
AGGREGATE CREDIT PERCENTAGE	: ${result.aggregateCreditPercentage}
CREDITS	: ${result.maxCredits} / ${result.totalCreditsEarned} `;
    resultMsgsList.push(introMsg);

    var resultsLength = res.data.data.results.length;

    const infoMsg = `Semester marks subject wise
I : Internal Marks
E : External Marks
T : Total Marks`;
    // console.log(infoMsg);
    resultMsgsList.push(infoMsg);

    for (var i = 0; i < resultsLength; i++) {
      const currentSem = res.data.data.results[i];

      var semMsg = `SEMESTER : ${currentSem.semYear.num}
Percentage : ${currentSem.percentage}
Total Marks :  ${currentSem.totalMarks}
College Rank :  ${currentSem.collegeRank}
University Rank :  ${currentSem.universityRank}
Credit Percentage :  ${currentSem.creditPercentage}

`;

      const subjects = currentSem.subjects;
      // console.log(subjects);

      // console.log(semMsg);

      for (var j = 0; j < subjects.length; j++) {
        const currentSubject = subjects[j];
        var subjectMsg = `${j + 1}. ${currentSubject.name} : I:${
          currentSubject.minor.earned
        }/${currentSubject.minor.max} |  E:${currentSubject.major.earned}/${
          currentSubject.major.max
        } |  T:${currentSubject.total.earned}/${currentSubject.total.max} `;
        // console.log(subjectMsg);
        semMsg = semMsg + subjectMsg + "\n";

        // semMsg.app(subjectMsg);
      }
      resultMsgsList.push(semMsg);
    }
  });
  return resultMsgsList;
};

// const resultMsgsList = await getResults(demoRollNo);
// console.log(resultMsgsList);
// for (var i = 0; i < resultMsgsList.length; i++) {
//   console.log(resultMsgsList[i]);
// }
