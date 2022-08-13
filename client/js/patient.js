var url_string = window.location.href;
var url = new URL(url_string);
var key ;


toggleRecordsButton = 0;
var recordHash ;

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
    console.log("Getting Patient Data");
    contractInstance.get_patient.call(key, {gas: 1000000}, function(error, result){
        console.log("Patient Data Result:"+result);
        if(!error){
            console.log("res2:",result);
            a = result[0]; 
            b = result[1];
            maladies = result[2];
            insurerAddress = result[3];
            recordHash = result[4];
            console.log("hash",recordHash)
            $("#name").html(a);
            $("#age").html(b.c[0]);
            $("#recordsHash").html(recordHash);
            fetchRapport();
        }
        else
            console.error(error);
    });

    
    
 
});

function fetchRapport() {
    $.get("http://localhost:8080/ipfs/"+recordHash, function(data){
            //data.toString();
            console.log(data['Name'],data['Public Key']);
            for(var i = 0; i < data['Dossier'].length; i++)
            {
                var obj = data['Dossier'][i];
                console.log("exple",obj)
                console.log("exple",obj.medecin)
                var table = document.getElementById("viewRapport");
                var str = "http://localhost:8080/ipfs/"+obj.hashFile;
                
                var row = table.insertRow(i + 1);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);
                        var cell6 = row.insertCell(5);
                        cell1.innerHTML = obj.diagnostic1;
                        cell2.innerHTML = obj.commentaire;
                        cell5.innerHTML = obj.medecin;
                        cell6.innerHTML = obj.date;
                        cell4.innerHTML = obj.docType;
                        cell3.innerHTML = `<input class="btn btn-success" onclick="window.open('${str}','_blank')"id="viewRecordsButton" type="button" value="${obj.fileName}"></input>`;
            }
        }
        )

}


