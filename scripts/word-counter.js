// oppdaterer ord og bokstav tellere
function update_word_and_character_counters(text_selection) {
    const {words: word_count, characters: character_count} = count_words_and_characters(text_selection) // object destructuring B)

    main_editor_footer_word_and_character_counter.innerHTML = `${word_count} ord, ${character_count} tegn`;
    console.log(`${word_count} ord, ${character_count} tegn`);
}

// teller ord og bokstaver
function count_words_and_characters(text) {
    const character_count = text.length;
    const word_count = text.trim().split(/\s+/).filter(word => word.length > 0).length;

    const word_and_character_counts_array = {characters: character_count, words: word_count}

    return (word_and_character_counts_array);
}

// hører etter endring på selection, og oppdaterer counteren. dette gjør ikke word og google docs! opn=bedre og kulere
main_editor_text_input.addEventListener('selectionchange', () => {
    const selection = document.getSelection();
    const selection_string = selection.toString();
    update_word_and_character_counters(selection_string);
})
