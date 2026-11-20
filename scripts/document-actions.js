function save_document_to_localstorage() {
    // const document_contents = main_editor_text_input.innerHTML;

    // localStorage.setItem("document_text_contents", document_contents);
    // console.log("Dokumentet er lagret til localstorage :)");
}

function load_document_from_localstorage() {
    // const document_text_contents = localStorage.getItem("document_text_contents");
    // main_editor_text_input.innerHTML = document_text_contents;
    // console.log("Dokumentets innhold er lastet fra localstorage :)");
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
}

new_local_document_form.addEventListener('submit', (event) => {
    event.preventDefault();
    create_new_local_document();
    create_new_document_dialog.close();
})
