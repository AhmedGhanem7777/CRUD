// Variables for DOM elements
var profilePhoto = document.getElementById('profilePhoto')
var inputPhoto = document.getElementById('inputPhoto')
var nameInput = document.getElementById('nameInput')
var ageInput = document.getElementById('ageInput')
var cityInput = document.getElementById('cityInput')
var emailInput = document.getElementById('emailInput')
var phoneInput = document.getElementById('phoneInput')
var startDateInput = document.getElementById('startDateInput')
var tableList = document.getElementById('tableList')
var addBtn = document.getElementById('addBtn')
var deleteAll = document.getElementById('deleteAll')
var resetBtn = document.getElementById('resetBtn')
var searchInput = document.getElementById('searchInput')
var allInput = document.querySelectorAll('.inputContent .input input')
var currentIndexForUpdate
var btnMood = 'add'
var searchMood = 'name'
var photoBtn = document.getElementById('photoBtn')
var updateBtn = document.getElementById('updateBtn')


// Regular expression patterns
var namePattern = /^[A-Z][a-z]{2,9}$/;
var cityPattern = /^[A-Za-z]{2,9}$/;
var agePattern = /^[0-9]{1,3}$/;
var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
var phonePattern = /^(010|011|012|015)[0-9]{8}$/;


// Initial form state
var isValid = true
addBtn.disabled = true



// Initialize usersList array and populate from localStorage if available
var usersList = []
if (JSON.parse(localStorage.getItem('userList')) != null) {
    usersList = JSON.parse(localStorage.getItem('userList'))

    // Display existing user data
    displayData(usersList)
}



// Event listener for inputPhoto change event
inputPhoto.addEventListener('change', function () {
    var reader = new FileReader();
    reader.onload = function (e) {
        // Update profile photo preview with selected image
        profilePhoto.src = e.target.result;
    }

    // Read the selected file as a data URL
    reader.readAsDataURL(inputPhoto.files[0]);
});



// Event listener for addBtn click event
addBtn.addEventListener('click', function () {
    if (validateInputs()) { // Validate form inputs
        if (btnMood === 'add') {
            // Add a new user if in 'add' mode
            addUser()
        } else {
            // Update user data if in 'update' mode
            updateData()
        }

        // Display updated user list
        displayData(usersList)

        // Clear input form
        clearForm()

        // Disable addBtn after action
        addBtn.disabled = true
    }
})



// Event listener for modalBtn click event
modalBtn.addEventListener('click', function () {
    resetFormData(); // Reset form data state
    clearForm(); // Clear input form

    // Change addBtn text to 'Add'
    addBtn.innerHTML = 'Add'

    // Set button mood to 'add' mode
    btnMood = 'add'
})



// Function to add a new user to the usersList array and localStorage
function addUser() {
    // Create a user object with data from input fields
    var user =
    {
        name: nameInput.value,
        age: ageInput.value,
        city: cityInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        startDate: startDateInput.value,
        photo: profilePhoto.getAttribute('src')
    }

    // Add the user object to the usersList array
    usersList.push(user)

    // Store the updated usersList in localStorage
    localStorage.setItem('userList', JSON.stringify(usersList))
}



// Function to display user data in a table
function displayData(list) {
    var container = ''; // Initialize an empty string to store table rows HTML
    for (var i = 0; i < list.length; i++) {
        // Iterate through the list of users and generate table row HTML
        container += `
        <tr>
            <td>${i + 1}</td>
            <td><img src="${list[i].photo}" alt="profile"></td>
            <td>${list[i].name}</td>
            <td>${list[i].age}</td>
            <td>${list[i].city}</td>
            <td>${list[i].email}</td>
            <td>${list[i].phone}</td>
            <td>${list[i].startDate}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick='dispalyFixedData(${i})' data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick='getUpdateInfo(${i})' data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <i class="fa-solid fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser(${i})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>      `
    }

    // Update the tableList element with generated HTML
    tableList.innerHTML = container

    if (list.length > 0) {
        deleteAll.innerHTML =
            `
        <button class="defaultBtn w-75 rounded-5" onclick='deleteAllUsers()'>Delete All</button>`; // Display delete all button if there are users
    } else {
        deleteAll.innerHTML = ''; // Hide delete all button if no users
    }
}



// Function to clear form inputs and reset profile photo
function clearForm() {
    allInput.forEach(input => {
        // Clear input field value
        input.value = '';

        // Remove validation classes from input
        input.classList.remove('is-valid', 'is-invalid');
    })
    profilePhoto.src = 'images/profile.png'; // Reset profile photo to default image
}



// Event listener to clear form on resetBtn click
resetBtn.addEventListener('click', clearForm)



// Function to delete a single user from usersList array and update localStorage and display
function deleteUser(currentIndex) {
    // Remove user at currentIndex from usersList
    usersList.splice(currentIndex, 1)

    // Update localStorage with updated usersList
    localStorage.setItem('userList', JSON.stringify(usersList))

    // Refresh displayed user data in the table
    displayData(usersList)
}



// Function to delete all users from usersList array and localStorage and update display
function deleteAllUsers() {
    localStorage.clear(); // Clear all data in localStorage
    usersList.splice(0); // Remove all users from usersList
    displayData(usersList); // Refresh displayed user data in the table
}



// Function to set search mode based on the selected ID and update search input placeholder
function getSearchMood(id) {
    if (id == 'searchName') {
        searchMood = 'name'; // Set search mode to 'name' if ID is 'searchName'
    } else {
        searchMood = 'city'; // Otherwise, set search mode to 'city'
    }

    // Update search input placeholder
    searchInput.placeholder = `Search by ${searchMood} . . .`
    searchInput.focus(); // Focus on search input field
}



// Function to perform search based on text input and display matching results
function search(txtValue) {
    var container = []; // Initialize an empty array to store matching users

    for (var i = 0; i < usersList.length; i++) {
        // Determine which field to search based on searchMood
        var searchField = searchMood == 'name' ? usersList[i].name : usersList[i].city
        if (searchField.toLowerCase().includes(txtValue.toLowerCase())) {
            // Add user to container if search text matches searchField
            container.push(usersList[i])
        }
    }
    displayData(container); // Display matching users in the table
}



// Function to populate form fields with data of selected user for update
function getUpdateInfo(index) {
    resetFormData(); // Reset form fields and UI
    addBtn.disabled = false; // Enable add/update button
    currentIndexForUpdate = index; // Store the index of the user being updated

    // Populate form fields with data from selected user
    nameInput.value = usersList[index].name
    ageInput.value = usersList[index].age
    cityInput.value = usersList[index].city
    emailInput.value = usersList[index].email
    phoneInput.value = usersList[index].phone
    startDateInput.value = usersList[index].startDate
    profilePhoto.src = usersList[index].photo

    // Change button text to 'Update
    addBtn.innerHTML = 'Update'

    // Set button mode to 'update'
    btnMood = 'update'
}



// Function to update user data in usersList array and localStorage
function updateData() {
    var userItem =
    {
        name: nameInput.value,
        age: ageInput.value,
        city: cityInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        startDate: startDateInput.value,
        photo: profilePhoto.getAttribute('src')
    }

    // Update user data at currentIndexForUpdate in usersList
    usersList[currentIndexForUpdate] = userItem

    // Update localStorage with updated usersList
    localStorage.setItem('userList', JSON.stringify(usersList))

    // Change button text back to 'Add'
    addBtn.innerHTML = 'Add'

    // Set button mode to 'add'
    btnMood = 'add'
}



// Function to display fixed data for viewing
function dispalyFixedData(index) {
    // Populate form fields with data from selected user
    nameInput.value = usersList[index].name;
    ageInput.value = usersList[index].age;
    cityInput.value = usersList[index].city;
    emailInput.value = usersList[index].email;
    phoneInput.value = usersList[index].phone;
    startDateInput.value = usersList[index].startDate;
    profilePhoto.src = usersList[index].photo;

    // Hide buttons and adjust styles for readonly view
    addBtn.style.visibility = 'hidden'; // Hide add/update button
    resetBtn.style.visibility = 'hidden'; // Hide reset button

    photoBtn.style.pointerEvents = 'none'; // Disable clicking on photo button
    photoBtn.style.opacity = '0.5'; // Reduce opacity of photo button

    // Make all inputs readonly and disable pointer events
    allInput.forEach(input => {
        input.readOnly = true; // Set input fields to readonly
        input.style.pointerEvents = 'none'; // Disable pointer events on inputs
    });
}



// Function to reset form data and enable editing
function resetFormData() {
    addBtn.style.visibility = 'visible'; // Make add/update button visible
    resetBtn.style.visibility = 'visible'; // Make reset button visible
    photoBtn.style.pointerEvents = 'visible'; // Enable clicking on photo button
    photoBtn.style.opacity = '1'; // Set full opacity for photo button

    // Enable editing for all input fields
    allInput.forEach(input => {
        input.readOnly = false; // Allow input fields to be editable
        input.style.pointerEvents = 'visible'; // Enable pointer events on inputs
    });
}



// Function to validate input fields
function validateInputs() {
    isValid = true; // Assume inputs are valid initially

    // Validate name input
    if (!namePattern.test(nameInput.value)) {
        nameInput.classList.add('is-invalid'); // Add 'is-invalid' class for styling
        nameInput.classList.remove('is-valid'); // Remove 'is-valid' class
        isValid = false; // Set isValid to false as input is invalid
    } else {
        nameInput.classList.remove('is-invalid'); // Remove 'is-invalid' class
        nameInput.classList.add('is-valid'); // Add 'is-valid' class for styling
    }

    // Validate age input
    if (!agePattern.test(ageInput.value)) {
        ageInput.classList.add('is-invalid'); // Add 'is-invalid' class for styling
        ageInput.classList.remove('is-valid'); // Remove 'is-valid' class
        isValid = false; // Set isValid to false as input is invalid
    } else { 
        ageInput.classList.remove('is-invalid'); // Remove 'is-invalid' class
        ageInput.classList.add('is-valid'); // Add 'is-valid' class for styling
    }

    // Validate email input
    if (!emailPattern.test(emailInput.value)) {
        emailInput.classList.add('is-invalid'); // Add 'is-invalid' class for styling
        emailInput.classList.remove('is-valid'); // Remove 'is-valid' class
        isValid = false; // Set isValid to false as input is invalid
    } else {
        emailInput.classList.remove('is-invalid'); // Remove 'is-invalid' class
        emailInput.classList.add('is-valid'); // Add 'is-valid' class for styling
    }

    // Validate city input
    if (!cityPattern.test(cityInput.value)) {
        cityInput.classList.add('is-invalid'); // Add 'is-invalid' class for styling
        cityInput.classList.remove('is-valid'); // Remove 'is-valid' class
        isValid = false; // Set isValid to false as input is invalid
    } else {
        cityInput.classList.remove('is-invalid'); // Remove 'is-invalid' class
        cityInput.classList.add('is-valid'); // Add 'is-valid' class for styling
    }

    // Validate phone input
    if (!phonePattern.test(phoneInput.value)) {
        phoneInput.classList.add('is-invalid'); // Add 'is-invalid' class for styling
        phoneInput.classList.remove('is-valid'); // Remove 'is-valid' class
        isValid = false; // Set isValid to false as input is invalid
    } else {
        phoneInput.classList.remove('is-invalid'); // Remove 'is-invalid' class
        phoneInput.classList.add('is-valid'); // Add 'is-valid' class for styling
    }

    // Return true if all inputs are valid, otherwise false
    return isValid; 
}



// Event listener for name input
nameInput.oninput = function () {
    addBtn.disabled = !validateInputs(); // Disable add/update button if inputs are invalid
}


// Event listener for phone input
phoneInput.oninput = function () {
    addBtn.disabled = !validateInputs(); // Disable add/update button if inputs are invalid
}


// Event listener for email input
emailInput.oninput = function () {
    addBtn.disabled = !validateInputs(); // Disable add/update button if inputs are invalid
}


// Event listener for age input
ageInput.oninput = function () {
    addBtn.disabled = !validateInputs(); // Disable add/update button if inputs are invalid
}


// Event listener for city input
cityInput.oninput = function () {
    addBtn.disabled = !validateInputs(); // Disable add/update button if inputs are invalid
}
