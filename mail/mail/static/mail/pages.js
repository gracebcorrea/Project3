window.onpopstate = function(event) {
            console.log(event.state.section);
            showSection(event.state.section);
        }

        function showSection(section) {

            fetch(`${section}`)
            .then(response => response.text())
            .then(text => {
                console.log(text);
                document.querySelector('#content').innerHTML = text;
            });

        }

        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('button').forEach(button => {
                button.onclick = function() {
                    const section = this.dataset.section;
                    history.pushState({section: section}, "", `${section}`);
                    showSection(section);
                };
            });
        });
