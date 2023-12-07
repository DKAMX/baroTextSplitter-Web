// interface element
const inputTextarea = document.getElementById("input");
const outputTextarea = document.getElementById("output");

const parseButton = document.getElementById("parse");
const clearButton = document.getElementById("clear");
const saveButton = document.getElementById("save");

// xml processing
const parser = new DOMParser();
const serializer = new XMLSerializer();

function parse() {
    let xmlDocument = parser.parseFromString(inputTextarea.value, "application/xml");
    let errorNode = xmlDocument.querySelector("parsererror");
    if (errorNode) {
        outputTextarea.value = "Error while parsing";
    } else {
        output(parseNode(xmlDocument.documentElement.childNodes));
    }
}

// traverse child nodes and extract attributes like identifier
function parseNode(nodes) {
    let results = [];
    for (let node of nodes) {
        if (node.nodeType == Node.ELEMENT_NODE) {
            // extract attribute
            let id = node.getAttribute("identifier");
            if (id == null) {
                continue;
            }
            let name = node.getAttribute("name");
            let description = node.getAttribute("description");
            results.push([
                id,
                name != null ? name : "",
                description != null ? description : ""
            ]);
        }
    }
    return results;
}

function output(results) {
    let root = document.createElement("infotexts");
    root.setAttribute("language", "English");
    root.setAttribute("nowhitespace", "false");
    root.setAttribute("translatedname", "English");

    for (let result of results) {
        let nameNode = document.createElement("entityname." + result[0]);
        nameNode.appendChild(document.createTextNode(result[1]));
        let descriptionNode = document.createElement("entitydescription." + result[0]);
        descriptionNode.appendChild(document.createTextNode(result[2]));
        root.appendChild(nameNode);
        root.appendChild(descriptionNode);
    }

    outputTextarea.value += "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
    outputTextarea.value += serializer.serializeToString(root);
}

parseButton.addEventListener("click", parse);

// clear both textarea
clearButton.addEventListener("click", () => {
    inputTextarea.value = "";
    outputTextarea.value = "";
});