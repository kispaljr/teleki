// TODO: save/load: allowed_interval
// TODO: save/load: random empty place options

var cookie_expiry = new Date(new Date().getTime() + 10 * 365 * 24 * 3600 * 1000);


// save the value of an input field to cookie
function save_field(id) {
  let element = document.getElementById(id);
  if (element.matches('input[type="checkbox"]')) {
    var field_value = element.checked;
  } else {
    var field_value = escape(element.value);
  }
  document.cookie = `${id}=${field_value}; expires=${cookie_expiry.toGMTString()}`;
}

// load the value of an input field from cookie
function load_field(name) {
  const value = ('; ' + document.cookie).split(`; ${name}=`).pop().split(';')[0];
  if (value != "") {
    console.log(`load: ${name}=${value}`);
    let element = document.querySelector(`input[name="${name}"]`);
    if (element.matches('input[type="checkbox"]')) {
      element.checked = (value === "true");
    } else {
      element.value = value;
    }
  }
}

// iterator of all the valid "setting" input field IDs
function* field_names() {
  for (let op of ["add", "sub"]) {
    yield `${op}_10crossings_ratio`;
  }
  for (let op of ["add", "sub", "mul", "div"]) {
    for (let x = 1; x <= column_cnt; x++) {
      yield `${op}_${x}`;
    }
  }
}

// save all settings to cookie
function save_settings() {
  for (let field of field_names()) {
    save_field(field);
  }
  // console.log("cookie: " + document.cookie);      
}

// load all settings from cookie
function load_settings() {
  for (let field of field_names()) {
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