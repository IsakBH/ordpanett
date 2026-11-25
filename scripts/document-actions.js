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

    Object.keys(localStorage).forEach((document_uuid) => {
        const document_object_unparsed = localStorage.getItem(document_uuid)
        const document_object = JSON.parse(document_object_unparsed);
        console.log(document_object);
        sorted_documents.push(document_object);
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
                <button class="document_list_document_delete_button" onclick="delete_document('${document_object.uuid}')" title="Slett dokument">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        li.setAttribute("id", document_object.uuid);
        document_manager_document_list.appendChild(li);
    })
}

new_local_document_form.addEventListener('submit', (event) => {
    event.preventDefault();
    create_new_local_document();
    create_new_document_dialog.close();
})
