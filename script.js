
const subfields = [
    "ǂv Comic books, strips, etc",
    "ǂv Juvenile fiction",
    "ǂv Juvenile literature",
    "ǂv Cartoons and comics",
    "ǂv Fiction",
    "",
];

const subfields_to_indicator = new Map(
    subfields.map((field, index, _) => {
        return [field, index < 3 ? "0" : "1"]
    }),
);


const handle_error = (msg) => {
    console.log("[ERROR] " + msg);
}


const parse_subfield = (item) => {
    const first_line = item.split("\n")[0];

    const subfield_index = first_line.lastIndexOf("ǂv");
    if(subfield_index === -1){
        handle_error("Input missing subfield indicator: ǂv")
        return;
    }

    var cur_subfield = first_line.substring(subfield_index).trim();
    if(cur_subfield.at(-1) === ".") {
        cur_subfield = cur_subfield.slice(0, cur_subfield.length - 1);
    }
    if(subfields_to_indicator.get(cur_subfield) === undefined) {
        handle_error("Unknown subfield: " + cur_subfield);
        return;
    }
    return cur_subfield;
}


const build_blocks = (input) => {
    const subfield = parse_subfield(input);
    const blocks = [];
    for (const item of subfields_to_indicator) {
        field = item[0]
        if (field === subfield) {
            continue;
        }
        const block = [];
        for (const line of input.split("\n")) {
            var new_line = line.slice(0, line.lastIndexOf("ǂv")) + field + ".";
            new_line = new_line.slice(0, 4) + item[1] + new_line.slice(5);
            block.push(new_line);
        }
        blocks.push(block.join("\n"));
    }
    return blocks;
}

document.getElementById("submit-button").addEventListener("click", () => {
    const code_input = document.getElementById("code-input").value.trim()
    if(code_input === "") {
        return;
    }
    const blocks = build_blocks(code_input);
    const code_output = document.getElementById("code-output")
    code_output.innerHTML = blocks.join("\n\n");
});
