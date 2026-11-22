function save_document_to_localstorage() {
    // const document_contents = main_editor_text_input.innerHTML;

    // localStorage.setItem("document_text_contents", document_contents);
    // console.log("Dokumentet er lagret til localstorage :)");
}

function load_document_from_localstorage(document_uuid) {
    // const document_text_contents = localStorage.getItem("document_text_contents");
    // main_editor_text_input.innerHTML = document_text_contents;
    // console.log("Dokumentets innhold er lastet fra localstorage :)");
    const document_object_unparsed = localStorage.getItem(document_uuid)
    const document_object = JSON.parse(document_object_unparsed);
    console.log('Fetchet dokument ' + document_object.uuid + ' fra localStorage :)');

    main_editor_text_input.innerHTML = document_object.content;
    console.log('Erstattet text inputs innhold med nytt dokument :)');

    const url = new URL(window.location.href)
    url.searchParams.set('document', document_uuid);
    console.log(url);
    history.replaceState(document_object, "", url);

    active_document = document_object.uuid;
}

function create_new_local_document() {
    const form_data = new FormData(new_local_document_form);

    // create uuid
    const uuid = self.crypto.randomUUID();

    // get document name from form_data
    const document_name = form_data.get('document_name');

    // get current date and time
    const current_date = new Date();
    const date_time = current_date.getDate() + "/"
                    + (current_date.getMonth()+1)  + "/"
                    + current_date.getFullYear() + " "
                    + current_date.getHours() + ":"
                    + current_date.getMinutes() + ":"
                    + current_date.getSeconds() + ":"
                    + current_date.getMilliseconds();

    // when syncing is implemented, run a check to see if user has enabled syncing. if so, enable sync and sync immediately on creation
    const is_sync_enabled = false;

    // create version hash based on current timestamp
    const version_hash = null;

    const document_object = {
        "uuid": uuid,
        "name": document_name,
        "content": null,
        "last_modified": date_time,
        "date_created": date_time,
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
    Object.keys(localStorage).forEach((document_uuid) => {
        const document_object_unparsed = localStorage.getItem(document_uuid)
        const document_object = JSON.parse(document_object_unparsed);

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
        document_manager_document_list.appendChild(li);
    });
}

new_local_document_form.addEventListener('submit', (event) => {
    event.preventDefault();
    create_new_local_document();
    create_new_document_dialog.close();
})
