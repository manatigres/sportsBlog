(function(){


  var svg = d3.select("#svg");
  var svg2 = d3.select("#svg2");
  var width = svg.attr("width");
  var height = svg.attr("height");
  var radius = 18;
  var filter = {forname: false, surname: false, sex: false, dataset: false, father_forname: false, father_surname: false, mother_forname: false, mother_surname: false, address: false, occupation: false, f_occupation: false, m_occupation: false, death: false, marriage: false, p_marriage: false}
  var filter_search = document.getElementById("filter_menu").value
  var input = "text"
  var dataset,view,current_list
  var nodes_activated = []
  let exclude = ["_id", "ID", "family", "marriage", "illegit", "notes", "Death", "CHILD_IDENTITY","MOTHER_IDENTITY","FATHER_IDENTITY","DEATH_RECORD_IDENTITY","PARENT_MARRIAGE_RECORD_IDENTITY","FATHER_BIRTH_RECORD_IDENTITY","MOTHER_BIRTH_RECORD_IDENTITY","MARRIAGE_RECORD_IDENTITY1","MARRIAGE_RECORD_IDENTITY2","MARRIAGE_RECORD_IDENTITY3","MARRIAGE_RECORD_IDENTITY4","MARRIAGE_RECORD_IDENTITY5","index","x","y","vy","vx","fx","fy","death code A","death code B","death code C","notes1","Birth","mar","DECEASED_IDENTITY","SPOUSE_IDENTITY","BIRTH_RECORD_IDENTITY","SPOUSE_MARRIAGE_RECORD_IDENTITY","SPOUSE_BIRTH_RECORD_IDENTITY","if father deceased","if mother deceased","color"]
  let current_filter_nodes 

  svg
  .attr("viewBox", [0, -height / 2, 100, height])
  .attr("style", "outline: medium solid black;");



  svg2
  .attr("viewBox", [0 / 2, -height / 2, 100, height])
  .attr("style", "outline: medium solid black;")

  let zoom = d3.zoom()
  .on('zoom', handleZoom)
  .scaleExtent([0.5, 5]);

function handleZoom(e) {
  d3.select('svg g')
    .attr('transform', d3.event.transform);
}

function initZoom() {
  d3.select('svg')
    .call(zoom)
    .on("dblclick.zoom", null);
}


function resetZoom() {
	d3.select('svg')
		.transition()
		.call(zoom.scaleTo, 1);
}

function center() {
	d3.select('svg')
		.transition()
		.call(zoom.translateTo,  0, 0)
}



initZoom()


  function createLegends(){
    svg.append("text").attr("x", 565).attr("y", -240).text("Dataset").style("font-size", "15px").style("font-weight", "bold").attr("alignment-baseline","middle")
    svg.append("circle").attr("cx",570).attr("cy",-210).attr("r", 10).style("fill", "#C64756")
    svg.append("text").attr("x", 590).attr("y", -210).text("Birth").style("font-size", "15px").attr("alignment-baseline","middle")


    svg.append("circle").attr("cx",570).attr("cy",-185).attr("r", 10).style("fill", "#DDFFBC")
    svg.append("text").attr("x", 590).attr("y", -185).text("Marriage").style("font-size", "15px").attr("alignment-baseline","middle")   

    svg.append("circle").attr("cx",570).attr("cy",-160).attr("r", 10).style("fill", "#EDF5E1")
    svg.append("text").attr("x", 590).attr("y", -160).text("Death").style("font-size", "15px").attr("alignment-baseline","middle")   

    svg.append("text").attr("x", 550).attr("y", -110).text("Relationship").style("font-size", "15px").style("font-weight", "bold").attr("alignment-baseline","middle")
    svg.append("rect").attr("x",545).attr("y",-84).attr("width", 45).attr("height", 5).style("fill", "purple")
    svg.append("text").attr("x", 600).attr("y", -80).text("Spouse").style("font-size", "15px").attr("alignment-baseline","middle") 

    svg.append("rect").attr("x",545).attr("y",-60).attr("width", 45).attr("height", 5).style("fill", "gray")
    svg.append("text").attr("x", 600).attr("y", -56).text("Mother").style("font-size", "15px").attr("alignment-baseline","middle") 

    svg.append("rect").attr("x",545).attr("y",-36).attr("width", 45).attr("height", 5).style("fill", "green")
    svg.append("text").attr("x", 600).attr("y", -32).text("Father").style("font-size", "15px").attr("alignment-baseline","middle") 

    svg.append("text").attr("x", 560).attr("y", 15).text("Gender").style("font-size", "15px").style("font-weight", "bold").attr("alignment-baseline","middle")
    svg.append("circle").attr("cx",570).attr("cy",45).attr("r", 9).style("fill", "white").style("stroke", "black").style("stroke-width", 4)
    svg.append("text").attr("x", 590).attr("y", 47).text("Male").style("font-size", "15px").attr("alignment-baseline","middle")

    svg.append("circle").attr("cx",570).attr("cy",73).attr("r", 9).style("fill", "white").style("stroke", "#0A81AB").style("stroke-width", 4)
    svg.append("text").attr("x", 590).attr("y", 75).text("Female").style("font-size", "15px").attr("alignment-baseline","middle")
    
    svg.append("text").attr("x", 565).attr("y", 125).text("Links").style("font-size", "15px").style("font-weight", "bold").attr("alignment-baseline","middle")
    svg.append("rect").attr("x",545).attr("y",150).attr("width", 45).attr("height", 5).style("fill", "purple")
    svg.append("text").attr("x", 600).attr("y", 150).text("Original").style("font-size", "15px").attr("alignment-baseline","middle") 

    svg.append("rect").attr("x",545).attr("y",174).attr("width", 10).attr("height", 5).style("fill", "gray")
    svg.append("rect").attr("x",560).attr("y",174).attr("width", 10).attr("height", 5).style("fill", "gray")
    svg.append("rect").attr("x",575).attr("y",174).attr("width", 10).attr("height", 5).style("fill", "gray")
    svg.append("text").attr("x", 600).attr("y", 174).text("Created").style("font-size", "15px").attr("alignment-baseline","middle") 

  }

 

    // Get the modal
  var modal = document.getElementById("myModal");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }



  function getFilterLists(){
    document.getElementById("list_menu").onchange = () => updateFilter()
  }

  function updateFilter(){
    
      current_list = document.getElementById("list_menu").value
      document.getElementById("borrar").style.display = "none"
      fetch(`/get/list/${current_list}`)
      .then (res => res.json())
      .then (jsn => {
        
        document.getElementById("person").innerHTML  = ""
        let default_option = document.createElement("option");
        default_option.id = "default_option"
        default_option.selected = "true"
        default_option.disabled = "disabled"
        default_option.innerHTML = "Select a person"
        document.getElementById("person").append(default_option)
        for(let member of jsn){        
          let option = document.createElement("option");
          option.innerHTML = `${member.Forname} ${member.Surname} (${member.ID})`
          option.id = member.ID
          option.value = member.ID
          document.getElementById("person").append(option)
          
      }

      document.getElementById("merge_select").innerHTML  = ""
      let default_option2 = document.createElement("option");
      default_option2.id = "default_option2"
      default_option2.selected = "true"
      default_option2.disabled = "disabled"
      default_option2.innerHTML = "Select a person"
      document.getElementById("merge_select").append(default_option2)

        for(let member of jsn){        
          let option = document.createElement("option");
          option.innerHTML = `${member.Forname} ${member.Surname} (${member.ID})`
          option.id = `M_${member.ID}`
          option.value = member.ID
          document.getElementById("merge_select").append(option)
        }



          current_filter_nodes = jsn

          createFilterViz(jsn)
      })
  }
  



  document.getElementById("filter_menu").onchange = () => {
    filter_search = document.getElementById("filter_menu").value

    if(filter_search == "dataset"){
      input = "list"
      let x = document.createElement("SELECT")
      x.id = "select"
      x.className = "select"
      x.name = "select"

      document.getElementById("input").innerHTML = ""
      
      let option1 = document.createElement("OPTION")
      let option2 = document.createElement("OPTION")
      let option3 = document.createElement("OPTION")
      option1.value = "birth"
      option2.value = "marriage"
      option3.value = "death"
      option1.innerHTML = "Birth"
      option2.innerHTML = "Marriage"
      option3.innerHTML = "Death"

      document.getElementById("input").append(x)

      document.getElementById("select").append(option1)
      document.getElementById("select").append(option2)
      document.getElementById("select").append(option3)
    } else if(filter_search == "sex"){
      input = "list"
      let x = document.createElement("SELECT")
      x.id = "select"
      x.name = "select"

      document.getElementById("input").innerHTML = ""
      
      let option1 = document.createElement("OPTION")
      let option2 = document.createElement("OPTION")

      option1.value = "M"
      option2.value = "F"

      option1.innerHTML = "Male"
      option2.innerHTML = "Female"

      document.getElementById("input").append(x)

      document.getElementById("select").append(option1)
      document.getElementById("select").append(option2)
    }else{
      input = "text"
      x = document.createElement("INPUT")
      x.type = "text"
      x.id = "search"
      x.name = "search"

      document.getElementById("input").innerHTML = ""

      document.getElementById("input").append(x)
    }
  }



  function clicked(d){
    console.log(d)

    document.getElementById("notes_button").onclick = () => showNotes(d);
    document.getElementById("properties_button").onclick = () => showTable(d);
    document.getElementById("relationships_button").onclick = () => showRelation(d);

      //document.getElementById("lab_container").style.display = "none"
     // document.getElementById("view_container").style.display = "none"
      //document.getElementById("borrar").style.display = "none"
      //document.getElementById("list_view").style.display = "none"
      //document.getElementById("dataset_view").style.display = "none"
      document.getElementById("list_message").innerHTML = ""

      showTable(d)

      document.getElementById("remove_relDiv").style.display = "none"
      document.getElementById("create_relDiv").style.display = "none"
      document.getElementById("merge_Div").style.display = "none"
      document.getElementById("listButton").onclick = () => showLists(d);
      document.getElementById("createList").onclick = () => createLists(d);
      document.getElementById("remove").onclick = () => removePerson(d);
      document.getElementById("create_rel").onclick = () => showRelDiv(d);
      document.getElementById("remove_rel").onclick = () => showRemoveDiv(d);
      document.getElementById("merge_button").onclick = () => showMergeDiv(d);
      document.getElementById("add_relationship").onclick = () => addRelationship(d);
      document.getElementById("merge").onclick = () => merge(d);
      document.getElementById("add_note").onclick = () => notes(d);
      removeRelationship(d);

      document.getElementById("create_list_div").style.display = "none"
      document.getElementById("myDropdown").className = "dropdown-content"
      modal.style.display = "block";
      
      

      document.getElementById("title").innerHTML = `${d["Forname"]} ${d["Surname"]}`
      buildTable(d)
     
     
     /*
      for(let object in d){

              if(exclude.includes(object)){
              }else{
                  var row = table.insertRow()
  
                  var cell1 = row.insertCell()
                  cell1.style.fontWeight = "bold"
                  var cell2 = row.insertCell()
                  cell1.innerHTML = object
                  cell2.innerHTML = d[object]
              }
      }*/
  }


  function notes(d){
    let id = d["ID"]
    let value = document.getElementById("text_box").value 
    data = { value }
    if(value !== ""){
      fetch(`/addNote/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(res => res.text())
      .then(data => {
        //alert(data)
        showNotes(d)
        })

    }
  }

  function showRelation(d){

    document.getElementById("rel_div").style.display = "inline"
    document.getElementById("rel_div").innerHTML  =""

    for(let i=0; i < d["children"].length; i++){
      let div = document.createElement("DIV")
      div.className = "rel_div"

      fetch(`/getPerson/${d["children"][i]}`)
      .then (res => res.json())
      .then (person => {
        let tag = document.createElement("span")
        tag.className = "tag"
        tag.innerHTML = "CHILD"
        tag.style.color = "red"
        let span = document.createElement("span")
        span.className = "rel_span"
        span.innerHTML = `${person["Forname"]} ${person["Surname"]}`
        div.append(span)
        div.append(tag)
      })
      document.getElementById("rel_div").append(div)
    }

    for(let i=0; i < d["father"].length; i++){
      let div = document.createElement("DIV")
      div.className = "rel_div"

      fetch(`/getPerson/${d["father"][i]}`)
      .then (res => res.json())
      .then (person => {
        let tag = document.createElement("span")
        tag.className = "tag"
        tag.innerHTML = "FATHER"
        tag.style.color = "blue"
        let span = document.createElement("span")
        span.className = "rel_span"
        span.innerHTML = `${person["Forname"]} ${person["Surname"]}`
        div.append(span)
        div.append(tag)
      })
      document.getElementById("rel_div").append(div)
    }

    for(let i=0; i < d["mother"].length; i++){
      let div = document.createElement("DIV")
      div.className = "rel_div"

      fetch(`/getPerson/${d["mother"][i]}`)
      .then (res => res.json())
      .then (person => {
        let tag = document.createElement("span")
        tag.className = "tag"
        tag.innerHTML = "MOTHER"
        let span = document.createElement("span")
        span.className = "rel_span"
        tag.style.color = "green"
        span.innerHTML = `${person["Forname"]} ${person["Surname"]}`
        div.append(span)
        div.append(tag)
      })
      document.getElementById("rel_div").append(div)
    }

    for(let i=0; i < d["spouse"].length; i++){
      let div = document.createElement("DIV")
      div.className = "rel_div"

      fetch(`/getPerson/${d["spouse"][i]}`)
      .then (res => res.json())
      .then (person => {
        let tag = document.createElement("span")
        tag.className = "tag"
        tag.innerHTML = "SPOUSE"
        tag.style.color = "purple"
        let span = document.createElement("span")
        span.className = "rel_span"
        span.innerHTML = `${person["Forname"]} ${person["Surname"]}`
        div.append(span)
        div.append(tag)
      })
      document.getElementById("rel_div").append(div)
    }


    document.getElementById("table_div").style.display = "none"
    document.getElementById("table").style.display = "none"
    document.getElementById("view_container").style.display = "none"
    document.getElementById("lab_container").style.display = "none"
    document.getElementById("notes").style.display = "none"
    document.getElementById("notes_text").style.display = "none"

  }

  function showNotes(d){
    let id = d["ID"]
    fetch(`/getNotes/${id}`)
    .then (res => res.json())
    .then (jsn => {
        document.getElementById("notes_ul").innerHTML = ""
        if(jsn.length == 0){
          let par = document.createElement("li")
          par.innerHTML = "No notes yet"
          document.getElementById("notes_ul").appendChild(par)
        }
        for( let note of jsn){
          let par = document.createElement("li")
          par.innerHTML = note
          document.getElementById("notes_ul").appendChild(par)
          
        }
    })

    document.getElementById("rel_div").style.display = "none"
    document.getElementById("table").style.display = "none"
    document.getElementById("view_container").style.display = "none"
    document.getElementById("lab_container").style.display = "none"
    document.getElementById("notes").style.display = "inline"
    document.getElementById("table_div").style.display = "flex"
    document.getElementById("notes_text").style.display = "flex"
    document.getElementById("text_box").value = ""


  }

  function showTable(d){

    if(view == "dataset_info"){
      document.getElementById("view_container").style.display = "inline"
      document.getElementById("lab_container").style.display = "none"

    }else if(view == "list_info") {
      document.getElementById("lab_container").style.display = "inline"
      document.getElementById("view_container").style.display = "none"
      omitPerson(d)
    }

    document.getElementById("dataset_view").style.display = "none"
    document.getElementById("rel_div").style.display = "none"
    document.getElementById("table").style.display = "inline"
    document.getElementById("table_div").style.display = "flex"
    document.getElementById("borrar").style.display = "flex"
    document.getElementById("notes").style.display = "none"
    document.getElementById("notes_text").style.display = "none"
  }


  function buildTable(d){
    table = document.getElementById("table")
    table.innerHTML = ""

    let table_titles = ["Dataset","Forname","Surname","Birthday","Sex","Occupation","Address","Father's name", "Mother's name","Father's occupation", "Mother's occupation", "Place of marriage", "Place of parent's marriage", "Date of death"  ]
    


   for(let title of table_titles){
      var row = table.insertRow()
      var cell1 = row.insertCell()
      cell1.innerHTML = title
      cell1.className = "table_titles"
      cell1.style.fontWeight = "bold"
   }
   

    // open loop for each row and append cell
    for (let i = 0; i < table.rows.length; i++) {

      let x = table.rows[i].insertCell(-1)
      x.className = "cell"
      let edit_button = document.createElement("BUTTON")
      let save_button = document.createElement("BUTTON")
      let span = document.createElement("SPAN")
      edit_button.className = "edit"
      edit_button.innerHTML = "&#128393"
      save_button.className = "save"
      save_button.innerHTML = "&#10003"


      


      if(i == 0){
        x.appendChild(span)
        span.id = `dataset_1`
        span.innerHTML = d["dataset"]
      }
        if(i == 1){
          x.appendChild(span)
          span.id = `forname_1`
          edit_button.id = "edit_button_forname_1"
          save_button.id = "save_button_forname_1"
          save_button.style.display = "none"
          span.innerHTML = d["Forname"]
          x.appendChild(edit_button)
          x.appendChild(save_button)
          edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
          save_button.onclick = () => save(span.id,edit_button.id,save_button.id,d)
        } else if(i == 2){
          x.appendChild(span)
          span.id = `surname_1`
          edit_button.id = "edit_button_surname_1"
          save_button.id = "save_button_surname_1"
          save_button.style.display = "none"
          span.innerHTML = d["Surname"]
          x.appendChild(edit_button)
          x.appendChild(save_button)
          edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
          save_button.onclick = () => save(span.id,edit_button.id,save_button.id,d)
        } else if(i == 3){
          x.appendChild(span)
          span.id = `birthday_1`
          edit_button.id = "edit_button_birthday_1"
          save_button.id = "save_button_birthday_1"
          save_button.style.display = "none"
          span.innerHTML = d["birthday"]
          x.appendChild(edit_button)
          x.appendChild(save_button)
          edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
          save_button.onclick = () => save(span.id,edit_button.id,save_button.id,d)
        } else if(i == 4){
          x.appendChild(span)
          span.id = `sex_1`
          edit_button.id = "edit_button_sex_1"
          save_button.id = "save_button_sex_1"
          save_button.style.display = "none"
          span.innerHTML = d["sex"]
          x.appendChild(edit_button)
          x.appendChild(save_button)
          edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
          save_button.onclick = () => save(span.id,edit_button.id,save_button.id,d)
        } else if(i == 5){
          x.appendChild(span)
          span.id = `occupation_1`
          edit_button.id = "edit_button_occupation_1"
          save_button.id = "save_button_occupation_1"
          save_button.style.display = "none"
          span.innerHTML = d["occupation"]
          x.appendChild(edit_button)
          x.appendChild(save_button)
          edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
          save_button.onclick = () => save(span.id,edit_button.id,save_button.id,d)
        } else if(i == 6){
          x.appendChild(span)
          span.id = `address_1`
          edit_button.id = "edit_button_address_1"
          save_button.id = "save_button_address_1"
          save_button.style.display = "none"
          span.innerHTML = d["address"]
          x.appendChild(edit_button)
          x.appendChild(save_button)
          edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
          save_button.onclick = () => save(span.id,edit_button.id,save_button.id,d)
        } else if(i == 7){
          x.appendChild(span)
          span.id = `fatherName_1`
          edit_button.id = "edit_button_fatherName_1"
          save_button.id = "save_button_fatherName_1"
          save_button.style.display = "none"
          span.innerHTML = `${d["father_forname"]} ${d["father_surname"]}`
          x.appendChild(edit_button)
          x.appendChild(save_button)
          edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
          save_button.onclick = () => save(span.id,edit_button.id,save_button.id,d)
        } else if(i == 8){
          x.appendChild(span)
          span.id = `motherName_1`
          edit_button.id = "edit_button_motherName_1"
          save_button.id = "save_button_motherName_1"
          save_button.style.display = "none"
          span.innerHTML = `${d["mother_forname"]} ${d["mother_surname"]}`
          x.appendChild(edit_button)
          x.appendChild(save_button)
          edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
          save_button.onclick = () => save(span.id,edit_button.id,save_button.id,d)
        } else if(i == 9){
          x.appendChild(span)
          span.id = `fatherOcc_1`
          edit_button.id = "edit_button_fatherOcc_1"
          save_button.id = "save_button_fatherOcc_1"
          save_button.style.display = "none"
          span.innerHTML = `${d["father_occupation"]}`
          x.appendChild(edit_button)
          x.appendChild(save_button)
          edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
          save_button.onclick = () => save(span.id,edit_button.id,save_button.id,d)
        } else if(i == 10){
          x.appendChild(span)
          span.id = `motherOcc_1`
          edit_button.id = "edit_button_motherOcc_1"
          save_button.id = "save_button_motherOcc_1"
          save_button.style.display = "none"
          span.innerHTML = `${d["mother_occupation"]}`
          x.appendChild(edit_button)
          x.appendChild(save_button)
          edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
          save_button.onclick = () => save(span.id,edit_button.id,save_button.id,d)
        } else if(i == 11){
          x.appendChild(span)
          span.id = `marriage_1`
          edit_button.id = "edit_button_marriage_1"
          save_button.id = "save_button_marriage_1"
          save_button.style.display = "none"
          span.innerHTML = `${d["place_marriage"]}`
          x.appendChild(edit_button)
          x.appendChild(save_button)
          edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
          save_button.onclick = () => save(span.id,edit_button.id,save_button.id,d)
        } else if(i == 12){
          x.appendChild(span)
          span.id = `p_marriage_1`
          edit_button.id = "edit_button_p_marriage_1"
          save_button.id = "save_button_p_marriage_1"
          save_button.style.display = "none"
          span.innerHTML = `${d["place_parents_marriage"]}`
          x.appendChild(edit_button)
          x.appendChild(save_button)
          edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
          save_button.onclick = () => save(span.id,edit_button.id,save_button.id,d)
        } else if(i == 13){
          x.appendChild(span)
          span.id = `death_1`
          edit_button.id = "edit_button_death_1"
          save_button.id = "save_button_death_1"
          save_button.style.display = "none"
          span.innerHTML = `${d["date of death"]}`
          x.appendChild(edit_button)
          x.appendChild(save_button)
          edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
          save_button.onclick = () => save(span.id,edit_button.id,save_button.id,d)
        }
        
    }

    if(d["people_absorbed"].length > 0){
      
      for(let j = 0; j < d["people_absorbed"].length; j++){



        fetch(`/absorbed/${d["people_absorbed"][j]}`)
        .then (res => res.json())
        .then (a => {

            
          for (let i = 0; i < table.rows.length; i++) {
            let x = table.rows[i].insertCell(-1)
            x.className = "cell"
            let edit_button = document.createElement("BUTTON")
            let save_button = document.createElement("BUTTON")
            let span = document.createElement("SPAN")
            edit_button.className = "edit"
            edit_button.innerHTML = "&#128393"
            save_button.className = "save"
            save_button.innerHTML = "&#10003"

            if(i == 0){
              x.appendChild(span)
              span.id = `forname_${j+2}`
              edit_button.id = `edit_button_forname_${j+2}`
              save_button.id = `save_button_forname_${j+2}`
              save_button.style.display = "none"
              span.innerHTML = a["Forname"]
              x.appendChild(edit_button)
              x.appendChild(save_button)
              edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
              save_button.onclick = () => save(span.id,edit_button.id,save_button.id)
            } if(i == 1){
              x.appendChild(span)
              span.id = `surname_${j+2}`
              edit_button.id = `edit_button_surname_${j+2}`
              save_button.id = `save_button_surname_${j+2}`
              save_button.style.display = "none"
              span.innerHTML = a["Surname"]
              x.appendChild(edit_button)
              x.appendChild(save_button)
              edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
              save_button.onclick = () => save(span.id,edit_button.id,save_button.id)
            } if(i == 2){
              x.appendChild(span)
              span.id = `birthday_${j+2}`
              edit_button.id = `edit_button_birthday_${j+2}`
              save_button.id = `save_button_birthday_${j+2}`
              save_button.style.display = "none"
              span.innerHTML = a["birthday"]
              x.appendChild(edit_button)
              x.appendChild(save_button)
              edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
             save_button.onclick = () => save(span.id,edit_button.id,save_button.id)
            } if(i == 3){
              x.appendChild(span)
              span.id = `sex_${j+2}`
              edit_button.id = `edit_button_sex_${j+2}`
              save_button.id = `save_button_sex_${j+2}`
              save_button.style.display = "none"
              span.innerHTML = a["sex"]
              x.appendChild(edit_button)
              x.appendChild(save_button)
              edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
              save_button.onclick = () => save(span.id,edit_button.id,save_button.id)
            } if(i == 4){
              x.appendChild(span)
              span.id = `occupation_${j+2}`
              edit_button.id = `edit_button_occupation_${j+2}`
              save_button.id = `save_button_occupation_${j+2}`
              save_button.style.display = "none"
              span.innerHTML = a["occupation"]
              x.appendChild(edit_button)
              x.appendChild(save_button)
              edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
              save_button.onclick = () => save(span.id,edit_button.id,save_button.id)
            } if(i == 5){
              x.appendChild(span)
              span.id = `address_${j+2}`
              edit_button.id = `edit_button_address_${j+2}`
              save_button.id = `save_button_address_${j+2}`
              save_button.style.display = "none"
              span.innerHTML = a["address"]
              x.appendChild(edit_button)
              x.appendChild(save_button)
              edit_button.onclick = () => edit(span.id,edit_button.id,save_button.id)
              save_button.onclick = () => save(span.id,edit_button.id,save_button.id)
            }

          }

        })

    }


  }
  }

  function edit(span_id, edit, save){

    document.getElementById(edit).className = "edithidden"
    document.getElementById(save).style.display="inline";

    let text = document.getElementById(span_id).innerHTML
    
    let input = document.getElementById(span_id)
    input.innerHTML="<input class='input_cell' type='text' id='input_"+span_id+"' value='"+text+"' >";


  }

  function save(span_id, edit, save, d){
    id = d["ID"]


    document.getElementById(edit).className = "edit"
    document.getElementById(save).style.display="none";
    
    let text_val=document.getElementById("input_"+span_id).value;
    document.getElementById(span_id).innerHTML=text_val;

    if(text_val == ""){
      text_val = "nothing"
    }

    if(span_id == "forname_1"){
      document.getElementById("title").innerHTML = `${text_val} ${d["Surname"]}`
    } else if(span_id == "surname_1"){
      document.getElementById("title").innerHTML = `${d["Forname"]} ${text_val}`
    }
    
   fetch(`/updateInfo/${span_id}/${text_val}/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.text())
    .then(data => {
      updateFilter()
    })



  }


  function showRelDiv(){
    document.getElementById("create_relDiv").style.display = "flex"
    document.getElementById("remove_relDiv").style.display = "none"
    document.getElementById("merge_Div").style.display = "none"

  }

  function showRemoveDiv(){
    document.getElementById("create_relDiv").style.display = "none"
    document.getElementById("merge_Div").style.display = "none"
    document.getElementById("remove_relDiv").style.display = "flex"
   // showRelation(person)
    console.log("lks")
    console.log(person)
  }

  function showMergeDiv(){
    document.getElementById("create_relDiv").style.display = "none"
    document.getElementById("remove_relDiv").style.display = "none"
    document.getElementById("merge_Div").style.display = "flex"

  }

  function omitPerson(person){
    omit_id = person.ID
    omit_merge_id = `M_${person.ID}`
    document.getElementById("default_option").selected = "true"
    document.getElementById("default_option2").selected = "true"

    
    Array.from(document.querySelector("#person").options).forEach(function(option_element) {
      option_element.style.display = "inline"
    })

    Array.from(document.querySelector("#merge_select").options).forEach(function(option_element) {
      option_element.style.display = "inline"
    })
    document.getElementById("default_option").style.display = "none"
    document.getElementById("default_option2").style.display = "none"
    document.getElementById(omit_id).style.display = "none"
    document.getElementById(omit_merge_id).style.display = "none"
  }


  function getBirthDatabase(data){
    console.log(data)
    let value = document.getElementById("limit").value
      if(data){
        document.getElementById("loader").style.display = "block";
        document.getElementById("g").style.display = "none";
          fetch(`/database/${value}/${data.forname}/${data.surname}/${data.sex}/${data.dataset}/${data.father_forname}/${data.father_surname}/${data.mother_forname}/${data.mother_surname}/${data.address}/${data.occupation}/${data.f_occupation}/${data.m_occupation}/${data.death}/${data.marriage}/${data.p_marriage}`)
          .then (res => res.json())
          .then (jsn => {
            document.getElementById("loader").style.display = "none";
            document.getElementById("g").style.display = "block";
            nodes_activated = jsn[2]
            document.getElementById("count").innerHTML = `Showing ${nodes_activated.length} results of ${jsn[1]}`
            jsn = jsn[0]


            if(jsn.length !== 0){
                  createVis(jsn)
              }
          })
      }else{
          fetch(`/database`)
          .then (res => res.json())
          .then (jsn => {
              createVis(jsn)
          })
      }
  }



  function removePerson(person){

      let delete_person = person["ID"]
      fetch(`/remove/${current_list}/${delete_person}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.text())
        .then(data => {
          alert(data)
          updateFilter()
          modal.style.display = "none";
        })
  }






  function createVis(data, main){
      document.getElementById("g").innerHTML = ""
      createLegends()
      view = "dataset_info"
      ///////////////////////////////////////////////////////////////







      /////////////////////////////////////////////////////
      //intialize data
      var graph = { };

      graph.nodes = []
      graph.links = []


          for(let i = 0; i < data.length; i++){

              graph.nodes[i] = data[i]
              graph.nodes[i]["ID"] = data[i]["ID"]
              if(main && main.includes(data[i]["ID"])){
                data[i]["main"] = true
              }
          }

          console.log(graph.nodes)

          for(let i = 0; i < graph.nodes.length; i++){


            //Esta crea links entre un padre a un hijo 
            if(data[i].children.length !== 0){
              for(let child of data[i].children){
                if(graph.nodes.findIndex(x => x["ID"] === child) !== -1){
                  if(data[i].sex == "M"){
                    if(data[i]["new_rel"].includes(child)){
                      graph.links.push({source: data[i]["ID"], target: child, color: "green", rel: "father-child", dash:true})
                    }else{
                      graph.links.push({source: data[i]["ID"], target: child, color: "green", rel: "father-child"})
                    }
                  } else if(data[i].sex == "F"){
                    if(data[i]["new_rel"].includes(child)){
                      graph.links.push({source: data[i]["ID"], target: child, color: "#800000", rel: "mother-child", dash:true})
                    }else{
                      graph.links.push({source: data[i]["ID"], target: child, color: "#800000", rel: "mother-child"})
                    }
                }
              }
            }
          }



             //Esta crea links entre un hijo a un padre si el link no se ha creado todavia         
            if(data[i].father.length !== 0){
              for(let parent of data[i].father){
                let repeated
                for (let j = 0; j < graph.links.length; j++){
                  for(let child of data[i].children){
                    if(graph.links[j].source == child && graph.links[j].target == data[i]["ID"]){
                      repeated = "don't add"
                      if(repeated !== "don't add"){
                        if(data[i]["new_rel"].includes(parent)){
                          graph.links.push({source: data[i]["ID"], target: parent, color: "yellow", rel: "child-father", dash:true})
                        }else{
                          graph.links.push({source: data[i]["ID"], target: parent, color: "yellow", rel: "child-father"})
                        }
                      }
                    }
                  }
                }
              }
            }

            
            //Esta crea links entre un hijo a un madre si el link no se ha creado todavia         
            if(data[i].mother.length !== 0){
            for(let parent of data[i].mother){
              let repeated
              for (let j = 0; j < graph.links.length; j++){
                for(let child of data[i].children){
                  if(graph.links[j].source == child && graph.links[j].target == data[i]["ID"]){
                    repeated = "don't add"
                    if(repeated !== "don't add"){
                      if(data[i]["new_rel"].includes(parent)){
                        graph.links.push({source: data[i]["ID"], target: parent, color: "green", rel: "child-mother", dash:true})
                      }else{
                        graph.links.push({source: data[i]["ID"], target: parent, color: "green", rel: "child-mother"})
                      }
                    }
                  }
                }
              }
            }
          }

            //Esta crea links entre esposos
            if(data[i].spouse.length !== 0){
              for(let spouse of data[i].spouse){
                if(graph.nodes.findIndex(x => x["ID"] === spouse) !== -1 ){
                  let add = true            
                  for(let j = 0; j < graph.links.length; j++){
                    if(graph.links[j].source == spouse && graph.links[j].target == data[i]["ID"]){
                        add = false
                  } 
                }

                if(add == true){
                  if(data[i]["new_rel"].includes(spouse)){
                    graph.links.push({source: data[i]["ID"], target: spouse, color: "purple", rel: "spouse", dash:true})
                  }else{
                    graph.links.push({source: data[i]["ID"], target: spouse, color: "purple", rel: "spouse"})
                  }
                }

                }
              }
            }










            /*
            if(data[i].dataset == "marriage" && data[i].role == "groom"){
              if(graph.nodes.findIndex(x => x["ID"] === data[i]["spouse"][0]) !== -1){
                graph.links.push({source: data[i]["ID"], target: data[i]["spouse"][0], color: "purple"})
              }
              if(graph.nodes.findIndex(x => x["ID"] === data[i]["parents"][0]) !== -1){
                graph.links.push({source: data[i]["ID"], target: data[i]["parents"][0], color: "gray"})
              }
              if(graph.nodes.findIndex(x => x["ID"] === data[i]["parents"][1]) !== -1){
                graph.links.push({source: data[i]["ID"], target: data[i]["parents"][1], color: "gray"})
              }
              
            }
            
            if(data[i].dataset == "marriage" && data[i].role == "bride"){
              let repeated
              for (let j = 0; j < graph.links.length; j++){
                if(graph.links[j].source == data[i]["spouse"] && graph.links[j].target == data[i]["ID"]){
                  repeated = "don't add"
                }
              }
              if(repeated !== "don't add" && graph.nodes.findIndex(x => x["ID"] === data[i]["spouse"][0]) !== -1){
                graph.links.push({source: data[i]["ID"], target: data[i]["spouse"][0], color: "purple"})
              }
              if(graph.nodes.findIndex(x => x["ID"] === data[i]["parents"][0]) !== -1){
                graph.links.push({source: data[i]["ID"], target: data[i]["parents"][0], color: "gray"})
              }
              if(graph.nodes.findIndex(x => x["ID"] === data[i]["parents"][1]) !== -1){
                graph.links.push({source: data[i]["ID"], target: data[i]["parents"][1], color: "gray"})
              }
            }
            
            if(data[i].dataset == "death" && data[i].role == "deceased"){
             if(graph.nodes.findIndex(x => x["ID"] === data[i]["parents"][0]) !== -1){
                graph.links.push({source: data[i]["ID"], target: data[i]["parents"][0]})
             }
             if(graph.nodes.findIndex(x => x["ID"] === data[i]["parents"][1]) !== -1){
                graph.links.push({source: data[i]["ID"], target: data[i]["parents"][1]})
             }
            }

            */
          }
          

          console.log(graph.links)



      
      var simulation = d3
      .forceSimulation(graph.nodes)
      .force(
          "link",
          d3
              .forceLink()
              .id(function (d) {
                  return d["ID"];
              })
              .links(graph.links)
              .distance(function (d) {
                if(d["rel"] == "spouse"){
                  return 50;
                }else{
                  return 80;
                }
            })
      )

      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force("charge", d3.forceManyBody().strength(-250))
      //.force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);


    var link = d3.select('svg g')
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter()
      .append("line")
      .style("stroke", function (d) {
        return d.color
    })
    .attr("stroke-dasharray", function (d) {
            if(d.dash == true){
              return 5;
            }else{
              return 0;
            }
        })
      .attr("stroke-width", function (d) {
            if(d["rel"] == "spouse"){
              return 4;
            }else{
              return 3;
            }
        });


    var texts = d3.select('svg g').selectAll("text.label")
        .data(graph.nodes)
        .enter().append("text")
        .attr("dx", 24)
        .style("font-size", "10px")
        .style("fill", (d) => {
          if(nodes_activated.includes(d["ID"])) {
            return "red"
          }
          })
        .attr("dy", ".35em")
        .text(function(d) { return `${d["Forname"]} ${d["Surname"]}` });

        



  var node = d3.select('svg g')
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter()
      .append("circle")
      .attr("r", (d) => {

          return radius * ( 1 + (d["people_absorbed"].length * 0.1))

      })
      .style("fill", function (d) { 
          if(d["dataset"] == "birth"){
              return '#C64756';
          } else if(d["dataset"] == "marriage"){
              return '#DDFFBC';
          } else if(d["dataset"] == "death"){
            return '#EDF5E1';
        }
        }) 
        .style("stroke", function (d) {
          if(d["sex"] == "F"){
            return '#0A81AB';
        } else if(d["sex"] == "M"){
          return 'black';
      }
      })
          
      .call(
          d3
              .drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended)
      )
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("dblclick", clicked)
      

  function handleMouseOver(d, i) {
     
          hover_text = `${d["Forname"]} ${d["Surname"]}` 


          /*
   
      // Add interactivity
      d3.selectAll("circle")
      .style("opacity", 0.75)
      d3.selectAll("line")
      .style("opacity", 0.5)

      */
        d3.select(this).transition()
        .attr("r", radius * 1.5)


        .style("stroke-width", "3px")
        //.style("fill", "orange")
        .style("opacity", 1)
        

      /*
        d3.select("svg")
        .append("text")
            .attr("class","tooltip")
            .attr("x",d.x + 50)
            .attr("y", d.y + 5 )
            .text(hover_text)
            */
    }


  function handleMouseOut(d, i) {
      d3.selectAll("circle","line")
      /*
      .style("opacity", 1)
      d3.selectAll("line")
      .style("opacity", 1)*/
      // Use D3 to select element, change color back to normal
      // Add interactivity
      d3.select(this).transition()
      .attr("r", (d) => {
        return radius * ( 1 + (d["people_absorbed"].length * 0.1))

      })
      .style("fill", function (d) { 
        if(d["dataset"] == "birth"){
          return '#C64756';
      } else if(d["dataset"] == "marriage"){
          return '#DDFFBC';
      } else if(d["dataset"] == "death"){
        return '#EDF5E1';
    }
    })
    .style("stroke", function (d) {
      if(d["sex"] == "F"){
        return '#0A81AB';
    } else if(d["sex"] == "M"){
      return 'black';
  }
})

      d3.selectAll(".tooltip")
  .remove()

    }



  function ticked() {

      link
          .attr("x1", function (d) {
              return d.source.x;
          })
          .attr("y1", function (d) {
              return d.source.y;
          })
          .attr("x2", function (d) {
              return d.target.x;
          })
          .attr("y2", function (d) {
              return d.target.y;
          });

      node
          .attr("cx", function (d) {
              return d.x;
          })
          .attr("cy", function (d) {
              return d.y;
          });

      texts.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  }

  function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
  }

  function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
  }

  function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
  }


  }



  

  function createFilterViz(data){
    console.log(data)
    document.getElementById("svg2").innerHTML = ""
    createLegends()
    view = "list_info"
    let people = []
    ///////////////////////////////////////////////////////////////




        for(let i = 0; i < data.length; i++){

            people.push(data[i])
        }


         /////////////////////////////////////////////////////
        //intialize data
        var graph = { };

        graph.nodes = []
        graph.links = []

        for(let i = 0; i < people.length; i++){
            graph.nodes[i] = people[i]
        }
        

        console.log(graph.links)

    
    var simulation = d3
    .forceSimulation(graph.nodes)
    .force(
        "link",
        d3
            .forceLink()
            .id(function (d) {
                return d["ID"];
            })
            .links(graph.links)
            .distance(70)
    )

    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .force("charge", d3.forceManyBody().strength(-200))
    //.force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);


  var link = svg2
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line")
    .style("stroke", function (d) {
      return d.color
  })
    .attr("stroke-width", function (d) {
        return 3;
    });


    var texts = svg2.selectAll("text.label")
        .data(graph.nodes)
        .enter().append("text")
        .attr("dx", 24)
        .style("font-size", "10px")
        .attr("dy", ".35em")
        .text(function(d) { return `${d["Forname"]} ${d["Surname"]}` });


var node = svg2
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .attr("r", (d) => {
        if(d["sex"] || d["marriage"] || d["forename(s) of deceased"]) {
            return radius
        } else{
            return radius * .9
        }
    })
    .style("fill", function (d) { 
      if(d["dataset"] == "birth"){
          return '#C64756';
      } else if(d["dataset"] == "marriage"){
          return '#DDFFBC';
      } else if(d["dataset"] == "death"){
        return '#EDF5E1';
    }
    }) 
    .style("stroke", function (d) {
      if(d["sex"] == "F"){
        return '#0A81AB';
    } else if(d["sex"] == "M"){
      return 'black';
  }
  })

        
    .call(
        d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
    )
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .on("dblclick", clicked)
    

function handleMouseOver(d, i) {
   
        hover_text = `${d["Forname"]} ${d["Surname"]}` 

 
    // Add interactivity
    d3.selectAll("circle")
    .style("opacity", 0.75)
    d3.selectAll("line")
    .style("opacity", 0.5)

      d3.select(this).transition()
      .attr("r", radius * 1.5)


      .style("stroke-width", "3px")
      .style("fill", "orange")
      .style("opacity", 1)
      

    
      d3.select("svg")
      .append("text")
          .attr("class","tooltip")
          .attr("x",d.x + 50)
          .attr("y", d.y + 5 )
          .text(hover_text)
          
  }


function handleMouseOut(d, i) {
    d3.selectAll("circle","line")
    .style("opacity", 1)
    d3.selectAll("line")
    .style("opacity", 1)
    // Use D3 to select element, change color back to normal
    // Add interactivity
    d3.select(this).transition()
    .attr("r", (d) => {
        if(d["sex"] || d["marriage"] || d["forename(s) of deceased"]) {
            return radius
        } else{
            return radius * .9
        }
    })
    .style("fill", function (d) { 
      if(d["dataset"] == "birth"){
          return '#C64756';
      } else if(d["dataset"] == "marriage"){
          return '#DDFFBC';
      } else if(d["dataset"] == "death"){
        return '#EDF5E1';
    }
    }) 
    .style("stroke", function (d) {
      if(d["sex"] == "F"){
        return '#0A81AB';
    } else if(d["sex"] == "M"){
      return 'black';
  }
  })

    d3.selectAll(".tooltip")
.remove()

  }



function ticked() {

    link
        .attr("x1", function (d) {
            return d.source.x;
        })
        .attr("y1", function (d) {
            return d.source.y;
        })
        .attr("x2", function (d) {
            return d.target.x;
        })
        .attr("y2", function (d) {
            return d.target.y;
        });

    node
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        });

        texts.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

}

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}


}



















  function showLists(d) {
      updateList(d)
      document.getElementById("create_list_div").style.display = "none"
      document.getElementById("dataset_view").style.display = "flex"
      //document.getElementById("myDropdown").classList.toggle("show");
  }

  function createLists(d) {
      document.getElementById("create_list_div").style.display = "flex"
      document.getElementById("dataset_view").style.display = "none"
      document.getElementById("name").value = ""
      document.getElementById("add").onclick = () => addToList(d);

  }

  function addToList(d) {
      let value = document.getElementById("name").value
      if(value !== ""){
      fetch(`/list/${value}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.text())
        .then(data => {
          if(data == "already exists"){
            document.getElementById("list_message").innerHTML = "A list with the same already exists"
          } else{
            document.getElementById("list_message").innerHTML = data
          }
        })
      }
        
      //clicked(d)
        
  }
  
  function updateList(d){
      document.getElementById("list_name").innerHTML = ""
      fetch('/lists/all')
      .then(res => res.json())
      .then(data => {
          for(let i=0; i < data.length; i++){
              let value = data[0].name
              let option = document.createElement("OPTION");
              option.innerHTML = data[i].name
              option.value = data[i].name
              document.getElementById("list_name").append(option)

              document.getElementById("list_name").onchange = () => {
                value = document.getElementById("list_name").value
              }

              document.getElementById("add_list").onclick = () => {
                createListCollection(d,value)
                updateFilter()
              }

              //list.addEventListener("click", () => createListCollection(d,name));
             // document.getElementById("myDropdown").append(list); 
          }
      })
  }

  function createListCollection(d,collection){
      let lala = d["ID"]
      let collection_name = `${collection}`

      fetch(`/list/family/${lala}/${collection_name}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.text())
        .then(data => {
          alert(data)
          console.log("sdfasdsd")
          document.getElementById("dataset_view").style.display = "none"
          clicked(d)
        })

  }

  function loadLists(){

      fetch('/collections')
      .then(res => res.json())
      .then(data => {
          let collections = []
          for(collection of data){
              collections.push(collection.name)
          

              document.getElementById("default_option_list").style.display = "none"
              let option = document.createElement("option");
              option.innerHTML = collection.name
              option.value = collection.name
              document.getElementById("list_menu").append(option)
          }
      })
  }


  function addRelationship(d){
    let person = document.getElementById("person").value
    let rel = document.getElementById("relationship").value
    let id= d.ID

    if(person == "Select a person"){

    }else {
      fetch(`/addRel/${id}/${person}/${rel}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      .then(res => res.text())
      .then(data => {
        document.getElementById("create_relDiv").style.display = "none"
        alert(data)
        createFilterViz(current_filter_nodes)
      })
    }    

  }



  function removeRelationship(d){
    let id= d.ID
    let rel

    
    document.getElementById("relationship_remove").onchange = () => {
    rel = document.getElementById("relationship_remove").value

    document.getElementById("person_remove").innerHTML  = ""
    let default_option = document.createElement("option");
    default_option.id = "default_option_remove"
    default_option.selected = "true"
    default_option.disabled = "disabled"
    default_option.innerHTML = "Select a person"
    document.getElementById("person_remove").append(default_option)
    document.getElementById("default_option_remove").style.display = "none"
    fetch(`/get/rel/${id}/${rel}`)
    .then (res => res.json())
    .then (jsn => {

      for(let member of jsn){        
        let option = document.createElement("option");
        option.innerHTML = `${member.Forname} ${member.Surname} (${member.ID})`
        option.id = member.ID
        option.value = member.ID
        document.getElementById("person_remove").append(option)
      }
    })
  }
    document.getElementById("remove_relationship").onclick = () => {
      
      let person = document.getElementById("person_remove").value
      if(person == "Select a person"){

      } else{
        fetch(`/removeRel/${id}/${person}/${rel}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.text())
        .then(data => {
          alert(data)
          updateFilter()
        })
        clicked(d)
      }
    
    };


  }



  function merge(d){
    let id = d.ID
    let person = document.getElementById("merge_select").value
    let collection = document.getElementById("list_menu").value
    console.log(collection)

    if(person == "Select a person"){

    }else {
      
      fetch(`/merge/${id}/${person}/${collection}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      .then(res => res.text())
      .then(data => {
        alert(data)
        updateFilter()
        modal.style.display = "none";
      })

    
    } 
    
  }



  document.getElementById("search_button").onclick = () =>{
    let search_value
    if(input == "text"){
      search_value = document.getElementById("search").value
      document.getElementById("search").value = ""
    } else if(input == "list"){
      search_value = document.getElementById("select").value
    }

      if(search_value !== ""){

      if(document.getElementById(filter_search)){
        document.getElementById(filter_search).remove()
      }
      
      let new_filter_button = document.createElement("BUTTON")
      new_filter_button.className = "filter_buttons"
      new_filter_button.id = filter_search
      new_filter_button.innerHTML = `${filter_search.toUpperCase()}: ${search_value}  &#128473`
      new_filter_button.addEventListener('click', removeButton);

      function removeButton(e) {
        e.target.remove();
        filter[e.target.id] = false
        getBirthDatabase(filter) 
      }

      document.getElementById("selected_filters_div").append(new_filter_button)

      filter[filter_search] = search_value
      getBirthDatabase(filter) 
    } 
  }


  // Code By Webdevtrick ( https://webdevtrick.com )
  var tabLinks = document.querySelectorAll(".singleLink");
  var tabContents = document.querySelectorAll(".insideContent");
  tabLinks[0].classList.add("active");
  tabContents[0].classList.add("active");
  tabLinks.forEach(function (tabLink, i) {
    tabLink.id = `button_${i}`
      tabLink.addEventListener("click", function () {
          if(tabLink.id == "button_0"){
            view = "dataset_info"
          } else if(tabLink.id == "button_1"){
            view = "list_info"
            getFilterLists()
          }

          tabLinks.forEach(function (tabLink) { return tabLink.classList.remove("active"); 
        });
          tabContents.forEach(function (tabContent) { return tabContent.classList.remove("active"); });
          tabLink.classList.add("active");
          tabContents[i].classList.add("active");
      });
  });
  

  window.onload = () => {
      loadLists()
      getBirthDatabase()
      
  }

})();