

//Fetch the info from wepsite 
async function Fetcher() {
    let info_about_covid_json = await fetch("https://api.covid19india.org/v4/min/data-all.min.json");
    let info_about_covid_Obj = await info_about_covid_json.json();

    return info_about_covid_Obj;
}




//timeFunction :
function find_from_data(state , inputDate) {
    // console.log("State :" + state);
    // console.log("Given Date " + inputDate);
    //needed parameter :
    let date = null;
    let month = null;
    let year = null;
    let go_for_prvDate = 0;

    if(inputDate === "") {
        // console.log("The date is null so going for prev List");
        go_for_prvDate = 1;
    }

    let tempDate_parser = new Date(inputDate); // first parsing the data :
    let userDate = inputDate === "" ?  new Date : tempDate_parser; //Here in case input data is empty show yesterdat data ::
    // console.log(userDate);
    if(go_for_prvDate === 0) {
        date = userDate.getDate();
        month = userDate.getMonth();
        year = userDate.getFullYear();
    }
    else{
        let yesterdayDate = new Date(userDate - (24 * 3600 * 1000));
        // console.log(yesterdayDate);

        date = yesterdayDate.getDate();
        month = yesterdayDate.getMonth();
        year = yesterdayDate.getFullYear();
    }

    let asString = "" + year;
    if(month < 10) {
        asString += "-0" + month;
    }
    else {
        asString += "-" + month;
    }

    if(date < 10) {
        asString += "-0" + date;
    }
    else{
        asString += "-" + date;
    }
    // console.log(asString);

    // //Now fetch the data forthe yesterday date :

    return([originalData[asString][state]["total"] , originalData[asString][state]]);
    
 
}

function uiCreator(confirm , recover , death) {
    let myArray = [+confirm , +recover , +death];


    //Get the Confirm box :
    let numberTag = document.querySelectorAll(".numbers");
    let i = 0;

    numberTag.forEach((item) => {
        let start = 0;
        let step = 5000;
        let targetValue = myArray[i];
        // let thatTag = item;

        let timerId = setInterval(() => {
            
            if(start <= targetValue) {
                //console.log(start);
                start += step;
                item.textContent = start;
            }
            else{
                //console.log("terminated");
                clearInterval(timerId);
            }
        } , 20);
        i++;
    })
}

function charCreator(data) {
    // console.log("In side chart section");
    let districtData = data["districts"];
    // console.log(districtData);
    let xValues = Object.keys(districtData);
    let recValues = [];
    let affecValues = [];
    let deathValues = [];
    for(let i in districtData) {
        recValues.push(districtData[i]["total"]["recovered"]);
        affecValues.push(districtData[i]["total"]["confirmed"])
        deathValues.push(districtData[i]["total"]["deceased"]);
    }
    // console.log(recValues);
    // console.log(affecValues);
    // console.log(deathValues);
    let myChart = document.getElementById("myChart");
    let barColors = ["red" , "orange" , "red"];

    new Chart(myChart, {
        type: "bar",
        data: {
            labels: xValues,
            datasets: [{
              label:"Recoverd",
              backgroundColor: "green",
              data: recValues,
              

            },
            {
              label : "Affected",
              backgroundColor: "orange",
              data: affecValues,
              

            },
            {
                label : "Death",
                backgroundColor: "red",
                data: deathValues,
                

            }

            ]
        }
        
      });
}
let myForm = document.querySelector("form");
let originalData = null;
myForm.addEventListener(('submit') , (event) => {
    event.preventDefault();
    Fetcher()
    .then((data) => {
        let charView = document.querySelector(".charView");
        let child_nodes = charView.children;
        for(let i = 0 ; i < child_nodes.length ; i++) {
            charView.removeChild(child_nodes[i]);
        }
        let myCanvas = document.createElement("canvas");
        myCanvas.setAttribute("id" , "myChart");
        charView.append(myCanvas);
        // console.log(data);
        originalData = data;
        let givenState = document.querySelector("#stateName_Id").value;
        let givenDate = document.querySelector("#datePicker_Id").value;
        let total = find_from_data(givenState , givenDate);
        //Design our ui :::
        uiCreator(total[0]["confirmed"] , total[0]["recovered"] , total[0]["deceased"]);
        charCreator(total[1]);
    })
    .catch((errMsg) => {
        console.log(errMsg);
    });

    //Date is fetched :::
    
})

