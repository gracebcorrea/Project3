document.addEventListener('DOMContentLoaded', function () {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => {load_mailbox('inbox'), Mailbox_List('inbox')});
    document.querySelector('#sent').addEventListener('click', () => {load_mailbox('sent'),Mailbox_List('sent')});
    document.querySelector('#archived').addEventListener('click', () => {load_mailbox('archive'),Mailbox_List('archive')});
    document.querySelector('#compose').addEventListener('click', compose_email);

    // By default, load the inbox
    load_mailbox('inbox');
    Mailbox_List('inbox');


/*    window.onpopstate = function(event) {
        console.log(event.state.section);
    }

    document.querySelectorAll('button').forEach(button => {
        button.onclick = function() {
            const section = this.dataset.section;
            history.pushState({section: section}, "emails", `${section}`);
            };
    });*/
});

function compose_email() {


  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#emailslist').style.display = 'none';
  document.querySelector('#emaildetail').style.display = 'none';
  document.querySelector('#message').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  console.log( "compose_email");

  document.querySelector('#submit').addEventListener('click', function() {
        console.log('submit send clicked!');
        recipients = document.querySelector('#compose-recipients').value;
        subject = document.querySelector('#compose-subject').value;
        body = document.querySelector('#compose-body').value;
        send_email(`${recipients}`, `${subject}`,`${body}`);

        });
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#emailslist').style.display = 'block';
  document.querySelector('#message').style.display = 'block';
  document.querySelector('#emaildetail').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


}


// See list of e-mails for each mailbox
function Mailbox_List(mailbox){
  if (mailbox == "inbox"){
      Inbox_list();

  }
  if (mailbox == "sent"){
     Sent_list();

  }
  if (mailbox == "archive"){
     Archived_list();

  }

}

//view all details from a selected e-mail
function ViewEmail(id, mailbox){
    console.log("ViewEmail");
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#emailslist').style.display = 'none';
    document.querySelector('#emaildetail').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';


    const mdetail = document.querySelector('#emaildetail');
          mdetail.innerHTML= "";
    const detailpart = document.createElement('div');

    fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
         // Print email
        console.log("EMAIL CONTENT : ");
        console.log(email);

        if (email.read== 0){
             Markread( `${id}`,0);
        }

         // ... do something else with email ...
        if (mailbox != "sent"){
             detailpart.innerHTML = `<hr>
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
                <hr>
                   ${email.body}
                <hr>
                <div class="email-buttons row">
                      <button class="btn btn-sm btn-outline-primary" id="reply"   onclick="Reply(${id})" style="position: relative; left:530px;" > Reply</button>
                      <button class="btn btn-sm btn-outline-primary" id="read"    onclick="Markread( ${id}, ${email.read})"  style="position: relative; left:550px;"  > ${email.read ?  "Mark as Unread" : "Mark as Read"}</button>
                      <button class="btn btn-sm btn-outline-primary" id="archive" onclick="ArchiveandUnarchive(${id}, ${email.archived})" style="position: relative; left:570px;"  > ${email.archived ? "Unarchive" : "Archive"    }</button>
                </div> `
        }
        else{
            detailpart.innerHTML = `<hr>
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
              <hr>
              ${email.body}
              <hr>`
        }
        document.querySelector('#emaildetail').append( detailpart);
     });
    //document.querySelector("#reply").addEventListener('click', Reply(id, mailbox));
    //onclick="Reply(${id}, ${mailbox})"

}




function ArchiveandUnarchive(id, flag){
  const url = `/emails/${id}`;
  console.log("ArchiveandUnarchive");
  console.log(`${id}`,`${flag}`);
  fetch(url, {
    method: "PUT",
    body: JSON.stringify({
      archived: !flag,
      }),

  });



}

function Markread(id, flag){
  const url = `/emails/${id}`;
  console.log("Markread");
  console.log(`${id}`,`${flag}`);

  fetch(url, {
    method: "PUT",
    body: JSON.stringify({
         read: !flag,
         })
  });

}

function Reply(id){
    console.log("Inside reply");
    const url = `/emails/${id}`;

      // Show compose view and hide other views
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#emailslist').style.display = 'none';
      document.querySelector('#emaildetail').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'block';

      // Clear out composition fields
      document.querySelector('#compose-recipients').value = '';
      document.querySelector('#compose-subject').value = '';
      document.querySelector('#compose-body').value = '';

    fetch(url)
    .then(response => response.json())
    .then(email => {
         // Print email
        console.log("EMAIL CONTENT : ");
        console.log(email);
        document.querySelector("#compose-recipients").value = email.sender;
        document.querySelector("#compose-subject").value = "RE: " +  email.subject;
        remembermsg = `${email.sender}   wrote:\n${email.body}\n on ${email.timestamp}`;
        document.querySelector("#compose-body").value = remembermsg;
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    document.querySelector('#submit').addEventListener('click', function() {
        console.log('Reply send clicked!');
        recipients = document.querySelector('#compose-recipients').value;
        subject = document.querySelector('#compose-subject').value;
        body = document.querySelector('#compose-body').value;
        send_email(`${recipients}`, `${subject}`,`${body}`);

        });

}




function send_email(recipients, subject, body){

   console.log("Inside SendMail : ", `${recipients}`,`${subject}`, `${body}`);

   fetch('/emails' , {
       method: 'POST',
       headers: {
                'Content-Type': 'application/javascript;charset=UTF-8',
              },
       body: JSON.stringify({
             recipients: `${recipients}`,
             subject: `${subject}`,
             body: `${body}`,
             })
       })
       .then(response => response.json())
       .then(result => {
            load_mailbox('sent');
            document.querySelector('#message').innerHTML=`<div class="alert alert-success" >Message Sent!</div>`;
            Sent_list();

       })
        .catch((error) => {
              document.querySelector('#message').innerHTML=`<div class="alert alert-danger" >${error}</div>`;
              console.error('Error:', error)
        });

}

function Sent_list(){
    //new way
    const sentdiv = document.querySelector('#emailslist');
    sentdiv.innerHTML= "";
    console.log("Sent_list()" );

    fetch(`/emails/sent`)
    .then((response) => response.json())
    .then(emails => {
            console.log(emails);
            emails.forEach((s) => {
                const newsent = document.createElement('div');
                newsent.innerHTML = `
                <table class="table"  style="background-color:#f2f2f2  ;">
                        <tbody>
                            <tr>
                            <td style="width:300px">  ${s.recipients}</td>
                            <td style="width:200px">  ${s.subject} </td>
                            <td style="width:200px; align:right;">  ${s.timestamp} </td>
                            <td style="width:100px;"><button class="btn" id="ViewEmail"  onclick="ViewEmail(${s.id},'sent');"  >
                                <i class="fab fa-readme" style="font-size:24px;"></i>
                            </button></td>
                            </tr>
                            </tbody>
                      </table>`;

                sentdiv.append(newsent);
            })

    })
    .catch(function(error) {
          document.querySelector('#message').innerHTML=`
               <div class="alert alert-danger" >
                    <span class="closebtn" > Sent error  -  ${error}</span>
               </div>`;
          window.stop();
    })
}

function Archived_list(){

  const archdiv = document.querySelector('#emailslist');
  archdiv.innerHTML= "";
  console.log("Archived_list()" );

  fetch(`/emails/archive`)
  .then((response) => response.json())
  .then(emails => {
        console.log(emails);
        emails.forEach((a) => {
            const adiv = document.createElement('div');
            adiv.innerHTML = `
                      <table class="table"  style="background-color:#f2f2f2  ;">
                          <tbody>
                              <tr>
                                <td style="width:300px">  ${a.recipients}</td>
                                <td style="width:200px">  ${a.subject} </td>
                                <td style="width:200px; align:right;">  ${a.timestamp} </td>
                                <td style="width:100px;"><button class="btn" id="ViewEmail"  onclick="ViewEmail(${a.id},'archive');"  >
                                <i class="fab fa-readme" style="font-size:24px;"></i>
                                </button></td>
                              </tr>
                          </tbody>
                      </table>`;
              archdiv.append(adiv);
        })

  })
  .catch(function(error) {
      document.querySelector('#message').innerHTML=`
           <div class="alert alert-danger" >  Archive error  -  ${error}
           </div>`;

  });
}

function Inbox_list(){
    const indiv = document.querySelector('#emailslist');
    indiv.innerHTML= "";
    console.log("Inbox_list()" );

    fetch(`/emails/inbox`)
    .then((response) => response.json())
    .then(emails => {
        console.log(emails);
        emails.forEach((i) => {

            const ediv = document.createElement('div');
            if (i.read == 0){
                  ediv.innerHTML = `
                      <table class="table">
                          <tbody>
                                 <tr>
                                   <td style="width:300px"><strong> ${i.sender}</strong> </td>
                                   <td style="width:200px"><strong> ${i.subject} </strong></td>
                                   <td style="width:200px"><strong> ${i.timestamp} </strong></td>
                                   <td style="width:100px;"><button class="btn" id="ViewEmail" onclick="ViewEmail(${i.id},'inbox');"  >
                                   <i class="fab fa-readme" style="font-size:24px;"></i>
                                   </button></td>
                                 </tr>
                          </tbody>
                      </table>`;
            }
            else {
                 ediv.innerHTML = `
                        <table class="table"  style="background-color:#f2f2f2;">
                            <tbody>
                                <tr>
                                  <td style="width:300px">  ${i.sender}</td>
                                  <td style="width:200px">  ${i.subject} </td>
                                  <td style="width:200px; align:right;">  ${i.timestamp} </td>
                                  <td style="width:100px;"><button class="btn" id="ViewEmail"  onclick="ViewEmail(${i.id},'inbox');"  >
                                  <i class="fab fa-readme" style="font-size:24px;"></i>
                                  </button></td>
                                </tr>
                            </tbody>
                        </table>`;

            }
            indiv.append(ediv);

        })
    })
    .catch(function(error) {
        document.querySelector('#message').innerHTML=`
             <div class="alert alert-danger" >  Inbox error  -  ${error}
             </div>`;



    });

}

/* no chrome usar :

chrome.exe --user-data-dir="D:\CS50" --disable-web-security

no mozzilla

   headers: { 'Content-Type': 'application/json' },

"C:\Program Files\Mozilla Firefox\firefox.exe" --network.http.referer.XOriginPolicy==0


*/
