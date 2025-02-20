export const Input = (type: string = "text", value: string = "", placeholder?: string, editable: boolean = true) => {
  const input = document.createElement("input");
  input.type = type;
  input.value = value;
  input.readOnly = !editable;

  if (type !== "password" && !value && placeholder) {
    input.placeholder = placeholder;
  }

  input.className = `p-2 border rounded-lg focus:outline-none transition ${
    editable ? "bg-white focus:ring-2 focus:ring-blue-500" : "bg-gray-200 cursor-not-allowed"
  }`;

  input.addEventListener("input", () => {
    if (input.value !== "") {
      input.placeholder = "";
    }
  });

  return input;
};
