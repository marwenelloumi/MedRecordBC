connect();    
function login(){
    $(".alert-warning").hide();

    publicKey= web3.currentProvider.selectedAddress;
    console.log(publicKey);
    contractInstance.get_patient_liste(function(error, result){
        if(!error){
            var PatientList = result;
            console.log(PatientList.length);
            for(var i = 0; i < PatientList.length; i++) {
                if (publicKey.toLowerCase() == PatientList[i]) {
                    location.href = "./patient.html?key=" + publicKey;
                }
            }
            
        } else {
            console.log(error);
            console.log("Invalid User!");
            $(".alert-warning").show();
        }
    });

    contractInstance.get_medecin_liste(function(error, result){
        if(!error){
            var DoctorList = result;
            for(var i = 0; i < DoctorList.length; i++) {
                if (publicKey.toLowerCase() == DoctorList[i]) {
                    location.href = "./medecin.html?key=" + publicKey;
                }
            }
            
        } else {
            console.log(error);
            $(".alert-warning").show();
        }
    }); 
    
    console.log("Invalid User!");
    $(".alert-warning").show();


    
}
