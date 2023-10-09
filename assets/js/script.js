// ***************************** Document is ready ***************************
$(document).ready(function() {
  
  // *************************** Define the variable that will hold all projects ***************************
  var myProjects;
  console.log("Beginning");

  // *************************** Call the init function ***************************
  init();

  // *************************** Initialise the page ***************************
  function init() {
    console.log("Initialising");

    // *************************** Display today's date ***************************
    var today = dayjs();
    $('.time').text(today.format('MMMM D, YYYY') + ' at ' + today.format('H:mm'));
    getProjects();
    displayProjects();
  };

  // *************************** Retrieve the array of projects from local storage. If nothing is stored, return an emty array
  function getProjects() { 
    console.log("Getting projects from local storage");
    myProjects = [];
    var myStoredProjects = JSON.parse(localStorage.getItem("myStoredProjects"));
    if (myStoredProjects !== null) {
      myProjects = myStoredProjects;
    };
  };

  // *************************** Display projects in a table with a delete button for each project ************************
  function displayProjects() {
    console.log("Displaying projects in a table");
      for (var i = 0; i < myProjects.length; i++) {
      let project = {};
      project = myProjects[i];
      let projectName = project.pName;
      let projectType = project.pType;
      let dueDate = project.pDue;
      $("#my-table").append("<tr><td class='align-middle'>" + projectName + "</td><td class='align-middle'>" + projectType + "</td><td class='align-middle'>" + dueDate + "</td><td>" 
      + "<button class='tableRow btn-dark border-1 px-2 py-1 rounded-2 fw-semibold' id=" + i + ">Delete</button>" + "</td></tr>");
    };
  // *************************** Add an event listener to the delete buttons ***************************
  $(".tableRow").on("click", deleteThisProject);
  };

// *************************** Delete a project ********************************************************************
function deleteThisProject(event) {
  console.log("Deleting a project");
  let buttonId = event.target.id;
  myProjects.splice(buttonId, 1);
  console.log(myProjects);

  // *************************** Clear the input rows in the form ***************************
  console.log("Clearing the table");
  $("#my-table > tbody > tr > td").remove();
  
  // *************************** Save the updated array and reload the projects into the table ***************************
  saveToLocalStorage();
  getProjects();
  displayProjects();
};


function saveToLocalStorage() {
  console.log("Saving projects");
  localStorage.setItem("myStoredProjects", JSON.stringify(myProjects));
}

  // *************************** Verify close without saving ***************************
  $("#modal-close").on("click", function () { 
    console.log("Close button clicked");
    let myModal = $("#staticBackdrop");
    if ( $("#project-name").val() === "" && $("#project-type").val() === "Select" && $( "#datepicker" ).val() === "" ) {
      console.log("Closing modal");
      myModal.modal("toggle");
    }
    else
     if ( $("#project-name").val() || $("#project-type").val() !== "Select" || $( "#datepicker" ).val() ) {
      if (confirm("Are you sure you want to close without saving?") === true) {
        console.log("Closing modal without saving");
        myModal.modal("toggle");
        $("#project-name").val("");
        $("#project-type").val("Select");
        $("#datepicker").val("");
      }
      else {
        console.log("Leaving modal open");
      };
    };   
  });

  // *************************** Select the project due date from an interactive calendar displayed in an overlay *********
$( function() {
  $( "#datepicker" ).datepicker();
  $( "#datepicker" ).on( "change", function() {
    let dueDate = dayjs($( "#datepicker" ).val()).format("MMMM D, YYYY");
    $( "#datepicker" ).val(dueDate);
  });
  });  

  // *************************** Submit form event handler ***************************
  $("form").on("submit", function() {
    console.log("Validating input");

    // *************************** Checking for empty fields ***************************
    if ($("#project-name").val().length === 0) {
      alert("Project Name cannot be blank.");
      return false;
    }
    else {
      var projectName = $("#project-name").val();
    };
    if ($("#project-type").val() === "Select") {
      alert("You must select a project type.");
      return false;
    }
    else {
    var projectType = $("#project-type").val();    
    };
    if ($("#datepicker").val().length === 0) {
      alert (" You must specify a due date for your project.");
      return false;
    }
    else {
      var dueDate = $("#datepicker").val()
    };

    // *************************** Define the new project's key-value pairs for local storage ***************************
    console.log("Creating new project object");
    let project = {
      pName: projectName,
      pType: projectType, 
      pDue: dueDate
    };
    
    // *************************** Clear the input rows in the form ***************************
    console.log("Clearing the form");
    $("#project-name").val("");
    $("#project-type").val("Select");
    $("#datepicker").val("");

    // A*************************** dd the project to the array of projects ***************************
    console.log("Adding new project to myProjects");
    myProjects.push(project);
    saveToLocalStorage();
    getProjects();
    displayProjects();
  });
});
