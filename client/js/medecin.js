var ipfs = window.IpfsApi('localhost', '5001')
var oldRecords;
const Buffer = window.IpfsApi().Buffer;
var fileBuffer;
var fileName;
var rapportHash;

var ailmentsDict = {};
ailmentsDict[0] = "Grippe";
ailmentsDict[1] = "Infection virale";
ailmentsDict[2] = "Cancer";
ailmentsDict[3] = "Tumeur";
ailmentsDict[4] = "Covid-19";
ailmentsDict[5] = "Trouble cardiaque";
ailmentsDict[6] = "Autre";

var docsDict = {};
docsDict[0] = "Rapport consulatation";
docsDict[1] ="Ordonnance";
docsDict[2] ="Demande d'analyse";
docsDict[3] ="Autres";
var url_string = window.location.href;
var url = new URL(url_string);
var key;
var docName = "";

toggleRecordsButton = 0;

$(window).load(function () {
    connect();
    $(".alert-danger").hide();

    key = web3.currentProvider.selectedAddress;
    key = key.toLocaleLowerCase();

    var a = 0;
    var b = 0;
    contractInstance.get_medecin.call(key, { gas: 1000000 }, function (error, result) {
        if (!error) {
            a = result[0];
            b = result[1];
            docName = a;
            $("#name").html(a);
            $("#age").html(b.c[0]);
        }

        else
            console.error(error);
    });


    var patientAddressList = 0;

    contractInstance.get_AccesPatientListe(key, { gas: 1000000 }, function (error, result) {
        if (!error) {
            patientAddressList = result;
            console.log("liste", result);

            patientAddressList.forEach(function (patientAddress, index) {
                contractInstance.get_patient.call(patientAddress, { gas: 1000000 }, function (error, result) {
                    var table = document.getElementById("viewPatient");
                    if (!error) {
                        [a, b] = result;
                        console.log(a);

                        var row = table.insertRow(index + 1);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        cell2.className = "publicKeyPatient";
                        cell1.innerHTML = a;
                        cell2.innerHTML = patientAddress;
                        cell3.innerHTML = '<input class="btn btn-success" onclick="showRecords(this)" id="viewRecordsButton" type="button" value="Afficher"></input>';


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

function showRecords(element) {

    var table = document.getElementById("viewPatient");
    var index = element.parentNode.parentNode.rowIndex;
    var patientAddress = table.rows[index].cells[1].innerHTML;

    if (toggleRecordsButton % 2 == 0) {

        var patientRecord = ""

        contractInstance.get_hash(patientAddress, { gas: 1000000 }, function (error, result) {
            if (!error) {

                $.get("http://localhost:8080/ipfs/" + result, function (data) {
                    patientRecord = data;
                    oldRecords = data;
                    console.log("nom", data['Name'])
                    content = `<div class="tab-content">
                    <div id="view${patientAddress}">
                            <div class="row">
                                <div class="col-sm-12"> 
                                <h4 style="color:blue">Historique du patient</h4><hr>
                                <table id="patientsheet" class="table table-hover">
                                <tr>
                                    <th>Diagnostic</th>
                                    <th>Détails</th>
                                    <th>Fichier</th>
                                    <th>Type</th>
                                    <th>Déposé par</th>
                                    <th>Date</th>
                                </tr>
                            
                            </table>
                                </div>
                            </div>
                            <h4  style="color:blue">Mettre à jour dossier </h4><hr>
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="row">
                                        <div class="form-group col-sm-10">
                                            <div class="row">
                                                <div class="col-sm-2"><label for="ailmentsList" class="control-label">Diagnosic:</label></div>
                                                <div class="col-sm-10">
                                                    <select class="form-control" id="ailmentsList${patientAddress}" style="width:inherit;" required>
                                                        <option selected disabled>-- Sélectionner --</option>
                                                        <option value = "0">Grippe</option>
                                                        <option value = "1">Infection virale</option>
                                                        <option value = "2">Cancer</option>
                                                        <option value = "3">Tumeur</option>
                                                        <option value = "4">Covid-19</option>
                                                        <option value = "5">Trouble cardiaque</option>
                                                        <option value = "6">Autres</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="form-group col-sm-10">
                                            <div class="row">
                                                <div class="col-sm-2"><label for="ailmentsList" class="control-label">Autres diagnotiques:</label></div>
                                                <div class="col-sm-10">
                                                    <input type="text" class="form-control" id="diagnostic" placeholder="veuillez entrer la maladie" name = "diagnostic" style="width: inherit" required autofocus>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="form-group col-sm-10">
                                            <div class="row">
                                                <div class="col-sm-2">
                                                    <label class="control-label" for="details">Details:</label>
                                                </div>
                                                <div class="col-sm-10">
                                                    <textarea class="form-control" rows="5" id="details" placeholder="Saisir les détails" name = "Details" style="width: inherit" required autofocus></textarea>
                                                </div>
                                            </div>  
                                         </div>
                                            <div class="form-group col-sm-10">
                                                <div class="row">
                                                    <div class="col-sm-2"><label for="docsList" class="control-label">Type:</label>
                                                    </div>
                                                    <div class="col-sm-10">
                                                        <select class="form-control" id="docsList${patientAddress}" style="width:inherit;" required>
                                                            <option value = "0">Rapport consulatation </option>
                                                            <option value = "1">Ordonnance</option>
                                                            <option value = "2">Demande d'analyse</option>
                                                            <option value = "3">Autres</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                       
                                            <div class="form-group col-sm-10">
                                                <div class="row">
                                                    <div class="col-sm-2">
                                                            <label class="control-label" for="rapport">Document:</label>
                                                        </div>
                                                        <div class="col-sm-10">
                                                        <input type='file' onChange="captureFile(event)" class="form-control" rows="6" id="rapport"  name = "rapport" style="width: inherit" required autofocus></input>
                                                        </div>
                                                </div> 
                                            </div>
                                        <div class="form-group col-sm-2">
                                            <button class="btn btn-primary" onclick = "submitDiagnosis(this,`+ index + `)">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>     
                        </div>
                    </div>`

                    var row1 = table.insertRow(index + 1);
                    var cell1 = row1.insertCell(0);
                    cell1.colSpan = 3;

                    cell1.innerHTML = content;
                    
                    for (var i = 0; i < data['Dossier'].length; i++) {
                        var obj = data['Dossier'][i];
                        console.log("exple", obj)
                        console.log("exple", obj.medecin)
                        var table1 = document.getElementById("patientsheet");
                        var str = "http://localhost:8080/ipfs/" + obj.hashFile;

                        var row = table1.insertRow(i + 1);
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
                })


            } else {
                console.log(error);
            }
        })

        toggleRecordsButton += 1
        element.value = "Cacher";
        element.className = "btn btn-danger"

    } else {
        row = table.rows[index + 1];
        $(row).hide();
        toggleRecordsButton -= 1;
        element.value = "Afficher";
        element.className = "btn btn-success"
    }

}

function getDateTime() {
    function AddZero(num) {
        return (num >= 0 && num < 10) ? "0" + num : num + "";
    }
    var now = new Date();
    var strDateTime = [[AddZero(now.getDate()),
    AddZero(now.getMonth() + 1),
    now.getFullYear()].join("/"),
    [AddZero(now.getHours()),
    AddZero(now.getMinutes())].join(":"),
    now.getHours() >= 12 ? "PM" : "AM"].join(" ");
    return strDateTime;
}

function submitDiagnosis(element, index) {

    var table = document.getElementById("viewPatient");
    var patientAddress = table.rows[index].cells[1].innerHTML;

    console.log(patientAddress);
    var diagnosis = $("#ailmentsList" + patientAddress).val();
    diagnosis = parseInt(diagnosis);

    var docs = $("#docsList" + patientAddress).val();
    docs = parseInt(docs);

    console.log("type",docs)
    console.log("diag val", diagnosis);
    var diagnosed = ailmentsDict[diagnosis];
    var docType = docsDict[docs];
    
    var comments = document.getElementById("details").value;
    var
    var diagnostic = document.getElementById("diagnostic").value;


    

    var newRecords = `{
    \"medecin\" : \"${docName}\",
    \"date\" : \"${getDateTime()}\",
    \"diagnostic1\" : \"${diagnosed}\",
    \"commentaire\" : \"${comments}\",
    \"diagnostic\" : \"${diagnostic}\",
    \"docType\" : \"${docType}\",
    \"hashFile\" : \"${rapportHash}\",
    \"fileName\" : \"${fileName}\"
    }`
    console.log(newRecords);
    console.log(typeof newRecords);
    var nr = JSON.parse(newRecords);
    oldRecords['Dossier'].push(nr);

    var updatedRecords = JSON.stringify(oldRecords);

    if (!isNaN(diagnosis)) {

        var buffer = Buffer(updatedRecords);

        ipfs.files.add(buffer, (error, result) => {
            if (error) {
                console.log(error)
            } else {
                ipfshash = result[0].hash;
                contractInstance.insurance_claim(patientAddress, diagnosis, ipfshash, rapportHash, { gas: 1000000 }, function (error, result) {
                    if (!error) {
                        alert("Your diagnosis has been submitted.");
                        // delete content row
                        table.deleteRow(index + 1);

                        // delete main row of corresponding content row
                        table.deleteRow(index);
                    } else {
                        // $(".alert-danger").show();
                        console.log(error);
                    }
                });
            }
        });
    }
    else {
        alert("Select a diagnosis");
    }



}

captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader();

    reader.fileName = file.name;
    console.log("reader", reader);
    reader.readAsArrayBuffer(file)


    reader.onloadend = function (readerEvt) {
        //this.setState({ buffer: Buffer(reader.result) })
        fileBuffer = Buffer(reader.result)

        console.log("file buffer", fileBuffer);
        fileName = readerEvt.target.fileName;
        console.log("name", fileName);

        ipfs.files.add(fileBuffer, (error2, result2) => {
            if (error2) {
                console.log(error2)
            }
            else {
                rapportHash = result2[0].hash;
                console.log("rapp hash", rapportHash);
            }
        })



    }




}