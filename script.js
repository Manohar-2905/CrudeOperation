let regform=document.querySelector(".user-register");
let allInput=document.querySelectorAll(".inputs");
let allbtn=regform.querySelectorAll("button");
let closebtn=document.querySelector(".btn-close");
let regList=document.querySelector(".reg-list");
let addBtn=document.querySelector(".add-btn");
let searchEl=document.querySelector(".search");
let allBtnDel=document.querySelector(".delete-Allbtn");
let pagination=document.querySelector(".pagination-box");
let prevBtn=document.querySelector(".prev-btn");
let nextBtn=document.querySelector(".next-btn");

let alldata=[];
let url="";
if(localStorage.getItem("alldata") != null){
    alldata=JSON.parse(localStorage.getItem("alldata"))
}
// adding data
regform.onsubmit=(e)=>{
    e.preventDefault();
    let checkEmail=alldata.find((data)=>data.email==allInput[1].value);

    if(checkEmail== undefined){
        alldata.push({ 
            name : allInput[0].value,
            email : allInput[1].value,
            mobile : allInput[3].value,
            dob : allInput[2].value,
            password : allInput[4].value,
            profile: url=="" ? "./assest/pngtree-wolf-logo-png-image_2306634.jpg ": url 
        });
        localStorage.setItem("alldata",JSON.stringify(alldata));
    
        swal("Data inserted","sucessfully","success");
        closebtn.click();
        regform.reset();
        getRegData(0,5);
        allpagBtn[0].click();
        url="";
    }
    else{
        swal("Already Data Exists","Failed","warning")
    }
    
}
//updating table
 const  getRegData=(skiped,loaded)=>{
    let divideData=alldata.slice(skiped,loaded);
    regList.innerHTML ="";
    divideData.forEach((data,index)=>{
        let datastr=JSON.stringify(data);
        let finaldata=datastr.replace(/"/g,"'");
        regList.innerHTML +=`
         <tr>
            <td>${index+1}</td>
            <td>
                <img src="${data.profile}" width="30">
            </td>
            <td>${data.name}</td>
            <td>${data.email}</td>
            <td>${data.dob}</td>
            <td>${data.mobile}</td>
            <td>
                <button data="${finaldata}" index="${index}" class="edit-btn btn btn-primary p-1 px-2"><i class="fa-solid fa-pen-to-square "></i></button>
                <button index="${index}" class="del-btn btn btn-danger p1 px-2"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`
    });
    action();
 }

 let action=()=>{
    // deleting data
    let alldb=regList.querySelectorAll(".del-btn");
    for(dbtn of alldb){
        dbtn.onclick=async()=>{
            let isconfirm= await confirm();
            if(isconfirm){
                let index=dbtn.getAttribute("index");
                alldata.splice(index,1);
                localStorage.setItem("alldata",JSON.stringify(alldata));
                getRegData(0,5);
                allpagBtn[0].click();
            }
            
        }
    }

    //editing data
    let alledtbtn=regList.querySelectorAll(".edit-btn");
    for(edbtn of alledtbtn){
        edbtn.onclick=()=>{
            let index=edbtn.getAttribute("index");
            let datastr=edbtn.getAttribute("data");
            let datafinal=datastr.replace(/'/g,'"');
            let data=JSON.parse(datafinal);
            addBtn.click();
            allInput[0].value=data.name;
            allInput[1].value=data.email;
            allInput[2].value=data.dob;
            allInput[3].value=data.mobile;
            allInput[4].value=data.password;
            url=data.profile;
            allbtn[0].disabled=false;
            allbtn[1].disabled=true;
            allbtn[0].onclick=()=>{
                alldata[index]={
                    name : allInput[0].value,
                    email : allInput[1].value,
                    mobile : allInput[3].value,
                    dob : allInput[2].value,
                    password : allInput[4].value,
                    profile: url=="" ? "./assest/pngtree-wolf-logo-png-image_2306634.jpg ": url 
                }
                localStorage.setItem("alldata",JSON.stringify(alldata));
    
                swal("Data updated ","sucessfully","success");
                closebtn.click();
                regform.reset();
                getRegData(0,5);
                allpagBtn[0].click();
                allbtn[1].disabled=false;
                allbtn[0].disabled=true;
            }
            

        }
    }
 }

 getRegData(0,5);

//deleting all data
allBtnDel.onclick=async ()=>{
    let isconfirm=await confirm();
    if(isconfirm){
         alldata=[];
         localStorage.removeItem("alldata");
         getRegData();
    }
 }

 // reading profile 
allInput[5].addEventListener("change", ()=>{
    let freader= new FileReader();
    freader.readAsDataURL(allInput[5].files[0]);
    freader.onload=function(event){
        url=event.target.result; 
    }

});


// confirmation alert
let confirm=()=>{
    return new Promise((resolve,reject)=>{
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                resolve(true);
              swal("Poof! Your imaginary file has been deleted!", {
                icon: "success",
              });
            } else {
                reject(false);
              swal("Your imaginary file is safe!");
            }
          });
    })
};

//searching element
searchEl.oninput=()=>{
    search();
}

search=()=>{
    let value=searchEl.value.toLowerCase();
    let allTr=regList.querySelectorAll("TR");
    let i;
    for(i=0;i<allTr.length;i++){
        let allTd=allTr[i].querySelectorAll("TD");
        let name=allTd[2].innerHTML;
        let email=allTd[3].innerHTML;
        let phone=allTd[5].innerHTML;
        if(name.toLocaleLowerCase().indexOf(value)!= -1){
            allTr[i].style.display="";
        }else if(email.toLocaleLowerCase().indexOf(value) !=-1){
            allTr[i].style.display="";
        }else if(phone.toLocaleLowerCase().indexOf(value) != -1){
            email.toLocaleLowerCase().indexOf(value) !=-1
        }
        else{
            allTr[i].style.display="none";
        }

    }
}

//pagination

let length=Number((alldata.length)/5) ;
let i,skip=0,load=5;
if(length.toString().indexOf(".") != -1){
    length=length+1;
}else{
    length=length;
}

for(i=1;i<=length;i++){
    pagination.innerHTML +=` <button data-skip="${skip}" data-load="${load}" class="btn paginate-btn bg-dark text-white">${i}</button>`;
    skip=skip+5;
    load=load+5;
}

let allpagBtn=pagination.querySelectorAll(".paginate-btn");
allpagBtn[0].classList.add("active");
allpagBtn.forEach((pagBtn,index)=>{
    pagBtn.addEventListener("click", function(){
        controlPrevAndNextBtn(allpagBtn,index);
        for(let el of allpagBtn){
            el.classList.remove("active");
        }
        this.classList.add("active");
        let dataSkip=this.getAttribute("data-skip");
        let dataLoad=this.getAttribute("data-load");
        getRegData(dataSkip,dataLoad);
    });
});

nextBtn.onclick=()=>{
    let currIdx=0;
    allpagBtn.forEach((btn,index)=>{
        if(btn.classList.contains("active")){
            currIdx=index+1;
        }
    });
    allpagBtn[currIdx].click();
    controlPrevAndNextBtn(allpagBtn,currIdx);
}


prevBtn.onclick=()=>{
    let currIdx=0;
    allpagBtn.forEach((btn,index)=>{
        if(btn.classList.contains("active")){
            currIdx=index-1;
        }
    });
    allpagBtn[currIdx].click();
    controlPrevAndNextBtn(allpagBtn,currIdx);
}

const controlPrevAndNextBtn=(allpagBtn,currIdx)=>{
    let length=allpagBtn.length-1;
    if(length==currIdx){
        nextBtn.disabled=true;
        prevBtn.disabled=false;
    }else if(currIdx>0){
        nextBtn.disabled=false;
        prevBtn.disabled=false;
    }else{
        nextBtn.disabled=false;
        prevBtn.disabled=true;
    }
}
