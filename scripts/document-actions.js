function save_document_to_localstorage() {
    const document_contents = main_editor_text_input.innerHTML;
    let active_document_object = localStorage.getItem(active_document);
    active_document_object = JSON.parse(active_document_object);
    active_document_object.content = document_contents;

    // get current date and time
    let current_date = new Date();
    current_date = current_date.getTime();
    // const date_time = current_date.getDate() + "/"
    //                 + (current_date.getMonth()+1)  + "/"
    //                 + current_date.getFullYear() + " "
    //                 + current_date.getHours() + ":"
    //                 + current_date.getMinutes() + ":"
    //                 + current_date.getSeconds() + ":"
    //                 + current_date.getMilliseconds();

    active_document_object.last_modified = current_date;

    active_document_object = JSON.stringify(active_document_object);
    localStorage.setItem(active_document, active_document_object);
    console.log('Lagret dokument til localStorage :)');
}

function load_document_from_localstorage(document_uuid) {
    const document_object_unparsed = localStorage.getItem(document_uuid)
    const document_object = JSON.parse(document_object_unparsed);
    console.log('Fetchet dokument ' + document_object.uuid + ' fra localStorage :)');

    main_editor_text_input.innerHTML = document_object.content;
    console.log('Erstattet text inputs innhold med nytt dokument :)');

    const url = new URL(window.location.href)
    url.searchParams.set('document', document_uuid);
    history.replaceState(document_object, "", url);

    active_document = document_object.uuid;

    // fjerner active-document klassen fra alle dokumenter og legger den til i nytt aktivt dokument
    document.querySelectorAll('#document-manager-document-list li').forEach(document_element => {
        document_element.classList.remove('active-document');
    });

    const active_document_element = document.getElementById(document_uuid);
    if (active_document_element) {
        active_document_element.classList.add('active-document');
        console.log("Added active-document class to the current active document");
    }
}

function create_new_local_document() {
    const form_data = new FormData(new_local_document_form);

    // create uuid
    const uuid = self.crypto.randomUUID();

    // get document name from form_data
    const document_name = form_data.get('document_name');

    // tøm inputen i dialogen
    new_local_document_form_document_name.value = '';

    // get current date and time
    let current_date = new Date();
    current_date = current_date.getTime();
    // const date_time = current_date.getDate() + "/"
    //                 + (current_date.getMonth()+1)  + "/"
    //                 + current_date.getFullYear() + " "
    //                 + current_date.getHours() + ":"
    //                 + current_date.getMinutes() + ":"
    //                 + current_date.getSeconds() + ":"
    //                 + current_date.getMilliseconds();

    // when syncing is implemented, run a check to see if user has enabled syncing. if so, enable sync and sync immediately on creation
    const is_sync_enabled = false;

    // create version hash based on current timestamp
    const version_hash = null;

    const document_object = {
        "uuid": uuid,
        "name": document_name,
        "content": null,
        "last_modified": current_date,
        "date_created": current_date,
        "sync_enabled": is_sync_enabled,
        "version_hash": version_hash,
        "last_synced_date": null,
    }

    const document_object_json = JSON.stringify(document_object);
    localStorage.setItem(uuid, document_object_json);
    console.log("Opprettet dokument med navn '" + document_name + "' og UUID '" + uuid + "'");
    load_document_list_from_localstorage()
}

function load_document_list_from_localstorage() {
    document_manager_document_list.innerHTML = '';
    let sorted_documents = [];
    const document_object_structure_example = { // dette objektet brukes for sammenligning av object struktur med objektene hentet fra localstorage i funksjonen under :D
        "uuid": "dette-er-en-eksempel-uuid",
        "name": "dette er et eksempel navn, håper dette funker lmao",
        "content": "her kommer contentet!!",
        "last_modified": "dette er en fin dato! 676767!!",
        "date_created": "enda en fin dato her, gitt!",
        "sync_enabled": "jepsi pepsi, det er det! selvfølgelig vil jeg gi all dataen min til isak!!!",
        "version_hash": "wow jeg er en hash av versjonen til dokumentet",
        "last_synced_date": "syncet i dag bro, nå nettopp, selvfølgelig",
    }

    Object.keys(localStorage).forEach((document_uuid) => {
        const document_object_unparsed = localStorage.getItem(document_uuid)

        try {
            const document_object = JSON.parse(document_object_unparsed);
            if (check_if_object_has_same_keys(document_object_structure_example, document_object)) {
                console.log(document_object);
                sorted_documents.push(document_object);
            }
        } catch (e) {
            return console.error("Ukjent localStorage entry funnet. Objekt er ikke generert av OPN. Hopper over. Feilmelding: " + e);
        }
    });

    sorted_documents.sort(function(a, b){return b.last_modified - a.last_modified});

    sorted_documents.forEach((document_object) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="document-item" onclick="load_document_from_localstorage('${document_object.uuid}')">
                <span>${document_object.name}</span>
            </div>
            <div class="document-actions">
                <button class="document_list_document_share_button" onclick="share_document('${document_object.uuid}')" title="Del dokument">
                    <i class="fa-solid fa-share"></i>
                </button>
                <button class="document_list_document_delete_button" onclick="add_document_uuid_to_delete_form('${document_object.uuid}')" command="show-modal" commandfor="delete-document-dialog" title="Slett dokument">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        li.setAttribute("id", document_object.uuid);
        document_manager_document_list.appendChild(li);
    })

    function check_if_object_has_same_keys(object_1, object_2) {
      const keys_object_1 = Object.keys(object_1);
      const keys_object_2 = Object.keys(object_2);

      if (keys_object_1.length !== keys_object_2.length) return false;

        return keys_object_1.every((key) => Object.hasOwn(object_2, key));
    }
}

function delete_document() {
    const form_data = new FormData(delete_document_form);
    const document_uuid = form_data.get('document-uuid');

    console.log('Sletter dokument ' + document_uuid);

    // tømmer valuen i den usynlige text fielden
    delete_document_form_document_uuid.value = '';

    localStorage.removeItem(document_uuid);
    console.log('Dokument slettet');

    delete_document_dialog.close();
    load_document_list_from_localstorage();
    show_select_document_message();
    history.replaceState(null, null, window.location.protocol + "//" + window.location.hostname + window.location.pathname); // clearer url - fjerner uuid get parameter
    active_document = null;
}

function add_document_uuid_to_delete_form(document_uuid) {
    delete_document_form_document_uuid.value = document_uuid;
}

// skriver at brukeren må velge et dokument - calles når currentDocumentId er null
function show_select_document_message(){
    main_editor_text_input.innerHTML = '<p id="placeholder"><u><h1>Vennligst velg et dokument.</h1></u> <br> <br> <h2>   Credits:  </h2>  Programmering: Isak Henriksen <br> Easter egg sang: NRK <br> Dark mode inspirasjon: GitHub/Microsoft <br> <a href="https://www.youtube.com/watch?v=7lQatGnsoS8" target="_blank">Ord på Nett sangen:</a> Isak Henriksen (sangtekst) Suno AI (sanger) </p>';
    console.log("Spør bruker om å velge et dokument")
}

new_local_document_form.addEventListener('submit', (event) => {
    event.preventDefault();
    create_new_local_document();
    create_new_document_dialog.close();
})

delete_document_form.addEventListener('submit', (event) => {
    event.preventDefault();
    delete_document();
})
