// A helper script to contain callback handlers to automate google forms for collecting Standup notes and creating a historical record.
// This requires 3 different triggers to be set in associated form response google sheet.
// 1. On formSubmit handler for every time a response is recieved.
// 2. A trigger to create a new sheet everymonth with the name in the format APRIL-2022
// 3. A trigger to copy header row every day when next day time starts.

var ssApp = SpreadsheetApp.getActiveSpreadsheet();
var debug = true;
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const formValueToSheetCellsMap = {
  'Timestamp': 'A3',
  'Email Address': 'B3',
	'Yesterday': 'C3',
	'Today': 'D3', 
	'Blockers?': 'E3', 
}

var logger = {
	log: function (msg, params) {
    if (!debug) return;

    if (params){
      console.log(msg, params)
    } else {
      console.log(msg)
    }	
	}
}

function getCurrentSheetName() {
  var todayDate = new Date();
	return monthNames[todayDate.getMonth()] + '-' + todayDate.getFullYear();
}

//Add next month sheet with a placeholder template
function addNextMonthSheet() {
	var templateSheet = ssApp.getSheetByName("Template");
	var newSheetName = getCurrentSheetName();
	var currentSheet = ssApp.insertSheet(newSheetName, 1, { template: templateSheet });
	currentSheet.getRange('A1:D1').merge(); // Perform a little formatting
}


function isWeeknd() {
  var todayDate = new Date();
  return [6, 0].includes(todayDate.getDay()); // Saturday, Sunday
}

//Add next working day template for adding standup notes
function formatNextDayRows() {
	logger.log("In formatNextDayRows function");
  if (isWeeknd()){
    logger.log("Weekend, skipping formatNextDayRows");
    return;
  } 

	var currentSheet = ssApp.getSheetByName(getCurrentSheetName());

	currentSheet.insertRows(1, 3);
	currentSheet.getRange('A3:E3').clearFormat();  

	logger.log("In formatNextDayRows function: Added 3 empty rows");

	copyCells('A4:E4', 'A1:E1');
	copyCells('A5:E5', 'A2:E2');

	currentSheet.getRange('A1').setValue(new Date());

	logger.log("In formatNextDayRows function: Copied 2 formatted header rows");
}

function copyCells(source, destination) {
	var currentSheet = ssApp.getSheetByName(getCurrentSheetName());
	var sourceRange = currentSheet.getRange(source);
	var fillDownRange = currentSheet.getRange(destination);
	sourceRange.copyTo(fillDownRange);
}

function setCellValueFromResponse(response) {
	var currentSheet = ssApp.getSheetByName(getCurrentSheetName());  
  for (const key in formValueToSheetCellsMap) {
    const value = response[key]
    if (value) { //response has value
      const cell = formValueToSheetCellsMap[key] //get cell range
      currentSheet.getRange(cell).setValue(value);
    }
  }
}

function onFormSubmit(e) {
	var response = e.namedValues;

	logger.log('In onFormSubmit', response);

	var currentSheet = ssApp.getSheetByName(getCurrentSheetName());
	currentSheet.insertRowAfter(2); //Top 2 header lines
	currentSheet.getRange('A3:E3').clearFormat();

	logger.log('Empty row inserted');

	setCellValueFromResponse(response);

	logger.log('Values inserted');
}
