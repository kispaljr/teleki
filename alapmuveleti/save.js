var cookie_expiry = new Date(new Date().getTime() + 10 * 365 * 24 * 3600 * 1000);


// iterator of all the valid "setting" input field IDs
function* input_field_names() {

  // addition & subtraction
  yield "allowed_numberset";
  for (let op of ["add", "sub"]) {
    yield `${op}_10crossings_ratio`;
  }

  // column settings
  for (let op of ["add", "sub", "mul", "div", "random_missing_operand"]) {
    for (let x = 1; x <= column_cnt; x++) {
      yield `${op}_${x}`;
    }
  }
}


// save the value of an input field to cookie
function save_field(name) {
  let element = document.querySelector(`input[name="${name}"]`);
  let field_value = "";
  if (element.matches('input[type="checkbox"]')) {
    field_value = element.checked;
  } 
  else if (element.matches('input[type="radio"]')) {
    field_value = get_radiobutton_value(name);
  }
  else {
    field_value = encodeURIComponent(element.value);
  }
  document.cookie = `${name}=${field_value}; expires=${cookie_expiry.toGMTString()}`;
}

// load the value of an input field from cookie
function load_field(name) {
  const value = ('; ' + document.cookie).split(`; ${name}=`).pop().split(';')[0];
  if (value != "") {
    console.log(`load: ${name}=${value}`);
    let element = document.querySelector(`input[name="${name}"]`);
    if (element.matches('input[type="checkbox"]')) {
      element.checked = (value === "true");
    } 
    else if (element.matches('input[type="radio"]')) {
      document.querySelector(`input[name="${name}"][value="${value}"]`).checked = true;
    }
    else {
      element.value = value;
    }
  }
}

// save all settings to cookie
function save_settings() {
  for (let field of input_field_names()) {
    save_field(field);
  }
  // console.log("cookie: " + document.cookie);      
}

// load all settings from cookie
function load_settings() {
  for (let field of input_field_names()) {
    load_field(field);
  }
}

function get_float_input(id) {
  let element = document.getElementById(id);
  let val = parseFloat(document.getElementById(id).value);
  if (isNaN(val)) {
    val = 0.0;
    element.value = 0;
  }
  return val;
}

function get_bool_input(name) {
  return document.querySelector(`input[name="${name}"]`).checked
}

function get_radiobutton_value(name) {
  return document.querySelector(`input[name="${name}"]:checked`).value;
}