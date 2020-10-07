'use strict'
// The API URL
const apiURL = 'https://studenter.miun.se/~joni1307/DT173G/Moment5/Del1/api.php';

// Elements
const table = document.getElementById('courses');
const courseForm = document.getElementById('course-form');
const inputName = document.getElementById('name');
const inputCode = document.getElementById('code');
const inputProgression = document.getElementById('progression');
const inputSyllabus = document.getElementById('syllabus');
const message = document.getElementById('message');

// Event listeners
window.addEventListener('load', init);

courseForm.addEventListener('submit', (e) => {
   e.preventDefault();

   addCourse();
});

function init() {
   // Use fetch to get course data from the API
   fetch(apiURL)
      // Turn the response into JSON
      .then(response => response.json()) 
      // Now we're able to work with the data..
      .then(data => {
         let courses = data['data'];
         // Clear previous content from table
         table.innerHTML = '';
         // Loop trough the courses to generate the table body
         courses.forEach(course => { 
            generateTableContent(table, course);
         });
         // Finish by generating the table head
         generateTableHead(table); 
      })
      // If there are any errors along the way, log them to the console
      .catch(error => { error ? console.log(error) : null; } ) 
}

// Create a <th>-element for each heading in thearray, then append it to row
function generateTableHead(table) {
   let headings = ['Kurskod', 'Kursnamn', 'Progression', 'Kursplan', 'Radera'];
   let thead = table.createTHead();
   let row = thead.insertRow();

   for (let heading of headings) {
      let th = document.createElement('th');
      let text = document.createTextNode(heading);
      th.appendChild(text);
      row.appendChild(th);
   }
}

// Create a row for each course and a cell for each piece of information (key)
function generateTableContent(table, data) {
   let course = data;
   let row = table.insertRow();

   Object.keys(course).forEach(key => {

      if(key != 'id') { // Don't create a cell for the id key
         let cell = row.insertCell();
         let content;

         if(key == 'syllabus') { // For the syllabus key, create a link instead of a string
            let link = document.createElement('a');
            link.href = course[key];
            text = document.createTextNode('Länk');
            link.appendChild(text);
            content = link;
         } else {
            content = document.createTextNode(course[key]);
         }

         cell.appendChild(content);
      }

   });

   // Finish the row by adding a cell with a delete-link
   let cell = row.insertCell();
   let link = document.createElement('a');
   let text = document.createTextNode('Radera');
   link.href = '#0';
   link.addEventListener('click', () => { removeCourse(course['id']) });
   link.appendChild(text);
   let content = link;
   cell.appendChild(content);
}

// Use fetch to add a course
function addCourse() {
   // Get all the values from the form
   const name = inputName.value;
   const code = inputCode.value;
   const progression = inputProgression.value;
   const syllabus = inputSyllabus.value;

   // Create a course object
   const course = {
      'code': code,
      'name': name,
      'progression': progression,
      'syllabus': syllabus
   };

   // Use fetch with the POST method, send the course object as body
   fetch(apiURL, {
      method: 'POST',
      body: JSON.stringify(course),
   })
      .then(response => response.json())
      .then(json => {
         displayMessage(json.message);
         init();
      })
      .catch(error => console.log(error))

   // Clear the form
   inputName.value = '';
   inputCode.value = '';
   inputProgression.value = 'A';
   inputSyllabus.value = '';
}

// Use fetch to remove a course, then display a message and update the table
function removeCourse(id) {
   fetch(`${apiURL}?id=${id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(json => {
         displayMessage(json.message);
         init();
      })
      .catch(error => console.log(error)) 
}

// Displays a message above the table, then hides it after 5 seconds
function displayMessage(text) {
   message.innerHTML = `<p>${text}</p>`;
   message.className = 'visible';
   setTimeout(() => {
      message.className = 'hidden';
   }, 5000);
}