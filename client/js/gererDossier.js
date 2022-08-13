var url_string = window.location.href;
var url = new URL(url_string);
var key ;


toggleRecordsButton = 0;
var recordHash = "";

$(window).load(function() {
    connect();
    $("#records").hide();
    $(".alert-info").hide();
    $(".alert-danger").hide();
    key = web3.currentProvider.selectedAddress;
    key = key.toLocaleLowerCase();

    var a = "";
    var b = 0;
    var maladies = [];
   
    $("#buyInsurance").hide();
    $("#insuranceInfo").hide();
    
    // print patient details and insurer details (if exists). If insurer does not exist show the buy insurance panel
    
    
    // print out the doctors to share emr
    var listeMedecins= 0;
    console.log("Getting Doctor List");
   
    contractInstance.get_medecin_liste({gas: 1000000},function(error, result){

        if(!error) {

            listeMedecins= result;
            console.log("Getting Doctor List",result);
            for(var i = 0; i < listeMedecins.length; i++) {
                contractInstance.get_medecin.call(listeMedecins[i], {gas: 1000000},function(error, result){

                    var list = document.getElementById("permitDoctorList");

                    if(!error) {
                        [a, b] = result; 
                        var option = document.createElement("option");
                        option.text = a;
                        list.add(option);
                        // console.log(a);
                    }
                    else
                        console.error(error);
                })
            }
        } 
        else
            console.error(error);
    });

    // print out the doctors who have access
    var listeAddMed = 0;
    contractInstance.get_AccesMedecinListe(key, {gas: 1000000}, function(error, result){
        if(!error){
            listeAddMed = result;
            // console.log(result);
            
           
            listeAddMed.forEach(function(doctorAddress, index){
                contractInstance.get_medecin.call(doctorAddress, {gas: 1000000}, function(error, result){
                    var table = document.getElementById("accessDoc");
                    if(!error) {
                        [a,b] = result;
                        console.log(a);
                        var row = table.insertRow(index+1);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        cell2.className = "publicKeyDoctor";
                        cell1.innerHTML = a;
                        cell2.innerHTML = doctorAddress;
                        cell3.innerHTML = '<button onclick="revoquerAcces(this)" class="btn btn-danger">Revoquer acces</button>';
                        console.log("res:",result);
                    }
                    else
                        console.error(error);
                })
            })
        }
        else 
            console.error(error);
    });

});


function donnerAcces() {

    var list = document.getElementById("permitDoctorList");
    index = list.selectedIndex;

    var listeMedecins= 0;

    contractInstance.get_medecin_liste({gas: 1000000}, function(error, result){

        if(!error) {
            // console.log(index);

            listeMedecins= result;
            medecinAajoute = listeMedecins[index-1];
            contractInstance.donner_Acces.sendTransaction(medecinAajoute, {from: key, gas: 1000000, value: web3.toWei(2, 'ether')}, function(error){
                if (!error) {
                    var table = document.getElementById("accessDoc");
                    noRows = table.rows.length;
                    var row = table.insertRow(noRows);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);

                    cell2.className = "publicKeyDoctor";
                    cell1.innerHTML = $("#permitDoctorList").val();
                    cell2.innerHTML = medecinAajoute;
                    cell3.innerHTML = '<button onclick="revoquerAcces(this)" class="btn btn-danger">Revoquer accés</button>';

                } else {
                    $(".alert-info").show();
                    console.log(error);
                }
                                        
            })

        } else
            console.log(error);
    })
}

function revoquerAcces(element) {

    rowNo = element.parentNode.parentNode.rowIndex;
    Row = element.parentNode.parentNode;
    var Cells = Row.getElementsByTagName("td");
    var docKey = Row.cells[1].firstChild.nodeValue;
    contractInstance.retirer_Acces(docKey, {gas: 1000000}, function(error){
        if (!error) {
            document.getElementById("accessDoc").deleteRow(rowNo);
        } else {
            $(".alert-danger").show();
            console.log(error);
        }
                                
    });
}
