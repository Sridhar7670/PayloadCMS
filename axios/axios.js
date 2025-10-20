import axios from "axios"
const url=`http://localhost:3000/api/graphql`;
const CreateSkillUrl=`http://localhost:3000/api/skills?depth=0&fallback-locale=null`
const CreateIDUrl=`http://localhost:3000/api/IdCard?depth=0&fallback-locale=null`
const headers=`
    "Authorization":"users API-Key e6e5091c-97da-4857-8d24-ce729cf60fc2",
    'Content-Type':"application/json",
`
const GetSingleIdCard={"query":"query GetSingleIdCard1 {  IdCard(id:1) {   id  userName   jobTitle position gender }}",variables:{}}

//GET SINGLE CARD id Crad no :1

axios.post(url,GetSingleIdCard,{
    headers:{
    "Authorization":`users API-Key e6e5091c-97da-4857-8d24-ce729cf60fc2`,
    'Content-Type':"application/json",
    }
})
.then(data=>console.log(data.data))
.catch(err=>console.log("this is for testiing SINGLE CARD",err));


//GET SINGLE CARD id Crad not equals :1

const DataNotEquals1=`{"query":"query getUniqueCrads { IdCards(where: { id: { not_equals: 1 } }, limit: 5) { docs {  id    userName    jobTitle    position    gender    Address    }    totalDocs    limit  }}","variables":{}}`

axios.post(url,DataNotEquals1,{
    headers:{
    "Authorization":`users API-Key e6e5091c-97da-4857-8d24-ce729cf60fc2`,
    'Content-Type':"application/json",
    }
})
.then(response=> { 
     // 1. Get the array of card objects
    const cardArray = response.data.data.IdCards.docs;
    
    console.log("Here is the array of cards:", cardArray);
})
.catch(err => console.log("this is for testing GET ALL CRADS NOT EQULAS 1", err.response ? err.response.data : err));


//GET ALL SKILLS
const GETALLSKILLS=`{"query":"query GetAllSkills {  Skills {    docs {     id      skillName      description    }    totalDocs    hasNextPage  }}","variables":{}}`

axios.post(url,GETALLSKILLS,{
    headers:{
    "Authorization":`users API-Key e6e5091c-97da-4857-8d24-ce729cf60fc2`,
    'Content-Type':"application/json",
    }
})
.then(response=> { 
    const AllSkills = response.data.data.Skills.docs;
    
    console.log("Here are All Skills:", AllSkills);
})
.catch(err => console.log("this is for testing GET ALL SKILLS", err.response ? err.response.data : err));


//CREATE SKILL
const CREATESKILLRAW=`{"skillName":"graph qll ","description":"some random "}`
axios.post(CreateSkillUrl,CREATESKILLRAW,{
    headers:{
        "Authorization":`users API-Key e6e5091c-97da-4857-8d24-ce729cf60fc2`,
        'Content-Type':"application/json",
    }
})
.then(response=> { 
    const CREATEDSKILL = response.data;
    
    console.log("Here is the CREATED Skill:", CREATEDSKILL);
})
.catch(err => console.log("this is for testing CREATING SKILL", err.response ? err.response.data : err));


//CREATE ID CARD 
const CREATEIDCARD=`{"gender":"Male","Address":"wefghjm,.","userName":"Sridhar ","jobTitle":"SomeOne","position":"Strong"}`
axios.post(CreateIDUrl,CREATEIDCARD,{
    headers:{
        "Authorization":`users API-Key e6e5091c-97da-4857-8d24-ce729cf60fc2`,
        'Content-Type':"application/json",
    }
})
.then(response=> { 
    const CREATEDID = response.data;
    
    console.log("Here is the CREATED ID CARD:", CREATEDID);
})
.catch(err => console.log("this is for testing CREATE ID", err.response ? err.response.data : err));


//UPDATE ID CARD QUERY AND VARIABLES ARE ADDED HERE

const UpdateSingleIdCard=`{
"query":"mutation UpdateSingleIdCard($cardId: Int!, $cardData: mutationIdCardUpdateInput!) {  updateIdCard(id: $cardId, data: $cardData) {    id    userName    jobTitle    position  }}",
"variables":{"cardId":1,"cardData":{"jobTitle":"junior Engineer"}}}`

axios.post(url,UpdateSingleIdCard,{
    headers:{
    "Authorization":`users API-Key e6e5091c-97da-4857-8d24-ce729cf60fc2`,
    'Content-Type':"application/json",
    }
})
.then(response=> { 
    const cardId = response.data;
    
    console.log("Here is the card after updateion:", cardId);
})
.catch(err => console.log("this is for testing UPDATE ID", err.response ? err.response.data : err));

//DELETE REQUEST 
const id=22
const deleteUrl=`http://localhost:3000/api/skills/${id}`
axios.delete(deleteUrl,{
    headers:{"Authorization": `users API-Key e6e5091c-97da-4857-8d24-ce729cf60fc2`}
})
.then(response=> { 
    const DletedID = response.data;
    
    console.log("Here is the card after DELETING:", DletedID);
})
.catch(err => console.log("this is for testing delet ID", err.response ? err.response.data : err));
