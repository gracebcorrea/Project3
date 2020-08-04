document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}


window.onpopstate = function(event) {
    console.log(event.state.section);
    showSection(event.state.section);
}

function Send_Mail(recipients, subject, body) {

  fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients:  document.getElementByid("compose-recipients").value,
          subject:  document.getElementByid("compose-subject").value,
          body: document.getElementByid("compose-body").value,
      })
  })
  .then(response => response.json())
  .then(result => {
       // Print result
       console.log(result);
  });


}


function Mailbox(){

  fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      // ... do something else with emails ...
  });


}


function View_Email(){


}



function Archive_and_Unarchive(){



}




function Reply(){


}
