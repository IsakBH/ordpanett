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
    console.log(form_data.documentname);
}

new_local_document_form.addEventListener('submit', (event) => {
    event.preventDefault();
    create_new_local_document();
    create_new_document_dialog.close();
})
