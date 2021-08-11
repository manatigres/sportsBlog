const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 4000



const { MongoClient } = require('mongodb');
const bp = require('body-parser')
const app = express()
const API_PORT = process.env.PORT || 22650;
const limit = 15;


app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))


async function main() {
    const uri = "mongodb+srv://kds4:Mongo123@cluster0.oficb.mongodb.net/Sample?retryWrites=true&w=majority";
    const uri2 = "mongodb+srv://kds4:Mongo123@cluster0.oficb.mongodb.net/List?retryWrites=true&w=majority";

    client =  new MongoClient(uri, {useUnifiedTopology: true})
    client2 = new MongoClient(uri2, {useUnifiedTopology: true})

    try {

        await client.connect();
        await client2.connect();

        groups = client.db("Sample").collection("sample_collection");
        marriage = client.db("Sample").collection("marriage_records");
        death = client.db("Sample").collection("death_records");
        list_names = client.db("Sample").collection("list");
        //list = client2.db("List").collection("BORRAR");
        combined = client.db("Sample").collection("combined_collections");
        absorbed = client.db("Sample").collection("absorbed");
        activity = client.db("Sample").collection("activity");
 
        //await findOneListingByName(client, "Lovdely Loft");

    } catch(e){

        console.error(e);
    } 

    try {

        app
        .use(express.static(path.join(__dirname, 'public')))
        .set('views', path.join(__dirname, 'views'))
        .set('view engine', 'ejs')
        .get('/', (req, res) => res.render('pages/index'))
        .listen(PORT, () => console.log(`Listening on ${ PORT }`))

    } catch(e){

        console.error(e);
    } 

}

main().catch(console.error);




app.get('/database', function(req,res) {
    combined.find({}).limit(limit).toArray()
        .then(group => {
            res.status(200).json(group);
        })
        .catch(err => {
            res.status(400).send("Could not get group information", err.message);
        })
});

app.get('/get/activity', async function(req,res) {
  const activity_array = await activity.findOne({id: "activity"})

  res.status(200).json(activity_array.activity);


});

app.get('/getNotes/:person', async function(req,res) {

    let id = req.params.person

    const person = await combined.findOne({ID: id})

    let notes = person["notes"]

    console.log(person)
    console.log(notes)

    
    res.status(200).send(notes);



});

app.get('/getPerson/:person', async function(req,res) {
    let id = req.params.person

    const person = await combined.findOne({ID: id})

    res.status(200).send(person);
});



app.get('/database/:value/:forname/:surname/:sex/:dataset/:father_forename/:father_surname/:mother_forename/:mother_surname/:address/:occupation/:f_occupation/:m_occupation/:death/:marriage/:p_marriage', async function(req,res) {
    let value = parseInt(req.params.value);
    let forname = req.params.forname;
    let surname = req.params.surname;
    let sex = req.params.sex;
    let dataset = req.params.dataset;
    let father_forname = req.params.father_forename;
    let father_surname = req.params.father_surname;
    let mother_forname = req.params.mother_forename;
    let mother_surname = req.params.mother_surname;
    let address = req.params.address;
    let occupation = req.params.occupation;
    let f_occupation = req.params.f_occupation;
    let m_occupation = req.params.m_occupation;
    let s_occupation = req.params.s_occupation;
    let death = req.params.death;
    let marriage = req.params.marriage;
    let p_marriage = req.params.p_marriage;
    
    let queary = {}
    let extra_people = []
    let all_people
    let global_people = []
    let response = []
    let main = []

    

    if(forname !== "false"){
        queary["Forname"] = { $regex : new RegExp(forname, "i") }
    } if(surname !== "false"){
        queary["Surname"] = { $regex : new RegExp(surname, "i") }
    } if(sex !== "false"){
        queary["sex"] = sex
    } if(dataset !== "false"){
        queary["dataset"] = dataset
    } if(father_forname !== "false"){
        queary["father_forname"] = { $regex : new RegExp(father_forname, "i") }
    } if(father_surname !== "false"){
        queary["father_surname"] = { $regex : new RegExp(father_surname, "i") }
    } if(mother_forname !== "false"){
        queary["mother_forname"] = { $regex : new RegExp(mother_forname, "i") }
    } if(mother_surname !== "false"){
        queary["mother_surname"] = { $regex : new RegExp(mother_surname, "i") }
    } if(address !== "false"){
        queary["address"] = { $regex : new RegExp(address, "i") }
    } if(occupation !== "false"){
        queary["occupation"] = { $regex : new RegExp(occupation, "i") }
    } if(f_occupation !== "false"){
        queary["father_occupation"] = { $regex : new RegExp(f_occupation, "i") }
    } if(m_occupation !== "false"){
        queary["mother_occupation"] = { $regex : new RegExp(m_occupation, "i") }
    } if(death !== "false"){
        queary["date of death"] = { $regex : new RegExp(death, "i") }
    } if(marriage !== "false"){
        queary["place_marriage"] = { $regex : new RegExp(marriage, "i") }
    } if(p_marriage !== "false"){
        queary["place_parents_marriage"] = { $regex : new RegExp(p_marriage, "i") }
    }

    console.log(queary)

    const count = await combined.find(queary).count()
    const group = await combined.find(queary).limit(value).toArray()

    
            all_people = group

            for(let x of all_people){
                global_people.push(x["ID"])
                main.push(x["ID"])
            }

            //Returns children of people
            for(let person of all_people){
                if(person.children.length > 0){
                    for(let child of person.children){
                        if(global_people.includes(child)){
                        }  else{
                            extra_people.push(child)
                            global_people.push(child)
                        }                  
                    }
                }
            }
             //Returns father of people
            for(let person of all_people){
                if(person.father.length > 0){
                    for(let parent of person.father){
                        if(global_people.includes(parent)){
                        }else{
                            extra_people.push(parent)
                            global_people.push(parent)
                        }
                    }
                }
            }

        
                //Returns mother of people
                for(let person of all_people){
                if(person.mother.length > 0){
                    for(let parent of person.mother){
                        if(global_people.includes(parent)){
                        }else{
                            extra_people.push(parent)
                            global_people.push(parent)
                        }
                    }
                }
            }

        
            //Returns spouse of people
            for(let person of all_people){
                if(person.spouse.length > 0){
                    for(let spouse of person.spouse){
                        if(global_people.includes(spouse)){
                        }else{
                            extra_people.push(spouse)
                            global_people.push(spouse)
                        }
                    }
                }
            }

            for(let person of extra_people){

                all_people.push(await gatherMorePeople(person))
            }





            for(let i = 0; i < all_people.length; i++){
              if(all_people[i] == undefined){
                all_people.splice(i,1)
              }
            }

            if(all_people.includes(undefined)){
              console.log("yess")
            }

            
            response[0] = all_people
            response[1] = count
            response[2] = main
                res.status(200).json(response)


});

async function gatherMorePeople(id){
    const person = await combined.findOne({ID: id})
    return person


}

app.post('/list/family/:candidate/:collection', async function (req, res) {
    let candidate = req.params.candidate; 
    let collection = req.params.collection

    const person = await client2.db("List").collection(collection).findOne({person_id: candidate})
    console.log(person)


    if(person == undefined){
      client2.db("List").collection(collection).insertOne({person_id: candidate})
      .then(comment => {
          console.log("Successfully insert with ID", comment.insertedId);
          res.status(200).send(`Person has been added to this list`);
      })
    } else{
      res.status(200).send(`Person is already in the list`);
    }


})



app.get('/lists/all', function(req,res) {
    list_names.find({}).toArray()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {res.status(200).json(data)
            res.status(400).send("Could not get information", err.message);
        })
});


app.get('/absorbed/:absorbed_id', function(req,res) {

    let id = req.params.absorbed_id;
    
    absorbed.findOne({ID: id})
        .then(data => {
            res.status(200).json(data);
        })

});

app.get('/get/list/:list', async function(req,res) {
    
    let list = req.params.list;
    let people = []

    const data = await client2.db("List").collection(`${list}`).find({}).toArray()


    for(person of data){
            people.push(await getPerson(person.person_id))                    
    }


    res.status(200).json(people);
})


app.get('/get/rel/:id/:rel', async function(req,res) {
    let id = req.params.id;
    let rel = req.params.rel;
    let people = []

    const person = await combined.findOne({ID: id})

    for(relative of person[`${rel}`]){
            people.push(await getPerson(relative))                    
    }


    res.status(200).json(people);
})
      

async function getPerson(id){
    const result = await combined.find({ID: id}).toArray()
    return result[0]
}

app.get('/collections',  function(req,res) {
    client2.db("List").listCollections({}, {nameOnly: true}).toArray(function(err, collection) {
        res.status(200).json(collection)});
})

app.post('/list/:list', async function (req, res) {
    let newList = req.params.list;
    let exist = "yes"

    
    client2.db("List").createCollection(`${newList}`)
        .then(() => {
            let collection = client2.db("List").collection(newList); //initialise our global variable so it can be used later
            console.log("Collection created!");
            list_names.insertOne({ name: newList})
            res.status(200).send(`${newList} list has been created`);
        })
        .catch(err => { 
            console.log("Could not create collection ", err.message); 
            res.status(200).send("already exists")
            //we will can check the reason the creation failed - 48 means collection already exists
            //in this case, we are choosing to re-throw the error if the collection does *not* already exist 
            if ( err.name != 'MongoError' || err.code!== 48) throw err
        })

        if(exist == "no"){
            list_names.insertOne({ name: newList})
                    .then(comment => {
            console.log("Successfully insert with ID", comment.insertedId);
        })
        }
    })




    app.post('/addRel/:d/:person/:rel', async function (req, res) {
        let reciever = req.params.d; 
        let new_rel = req.params.person
        let relationship = req.params.rel
        let relationship2
        let manually_created_rel1 = []
        let manually_created_rel2 = []


        const person1 = await combined.findOne({ID: reciever})
        const person2 = await combined.findOne({ID: new_rel})

        if(relationship == "children"){
            if(person2.sex == "M"){
                relationship2 = "father"
            } else if(person2.sex == "F"){
                relationship2 = "mother"
            }   
            
        } else if(relationship == "father"){
            relationship2 = "children"
        } else if(relationship == "mother"){
            relationship2 = "children"
        } else if(relationship == "spouse"){
            relationship2 = "spouse"
        }


        
        if(person1[`${relationship}`].includes(new_rel) || person2[`${relationship2}`].includes(reciever)){
            res.status(200).send(`Relationship already exists`);
        }else{
            person1[`${relationship}`].push(new_rel)
            person2[`${relationship2}`].push(reciever)

            person1["new_rel"].push(new_rel)
            person2["new_rel"].push(reciever)

    
            if(relationship == "children" && relationship2 == "father"){
                await combined.findOneAndUpdate(
                    { ID: reciever},
                    {$set: { children : person1["children"] }},
                    {upsert: true}
                )
                await combined.findOneAndUpdate(
                    { ID: new_rel},
                    {$set: { father : person2['father'] }},
                    {upsert: true}
                )
            }  else if(relationship == "children" && relationship2 == "mother"){
                await combined.findOneAndUpdate(
                    { ID: reciever},
                    {$set: { children : person1["children"] }},
                    {upsert: true}
                )
                await combined.findOneAndUpdate(
                    { ID: new_rel},
                    {$set: { mother : person2['mother'] }},
                    {upsert: true}
                )
            } else if(relationship == "father"){
                await combined.findOneAndUpdate(
                    { ID: reciever},
                    {$set: { father : person1['father'] }},
                    {upsert: true}
                )
                await combined.findOneAndUpdate(
                    { ID: new_rel},
                    {$set: { children : person2["children"] }},
                    {upsert: true}
                )
            } else if(relationship == "mother"){
                await combined.findOneAndUpdate(
                    { ID: reciever},
                    {$set: { mother : person1['mother'] }},
                    {upsert: true}
                )
                await combined.findOneAndUpdate(
                    { ID: new_rel},
                    {$set: { children : person2["children"] }},
                    {upsert: true}
                )
            } else if(relationship == "spouse"){
                await combined.findOneAndUpdate(
                    { ID: reciever},
                    {$set: { spouse : person1["spouse"] }},
                    {upsert: true}
                )
                await combined.findOneAndUpdate(
                    { ID: new_rel},
                    {$set: { spouse : person2["spouse"] }},
                    {upsert: true}
                )
            }


            await combined.findOneAndUpdate(
                { ID: reciever},
                {$set: { new_rel : person1["new_rel"] }},
                {upsert: true}
            )
            await combined.findOneAndUpdate(
                { ID: new_rel},
                {$set: { new_rel : person2["new_rel"] }},
                {upsert: true}
            )

        }


        


        


       res.status(200).send(`Relationship has been created`);

        
    })


    app.post('/removeRel/:d/:person/:rel', async function (req, res) {
        let reciever = req.params.d; 
        let new_rel = req.params.person
        let relationship = req.params.rel
        let relationship2

        const person1 = await combined.findOne({ID: reciever})
        const person2 = await combined.findOne({ID: new_rel})



        if(relationship == "children"){
            if(person2.sex == "M"){
                relationship2 = "father"
            } else if(person2.sex == "F"){
                relationship2 = "mother"
            }   
            
        } else if(relationship == "father"){
            relationship2 = "children"
        } else if(relationship == "mother"){
            relationship2 = "children"
        } else if(relationship == "spouse"){
            relationship2 = "spouse"
        }


        


        if(person1[`${relationship}`].includes(new_rel) && person2[`${relationship2}`].includes(reciever)){

            const index1 = person1[`${relationship}`].indexOf(new_rel)
            if (index1 > -1) {
                person1[`${relationship}`].splice(index1, 1);
            }

            const index2 = person2[`${relationship2}`].indexOf(reciever)
            if (index2 > -1) {
                person2[`${relationship2}`].splice(index2, 1);
            }


            if(relationship == "children" && relationship2 == "father"){
                await combined.findOneAndUpdate(
                    { ID: reciever},
                    {$set: { children : person1["children"] }},
                    {upsert: true}
                )
                await combined.findOneAndUpdate(
                    { ID: new_rel},
                    {$set: { father : person2['father'] }},
                    {upsert: true}
                )
            }  else if(relationship == "children" && relationship2 == "mother"){
                await combined.findOneAndUpdate(
                    { ID: reciever},
                    {$set: { children : person1["children"] }},
                    {upsert: true}
                )
                await combined.findOneAndUpdate(
                    { ID: new_rel},
                    {$set: { mother : person2['mother'] }},
                    {upsert: true}
                )
            } else if(relationship == "father"){
                await combined.findOneAndUpdate(
                    { ID: reciever},
                    {$set: { father : person1['father'] }},
                    {upsert: true}
                )
                await combined.findOneAndUpdate(
                    { ID: new_rel},
                    {$set: { children : person2["children"] }},
                    {upsert: true}
                )
            } else if(relationship == "mother"){
                await combined.findOneAndUpdate(
                    { ID: reciever},
                    {$set: { mother : person1['mother'] }},
                    {upsert: true}
                )
                await combined.findOneAndUpdate(
                    { ID: new_rel},
                    {$set: { children : person2["children"] }},
                    {upsert: true}
                )
            } else if(relationship == "spouse"){
                await combined.findOneAndUpdate(
                    { ID: reciever},
                    {$set: { spouse : person1["spouse"] }},
                    {upsert: true}
                )
                await combined.findOneAndUpdate(
                    { ID: new_rel},
                    {$set: { spouse : person2["spouse"] }},
                    {upsert: true}
                )
            }

            
            res.status(200).send(`Relationship has been removed`);


        }


        
    })


    app.post('/merge/:d/:person/:collection', async function (req, res) {
        let merged_personID = req.params.d; 
        let erasedID = req.params.person
        let collection = req.params.collection
        let update = []


        let person1 = await combined.findOne({ID: merged_personID})
        let person2 = await combined.findOne({ID: erasedID})



        if(person2.mother.length > 0){
            for(let mother of person2.mother){
                if(person1.mother.includes(mother)){
                }else{
                    person1.mother.push(mother)
                    update.push(mother)
                }
            }
        } if(person2.father.length > 0){
            for(let father of person2.father){
                if(person1.father.includes(father)){
                }else{
                    person1.father.push(father)
                    update.push(father)
                }
            }
        } if(person2.children.length > 0){
            for(let child of person2.children){
                if(person1.children.includes(child)){
                }else{
                    person1.children.push(child)
                    update.push(child)
                }
            }
        } if(person2.spouse.length > 0){
            for(let spouse of person2.spouse){
                if(person1.spouse.includes(spouse)){
                }else{
                    person1.spouse.push(spouse)
                    update.push(spouse)
                }
            }
        }

        person2["absorbedBy"] = merged_personID
        person1["people_absorbed"].push(erasedID)


        for(let relationship_id of update){
            let person = await combined.findOne({ID: relationship_id})
            


            if(person.mother.length > 0){
                if(person["mother"].findIndex(x => x === erasedID) !== -1){
                    let index = person.mother.findIndex(x => x === erasedID)
                    person.mother[index] = merged_personID
                }
            } if(person.father.length > 0){
                if(person["father"].findIndex(x => x === erasedID) !== -1){
                    let index = person.father.findIndex(x => x === erasedID)
                    person.father[index] = merged_personID
                }
            } if(person.children.length > 0){
                if(person["children"].findIndex(x => x === erasedID) !== -1){
                    let index = person.children.findIndex(x => x === erasedID)
                    person.children[index] = merged_personID
                }
            } if(person.spouse.length > 0){
                if(person["spouse"].findIndex(x => x === erasedID) !== -1){
                    let index = person.spouse.findIndex(x => x === erasedID)
                    person.mother[index] = merged_personID
                }
            }

            

            await combined.findOneAndUpdate(
                { ID: person.ID},
                {$set: 
                    { mother: person.mother,
                     father: person.father,
                     children: person.children,
                     spouse: person.spouse}
                },
                {upsert: true}
            )
        }

        await combined.findOneAndUpdate(
            { ID: merged_personID},
            {$set: {  mother: person1.mother,
                     father: person1.father,
                     children: person1.children,
                     spouse: person1.spouse,
                     people_absorbed: person1["people_absorbed"]}},
            {upsert: true}
        )
    


        absorbed.insertOne(person2)

        await combined.deleteOne( { ID: erasedID } )
        await client2.db("List").collection(collection).deleteOne( { person_id: erasedID } )


        res.status(200).send(`They have been merged`);


        


        
    })



    app.post('/remove/:list/:person', function (req, res) {
        let person = req.params.person;
        let list = req.params.list;    
        
        
       client2.db("List").collection(list).deleteOne({ person_id: person })
            .then(() => {
                console.log("person deleted");
                res.status(200).send(`Person was removed`);
            })
            .catch(err => { 
                console.log("Could not delete person ", err.message); 
                //we will can check the reason the creation failed - 48 means collection already exists
                //in this case, we are choosing to re-throw the error if the collection does *not* already exist 
                if ( err.name != 'MongoError' || err.code!== 48) throw err; 
            })
        })


        app.post('/removeList/:list', async function (req, res) {
          let list = req.params.list;    
          

        await list_names.deleteOne( { name: list } )

        await client2.db("List").collection(list).drop()
          
        res.status(200).send(`List deleted`);
          
          
        })

        app.post('/activity', async function (req, res) {
          let phrase= req.body;    

          
         //await activity.insertOne({id: "activity", activity: []})

         let activity_array = await activity.findOne({id: "activity"})
         activity_array.activity.push(phrase.phrase)

          await activity.findOneAndUpdate(
            { id: "activity"},
            {$set: {  activity: activity_array.activity}},
            {upsert: true}
        )
        res.status(200).send(`Note added`);
          
        })

        app.post('/addNote/:person', async function (req, res) {
            let id = req.params.person;
            let note = req.body   
            
            const person = await combined.findOne({ID: id})

            person["notes"].push(note.value)

            
            await combined.findOneAndUpdate(
                { ID: id},
                {$set: {  notes: person["notes"]}},
                {upsert: true}
            )

            res.status(200).send(`Note added`);

            })

            app.post('/updateInfo/:cell/:info/:person', async function (req, res) {
                let id = req.params.person;
                let cell = req.params.cell;
                let info = req.params.info;
                let queary

                if(cell == "forname_1"){
                    queary = "Forname"
                } else if(cell == "surname_1"){
                    queary = "Surname"
                } else if(cell == "birthday_1"){
                    queary = "birthday"
                } else if(cell == "birthday_1"){
                    queary = "sex_1"
                } else if(cell == "sex"){
                    queary = "birthday"
                } else if(cell == "occupation_1"){
                    queary = "occupation"
                } else if(cell == "address_1"){
                    queary = "address"
                } else if(cell == "fatherOcc_1"){
                    queary = "father_occupation"
                } else if(cell == "motherOcc_1"){
                    queary = "mother_occupation"
                } else if(cell == "marriage_1"){
                    queary = "place_marriage"
                } else if(cell == "p_marriage_1"){
                    queary = "place_parents_marriage"
                } else if(cell == "death_1"){
                    queary = "date of death"
                }
                
                if(info == "nothing"){
                    info = ""
                }


                console.log(info)
                console.log(cell)
                console.log(queary)

                const person = await combined.findOne({ID: id})
    

    
                
                await combined.findOneAndUpdate(
                    { ID: id},
                    {$set: {  [`${queary}`] : info}},
                    {upsert: true}
                )
    

                res.status(200).send(`Note added`);
    
                })






