//////VALIDATIONS//////////////////

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})
// Add Method
$.validator.addMethod('textOnly',(v,e)=>{
  let ex =  /^[\u0621-\u064A0-9 ]+$/;
  if(v.match(ex)){
    return true
  }
})

$.validator.addMethod('noSpace',(v,e)=>{
  let ex =v.trim();
  if(ex.length!=0){
    return true
  }
})

// Start validation
// one table
var validator1 = $("#guide_form").validate({
  rules:{
    guide:{
      required:true,
     // textOnly:true,
     noSpace:true
    }
  },
  messages:{
    guide:{
      //textOnly:' !رجاء ادخال دليل محاسبي صحيح',
      noSpace:' !رجاء ادخال دليل محاسبي صحيح'
    }
  }
})
// two table
var validator2 = $("#item_form").validate({
  rules:{
    item:{
      required:true,
     // textOnly:true,
     noSpace:true
    }
  },
  messages:{
    item:{
      //textOnly:' !رجاء ادخال اسم صنف صحيح',
      noSpace:' !رجاء ادخال اسم صنف صحيح'
    }
  }
})
// thired table
var validator3 = $("#cost_form").validate({
  rules:{
    cost:{
      required:true,
      //textOnly:true,
      noSpace:true
    }
  },
  messages:{
    cost:{
      //textOnly:' !رجاء ادخال مركز تكلفة صحيح',
      noSpace:' !رجاء ادخال مركز تكلفة صحيح',
    }
  }
})

// Fourth table
var validator4 = $("#employee_form").validate({
  rules:{
    employee:{
      required:true,
      //textOnly:true,
      noSpace:true
    }
  },
  messages:{
    employee:{
      //textOnly:' !رجاء ادخال اسم موظف صحيح',
      noSpace:' !رجاء ادخال اسم موظف صحيح',
    }
  }
})

// supplier table
var validator5 = $("#supplier_form").validate({
  rules:{
    supplier:{
      required:true,
      //textOnly:true,
      noSpace:true
    }
  },
  messages:{
    supplier:{
     // textOnly:' !رجاء ادخال مركز تكلفة صحيح',
    noSpace:' !رجاء ادخال مركز تكلفة صحيح',
    }
  }
})

// client table
var validator6 = $("#client_form").validate({
  rules:{
    client:{
      required:true,
      //textOnly:true,
      noSpace:true
    }
  },
  messages:{
    client:{
     // textOnly:' !رجاء ادخال مركز تكلفة صحيح',
    noSpace:' !رجاء ادخال اسم عميل صحيح',
    }
  }
})
//////End VALIDATIONS//////////////////

// Custom Function to send and responed res of backend
const sendApiEdite = async (id,value,type) => {
  var data ={
    value :  value,
    id     : id,
    type: type
  }
  axios({
    method:'post',
    url   :'/accounting/accounting_guide/editeAccounting_guide/',
    data  :data
  }).then(
      res =>{
        if(res.data.status==true){

          // repalce
          $("#value_"+id).val(value)
          $("#value_dele_"+id).val(value)
          $("#value_row_"+id).replaceWith(`<td id="value_row_${id}">${value}</td>`)
  
          // toggle modal
          var idModal = "#exampleModaledite_"+id ;
          $(idModal).modal('toggle')
  
          // add alert succedd
          Toast.fire({
            icon: 'success',
            title: res.data.msg
          })
          
         }else if(res.data.msg == 'notAllow'){
            window.location = "/";
          
        }else{
          Toast.fire({
            icon: 'error',
            title: res.data.msg
          })
        }
      })
$("#exampleModaledite_"+id+ " .modal-dialog  .modal-content  .modal-body .mb-3 div").remove();
return true;
}

// custo function to  delete
const sendApidelete = async (id,type) => {
var data = {
     id : id,
     type: type,
  }
  axios({
    method:'post',
    url   : '/accounting/accounting_guide/deleteAccounting_guide',
    data  : data
  }).then(
    res=>{
      if(res.data.status == true){

        // toggle Modal
        let idModal = "#exampleModaldelete_"+id ;
        $(idModal).modal('toggle')

        //  remove element
        $("#"+id).remove();
        
        // show success msg
        return Toast.fire({
          icon : 'success',
          title: res.data.msg
        });

      }else if(res.data.msg == 'notAllow'){
        return window.location = "/";
      }else{
        return Toast.fire({
          icon : 'error',
          title: res.data.msg
        });
      }
    }
  )
}

// Guide Modal
function saveChangesGuide (id){
var value = $("#value_"+id).val().trim();
if(value.length ==0)return $("#exampleModaledite_"+id+ " .modal-dialog  .modal-content  .modal-body .mb-3").append(`<div style="color:red;">من فضلك قم بأدخال قيمة صحيحة !</div>`);
sendApiEdite(id,value,'guide')
}
function deleteGuide(id){
  // call API Function 
  sendApidelete(id,'guide')
}



// Item Modal
function saveChangesItem(id){
var value = $("#value_"+id).val().trim();
if(value.length ==0)return $("#exampleModaledite_"+id+ " .modal-dialog  .modal-content  .modal-body .mb-3").append(`<div style="color:red;">من فضلك قم بأدخال قيمة صحيحة !</div>`);

sendApiEdite(id,value,'item')
}
function deleteItem(id){
  // call API Function 
  sendApidelete(id,'item')
}


// Cost Modal
function saveChangesCost(id){
var value = $("#value_"+id).val().trim();
if(value.length ==0)return $("#exampleModaledite_"+id+ " .modal-dialog  .modal-content  .modal-body .mb-3").append(`<div style="color:red;">من فضلك قم بأدخال قيمة صحيحة !</div>`);

sendApiEdite(id,value,'cost')
}
function deleteCost(id){
  // call API Function 
  sendApidelete(id,'cost')
}


// Employee Modal
function saveChangesEmployee(id){
var value = $("#value_"+id).val().trim();
if(value.length ==0)return $("#exampleModaledite_"+id+ " .modal-dialog  .modal-content  .modal-body .mb-3").append(`<div style="color:red;">من فضلك قم بأدخال قيمة صحيحة !</div>`);

sendApiEdite(id,value,'employee')
}
function deleteEmployee(id){
 // call API Function 
 sendApidelete(id,'employee')
}



// Supplier Modal
function saveChangesSupplier(id){
var value = $("#value_"+id).val().trim();
if(value.length ==0)return $("#exampleModaledite_"+id+ " .modal-dialog  .modal-content  .modal-body .mb-3").append(`<div style="color:red;">من فضلك قم بأدخال قيمة صحيحة !</div>`);

sendApiEdite(id,value,'supplier')
}
function deleteSupplier(id){
   // call API Function 
   sendApidelete(id,'supplier')
}


// Client Modal
function saveChangesClient(id){
var value = $("#value_"+id).val().trim();
if(value.length ==0)return $("#exampleModaledite_"+id+ " .modal-dialog  .modal-content  .modal-body .mb-3").append(`<div style="color:red;">من فضلك قم بأدخال قيمة صحيحة !</div>`);

sendApiEdite(id,value,'client')
}
function deleteClient(id){
  // call API Function 
  sendApidelete(id,'client')
}


///// Sweet alert /////////////////////
//     Swal.fire({
//     title: 'هل انت متاكد من حذف هذاالدليل؟',
//     text: "لن تتمكن من استرجاع هذا الدليل مرة اخري !",
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'نعم , أحذف هذا'
// }).then((result) => {
//     if (result.isConfirmed) {
//     Swal.fire(
//         'تم الحذف !',
//         'تم حذف هذا الدليل بنجاح',
//         'success'
//     )
//     }
// })

// Toast.fire({
//   icon: 'success',
//   title: 'تم حذف هذا الدليل بنجاح'
// })


///// End Sweet alert /////////////////////

// append_new_row function
const append_new_row = (id,value,table)=>{
  var id = id;
  var value = value;
  var table;
  if (table == 'guide'){
    var idtable = '#onetable';
    var editeTitle = 'تعديل الدليل المحاسبي';
    var subEditeTitle = 'اسم الدليل';
    var editNameInput = 'guide_edited';
    // delete
    var deleteTitle = ' حذف الدليل';
    var deleteNameInput = 'guide_delete';
    var msg_delete = ' لن يمكنك استرجاع هذا الدليل بعد ذلك !!';
    var edite = 'saveChangesGuide';
    var delet =  'deleteGuide';
  }else if(table == 'item'){
    var idtable = '#twotable';
    var editeTitle = 'تعديل اسم الصنف';
    var subEditeTitle = 'اسم الصنف';
    var editNameInput = 'item_edited';
    // delete
    var deleteTitle = ' حذف الصنف';
    var deleteNameInput = 'item_delete';
    var msg_delete = ' لن يمكنك استرجاع هذا الصنف بعد ذلك !!';
    var edite = 'saveChangesItem';
    var delet =  'deleteItem';
  }else if(table =='cost'){
    var idtable = '#thiredtable';
    var editeTitle = 'تعديل مركز التكلفة';
    var subEditeTitle = 'اسم التكلفة';
    var editNameInput = 'cost_edited';
    // delete
    var deleteTitle = ' حذف التكلفة';
    var deleteNameInput = 'cost_delete';
    var msg_delete = ' لن يمكنك استرجاع هذة التكلفة بعد ذلك !!';
    var edite = 'saveChangesCost';
    var delet =  'deleteCost';
  }else if(table =='employee'){
    var idtable = '#fourthtable';
    var editeTitle = 'تعديل اسم الموظف';
    var subEditeTitle = 'اسم الموظف';
    var editNameInput = 'employee_edited';
    // delete
    var deleteTitle = ' حذف الموظف';
    var deleteNameInput = 'employee_delete';
    var msg_delete = ' لن يمكنك استرجاع هذا الموظف بعد ذلك !!';
    var edite = 'saveChangesEmployee';
    var delet =  'deleteEmployee';
  }else if(table =='supplier'){
    var idtable = '#suppliertable';
    var editeTitle = 'تعديل اسم المورد';
    var subEditeTitle = 'اسم المورد';
    var editNameInput = 'supplier_edited';
    // delete
    var deleteTitle = ' حذف المورد';
    var deleteNameInput = 'supplier_delete';
    var msg_delete = ' لن يمكنك استرجاع هذا المورد بعد ذلك !!';
    var edite = 'saveChangesSupplier';
    var delet =  'deleteSupplier';
  }else if(table =='client'){
    var idtable = '#clienttable';
    var editeTitle = 'تعديل اسم العميل';
    var subEditeTitle = 'اسم العميل';
    var editNameInput = 'client_edited';
    // delete
    var deleteTitle = ' حذف العميل';
    var deleteNameInput = 'client_delete';
    var msg_delete = ' لن يمكنك استرجاع هذا العميل بعد ذلك !!';
    var edite = 'saveChangesClient';
    var delet =  'deleteClient';
  }
  $(idtable).append(`
  <tr id="${id}">
  <th scope="row">  ${$( idtable+" tr").length +1}  </th>
  <td id="value_row_${id}">${value}</td>
  <td>
      <span class="font-edit"  data-bs-toggle="modal" data-bs-target="#exampleModaledite_${id}"><i class="far fa-edit"></i></span>
      <span class="font-delete"data-bs-toggle="modal" data-bs-target="#exampleModaldelete_${id}"><i class="far fa-trash-alt"></i></span> 


      <!-- Edite Employee -->
      <div class="modal fade" id="exampleModaledite_${id}" tabindex="-1" aria-labelledby="${id}" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"> ${editeTitle} </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                  <label for="${id}" class="col-form-label">${subEditeTitle}</label>
                  <input type="text" id="value_${id}"  value="${value}" class="form-control" name="${editNameInput}">
                </div>
            </div>
            <div class="modal-footer">
              <input class="btn btn-primary btn-block" type="button" onclick='${edite}("${id}")' value="حفظ التعديلات" />
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal">اغلاق</button>
            </div>
          </div>
        </div>
      </div>


      <!-- Delte Employee -->
      <div class="modal fade" id="exampleModaldelete_${id}" tabindex="-1" aria-labelledby="${id}" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" > ${deleteTitle}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form>
            <div class="modal-body">
                <div class="mb-3">
                  <label for="delete_${id}" class="col-form-label">${subEditeTitle}</label>
                  <input type="text" readonly id="value_dele_${id}" value="${value}" class="form-control" name="${deleteNameInput}">
                  <label for="" style="color: red;">${msg_delete}</label>
                </div>
            </div>
            <div class="modal-footer">
              <input class="btn btn-danger btn-block" type="button" onclick='${delet}("${id}")' value="حذف !" />
              <button type="button" class="btn btn-dark" data-bs-dismiss="modal">اغلاق</button>
            </div>
          </form>
          </div>
        </div>
      </div>
  </td>
</tr>
`)
return true;
}
// End append_new_row function /////////////


///// API & submit froms /////////////////////
const AddNewRowBackend = (data) =>{
   
if(data.type == 'guide'){
      var success_msg = 'تم انشاء الدليل بنجاح';
      var error_msg   = 'هذا الدليل موجود بالفعل !';
      var closeModal  = '#closeGuideModel';
      var clearVal    = '#guid';
}else if(data.type == 'item'){
      var success_msg = 'تم انشاء الصنف بنجاح';
      var error_msg   = 'هذا الصنف موجود بالفعل !';
      var closeModal  = '#closeItemModel';
      var clearVal    = '#item';
}else if(data.type == 'cost'){
      var success_msg =  'تم انشاء التكلفة بنجاح';
      var error_msg   = 'هذة التكلفة موجود بالفعل !';
      var closeModal  = '#closeCostModel';
      var clearVal    = '#cost';
}else if(data.type == 'supplier'){
      var success_msg = 'تم اضافة هذا المورد';
      var error_msg   = 'هذا المورد موجود بالفعل !';
      var closeModal  = '#closeSupplierModel';
      var clearVal    = '#supplier';
}else if(data.type == 'employee'){  
      var success_msg =  'تم اضافة هذا الموظف';
      var error_msg   = 'هذا الموظف موجود بالفعل !';
      var closeModal  = '#closeEmployeeModel';
      var clearVal    = '#employee';
}else if(data.type == 'client'){
      var success_msg =  'تم اضافة هذا العميل';
      var error_msg   = 'هذا العميل موجود بالفعل !';
      var closeModal  = '#closeClientModel';
    var clearVal    = '#client';
  }
var RES=  axios({
    method:'post',
    url   :'/accounting/accounting_guide/addAccounting_guide/',
    data  :data
  }).then(
      res =>{
        if(res.data.status==true){
          // add alert succedd
          Toast.fire({
            icon: 'success',
            title: success_msg
          })

          $(closeModal).click()
          $(clearVal).val('')
           
        return  res.data;
        }else if(res.data.msg == 'notAllow'){
          window.location = "/";
      }else{
          Toast.fire({
            icon: 'error',
            title: error_msg
          })
          return  res.data;
      }
    })
  return RES
}

// ONE TABLE
// Submit Form
$("#guide_form").on("submit",async(e)=>{
e.preventDefault()
if(validator1.numberOfInvalids() !=0)return;
var data ={
  name :  $("#guide").val().trim(),
  type : 'guide'
}

let save = await AddNewRowBackend(data);

if(save.status==true)return append_new_row(save.guide._id , save.guide.name , 'guide')
})

// TWO TABLE
$("#item_form").on("submit",async (e)=>{
e.preventDefault()
if(validator2.numberOfInvalids() !=0)return;
var data ={
  name :  $("#item").val().trim(),
  type : 'item'
}



let save = await AddNewRowBackend(data);
if(save.status==true)return append_new_row(save.guide._id , save.guide.name , 'item')
})

//THIRED TABLE
$("#cost_form").on("submit",async (e)=>{
e.preventDefault()
if(validator3.numberOfInvalids() !=0)return;
var data ={
  name :  $("#cost").val().trim(),
  type:'cost'
}
let save = await AddNewRowBackend(data);
if(save.status==true)return append_new_row(save.guide._id , save.guide.name , 'cost')

}) 

//Fourth TABLE
$("#employee_form").on("submit",async (e)=>{
  e.preventDefault()
  if(validator4.numberOfInvalids() !=0)return;
  var data ={
    name :  $("#employee").val().trim(),
    type:'employee'
  }
  let save = await AddNewRowBackend(data);
if(save.status==true)return append_new_row(save.guide._id , save.guide.name , 'employee')
})

//Supplier TABLE
$("#supplier_form").on("submit",async (e)=>{
  e.preventDefault()
  if(validator5.numberOfInvalids() !=0)return;
  var data ={
    name :  $("#supplier").val().trim(),
    type : 'supplier'
  }
  let save = await AddNewRowBackend(data);
if(save.status==true)return append_new_row(save.guide._id , save.guide.name , 'supplier')
})
  

  //Client TABLE
$("#client_form").on("submit",async (e)=>{
e.preventDefault()
if(validator6.numberOfInvalids() !=0)return;
var data ={
  name :  $("#client").val().trim(),
  type : 'client'
}
let save = await AddNewRowBackend(data);
if(save.status==true)return append_new_row(save.guide._id , save.guide.name , 'client')
})
///// End API & submit froms ///////////////////// 749