const axios = require('axios');

const url = `https://9nfmj2dq1f.execute-api.ap-south-1.amazonaws.com/Development/menu/get-all`;
let speechOutput = "Items on today's menu are : ";

const fetchMenu = async () => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error('cannot fetch api data', error);
  }
};

const responseObj = fetchMenu();
console.log("response:",responseObj);
        
/*request.get(url, (error, response, body) => {
let responseObj = JSON.parse(body);
let arindex = responseObj.Menu_ITEMS.length;
for (i=0;i<arindex;i++) {
	speechOutput = speechOutput + responseObj.Menu_ITEMS[i].ItemName;
	speechOutput = speechOutput + " priced at rupees " + responseObj.Menu_ITEMS[i].Price;
	if (i < (arindex-2)){
		speechOutput = speechOutput + ", ";
	}
	else if (i == arindex-2){
		speechOutput = speechOutput + " and ";
	}
	else if (i == arindex-1){
		speechOutput = speechOutput + ".";
	}
}
console.log("error:",error);
console.log("speech:",speechOutput);
});*/