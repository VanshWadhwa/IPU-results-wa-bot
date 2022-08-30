import * as dotenv from "dotenv";
import axios from "axios";

// Env config
dotenv.config();
const API_URL = process.env.API_URL;

// Demo API routes
const demoRollNo = "04796203120";
const resultURL = API_URL + "results/" + demoRollNo;

// Basic axios get
axios.get(resultURL).then((res) => {
  //   console.log(res.data);
  const result = res.data.data;

  const introMsg = `
ROLL NUMBER : ${result.rollNumber}
NAME	: ${result.name}
PROGRAMME : ${result.programme.name}
INSTITUTION	: ${result.institution.name}
BATCH	: ${result.batch}
AGGREGATE PERCENTAGE : ${result.name}
AGGREGATE CREDIT PERCENTAGE	: ${result.aggregateCreditPercentage}
CREDITS	: ${result.maxCredits} / ${result.totalCreditsEarned} 

  `;

  console.log(introMsg);
  var semMsgList = [];

  var resultsLength = res.data.data.results.length;

  for (var i = 0; i < resultsLength; i++) {
    const currentSem = res.data.data.results[i];
    // console.log(currentSem.semYear.num);
    //Do something
    const semMsg = `
-----------------------------------------------------
SEMESTER : ${currentSem.semYear.num}
Percentage : ${currentSem.percentage}
Total Marks :  ${currentSem.totalMarks}
College Rank :  ${currentSem.collegeRank}
University Rank :  ${currentSem.universityRank}
Credit Percentage :  ${currentSem.creditPercentage}
------------------------------------------------------
`;
    const subjects = currentSem.subjects;

    console.log(semMsg);
    const infoMsg = `
        Sem-${currentSem.semYear.num} marks subject wise
        I : Internal Marks
        E : External Marks
        T : Total Marks
    `;
    console.log(infoMsg);
    for (var j = 0; j < subjects.length; j++) {
      const currentSubject = subjects[j];
      const subjectMsg = `${j + 1}. ${currentSubject.name} : I:${
        currentSubject.minor.earned
      }/${currentSubject.minor.max} |  E:${currentSubject.major.earned}/${
        currentSubject.major.max
      } |  T:${currentSubject.total.earned}/${currentSubject.total.max} `;
      console.log(subjectMsg);
    }
  }
});
