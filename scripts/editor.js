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
const main_editor_footer_word_and_character_counter = document.getElementById('main-editor-footer-word-and-character-counter');

// html forms
const new_local_document_form = document.getElementById('new-local-document-form');
const create_new_document_dialog = document.getElementById('new-local-document-dialog');

// andre variabler
let active_document;

/*
// finner tid og dato for last modified
const current_date = new Date();
const date_time = current_date.getDate() + "/"
                + (current_date.getMonth()+1)  + "/"
                + current_date.getFullYear() + " "
                + current_date.getHours() + ":"
                + current_date.getMinutes() + ":"
                + current_date.getSeconds() + ":"
                + current_date.getMilliseconds();

const uuid = self.crypto.randomUUID();
console.log(uuid);

const document_object = {
    "id": uuid,
    "name": document_name,
    "content": document_contents,
    "last_modified": date_time,
    "date_created": date_time,
    "sync_enabled": is_sync_enabled,
    "version_hash": version_hash,
    "last_synced_date": last_synced_date,
};
*/

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

function get_text_selection_formatting_info() {
    const selection = window.getSelection() // henter data om selectionen (text selection caret)

    let current_node = selection.anchorNode;
    if (current_node.nodeType === Node.TEXT_NODE) {
        current_node = current_node.parentElement;
    } else if (!current_node) { // hvis caret ikke er i noe node
        return;
    }

    const toolbar_ids_and_tags = [
        { button_id: 'bold-toolbar-button', tags: ['B', 'STRONG'] },
        { button_id: 'italic-toolbar-button', tags: ['I', 'EM'] },
        { button_id: 'underline-toolbar-button', tags: ['U'] },
        { button_id: 'strikethrough-toolbar-button', tags: ['strike', 'S'] },
        { button_id: 'link-toolbar-button', tags: ['A'] },
        { button_id: 'ordered-list-toolbar-button', tags: ['OL'] },
        { button_id: 'unordered-list-toolbar-button', tags: ['UL'] },
        // { button_id: 'justify-left-toolbar-button', tags: [] },
        // { button_id: 'justify-center-button', tags: [] },
        // { button_id: 'justify-right-button', tags: [] },
    ]

    toolbar_ids_and_tags.forEach(button => {
        const button_id = document.getElementById(button.button_id);
        if (!button_id) {
            return;
        }

        const is_formatted = button.tags.some(tag => current_node.closest(tag));

        if (is_formatted) {
            button_id.classList.add('active-button');
        } else {
            button_id.classList.remove('active-button');
        }
    })
}

// gjør denne bedre!!
function button_highlighter(class_name) {
    class_name.forEach((button) => {
        button.addEventListener('click', () => {
            button.classList.toggle('active-button');
        })
    })
}

main_editor_text_input.addEventListener("keyup", () => {
    update_word_and_character_counters(main_editor_text_input.innerText)
    delay_timer(save_document_to_localstorage(), 500);
})

window.onload = () => {
    update_word_and_character_counters(main_editor_text_input.innerText);
    load_document_list_from_localstorage()
}
