document.addEventListener('DOMContentLoaded', function () {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => { load_mailbox('inbox'); Mailbox('inbox') });
    document.querySelector('#sent').addEventListener('click', () => {load_mailbox('sent') ; Mailbox('sent') });
    document.querySelector('#archived').addEventListener('click', () => {load_mailbox('archive') ; Mailbox('archive') });

    // By default, load the inbox
    load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#emailslist').style.display = 'none';
  document.querySelector('#emaildetail').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('#compose-view').addEventListener('DOMContentLoaded', SendMail());


}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#emailslist').style.display = 'block';
  document.querySelector('#emaildetail').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3><hr>`;


}


function Mailbox(mailbox){

  const mydiv = document.querySelector('#emailslist');
  const url = `/emails/${mailbox}`;


    fetch(url)
    .then((response) => response.json())
    .then(emails => {
         /*for (let e of emails) {*/
          emails.forEach((e) => {
              console.log(e.id);
              const ediv = document.createElement('div');
              if (mailbox == 'inbox') {
                  if (e.read == 0){
                     ediv.innerHTML = `<br><strong> <a href= "">${e.id} </a> /  ${e.sender} /  ${e.subject} /  ${e.timestamp} </strong><br> `;
                     }
                  else {
                  ediv.innerHTML = `<br><a href= "">${e.id} </a> /  ${e.sender} /  ${e.subject} /  ${e.timestamp} <br> `;
                  }

              }
              else {
                  if (e.read == 0){
                    ediv.innerHTML = `<br><strong> <a href= "">${e.id} </a> / ${e.recipients} / ${e.subject} / ${e.timestamp} </strong> <br> `;

                  }
                  else {
                    ediv.innerHTML = `<br> <a href= "">${e.id} </a> / ${e.recipients} / ${e.subject} / ${e.timestamp} <br> `;
                  }
              }
              document.querySelector('#emailslist').append( ediv);

          })
    })
    .catch(function(error) {
       console.log('Looks like there was a problem: \n', error);
     });


}

function SendMail() {
  const maildata = document.querySelector('#compose-form');
  maildata.onsubmit = () => {
     recipients = document.querySelector('#compose-recipients').value;
     subject = document.querySelector('#compose-subject').value;
     body = document.querySelector('#compose-body').value;

     fetch('/emails', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
           },
        body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
        }),
        })
      .then(response => response.json())
      .then(result => {
          console.log(result);
          if (result.status == 201) {
               /*alert("Message Sent!");*/
               load_mailbox("sent");
          }
          else {
                alert("Something wrong trying to send message -> " `${result.status}`);

          }
      });

  };
}


function ViewEmail(){



}


function ArchiveandUnarchive(){




}

function Reply(){






}
/* no chrome usar :

"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --user-data-dir="D:/CS50" --disable-web-security

*/
