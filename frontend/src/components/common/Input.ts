export const Input = (type: string = "text", value: string = "", placeholder?: string, editable: boolean = true) => {
  const input = document.createElement("input");
  input.type = type;
  input.value = value;
  input.readOnly = !editable;

  if (type !== "password" && !value && placeholder) {
    input.placeholder = placeholder;
  }

  input.className = `p-2 rounded-lg focus:outline-none transition bg-white focus:ring-2 focus:ring-blue-500 border text-gray-900 ${
    !editable && "cursor-default"
  }`;

  input.addEventListener("input", () => {
    if (input.value !== "") {
      input.placeholder = "";
    }
  });

  return input;
};
