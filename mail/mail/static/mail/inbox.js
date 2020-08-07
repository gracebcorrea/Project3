document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => {load_mailbox('inbox'); Mailbox('inbox')});
  document.querySelector('#sent').addEventListener('click', () => {load_mailbox('sent'); Mailbox('sent')});
  document.querySelector('#archived').addEventListener('click', () => {load_mailbox('archive');Mailbox('archive')});
  document.querySelector('#compose').addEventListener('click', compose_email);

    // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#emailslist').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#emailslist').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';



  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3><hr>`;

}

function createNode(element) {
     return document.createElement(element);
 }

 function append(parent, el) {
   return parent.appendChild(el);
 }



function Mailbox(mailbox){
  const ul = document.getElementById('emailslist');


  fetch("/emails/<mailbox>")
  .then(response => response.json())
  .then(function(emails) => {
      let emailslist = emails.results;
      return emailslist.map(function(e) {
        let li = createNode('li'),
            span = createNode('span');
            span.innerHTML = `${e.id} ${e.sender} ${e.recipients"} ${e.subject} ${e.timestamp} `;
            append(li, span);
            append(ul, li);
        })
      })
      .catch(function(error) {
        console.log(JSON.stringify(error));
      });

}







function Send_Mail() {
  const recipients = document.querySelector("#compose-recipients").value;
  const subject = document.querySelector("#compose-subject").value;
  const body = document.querySelector("#compose-body").value;

  /* POST /emails  */

  fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body:body,
      })
  })
  .then(response => response.json())
  .then(result => {
       // Print result
       console.log(result);
  });


}
