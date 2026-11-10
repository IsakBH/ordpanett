// keyboard shortcuts
window.onkeydown = function (e) {
    if (e.ctrlKey) {
        if (e.key === "b") {
            e.preventDefault()
            modify_text_formatting("bold", false, null);
        }
        else if (e.key === "i") {
            e.preventDefault();
            modify_text_formatting("italic", false, null);
        }

        else if (e.key === "u") {
            e.preventDefault();
            modify_text_formatting("underline", false, null);
        }

        else if (e.key == "-") {
            e.preventDefault();
            modify_text_formatting("strikethrough", false, null);
        }

        // unordered list (uten tall)
        else if (e.key == "*") {
            e.preventDefault();
            modify_text_formatting("insertUnorderedList", false, null);
        }
        // ordered list (med tall)
        else if (e.key == "/") {
            e.preventDefault();
            modify_text_formatting("insertOrderedList", false, null);
        }

        else if (e.key === "k") {
            e.preventDefault();
            link_toolbar_button.click();
        }

        // focuse documentsearch
        if (e.key === "l") {
            e.preventDefault();
            document_manager_search_button.focus();
        }

        // selecte text-input
        if (e.key === "q") {
            e.preventDefault();
            main_editor_text_input.focus();
        }
    }
};
