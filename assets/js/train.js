// Decided to change the front facing theme a bit after finishing the javascript and testing it. 
// If you went to/enjoyed some time at UNC, please let this be a time of reflection regarding the P2P,
// and those elegant individuals riding it at 2:30 am. 


// Gloabls --------------------------------------------------------
var getTrain = $("#train-name");
var getTrainDestination = $("#train-destination");
var getTrainTime = $("#train-time");
var getTimeFreq = $("#time-freq");

var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";

// Firebase Setup --------------------------------------------------
var config = {
    apiKey: "AIzaSyAr3yxMF6cre7gXQqJsuiQzfloJtWRxE8U",
    authDomain: "testing-123-dde2e.firebaseapp.com",
    databaseURL: "https://testing-123-dde2e.firebaseio.com",
    projectId: "testing-123-dde2e",
    storageBucket: "testing-123-dde2e.appspot.com",
    messagingSenderId: "77732228703"
    };
    
firebase.initializeApp(config);

var database = firebase.database();

// ----------------------------------------------------------------

database.ref("/trains").on("child_added", function(snapshot) {

    var trainDiff = 0;                                              // Variables for firebase data
    var trainRemainder = 0;
    var minutesTillArrival = "";
    var nextTrainTime = "";
    var frequency = snapshot.val().frequency;

    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");     // this line took a while to work out syntax...
    trainRemainder = trainDiff % frequency;                                     // Calculate frequency remainder
    minutesTillArrival = frequency - trainRemainder;                            // subtract to get remaining time till arrival
    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

    $("#table-data").append(                                                    // append to top table
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "</td></tr>"
    );

    $("span").hide();
    
});


var storeInputs = function(event) {
    event.preventDefault();

    trainName = getTrain.val().trim();                                          // trim to remove potential spaces
    trainDestination = getTrainDestination.val().trim();
    trainTime = moment(getTrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = getTimeFreq.val().trim();

    database.ref("/trains").push({                                              // function to push data to trains branch on my database
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    alert("Route successuflly added!");                                         // only added bc of HW example, though it was a good test

    getTrain.val("");                                                           // clear form once train is added
    getTrainDestination.val("");
    getTrainTime.val("");
    getTimeFreq.val("");
};

$("#btn-add").on("click", function(event) {                                     // added if else to make sure all info was present
    if (getTrain.val().length === 0 || getTrainDestination.val().length === 0 || getTrainTime.val().length === 0 || getTimeFreq === 0) {
        alert("All fields are required for submission. Please review entry.");
    } else {
        storeInputs(event);
    }
});