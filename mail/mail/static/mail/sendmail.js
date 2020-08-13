document.addEventListener("DOMContentLoaded", SendMail() );



function SendMail() {
  const maildata = document.querySelector('#compose-form');

  console.log("SendMail");

  maildata.addEventListener('submit', () => {

     recipients = document.querySelector('#compose-recipients').value;
     subject = document.querySelector('#compose-subject').value;
     body = document.querySelector('#compose-body').value;

     console.log(recipients);
     console.log(subject);
     console.log(body );

     fetch('/emails', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
           },
        body: JSON.stringify({
              recipients: recipients,
              subject: subject,
              body: body
              })
        })
      .then(response => response.json())
      .then(result => {
            console.log(result.status);

          if (result.status == 201) {
               alert("Message Sent!");
               load_mailbox('sent');
          }
          else {
                alert("Something wrong trying to send message -> " `${result.status}`);
                compose_email();

          }
      });

  };
}
