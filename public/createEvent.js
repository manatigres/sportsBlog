  // The set method is the setting value, which is visible = true/false. 
  // If true, call the method load new Event, load the form, and if false, load the list.

  // Define a formData property in the HTMLFormElement prototype that returns formData when evaluated
  Object.defineProperty(HTMLFormElement.prototype, 'formData', {
    get() {
      return new FormData(this);
    }
  });

/**
 * Template syntax (field formatting)
 * @param {string} template  The template string script type="text/ HTML "tag
 * @param {object} data The object data
 * @returns {string}
 */
function dealTemplate(template, data = {}) {
  // Regular expression: Replace {{name}} with the value corresponding to the name in data
  // Run on the console:
  /*
  'Test RegExp replace key: {{ name }}. And console name.'.replace(/{{\s+?(\w+?)\s+?}}/, function () {
    // The first argument in the callback function returns what was matched, and the second argument returns what was matched in the first () in the regular. The third argument returns the second matched ().
    console.log(arguments);
    return 'nameValue';
  })
  */
  const reg = /{{\s+?(\w+?)\s+?}}/img;
  return template.replace(reg, (...args) => data[args[1]]);
}

/**
 * submit form
 */
function handleSubmit(event) {
  event.preventDefault();
  const formData = event.target.formData;
  const data = {};

  // FormData: https://developer.mozilla.org/zh-CN/docs/Web/API/FormData
  // https://developer.mozilla.org/zh-CN/docs/Learn/Forms/Sending_forms_through_JavaScript#%E4%BD%BF%E7%94%A8%E7%BB%91%E5%AE%9A%E5%88%B0%E8%A1%A8%E5%8D%95%E5%85%83%E7%B4%A0%E4%B8%8A%E7%9A%84_formdata
  // FormData.keys() returns all keys of a traversable object
  for (var name of formData.keys()) {
    // Use the key to get the values in the formData
    const value = formData.get(name);
    if (value instanceof File) {
      // If the current value is a file input box and the file is uploaded, a URL is created with the file BLOB.
      if (value.size && value.name) {
        // https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL
        // Create the file address with BLOB
        data[name] = window.URL.createObjectURL(value);
      }
      continue;
    }

    // Get the corresponding value
    data[name] = value;
  }

  console.log(data);
  sendData(data);
}

//Go back button
function goBack() {
  location.href = '/'
}

//Send data to server
function sendData(newData) {
  var data = {name: newData.name, time: newData.date, location: newData.location}
  console.log(data);
  fetch('/events/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then (res => {
    console.log (res.status)
    if (!res.ok) {
      alert ("Event name alreay exists")
    } else {
      alert ("New event is created")
    }
    return res.text()
  })
  .then (data => console.log(data))
}