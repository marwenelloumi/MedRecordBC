function addUser()
{
    var ipfs = window.IpfsApi('localhost', '5001')

    const Buffer = window.IpfsApi().Buffer;

    name = $("#name").val();
    age = $("#age").val();

    designation = $("#designation").val();
    designation = parseInt(designation);
    
    publicKey = web3.currentProvider.selectedAddress;
    publicKey = publicKey.toLowerCase();
    console.log("PK:"+publicKey);

    var validPublicKey = true;
    var validAgent = true;
    var PatientList = 0;
    var DoctorList = 0;
    var InsurerList = 0;

    contractInstance.get_patient_liste({gas: 1000000},function(error, result){
        if(!error)
            PatientList = result; 
        else
            console.error(error);
        });

    contractInstance.get_medecin_liste({gas: 1000000},function(error, result){
        if(!error)
            DoctorList = result;
        else
            console.error(error);
        });

    /*contractInstance.get_insurer_list({gas: 1000000},function(error, result){
        if(!error)
            InsurerList = result;
        else
            console.error(error);
        });*/

    if (validPublicKey == false) {
        $(".alert-warning").show();
    }
    else{
        for(j = 0; j < PatientList.length; j++) {
             if (publicKey == PatientList[j] ){
                 validAgent = false;
            }
        }
        for(j = 0; j < DoctorList.length; j++) {
             if (publicKey == DoctorList[j] ){
                 validAgent = false;
            }
        }
        for(j = 0; j < InsurerList.length; j++) {
             if (publicKey == InsurerList[j] ){
                 validAgent = false;
            }
        }
        console.log(validAgent);
        if (validAgent == true) {
            $(".alert-warning").hide()
            $(".alert-info").hide();   
            
            var ipfshash = "";

            if (designation == "0") {
                var reportTitle =    
                `{\"Name\" : \"${name}\",
\"Public Key\" : \"${publicKey}\",
\"Dossier\" : []               
}`;
                
                var buffer = Buffer(reportTitle);
                
                ipfs.files.add(buffer, (error, result) => {
                    if(error){
                        console.log(error);
                    }else{
                        console.log("result:"+result);
                        ipfshash = result[0].hash;
                        console.log("Ipfs hash:"+ipfshash);
                        contractInstance.add_user(name, age, designation, ipfshash, {gas: 1000000}, (err, res) => {
                            if(!err){
                                location.replace("./patient.html");
                             
                            }else{
                                console.log(err);
                            }
                            
                        });
                        contractInstance.get_patient_liste(function(error, result){
                            if(!error){
                                var PatientList = result;
                                console.log(PatientList);
                            }
                        });
                    }
                })
            }else{
                contractInstance.add_user(name, age, designation, ipfshash, {gas: 1000000}, (err, res) => {
                if (!err) {
                    if (designation == "1") {
                        location.replace("./medecin.html");
                    }
                    
                } else
                    console.log(err);
                });
            }              
        }
        else {
            $(".alert-info").show();
        } 

    }

    return false;
}
