  $(document).ready(function(){
    $("#myInput").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#myTable tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
});


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

function AddRowItem(){
  var item = document.getElementById('inputItem');
  var values = $.map(item ,function(option) {
     return  '<option value=' + option.value  + '>  '+ option.innerText + ' </option>' 
});
 
  $("#spam-item").append(`
  <div class=" ">
    <select  class="form-select div_column" name="selectItem[]">
    <option value="">اختيار صنف</option>
      ${values}
    </select>
  </div>`)
  $("#spam-count").append(`<input type="number" min="1" class="form-control div_column"  placeholder="" name="count[]" aria-label="">`)
  $("#spam-price").append(`<input type="text" class="form-control div_column" placeholder=""  name="price[]" aria-label="" >`)
  $("#spam-Descound").append(`<input type="text" class="form-control div_column" placeholder="" name="descound[]" aria-label="" >`)
  $("#spam-TotalBeforeDescound").append(`<input type="text" readonly  name="TotalBeforeDescound[]" class="form-control div_column" placeholder="" aria-label="">`)
  $("#spam-TotalAfterDescound").append(`<input type="text" readonly  name="TotalAfterDescound[]" class="form-control div_column" placeholder="" aria-label="">`)
}
function RemoveRowItem(){
  $("#spam-item div").last().remove()
  $("#spam-count .div_column").last().remove()
  $("#spam-price .div_column").last().remove()
  $("#spam-Descound .div_column").last().remove()
  $("#spam-TotalBeforeDescound .div_column").last().remove()
  $("#spam-TotalAfterDescound .div_column").last().remove()
}
function CalculateABToTal(){
var selectItem = document.getElementsByName('selectItem[]'); 
var count = document.getElementsByName('count[]'); 
var price = document.getElementsByName('price[]'); 
var descound = document.getElementsByName('descound[]');
var TotalBeforeDescound = document.getElementsByName('TotalBeforeDescound[]');
var TotalAfterDescound = document.getElementsByName('TotalAfterDescound[]');
var dataArray = []

for (var i = 0; i < count.length; i++) {
    var o = {};
    var item = selectItem[i].value;
    var c = Number(count[i].value).toFixed(2);
    var p = Number(price[i].value).toFixed(2);
    var d = Number(descound[i].value).toFixed(2);
    d = d /100 ;
    
    if(c =='' || c <0 || p=='' || p<0 || item=='') {
      $('#Count_Price_error').append(`<div style='color:red;background-color:black;font-size: 18px;'>رجاء تأكد ان العدد و السعر والصنف قيم صحيحة !</div>`); 
      return false;
    }

    let TotalAfter  = ( (c*p)  - (c*p*d) ).toFixed(2)
    if(TotalAfter == 0)  TotalAfter = (c*p).toFixed(2)

    TotalBeforeDescound[i].value = ( c*p)
    TotalAfterDescound[i].value = (TotalAfter)
    o.item = item;
    o.count = c;
    o.price = p;
    o.descound =  d  
    o.TotalBeforeDescound =  c*p;
    o.TotalAfterDescound = TotalAfter;
    dataArray.push(o)
    
}

return(dataArray)
}
  // add method 'notMinus'
$.validator.addMethod('notMinus',(v,e)=>{
  if(v > 0){
    return true;
  }else{
    return false;
  }
})
//
$.validator.addMethod('diffrentAccount',(v,e)=>{
  if($("#DebtorAccount").val() == $("#CreditorAccount").val() ){
    return false;
  }else{
    return true;
  }
})
var validator = $("#invoice-form").validate({
  rules:{
   selectItem :{
     required :true
   },
   date:{
     required:true
   },
   ExplainTheLimitation:{
     required :true
   },
  DebtorAccount:{
    required:true
  },
  CreditorAccount:{
    required:true,
    diffrentAccount:true
  },
  },
  messages:{
    CreditorAccount:{
      diffrentAccount: 'رجاء اختيار حساب مدين و دائن مختلفين '
    },
  }
})


$("#invoice-form").on('submit',async (e)=>{
  e.preventDefault()
  if(validator.numberOfInvalids() !=0)return;

  // Start Calculate ToTal
  let cal = await CalculateABToTal();
  if(cal == false) return
  //  End  Calculate ToTal

  var data = {
    invoiceNumber          :$("#invoiceNumber").val(),
    date                   : $("#date").val(),
    ExplainTheLimitation   : $("#ExplainTheLimitation").val(),
    items                  : cal,
    DebtorAccount          : $("#DebtorAccount").val(),
    CreditorAccount        : $("#CreditorAccount").val(),
  }

axios({
method:'post',
url   :'/accounting/dailyAgenda/AddInvoice',
data  : data
}).then(
  res=>{

  if(res.data.status==true){
    Toast.fire({
      icon: 'success',
      title: res.data.msg
    })
    $("#invoiceNumber").val('')
     $("#date").val("");
     $("#ExplainTheLimitation").val('');
    $(".div_column").val('')
    $(".alert-notInvoices").remove();
    $("#Count_Price_error div").remove()
    let invoice = res.data.invoice;
   
    // append new row

    var DebtorAccount = document.getElementById('DebtorAccount');
    var valuesDebtor = $.map(DebtorAccount ,function(option) {
        return  '<option value=' + option.value  + '>  '+ option.innerText + ' </option>' 
    });
  
var items = (id)=>{
  var options = document.getElementById('inputItem');
  var id = String(id);
   
    var valuesItem =   $.map(options ,function(option){
        let idOption = String(option.value)
      if(id!= idOption)return  ('<option  value=' + option.value  + '>' + option.innerText + ' </option>');
      return   ('<option selected value=' + option.value  + '>' + option.innerText + ' </option>');
    })
    return valuesItem
}

var itrations = ()=>{
  var re = '' ;
   for(i=0; i< invoice.items.length; i++){

      re += "<div class=\"line\">_____________________________________________________</div>" +
          "<br>"+
         " <div class=\"input-group mb-3 form-input\"> "+
                "<label for=\"invoices_item\" class=\"input-group-text\">الصنف</label>"+
                "<select name='inputItem_"+invoice._id+'[]\' ' + ' class=form-select  data-live-search="true">'+
                 "option  value='delete' > حذف هذا العنصر </option>"+
                   items(invoice.items[i].item)
                  + "</select>" +
                 "</div>" + 

                " <div class=\"input-group mb-3 form-input\"> "+
                " <label for=\"invoices_count\" class=\"input-group-text\">العدد</label>  "+
                "  <input type=\"number\" name=count_"+invoice._id+'[] '+" value="+invoice.items[i].count +"  class=\"form-control\" > "+
                " </div>"+


            "<div class=\"input-group mb-3 form-input\">"+
                    "<label for=\"invoices_price\" class=\"input-group-text\">السعر</label>"+
                    "<input type=\"number\" name=price_"+invoice._id+'[] '+" value="+invoice.items[i].price +" class=\"form-control\" >"+
            "</div>"+



            "<div class=\"input-group mb-3 form-input\">"+
              "<label for=\"invoices_descound\" class=\"input-group-text\">نسبةالخصم</label>"+
              "<input type=\"number\" name=descound_"+invoice._id+'[]  '+ "  value="+invoice.items[i].descound*100 +" class=\"form-control\" >"+
            "</div>"+

            "<div class=\"input-group mb-3 form-input\">"+
                    "<label for=\"TotalBeforeDescound\" class=\"input-group-text\">السعر قبل الخصم</label>"+
                    "<input type=\"text\" readonly  name=EditeTotalBeforeDescound_"+invoice._id+ '[] '+ "  value="+invoice.items[i].TotalBeforeDescound +" class=\"form-control\">"+
            "</div>"+

            "<div class=\"input-group mb-3 form-input\">"+
              "<label for=\"TotalAfterDescound\" class=\"input-group-text\">السعر بعد الخصم</label>"+
              "<input type=\"text\" readonly  name=EditeTotalAfterDescound_"+invoice._id+'[]'+" value="+invoice.items[i].TotalAfterDescound +"  class=\"form-control\">"+
            "</div> ";       
  }
    return re
}

$("#myTable").prepend(`

<tr id="row_inovice_${invoice._id}">
<th scope="row">  ${ $( "#myTable  tr").length +1}  </th>
<td class="RegistrationNumber"> ${invoice.RegistrationNumber} </td>
<td class="invoiceNumber"> ${invoice.invoiceNumber} </td>

<td id="invoiceDate_${invoice._id}">${ new Date(invoice.date).toISOString().slice(0,10)} </td>

<td>${invoice.items.length}</td>

<td id="invoiceDebtorAccount_${invoice._id}">         ${invoice.DebtorAccount.name} </td>
<td id="invoiceCreditorAccount_${invoice._id}">       ${invoice.CreditorAccount.name} </td>
<td>
  <span class="font-edit"  data-bs-toggle="modal" data-bs-target="#InvoiceModaledite_${invoice._id}"><i class="far fa-edit"></i></span>
  <span class="font-delete"data-bs-toggle="modal" data-bs-target="#InvoiceModaldelete_${invoice._id}"><i class="far fa-trash-alt"></i></span> 
  
<!-- Edite invoices -->
<div class="modal fade " id="InvoiceModaledite_${invoice._id}" tabindex="-1" aria-labelledby="${invoice._id}" aria-hidden="true">
<div class="modal-dialog ">
  <div class="modal-content">
    <form  id="formEdite_${invoice._id}" name="formEditeName_${invoice._id}">
    <div class="modal-header">
      <h5 class="modal-title">تعديل فاتورة</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    
    <div class="modal-body">
        <div class="mb-3">

          <div class="">
            <div class="alert alert-dark" role="alert">
              رقم الفاتورة :  <span class="badge badge-dark text-dark">${ invoice.invoiceNumber}</span>
              <input type="hidden" id="Edite_invoiceNumber_${invoice._id}"  value="${ invoice.invoiceNumber}">
              <span class="sr-only">unread messages</span>
              <br>
              رقم القيد :  <span class="badge badge-dark text-dark">${ invoice.RegistrationNumber}</span>
              <input type="hidden" id="Edite_RegistrationNumber_${invoice._id}"  value="${ invoice.RegistrationNumber}">
              <span class="sr-only">unread messages</span>
            </div>
          </div>

          <div class="input-group mb-3 form-input">
              <label for="invoices_date" class="input-group-text ">التاريخ</label>
              <input type="date" value="${ new Date(invoice.date).toISOString().slice(0,10)}" id="date_${invoice._id}"  class="form-control" name="invoices_date">
          </div>
          
<div class="input-group mb-3 form-input">             

            <label for="oldDebtorAccount_${invoice._id}" class="input-group-text">حساب المدين</label>
              
            <select class="form-select" id="DebtorAccount_${invoice._id}" name="DebtorAccount_${invoice._id}">
              <option  selected value='${invoice.DebtorAccount._id}' > ${invoice.DebtorAccount.name} </option>
              <br>
              ${valuesDebtor}
            </select>
            <label  class="DebtorAccount_error_${invoice._id}" for="DebtorAccount"></label>
          </div>


          <div class="input-group mb-3 form-input">             

            <label for="oldCreditorAccount_${invoice._id}" class="input-group-text">حساب دائن</label>
              
            <select class="form-select" id="CreditorAccount_${invoice._id}" name="CreditorAccount_${invoice._id}">
              <option  selected value='${invoice.CreditorAccount._id}' >  ${invoice.CreditorAccount.name} </option>
              ${valuesDebtor} 
            </select>
          </div>
          <spam  class="CreditorAccount_error_${invoice._id}" ></spam>

    <div class="input-group mb-3 form-input">
      <label for="invoices_ExplainTheLimitation" class="input-group-text">شرح القيد</label>
      <input type="text" id="ExplainTheLimitation_${invoice._id}" value="${invoice.ExplainTheLimitation}"  class="form-control" name="invoices_ExplainTheLimitation">
    </div>
    <span class="ExplainTheLimitation_error_${invoice._id}"></span>

    <!-- --Start Items Of Invoice -->
    <div id="AddRow_${invoice._id}">
        ${itrations()}
    </div>
<!-- --Start Items Of Invoice -->
<div class="Count_Price_error_${invoice._id}"></div>
              <input type="button" onclick="AddRowItemEdite('${invoice._id}')" class="btn btn-dark" value="اضافة عنصر">
              
              <button  class="btn btn-success" type="button"   onclick="calculateEditeTotal('${invoice._id}')">احسب الاجمالي الجديد</button>
              <span class="Count_Price_error_${invoice._id}"></span>
      </div>
    </div>
  

    <div class="modal-footer">
      <input class="btn btn-primary btn-block" type="button" onclick="submitEditeInvoice('${invoice._id}')" value="حفظ التعديلات" />
      <button type="button" class="btn btn-danger" id="CloseEditeModal_${invoice._id}" data-bs-dismiss="modal">اغلاق</button>
    </div>
  </form>
  </div>
</div>
</div>



<!-- Delte Supplier -->
<div class="modal fade" id="InvoiceModaldelete_${invoice._id}" tabindex="-1" aria-labelledby="${invoice._id}" aria-hidden="true">
<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title">حذف فاتورة</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <form>
    <div class="modal-body">

      
      <div class="">
        <div class="alert alert-dark" role="alert">
          رقم الفاتورة :  <span class="badge badge-dark text-dark">${ invoice.invoiceNumber}</span>
          <input type="hidden" id="delete_invoiceNumber_${invoice._id}"  value="${ invoice.invoiceNumber}">
          <span class="sr-only">unread messages</span>
        
          <br>
        
          رقم القيد :  <span class="badge badge-dark text-dark">${ invoice.RegistrationNumber}</span>
          <input type="hidden" id="delete_RegistrationNumber_${invoice._id}"  value="${ invoice.RegistrationNumber}">
          <span class="sr-only">unread messages</span>
        </div>
      </div>


    </div>
    <div class="modal-footer">
      <input class="btn btn-danger btn-block" type="button" onclick='submitDeleteInvoice("${invoice._id}")' value="حذف !" />
      <button type="button" class="btn btn-dark CloseModal_${invoice._id}" data-bs-dismiss="modal">اغلاق</button>
    </div>
  </form>
  </div>
</div>
</div>

</td>
</tr>
`)
  }else if(res.data.msg == 'notAllow'){
    window.location = "/";
  
  }else{
    Toast.fire({
      icon: 'error',
      title: res.data.msg
    })
  }
  })
 
})



function calculateEditeTotal(id){
var items = document.getElementsByName('inputItem_'+id+'[]')
var count = document.getElementsByName('count_'+id+'[]')
var price = document.getElementsByName('price_'+id+'[]')
var descound = document.getElementsByName('descound_'+id+'[]')
var EditeTotalBeforeDescound = document.getElementsByName('EditeTotalBeforeDescound_'+id+'[]')
var EditeTotalAfterDescound = document.getElementsByName('EditeTotalAfterDescound_'+id+'[]')


var dataArray = []
var Total = Number(0);
for (var i = 0; i < count.length; i++) {
    var o = {};
    var item = items[i].value;
    var c = Number(count[i].value).toFixed(2);
    var p = Number(price[i].value).toFixed(2);
    var d = Number(descound[i].value).toFixed(2);
    d = d /100 ;
    
    if(c =='' || c <0 || p=='' || p<0 || item=='') {
      $('.Count_Price_error_'+id).append(`<div style='color:red;background-color:black;font-size: 18px;'>رجاء تأكد ان العدد و السعر والصنف قيم صحيحة !</div>`); 
      return false;
    }else{

    if(item != 'delete'){
      let TotalAfter  = ( (c*p)  - (c*p*d) ).toFixed(2)
      if(TotalAfter == 0)  TotalAfter = (c*p).toFixed(2)
  
      EditeTotalBeforeDescound[i].value = (c*p).toFixed(2);
      EditeTotalAfterDescound[i].value = (TotalAfter)
  
      Total += TotalAfter
      o.item = item;
      o.count = c;
      o.price = p;
      o.descound =  d 
      o.TotalBeforeDescound =  c*p;
      o.TotalAfterDescound = TotalAfter;
      dataArray.push(o)
    }else{
      console.log('Deleted ;)')
    }
    
  }
}

return(Total , dataArray)
}
function AddRowItemEdite(id){
var item = document.getElementById('inputItem');
var values = $.map(item ,function(option) {
    return  '<option value=' + option.value  + '>  '+ option.innerText + ' </option>' 
});

$("#AddRow_"+id).append(`
<div class="line">_____________________________________________________</div>
<br>
<div class="input-group mb-3 form-input">
  <label for="invoices_item" class="input-group-text">الصنف</label>
  <select name="inputItem_${id}[]" class="form-select"  data-live-search="true">
  <option  value='delete' > حذف هذا العنصر </option>
  ${values}
  </select>
</div>


<div class="input-group mb-3 form-input">
      <label for="invoices_count" class="input-group-text">العدد</label>
      <input type="number" name="count_${id}[]" value=""  class="form-control" >
</div>


<div class="input-group mb-3 form-input">
      <label for="invoices_price" class="input-group-text">السعر</label>
      <input type="number" name="price_${id}[]"  value=""  class="form-control" >
</div>

<div class="input-group mb-3 form-input">
<label for="invoices_descound" class="input-group-text">نسبةالخصم</label>
<input type="number" name="descound_${id}[]"  value=""  class="form-control" >
</div>

<div class="input-group mb-3 form-input">
      <label for="TotalBeforeDescound" class="input-group-text">السعر قبل الخصم</label>
      <input type="text" readonly  name="EditeTotalBeforeDescound_${id}[]"  value="" class="form-control" placeholder="" aria-label="">
</div>

<div class="input-group mb-3 form-input">
<label for="TotalAfterDescound" class="input-group-text">السعر بعد الخصم</label>
<input type="text" readonly  name="EditeTotalAfterDescound_${id}[]"  value="" class="form-control" placeholder="" aria-label="">
</div>
`);
}

async function submitEditeInvoice(id ){
  // Collect Data
  let c = Number($("#count_"+id).val()).toFixed(2)
  let p = Number($("#price_"+id).val()).toFixed(2)
  let Descound = Number($("#descound_"+id).val()).toFixed(2)   / 100

  let TotalBeforeDescound = Number(c*p).toFixed(2)
  let TotalAfterDescound = ( (c*p)  - (c*p*Descound) ).toFixed(2)
  if(TotalAfterDescound == 0)  TotalAfterDescound = (c*p).toFixed(2)


let col = await calculateEditeTotal(id)
if(col == false) return;
console.log(col)
  var data = {
      _id                       : id,
      RegistrationNumber        : $("#RegistrationNumber_"+id).val(),
      date                      : $("#date_"+id).val(),
      ExplainTheLimitation      : $("#ExplainTheLimitation_"+id).val(),
      DebtorAccount             : $("#DebtorAccount_"+id).val(),
      CreditorAccount           : $("#CreditorAccount_"+id).val(),
      items                     :  col,
  }
// return ;
 // Validation
 if(data.ExplainTheLimitation.trim().length == 0)return  $('.ExplainTheLimitation_error_'+id).append(`<div style='color:red;'> رجاء تأكد من أدخال شرح القيد بشكل سليم!</div>`);
 if(data.DebtorAccount ==data.CreditorAccount )return $('.CreditorAccount_error_'+id).append(`<div style='color:red;'> رجاء اختيار حساب مدين و دائن مختلفين!</div>`);
//  if((data.count <0) || (data.price<0) || (data.Total<0) || (data.descound <0)) return $('.Count_Price_error_'+id).append(`<div style='color:red;'>رجاء تأكد ان العدد و السعر و نسبة الخصم قيم ليست سالبة !</div>`);
 $('.CreditorAccount_error_'+id +' div').remove()
 $('.Count_Price_error_'+id +' div').remove()
 $('.ExplainTheLimitation_error_'+id +' div').remove()

// Send Api Request
 axios({
  method:'post',
  url   :'/accounting/dailyAgenda/EditeInvoice',
  data  : data
}).then(
  res=>{

  if(res.data.status==true){
    console.log(res.data.invoice.items.length)
          // replace row
          let date = new Date(res.data.invoice.date).toISOString().slice(0,10)
          $("#invoiceDate_"+id).replaceWith(` <td id="invoiceDate_${id}"> ${date}  </td>`)
          $("#itemsLength_"+id).replaceWith(`<td id="itemsLength_${id}"> ${res.data.invoice.items.length}  </td>`)
          $("#invoiceDebtorAccount_"+id).replaceWith(` <td id="invoiceDebtorAccount_${id}"> ${res.data.invoice.DebtorAccount.name}  </td>` )
          $("#invoiceCreditorAccount_"+id).replaceWith(` <td id="invoiceCreditorAccount_${id}"> ${res.data.invoice.CreditorAccount.name}  </td>` )

          // fire success mssage
              Toast.fire({
                icon: 'success',
                title: res.data.msg
              })

          $("#CloseEditeModal_"+id).click()

  }else if(res.data.msg == 'notAllow'){
    return window.location = "/";
  }else{
    Toast.fire({
      icon: 'error',
      title: res.data.msg
    })
  }
  })
  
}

function submitDeleteInvoice(id){

  Swal.fire({
    title: 'هل أنت متأكد من حذف هذة الفاتورة',
    text: "لن تتمكن من أسترجاع هذة الفاتورة بعد ذلك !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'نعم قم بالحذف!'
  }).then((result) => {
    if (result.isConfirmed) {
let data = {
  id:id
}
      axios({
        method:'post',
        data  : data,
        url   : '/accounting/dailyAgenda/DeleteInvoice'
      }).then(
        res=>{
          if(res.data.status==true){

                $(".CloseModal_"+id).click()
                $("#row_inovice_"+id).remove()
          
                Swal.fire(
                  'تم الحذف',
                   res.data.msg,
                  'success'
                )

          }else if(res.data.msg == 'notAllow'){
            return window.location = '/';
          }else{
            Swal.fire(
              'عذرا',
              res.data.msg,
              'error'
            )
          }
        }
      )



    }
  })
}
