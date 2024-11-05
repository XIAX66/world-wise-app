import axios from "axios";

async function getCity() {
  const res = await axios.get("http://127.0.0.1:3000/api/v1/cities");
  const data = res.data;
  console.log(data.data.cities);
}

getCity();
