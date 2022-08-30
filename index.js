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
  console.log(res.data);
});
