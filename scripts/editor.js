// buttons in the toolbar
const link_toolbar_button = document.getElementById('link-toolbar-button');
const toolbar_buttons = document.querySelectorAll('.toolbar-button'); // alle knappene

// buttons and other elements in document manager
const document_manager_new_document_button = document.getElementById('document-manager-new-document-button');
const document_manager_search_button = document.getElementById('document-manager-search-button');
const document_manager_document_list = document.getElementById('document-manager-document-list');

// main text input and its relatives
const main_editor_text_input = document.getElementById('main-editor-text-input');
const main_editor_text_input_placeholder_text = document.getElementById('main-editor-text-input-placeholder-text');

// main container footer & company
const main_editor_footer = document.getElementById('main-editor-footer');
const main_editor_footer_word_counter = document.getElementById('main-editor-footer-word-counter');
const main_editor_footer_character_counter = document.getElementById('main-editor-footer-character-counter');

// lmfao, https://www.geeksforgeeks.org/javascript/debouncing-in-javascript/
function delay_timer(original_function, milliseconds_delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            original_function.apply(this, args);
        }, milliseconds_delay);
    }
}

function save_document_to_localstorage() {
    const text_input_contents = main_editor_text_input.innerHTML;
    localStorage.setItem("document_text_contents", text_input_contents);
    console.log("Dokumentet er lagret til localstorage :)");
}

function load_document_from_localstorage() {
    const document_text_contents = localStorage.getItem("document_text_contents");
    main_editor_text_input.innerHTML = document_text_contents;
    console.log("Dokumentets innhold er lastet fra localstorage :)");
}

// logikken bak formattering
function modify_text_formatting(command, default_ui, value) {
    document.execCommand(command, default_ui, value); // command = f.eks bold/italic, default_ui = har nettleseren default ui for denne actionen/kommandoen, og value = f.eks font size = 12, osv.
};

toolbar_buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        modify_text_formatting(button.value, false, null);
        main_editor_text_input.focus();
    })
})

link_toolbar_button.addEventListener("click", () => {
    let user_link = prompt("Skriv inn en URL");
    if(user_link) {
        if (/https/i.test(user_link)) { // hvis link allerede har https
            modify_text_formatting("createLink", false, user_link);
        } else { // legg til https og bruk den
            user_link = "https://" + user_link;
            modify_text_formatting("createLink", false, user_link);
        }
    }
});

main_editor_text_input.addEventListener("keyup", () => {
    delay_timer(save_document_to_localstorage(), 500)
})

window.onload = () => {
    load_document_from_localstorage();
}
