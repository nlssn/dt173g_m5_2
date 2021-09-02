"use strict"

const table = document.getElementById('courses');
const courseForm = document.getElementById('course-form');

const inputName = document.getElementById('name');
const inputCode = document.getElementById('code');
const inputProgression = document.getElementById('progression');
const inputSyllabus = document.getElementById('syllabus')

window.addEventListener('load', getCourses);
courseForm.addEventListener('submit', (e) => {
   e.preventDefault();

   addCourse();

   inputName.value = '';
   inputCode.value = '';
   inputProgression.value = 'A';
   inputSyllabus.value = '';
})

function getCourses() {
   // Clear our any previous content
   table.innerHTML = '';

   // Use fetch to get data from the REST API
   fetch('https://studenter.miun.se/~joni1307/DT173G/Moment5/Del1/api.php')
      .then(response => response.json())
      .then(data => outputTable(data['data']))
      .catch(error => console.log(error))
}

function createTableHead(table, data) {
   table.creatTHead();
}

function outputTable(courses) {
   // Output the table headings
   const headings = ['Kurskod', 'Kursnamn', 'Progression', 'Länk', "Radera"];
   const tableHead = document.createElement('tr');

   headings.forEach((th) => {
      const el = document.createElement('th');
      const text = document.createTextNode(th);
      el.append(text);
      tableHead.append(el);
      table.append(tableHead);
   });

   // Output a row for each course
   courses.forEach((course) => {
      const row = document.createElement('tr');

      const code = document.createElement('td');
      const codeText = document.createTextNode(course.code);
      code.append(codeText);

      const name = document.createElement('td');
      const nameText = document.createTextNode(course.name);
      name.append(nameText);

      const progression = document.createElement('td');
      const progressionText = document.createTextNode(course.progression);
      progression.append(progressionText);

      const syllabus = document.createElement('td');
      const syllabusLink = document.createElement('a');
      syllabusLink.innerHTML = '<i class="fa fa-file-text-o" aria-hidden="true"></i>';
      syllabusLink.href = course.syllabus;
      syllabus.append(syllabusLink);

      const remove = document.createElement('td')
      const removeLink = document.createElement('a');
      removeLink.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>';
      removeLink.addEventListener('click', () => { removeCourse(course.id); });
      remove.append(removeLink);

      row.append(code);
      row.append(name);
      row.append(progression);
      row.append(syllabus);
      row.append(remove);

      table.append(row);
   });
}

function addCourse() {
   const name = inputName.value;
   const code = inputCode.value;
   const progression = inputProgression.value;
   const syllabus = inputSyllabus.value;

   const course = {
      'name': name,
      'code': code,
      'progression': progression,
      'syllabus': syllabus
   };

   fetch('https://studenter.miun.se/~joni1307/DT173G/Moment5/Del1/api.php', {
      method: 'POST',
      body: JSON.stringify(course),
   })
      .then(response => response.json())
      .then(data => {
         getCourses();
      })
      .catch(error => console.log(error));
}

function removeCourse(id) {
   fetch('https://studenter.miun.se/~joni1307/DT173G/Moment5/Del1/api.php?id=' + id, {
      method: 'DELETE',
   })
      .then(response => response.json())
      .then(data => {
         getCourses();
      })
      .catch(error => console.log(error));
}