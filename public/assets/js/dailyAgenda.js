  $(document).ready(function(){
    $("#myInput").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#myTable tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });

//$("#DebtorAccountInput").on("keyup", function() {
//var value = $(this).val().toLowerCase();
//$("select optgroup option").filter(function() {
//$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
//});
//  }); 
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
  $("#spam-item").append(`
  <div class=" ">
    <select id="inputItem" class="form-select div_column" name="selectItem[]">
      <option value="">اختيار صنف</option>
      <%for(i of items){%>
        <option value="<%=i._id%>"><%=i.name%></option>
        <%}%>
    </select>
  </div>`)
  $("#spam-count").append(`<input type="number" min="1" class="form-control div_column"  placeholder="" name="count[]" aria-label="">`)
  $("#spam-price").append(`<input type="text" class="form-control div_column" placeholder=""  name="price[]" aria-label="" >`)
  $("#spam-Descound").append(`<input type="text" class="form-control div_column" placeholder="" name="descound[]" aria-label="" >`)
  $("#spam-TotalBeforeDescound").append(`<input type="text" readonly  name="TotalBeforeDescound[]" class="form-control div_column" placeholder="" aria-label="">`)
  $("#spam-TotalAfterDescound").append(`<input type="text" readonly  name="TotalAfterDescound[]" class="form-control div_column" placeholder="" aria-label="">`)
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
   'count[]':{
     required:true,
     notMinus:true,
   },
   'price[]':{
    required:true,
    notMinus:true,
  },
  'selectItem[]':{
    required:true
  },
  'descound[]':{
    required :true,
    notMinus:true
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
    count:{
      notMinus:'رجاء ادخال قيمة موجبة',
      //numbersOnly:'رجاء ادخال ارقام فقط'
    },
    price:{
      notMinus:'رجاء ادخال قيمة موجبة',
      //numbersOnly:'رجاء ادخال ارقام فقط'
    },
    CreditorAccount:{
      diffrentAccount: 'رجاء اختيار حساب مدين و دائن مختلفين '
    },
    'descound[]':{
      notMinus:'رجاء ادخال قيمة موجبة',
    }
  }
})


$("#invoice-form").on('submit',(e)=>{
  e.preventDefault()
  if(validator.numberOfInvalids() !=0)return;
  let   lene = $('tr').length;

  let c = Number($("#count").val()).toFixed(2)
  let p = Number($("#price").val()).toFixed(2)
  let Descound = Number($("#Descound").val()).toFixed(2)   / 100

 

  let TotalBeforeDescound = Number(c*p).toFixed(2)
  let TotalAfterDescound = ( (c*p)  - (c*p*Descound) ).toFixed(2)
  if(TotalAfterDescound == 0)  TotalAfterDescound = (c*p).toFixed(2)

  var data = {
    invoiceNumber          :$("#invoiceNumber").val(),
    item                   : $("#inputItem").val(),
    date                   : $("#date").val(),
    ExplainTheLimitation   : $("#ExplainTheLimitation").val(),
    count                  : c , // $("#count").val(),
    price                  : p,  //$("#price").val(),
    Descound               :Descound,
    TotalBeforeDescound    : TotalBeforeDescound,
    TotalAfterDescound     : TotalAfterDescound,
    DebtorAccount          : $("#DebtorAccount").val(),
    CreditorAccount        : $("#CreditorAccount").val(),
  }
var selectItem = document.getElementsByName('selectItem[]'); 
var count = document.getElementsByName('count[]'); 
var price = document.getElementsByName('price[]'); 
var descound = document.getElementsByName('descound[]'); 
var dataArray = {}

for (var i = 0; i < count.length; i++) { 
    var a = count[i].value;
    if(a =='' || a <0) return $('#Count_Price_error').append(`<div style='color:red;'>رجاء تأكد ان العدد و السعر و نسبة الخصم قيم صحيحة !</div>`);
    console.log(a)

} 

// for (var i = 0; i < price.length; i++) { 
//     var a = count[i].value;
//     if(a =='' || a <0) return $('#Count_Price_error').append(`<div style='color:red;'>رجاء تأكد ان العدد و السعر و نسبة الخصم قيم صحيحة !</div>`);
//     console.log(a)  
// } 

// dataArray.selectItem = document.getElementsByName('selectItem[]'); 
// dataArray.count = document.getElementsByName('count[]'); 
// dataArray.price = document.getElementsByName('price[]'); 
// dataArray.descound = document.getElementsByName('descound[]'); 

return 
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

     $("#date").val("");
     $("#ExplainTheLimitation").val('');
     $("#count").val('');
     $("#price").val('');
     $("#Descound").val('');
     $("#TotalBeforeDescound").val('');
     $("#TotalAfterDescound").val('');
    let invoice = res.data.invoice;
    $(".alert-notInvoices").remove();
   
    // append new row
     $("#myTable").prepend(`

     <tr id="row_inovice_${invoice._id}">
      <th scope="row">  ${ $( "#myTable  tr").length +1}  </th>
      <td class="RegistrationNumber"> ${invoice.RegistrationNumber} </td>
      <td class="invoiceNumber"> ${invoice.invoiceNumber} </td>
      
      <td id="invoiceDate_${invoice._id}">                  ${ new Date(invoice.date).toISOString().slice(0,10)} </td>
    <td id="invoiceItem_${invoice._id}">                    ${invoice.item.name} </td>
      <td id="invoiceExplainTheLimitation_${invoice._id}">  ${invoice.ExplainTheLimitation}</td>
      <td id="invoiceCount_${invoice._id}">                 ${invoice.count}  </td>
      <td id="invoicePrice_${invoice._id}">                 ${invoice.price} </td>

     <td id="descound_${invoice._id}">                             ${invoice.descound * 100 }  </td>
     <td id="TotalBeforeDescound_${invoice._id}">                  ${invoice.TotalBeforeDescound}  </td>
     <td id="TotalAfterDescound_${invoice._id}">                  ${invoice.TotalAfterDescound}  </td>

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
                <label for="invoices_item" class="input-group-text">الصنف</label>
                  
                <select id="inputItem_${invoice._id}" class="form-select" name="selectItem">
                  <option  selected value='${invoice.item._id}' > ${invoice.item.name} </option>
                  <%for(x of items){%>
                    <option value="<%=x._id%>"><%=x.name%></option>
                    <%}%>
                </select>
          </div>
 

          <div class="input-group mb-3 form-input">
            <label for="invoices_ExplainTheLimitation" class="input-group-text">شرح القيد</label>
            <input type="text" id="ExplainTheLimitation_${invoice._id}" value="${invoice.ExplainTheLimitation}"  class="form-control" name="invoices_ExplainTheLimitation">
          </div>
          <span class="ExplainTheLimitation_error_${invoice._id}"></span>


          
          <div class="input-group mb-3 form-input">             
 
            <label for="oldDebtorAccount_${invoice._id}" class="input-group-text">حساب المدين</label>
              
            <select class="form-select" id="DebtorAccount_${invoice._id}" name="DebtorAccount_${invoice._id}">
              <option  selected value='${invoice.DebtorAccount._id}' > ${invoice.DebtorAccount.name} </option>

              <optgroup label="الدليل المحاسبي" data-max-options="1">
                <%for(w of guides){%>
                   <option value="<%=w._id%>"><%=w.name%></option>
                <%}%>
              </optgroup>

              <optgroup label="الموردون" data-max-options="1">
                <%for(e of suppliers){%>
                   <option value="<%=e._id%>"><%=e.name%></option>
                <%}%>
              </optgroup>

                <optgroup label="العملاء" data-max-options="1">
                <%for(r of clients){%>
                   <option value="<%=r._id%>"><%=r.name%></option>
                <%}%>
              </optgroup>
              
                <optgroup label="الموظفين" data-max-options="1">
                <%for(t of employees){%>
                    <option value="<%=t._id%>"><%=t.name%></option>
                <%}%>
              </optgroup>

                <optgroup label="التكلفة" data-max-options="1">
                <%for(y of costs){%>
                    <option value="<%=y._id%>"><%=y.name%></option>
                <%}%>
              </optgroup>
            </select>
            <label  class="DebtorAccount_error_${invoice._id}" for="DebtorAccount"></label>
          </div>


          <div class="input-group mb-3 form-input">             
 
            <label for="oldCreditorAccount_${invoice._id}" class="input-group-text">حساب دائن</label>
              
            <select class="form-select" id="CreditorAccount_${invoice._id}" name="CreditorAccount_${invoice._id}">
              <option  selected value='${invoice.CreditorAccount._id}' >  ${invoice.CreditorAccount.name} </option>
              <optgroup label="الدليل المحاسبي" data-max-options="1">
                <%for(w of guides){%>
                   <option value="<%=w._id%>"><%=w.name%></option>
                <%}%>
              </optgroup>

              <optgroup label="الموردون" data-max-options="1">
                <%for(e of suppliers){%>
                   <option value="<%=e._id%>"><%=e.name%></option>
                <%}%>
              </optgroup>

                <optgroup label="العملاء" data-max-options="1">
                <%for(r of clients){%>
                   <option value="<%=r._id%>"><%=r.name%></option>
                <%}%>
              </optgroup>
              
                <optgroup label="الموظفين" data-max-options="1">
                <%for(t of employees){%>
                    <option value="<%=t._id%>"><%=t.name%></option>
                <%}%>
              </optgroup>

                <optgroup label="التكلفة" data-max-options="1">
                <%for(y of costs){%>
                    <option value="<%=y._id%>"><%=y.name%></option>
                <%}%>
              </optgroup>
            </select>
          </div>
          <spam  class="CreditorAccount_error_${invoice._id}" ></spam>


          <div class="input-group mb-3 form-input">
                  <label for="invoices_count" class="input-group-text">العدد</label>
                  <input type="number" id="count_${invoice._id}" value="${invoice.count}"  class="form-control" name="invoices_count">
          </div>


          <div class="input-group mb-3 form-input">
                  <label for="invoices_price" class="input-group-text">السعر</label>
                  <input type="number" id="price_${invoice._id}"  value="${invoice.price}"  class="form-control" name="invoices_price">
          </div>

         <!--  -->
          <div class="input-group mb-3 form-input">
            <label for="invoices_descound" class="input-group-text">نسبةالخصم</label>
            <input type="number" id="descound_${invoice._id}"  value="${Number(invoice.descound * 100 )}"  class="form-control" name="invoices_descound">
          </div>

          <div class="input-group mb-3 form-input">
                  <label for="TotalBeforeDescound" class="input-group-text">السعر قبل الخصم</label>
                  <input type="text" readonly  id="EditeTotalBeforeDescound_${invoice._id}"  value="${invoice.TotalBeforeDescound}" class="form-control" placeholder="" aria-label="">
          </div>

          <div class="input-group mb-3 form-input">
            <label for="TotalAfterDescound" class="input-group-text">السعر بعد الخصم</label>
            <input type="text" readonly  id="EditeTotalAfterDescound_${invoice._id}"  value="${invoice.TotalAfterDescound}" class="form-control" placeholder="" aria-label="">
          </div>
          <!--  -->
          <button  class="badge badge-dark text-dark" type="button"   onclick="calculateEditeTotal(invoices_count.value ,invoices_price.value, invoices_descound.value ,'${invoice._id}' )">احسب الاجمالي الجديد</button>

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



$("#count").focusout((e)=>{
   let c =  $("#count").val();
   let p = $("#price").val();
   let Descound = Number($("#Descound").val()).toFixed(2)   / 100 //|| 1
  
  
   let TotalAfterDescound = ( (c*p)  - (c*p*Descound) ).toFixed(2)
  if(TotalAfterDescound == 0)  TotalAfterDescound = (c*p).toFixed(2)
 
    $("#TotalBeforeDescound").val( (c*p).toFixed(2) )
    $("#TotalAfterDescound").val(TotalAfterDescound)
 
})

$("#price").focusout((e)=>{
  let c = $("#count").val();
  let p = $("#price").val();
  let Descound = Number($("#Descound").val()).toFixed(2)   / 100 //|| 1
 

  let TotalAfterDescound = ( (c*p)  - (c*p*Descound) ).toFixed(2)
  if(TotalAfterDescound == 0)  TotalAfterDescound = (c*p).toFixed(2)

  $("#TotalBeforeDescound").val( (c*p).toFixed(2) )
  $("#TotalAfterDescound").val(TotalAfterDescound )

})

$("#Descound").focusout((e)=>{
  let c = $("#count").val();
  let p = $("#price").val();
  let Descound = Number($("#Descound").val()).toFixed(2)   / 100 //|| 1
  
  
  $("#TotalBeforeDescound").val( (c*p).toFixed(2) )
  $("#TotalAfterDescound").val(  ( (c*p)  - (c*p*Descound) ).toFixed(2) )

})


function calculateEditeTotal(c,p,d,id){
// c is 'count'
// p is 'price'
// d is 'descound'
// id is 'id of invoice'
//$("#"+id).val( (c*p).toFixed(2))

 console.log(c,p,d,id)
  let Descound = Number(d).toFixed(2)   / 100 
 
 
  let TotalAfterDescound = ( (c*p)  - (c*p*Descound) ).toFixed(2)
 if(TotalAfterDescound == 0)  TotalAfterDescound = (c*p).toFixed(2)

   $("#EditeTotalBeforeDescound_"+id).val( (c*p).toFixed(2) )
   $("#EditeTotalAfterDescound_"+id).val(TotalAfterDescound)
}

function submitEditeInvoice(id ){
  // Collect Data
  let c = Number($("#count_"+id).val()).toFixed(2)
  let p = Number($("#price_"+id).val()).toFixed(2)
  let Descound = Number($("#descound_"+id).val()).toFixed(2)   / 100

  let TotalBeforeDescound = Number(c*p).toFixed(2)
  let TotalAfterDescound = ( (c*p)  - (c*p*Descound) ).toFixed(2)
  if(TotalAfterDescound == 0)  TotalAfterDescound = (c*p).toFixed(2)




  var data = {
      _id                       : id,
      RegistrationNumber        : $("#RegistrationNumber_"+id).val(),
      date                      : $("#date_"+id).val(),
      item                      : $("#inputItem_"+id).val(),
      ExplainTheLimitation      : $("#ExplainTheLimitation_"+id).val(),
      DebtorAccount             : $("#DebtorAccount_"+id).val(),
      CreditorAccount           : $("#CreditorAccount_"+id).val(),
     count                      : c , 
     price                      : p ,
     descound                   : Descound,
     TotalBeforeDescound        : TotalBeforeDescound,
     TotalAfterDescound         : TotalAfterDescound,
  }

 // Validation
 if(data.ExplainTheLimitation.trim().length == 0)return  $('.ExplainTheLimitation_error_'+id).append(`<div style='color:red;'> رجاء تأكد من أدخال شرح القيد بشكل سليم!</div>`);
 if(data.DebtorAccount ==data.CreditorAccount )return $('.CreditorAccount_error_'+id).append(`<div style='color:red;'> رجاء اختيار حساب مدين و دائن مختلفين!</div>`);
 if((data.count <0) || (data.price<0) || (data.Total<0) || (data.descound <0)) return $('.Count_Price_error_'+id).append(`<div style='color:red;'>رجاء تأكد ان العدد و السعر و نسبة الخصم قيم ليست سالبة !</div>`);
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

          // replace row

          let date = new Date(res.data.invoice.date).toISOString().slice(0,10)

          $("#invoiceDate_"+id).replaceWith(` <td id="invoiceDate_${id}"> ${date}  </td>`)
          $("#invoiceItem_"+id).replaceWith(` <td id="invoiceItem_${id}"> ${res.data.invoice.item.name}  </td>` )
          $("#invoiceExplainTheLimitation_"+id).replaceWith(` <td id="invoiceExplainTheLimitation_${id}"> ${res.data.invoice.ExplainTheLimitation}  </td>` )

          $("#invoiceCount_"+id).replaceWith(` <td id="invoiceCount_${id}"> ${res.data.invoice.count}  </td>` )
          $("#invoicePrice_"+id).replaceWith(` <td id="invoicePrice_${id}"> ${res.data.invoice.price}  </td>` )
          $("#invoiceDescound_"+id).replaceWith(` <td id="invoiceDescound_${id}"> ${Number(res.data.invoice.descound * 100) }  </td>` )
          $("#invoiceTotalBeforeDescound_"+id).replaceWith(` <td id="invoiceTotalBeforeDescound_${id}"> ${res.data.invoice.TotalBeforeDescound}  </td>` )
          $("#invoiceTotalAfterDescound_"+id).replaceWith(` <td id="invoiceTotalAfterDescound_${id}"> ${res.data.invoice.TotalAfterDescound}  </td>` )
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
