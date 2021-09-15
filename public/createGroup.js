  // The code below was taken from a post at https://www.shangmayuan.com/a/4b610ec8739e446aa9a93431.html
  // BEGIN Copied Code
  Object.defineProperty(HTMLFormElement.prototype, 'formData', {
    get() {
      return new FormData(this);
    }
  });
  // END Copied Code

/**
 * Template syntax (field formatting)
 * @param {string} template
 * @param {object} data
 * @returns {string}
 */
function dealTemplate(template, data = {}) {
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
//FormData: https://developer.mozilla.org/zh-CN/docs/Web/API/FormData
  for (var name of formData.keys()) {
    const value = formData.get(name);
    if (value instanceof File) {
      if (value.size && value.name) {
        data[name] = window.URL.createObjectURL(value);
      }
      continue;
    }

    data[name] = value;
  }

  sendData(data);
}

//Go back button
function goBack() {
      location.href = '/'
}

//Send data to server
function sendData(newData) {
  var data = {name: newData.name, tags: newData.tags, description: newData.description}
  fetch('/groups/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then (res => {
    console.log (res.status)
    if (!res.ok) {
      alert ("Group name already exists")
    } else {
      location.href = `/groups/${data.name}`
      alert ("New group is created")
    }
    return res.text()
  })
  .then (data => console.log(data))
}