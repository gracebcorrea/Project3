document.addEventListener( "DOMContentLoaded",  function () {
    console.log("SendMail");
    document.querySelector("#compose-form").addEventListener('submit', () => {

        fetch("/emails", {
        method: "POST",
        headers: { 'Accept': 'application/json',
                   'Content-Type': 'application/json; charset=UTF-8',
                   'Access-Control-Allow-Origin': "*", },
        body: JSON.stringify({
            recipients:  document.querySelector("#compose-recipients").value,
            subject: document.querySelector("#compose-subject").value,
            body: document.querySelector("#compose-body").value,
        }),
        })
        .then((response) => response.json())
        .then(result => {
            console.log(result.status);

            if (result.status == 201) {
                  load_mailbox('sent');
            }
            else {
                console.log(result.error);
            }
        });
    });
  },
);

/*
function send_email(recipients, subject, body){


  console.log("SendMail");
  document.querySelector('#submit').addEventListener('click', function() {
        console.log('submit clicked!');
        recipients = document.querySelector('#compose-recipients').value;
        subject = document.querySelector('#compose-subject').value;
        body = document.querySelector('#compose-body').value;
        });

   console.log(recipients, subject , body);

    fetch('/emails', {
       method: 'POST',
       headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
       body: JSON.stringify({
             recipients: recipients,
             subject: subject,
             body: body,
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


         }
     });

}
*/
