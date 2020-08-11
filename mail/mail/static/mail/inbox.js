document.addEventListener('DOMContentLoaded', function () {

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
  document.querySelector('#emailslist').style.display = 'none';
  document.querySelector('#emaildetail').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  SendMail();


}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#emailslist').style.display = 'block';
  document.querySelector('#emaildetail').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  Mailbox(mailbox);

}


function Mailbox(mailbox){

  const url = `/emails/${mailbox}`;
  const mydiv = document.querySelector('#emailslist');
  mydiv.innerHTML= "";



  fetch(url)
  .then((response) => response.json())
  .then(emails => {
      emails.forEach((e) => {
          console.log(e.id);
          const ediv = document.createElement('div');
          if (e.read == 0){
            if (`${mailbox}` == "inbox") {
                  ediv.innerHTML = `
                        <table class="table">
                            <tbody>
                               <tr>
                                 <td style="width:300px"><strong> ${e.sender}</strong> </td>
                                 <td style="width:200px"><strong> ${e.subject} </strong></td>
                                 <td style="width:200px"><strong> ${e.timestamp} </strong></td>
                                 <td style="width:50px"> <button class="btn" onclick="ViewEmail(${e.id},${mailbox})">
                                        <i class="fab fa-readme" style="font-size:24px;"></i> </button></td>
                               </tr>
                            </tbody>
                        </table>`;
            }
            else {
                ediv.innerHTML = `
                    <table class="table">
                          <tbody>
                              <tr>
                                <td style="width:300px"><strong> ${e.recipients}</strong> </td>
                                <td style="width:200px"><strong> ${e.subject} </strong></td>
                                <td style="width:200px"><strong> ${e.timestamp} </strong></td>
                                <td style="width:50px"> <button class="btn" onclick="ViewEmail(${e.id},${mailbox})">
                                      <i class="fab fa-readme" style="font-size:24px;"> </i></button></td>
                              </tr>
                          </tbody>
                    </table>  `;
            }
          }
          else {
              if (`${mailbox}` == "inbox") {
                 ediv.innerHTML = `
                      <table class="table"  style="background-color:#f2f2f2  ;">
                            <tbody>
                              <tr>
                                <td style="width:300px">  ${e.sender}</td>
                                <td style="width:200px">  ${e.subject} </td>
                                <td style="width:200px">  ${e.timestamp} </td>
                                <td style="width:50px"> <button class="btn" onclick="ViewEmail(${e.id},${mailbox})">
                                  <i class="fab fa-readme" style="font-size:24px;"> </i></button></td>
                              </tr>
                            </tbody>
                      </table>`;
              }
              else{
                  ediv.innerHTML = `
                      <table class="table"  style="background-color:#f2f2f2  ;">
                          <tbody>
                              <tr>
                                <td style="width:300px">  ${e.recipients}</td>
                                <td style="width:200px">  ${e.subject} </td>
                                <td style="width:200px">  ${e.timestamp} </td>
                                <td style="width:50px"> <button class="btn" onclick="ViewEmail(${e.id},${mailbox})">
                                      <i class="fab fa-readme" style="font-size:24px;"></i> </button></td>
                              </tr>
                          </tbody>
                      </table>`;
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
        fetch('/emails', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
               recipients: document.querySelector('#compose-recipients').value,
               subject: document.querySelector('#compose-subject').value,
               body: document.querySelector('#compose-body').value,
               })
        })
        .then(response => response.json())
        .then(function(result ){
               // Print result
               console.log(result);
                load_mailbox('sent');

        })
        .catch(function(error) {
              console.log('There has been a problem with your fetch operation: ' + error.message );
        });

  };
}


function ViewEmail(id, mailbox){
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#emailslist').style.display = 'none';
    document.querySelector('#emaildetail').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    const mdetail = document.querySelector('#emaildetail');
    mdetail.innerHTML= "";
    const url = `/emails/${id}`;

    fetch(url)
    .then(response => response.json())
    .then(email => {
         // Print email
        console.log(email);
         // ... do something else with email ...
        if (mailbox != 'sent'){
             mdetail.innerHTML = `<hr>
             <table style= "border:none;">
                <tbody>
                    <tr>
                    <td ><strong>From:  </strong>  ${email.sender}</td>
                    <td ><strong>To:    </strong>  ${email.recipients} </td>
                    </tr>
                    <tr>
                    <td ><strong>Subject: </strong> ${email.subject} </td>
                    <td ><strong>Date:    </strong> ${email.timestamp}</td>
                    </tr>
                </tbody>
             </table>
             <br>
             <div class="email-buttons row">
                <button class="btn btn-sm btn-outline-primary" id="reply"   style="position: relative; left:520px;" onclick="Reply(${id},${email.sender}, ${email.recipients}, ${email.subject},${email.body})"> Reply</button>
                <button class="btn btn-sm btn-outline-primary" id="read"    style="position: relative; left:550px;" onclick="Markread(${id}, ${email.read})" >           ${email.read ?  "Mark as Unread" : "Mark as Read"}</button>
                <button class="btn btn-sm btn-outline-primary" id="archive" style="position: relative; left:580px;" onclick="ArchiveandUnarchive(${id},${email.archived})"> ${email.archived ? "Unarchive" : "Archive"    }</button>
             </div>
             <hr>
             ${email.body} `;
          }
          else{
            mdetail.innerHTML = `<hr>
            <table style= "border:none;">
               <tbody>
                   <tr>
                   <td ><strong>From:  </strong>  ${email.sender}</td>
                   <td ><strong>To:    </strong>  ${email.recipients} </td>
                   </tr>
                   <tr>
                   <td ><strong>Subject: </strong> ${email.subject} </td>
                   <td ><strong>Date:    </strong> ${email.timestamp}</td>
                   </tr>
               </tbody>
            </table>
            <br>
               ${email.body} `;




          }

    });

}


function ArchiveandUnarchive(id, flag){
  const url = `/emails/${id}`;

  fetch(url, {
    method: "PUT",
    body: JSON.stringify({
      archived: flag,
      }),
  });
  load_mailbox('archive');

}

function Markread(id, flag){
  const url = `/emails/${id}`;

  fetch(url, {
    method: "PUT",
    body: JSON.stringify({
         read:  flag,
         }),
    });
  load_mailbox('inbox');
}




function Reply(id, sender, recipients, subject , body){

    console.log(id,  sender, recipients, subject);
    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#emailslist').style.display = 'none';
    document.querySelector('#emaildetail').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';


    document.querySelector("#compose-recipients").value = sender;
    document.querySelector("#compose-subject").value = "RE:" +  subject;

    remembermsg = `${sender}   wrote:\n${body}\n on ${timestamp}`;
    document.querySelector("#compose-body").value = remembermsg;




}
/* no chrome usar :

"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --user-data-dir="D:/CS50" --disable-web-security

*/
