
$("#shipNo").focus();
const token = "90931929|-31949300307281425|90960857";
const baseURL = "http://api.login2explore.com:5577";
const imlEndPoint = "/api/iml";
const irlEndPoint = "/api/irl";
const dbName = "DELIVERY-DB";
const relName = "SHIPMENT-TABLE";

function getShipment() {
    let shipNo = $("#shipNo").val();
    const jsonStr = {
        "shipNo": shipNo
    }
    const jsonStrString = JSON.stringify(jsonStr);
    let getReqStr = createGET_BY_KEYRequest(token, dbName, relName, jsonStrString);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(getReqStr, irlEndPoint);
    jQuery.ajaxSetup({ async: true });
    // console.log(resultObj);
    if (resultObj.status === 400) {
        $("#shipNo").prop('disabled', true);
        disableEnableField(false);


        $("#shipSave").prop('disabled', false);
        $("#shipReset").prop('disabled', false);

        $("#shipDescription").focus();
    }
    else {

        $("#shipNo").prop('disabled', true);
        const jsonData = JSON.parse(resultObj.data);
        let data = jsonData.record;
        saveRecord2LS(jsonData);

        //Fill the data
        $("#shipDescription").val(data.shipDescription);
        $("#shipSource").val(data.shipSource);
        $("#shipDestination").val(data.shipDestination);
        $("#shippingDateText").val(data.shippingDate);
        $("#deliveryDateText").val(data.deliveryDate);
        disableEnableField(false);


        $("#shipChange").prop('disabled', false);
        $("#shipReset").prop('disabled', false);

    }

}


function changeShipment() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }
    var updateReqStr = createUPDATERecordRequest(token, jsonStr, dbName, relName, localStorage.recno);
    // alert(updateReqStr);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(updateReqStr, imlEndPoint);
    jQuery.ajaxSetup({ async: true });
    // alert(JSON.stringify(resultObj));
    resetForm();
}


//Save record no to local storage
function saveRecord2LS(jsonObj) {
    localStorage.setItem("recno", jsonObj.rec_no);
}

//Function to disable/enable all the fields except the primary id field
function disableEnableField(flag) {
    $("#shipDescription").prop('disabled', flag);
    $("#shipSource").prop('disabled', flag);
    $("#shipDestination").prop('disabled', flag);
    $("#shippingDateText").prop('disabled', flag);
    $("#deliveryDateText").prop('disabled', flag);
}

function validateAndGetFormData() {
    var shipNoVar = $("#shipNo").val();

    var shipDescriptionVar = $("#shipDescription").val();
    if (shipDescriptionVar === "") {
        alert("Shipment Description is Required Value");
        $("#shipDescription").focus();
        return "";
    }
    var shipSourceVar = $("#shipSource").val();
    if (shipSourceVar === "") {
        alert("Shipment Source is Required Value");
        $("#shipSource").focus();
        return "";
    }

    var shipDestinationVar = $("#shipDestination").val();
    if (shipDestinationVar === "") {
        alert("Shipment Destination is Required Value");
        $("#shipDestination").focus();
        return "";
    }
    var shippingDateTextVar = $("#shippingDateText").val();
    if (shippingDateTextVar === "") {
        alert("Shipment Date is Required Value");
        $("#shippingDateText").focus();
        return "";
    }

    var deliveryDateTextVar = $("#deliveryDateText").val();
    if (deliveryDateTextVar === "") {
        alert("Delivery Date is Required Value");
        $("#deliveryDateText").focus();
        return "";
    }


    var jsonStrObj = {
        shipNo: shipNoVar,
        shipDescription: shipDescriptionVar,
        shipSource: shipSourceVar,
        shipDestination: shipDestinationVar,
        shippingDate: shippingDateTextVar,
        deliveryDate: deliveryDateTextVar
    };
    return JSON.stringify(jsonStrObj);
}

function resetForm() {
    $("#shipNo").val("")
    $("#shipDescription").val("");
    $("#shipSource").val("");
    $("#shipDestination").val("");
    $("#shippingDateText").val("");
    $("#deliveryDateText").val("");
    $("#shipNo").prop('disabled', false);

    disableEnableField(true);

    $("#shipSave").prop('disabled', true);
    $("#shipChange").prop('disabled', true);
    $("#shipReset").prop('disabled', true);
    $("#shipNo").focus();
}
function saveShipment() {
    var jsonStr = validateAndGetFormData();
    // console.log(jsonStr)
    if (jsonStr === "") {
        return;
    }
    var putReqStr = createPUTRequest(token, jsonStr, dbName, relName);
    // alert(putReqStr);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(putReqStr, imlEndPoint);
    jQuery.ajaxSetup({ async: true });
    // alert(JSON.stringify(resultObj));//90934780|-31949209358919657|90957587
// Focus on the Project ID field on page load
$(document).ready(function() {
    $("#projectId").focus();
    
    // Add event handler for Project ID field
    $("#projectId").on("blur", function() {
        var projectId = $("#projectId").val();
        if (projectId.trim() === "") {
            showMessage("Project ID cannot be empty!", "danger");
            return;
        }
        checkProjectExistence(projectId);
    });
});

function showMessage(msg, type) {
    var statusDiv = $("#status");
    statusDiv.removeClass("alert-success alert-danger alert-warning").addClass("alert-" + type);
    statusDiv.html(msg);
    statusDiv.show();
    setTimeout(function() {
        statusDiv.hide();
    }, 5000);
}

function checkProjectExistence(projectId) {
    var jsonStr = {
        projectId: projectId
    };
    var getReqStr = createGETRequest("90934780|-31949209358919657|90957587", 
                                      JSON.stringify(jsonStr), 
                                      "COLLEGE-DB", 
                                      "PROJECT-TABLE");
    
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(getReqStr, 
                                                "http://api.login2explore.com:5577", 
                                                "/api/irl");
    jQuery.ajaxSetup({async: true});
    
    if (resultObj.status === 400) {
        // Project does not exist - enable fields for new entry
        showMessage("Enter new project details", "success");
        enableFormFields(true);
        $("#saveBtn").prop("disabled", false);
        $("#resetBtn").prop("disabled", false);
        $("#updateBtn").prop("disabled", true);
        $("#projectName").focus();
    } else if (resultObj.status === 200) {
        // Project exists - display data and enable update
        var data = JSON.parse(resultObj.data).record;
        fillFormData(data);
        showMessage("Project record exists. You can update the details.", "warning");
        enableFormFields(true);
        $("#projectId").prop("disabled", true);
        $("#saveBtn").prop("disabled", true);
        $("#updateBtn").prop("disabled", false);
        $("#resetBtn").prop("disabled", false);
        $("#projectName").focus();
    }
}

function enableFormFields(enable) {
    $("#projectName").prop("disabled", !enable);
    $("#assignedTo").prop("disabled", !enable);
    $("#assignmentDate").prop("disabled", !enable);
    $("#deadline").prop("disabled", !enable);
}

function fillFormData(data) {
    $("#projectId").val(data.projectId);
    $("#projectName").val(data.projectName);
    $("#assignedTo").val(data.assignedTo);
    $("#assignmentDate").val(data.assignmentDate);
    $("#deadline").val(data.deadline);
}

function validateAndGetFormData() {
    var projectIdVar = $("#projectId").val();
    if (projectIdVar === "") {
        showMessage("Project ID is required!", "danger");
        $("#projectId").focus();
        return "";
    }
    
    var projectNameVar = $("#projectName").val();
    if (projectNameVar === "") {
        showMessage("Project Name is required!", "danger");
        $("#projectName").focus();
        return "";
    }
    
    var assignedToVar = $("#assignedTo").val();
    if (assignedToVar === "") {
        showMessage("Assigned To is required!", "danger");
        $("#assignedTo").focus();
        return "";
    }
    
    var assignmentDateVar = $("#assignmentDate").val();
    if (assignmentDateVar === "") {
        showMessage("Assignment Date is required!", "danger");
        $("#assignmentDate").focus();
        return "";
    }
    
    var deadlineVar = $("#deadline").val();
    if (deadlineVar === "") {
        showMessage("Deadline is required!", "danger");
        $("#deadline").focus();
        return "";
    }
    
    var jsonStrObj = {
        projectId: projectIdVar,
        projectName: projectNameVar,
        assignedTo: assignedToVar,
        assignmentDate: assignmentDateVar,
        deadline: deadlineVar
    };
    
    return JSON.stringify(jsonStrObj);
}

// Function to create PUT JSON request
function createPUTRequest(connToken, jsonObj, dbName, relName) {
    var putRequest = "{\n"
        + "\"token\" : \""
        + connToken
        + "\","
        + "\"dbName\": \""
        + dbName
        + "\",\n" + "\"cmd\" : \"PUT\",\n"
        + "\"rel\" : \""
        + relName + "\","
        + "\"jsonStr\": \n"
        + jsonObj
        + "\n"
        + "}";
    return putRequest;
}

// Function to create GET JSON request
function createGETRequest(connToken, jsonObj, dbName, relName) {
    var getRequest = "{\n"
        + "\"token\" : \""
        + connToken
        + "\","
        + "\"dbName\": \""
        + dbName
        + "\",\n" + "\"cmd\" : \"GET\",\n"
        + "\"rel\" : \""
        + relName + "\","
        + "\"jsonStr\": \n"
        + jsonObj
        + "\n"
        + "}";
    return getRequest;
}

// Function to create UPDATE JSON request
function createUPDATERequest(connToken, jsonObj, dbName, relName) {
    var updateRequest = "{\n"
        + "\"token\" : \""
        + connToken
        + "\","
        + "\"dbName\": \""
        + dbName
        + "\",\n" + "\"cmd\" : \"UPDATE\",\n"
        + "\"rel\" : \""
        + relName + "\","
        + "\"jsonStr\": \n"
        + jsonObj
        + "\n"
        + "}";
    return updateRequest;
}

function executeCommandAtGivenBaseUrl(reqString, dbBaseUrl, apiEndPointUrl) {
    var url = dbBaseUrl + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}

function resetForm() {
    $("#projectId").val("");
    $("#projectName").val("");
    $("#assignedTo").val("");
    $("#assignmentDate").val("");
    $("#deadline").val("");
    
    $("#projectId").prop("disabled", false);
    enableFormFields(false);
    
    $("#saveBtn").prop("disabled", true);
    $("#updateBtn").prop("disabled", true);
    $("#resetBtn").prop("disabled", true);
    
    $("#projectId").focus();
    $("#status").hide();
}

function saveProject() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }
    
    var putReqStr = createPUTRequest("90934780|-31949209358919657|90957587",
                                      jsonStr, 
                                      "COLLEGE-DB", 
                                      "PROJECT-TABLE");
    
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr,
                                              "http://api.login2explore.com:5577", 
                                              "/api/iml");
    jQuery.ajaxSetup({async: true});
    
    if (resultObj.status === 200) {
        showMessage("Project saved successfully!", "success");
    } else {
        showMessage("Error saving project: " + resultObj.message, "danger");
    }
    
    resetForm();
}

function updateProject() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }
    
    var updateReqStr = createUPDATERequest("90934780|-31949209358919657|90957587",
                                         jsonStr, 
                                         "COLLEGE-DB", 
                                         "PROJECT-TABLE");
    
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(updateReqStr,
                                              "http://api.login2explore.com:5577", 
                                              "/api/iml");
    jQuery.ajaxSetup({async: true});
    
    if (resultObj.status === 200) {
        showMessage("Project updated successfully!", "success");
    } else {
        showMessage("Error updating project: " + resultObj.message, "danger");
    }
    
    resetForm();
}$("#shipNo").focus();
const token = "90931929|-31949300307281425|90960857";
const baseURL = "http://api.login2explore.com:5577";
const imlEndPoint = "/api/iml";
const irlEndPoint = "/api/irl";
const dbName = "DELIVERY-DB";
const relName = "SHIPMENT-TABLE";

function getShipment() {
    let shipNo = $("#shipNo").val();
    const jsonStr = {
        "shipNo": shipNo
    }
    const jsonStrString = JSON.stringify(jsonStr);
    let getReqStr = createGET_BY_KEYRequest(token, dbName, relName, jsonStrString);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(getReqStr, irlEndPoint);
    jQuery.ajaxSetup({ async: true });
    // console.log(resultObj);
    if (resultObj.status === 400) {
        $("#shipNo").prop('disabled', true);
        disableEnableField(false);


        $("#shipSave").prop('disabled', false);
        $("#shipReset").prop('disabled', false);

        $("#shipDescription").focus();
    }
    else {

        $("#shipNo").prop('disabled', true);
        const jsonData = JSON.parse(resultObj.data);
        let data = jsonData.record;
        saveRecord2LS(jsonData);

        //Fill the data
        $("#shipDescription").val(data.shipDescription);
        $("#shipSource").val(data.shipSource);
        $("#shipDestination").val(data.shipDestination);
        $("#shippingDateText").val(data.shippingDate);
        $("#deliveryDateText").val(data.deliveryDate);
        disableEnableField(false);


        $("#shipChange").prop('disabled', false);
        $("#shipReset").prop('disabled', false);

    }

}


function changeShipment() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }
    var updateReqStr = createUPDATERecordRequest(token, jsonStr, dbName, relName, localStorage.recno);
    // alert(updateReqStr);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(updateReqStr, imlEndPoint);
    jQuery.ajaxSetup({ async: true });
    // alert(JSON.stringify(resultObj));
    resetForm();
}


//Save record no to local storage
function saveRecord2LS(jsonObj) {
    localStorage.setItem("recno", jsonObj.rec_no);
}

//Function to disable/enable all the fields except the primary id field
function disableEnableField(flag) {
    $("#shipDescription").prop('disabled', flag);
    $("#shipSource").prop('disabled', flag);
    $("#shipDestination").prop('disabled', flag);
    $("#shippingDateText").prop('disabled', flag);
    $("#deliveryDateText").prop('disabled', flag);
}

function validateAndGetFormData() {
    var shipNoVar = $("#shipNo").val();

    var shipDescriptionVar = $("#shipDescription").val();
    if (shipDescriptionVar === "") {
        alert("Shipment Description is Required Value");
        $("#shipDescription").focus();
        return "";
    }
    var shipSourceVar = $("#shipSource").val();
    if (shipSourceVar === "") {
        alert("Shipment Source is Required Value");
        $("#shipSource").focus();
        return "";
    }

    var shipDestinationVar = $("#shipDestination").val();
    if (shipDestinationVar === "") {
        alert("Shipment Destination is Required Value");
        $("#shipDestination").focus();
        return "";
    }
    var shippingDateTextVar = $("#shippingDateText").val();
    if (shippingDateTextVar === "") {
        alert("Shipment Date is Required Value");
        $("#shippingDateText").focus();
        return "";
    }

    var deliveryDateTextVar = $("#deliveryDateText").val();
    if (deliveryDateTextVar === "") {
        alert("Delivery Date is Required Value");
        $("#deliveryDateText").focus();
        return "";
    }


    var jsonStrObj = {
        shipNo: shipNoVar,
        shipDescription: shipDescriptionVar,
        shipSource: shipSourceVar,
        shipDestination: shipDestinationVar,
        shippingDate: shippingDateTextVar,
        deliveryDate: deliveryDateTextVar
    };
    return JSON.stringify(jsonStrObj);
}

function resetForm() {
    $("#shipNo").val("")
    $("#shipDescription").val("");
    $("#shipSource").val("");
    $("#shipDestination").val("");
    $("#shippingDateText").val("");
    $("#deliveryDateText").val("");
    $("#shipNo").prop('disabled', false);

    disableEnableField(true);

    $("#shipSave").prop('disabled', true);
    $("#shipChange").prop('disabled', true);
    $("#shipReset").prop('disabled', true);
    $("#shipNo").focus();
}
function saveShipment() {
    var jsonStr = validateAndGetFormData();
    // console.log(jsonStr)
    if (jsonStr === "") {
        return;
    }
    var putReqStr = createPUTRequest(token, jsonStr, dbName, relName);
    // alert(putReqStr);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(putReqStr, imlEndPoint);
    jQuery.ajaxSetup({ async: true });
    // alert(JSON.stringify(resultObj));
    resetForm();
}

$(function () {
    $('#shippingDate').datepicker();
});

$(function () {
    $('#deliveryDate').datepicker();
});
    resetForm();
}

$(function () {
    $('#shippingDate').datepicker();
});

$(function () {
    $('#deliveryDate').datepicker();
});