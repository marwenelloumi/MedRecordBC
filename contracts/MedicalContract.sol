// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma abicoder v2;

contract MedicalContract 
{

struct patient 
{
    string nom;
    uint age;
    address[] AccesMedecinListe;
    uint[] diagnostic;
    string dossier;
    string[] rapport;
    string chainediag;
}

struct medecin 
{
    string nom;
    uint age;
    address[] AccesPatientListe;
}

uint ensembleCredit;

    address[] public patientListe;
    address[] public medecinListe;

    //Mapping is a reference type as arrays and structs.
    // Following is the syntax to declare a mapping type.

    mapping(address => patient) patientInfo;
    mapping(address => medecin) medecinInfo;
    mapping (address => address) listeVide;


    function add_user(string memory _nom, uint _age,uint _type, string memory _hash) public returns(string memory){ 
        address addr = msg.sender;
        if(_type == 0)
        {
            patient memory p;
            p.nom = _nom;
            p.age = _age;
            p.dossier = _hash;
            patientInfo[msg.sender] = p;
            patientListe.push(addr);
            return _nom;
        }
        else if (_type == 1)
        {
         medecinInfo[addr].nom = _nom;
         medecinInfo[addr].age = _age ;
         medecinListe.push(addr);
          return _nom;
        }
        else{
            revert();
        }
    }

    function get_patient(address addr) view public returns(string memory , uint, uint[] memory , address, string memory,string[] memory )
    {
        return (patientInfo[addr].nom, patientInfo[addr].age, patientInfo[addr].diagnostic, listeVide[addr], patientInfo[addr].dossier,patientInfo[addr].rapport);
    }

    function get_medecin(address addr) view public returns (string memory , uint){
        return (medecinInfo[addr].nom, medecinInfo[addr].age);
    }

     function get_patient_liste() public view returns(address[] memory ){
        return patientListe;
    }

    function get_medecin_liste() public view returns(address[] memory ){
        return medecinListe;
    }
     function get_patient_medecin_NOM(address patientaddr, address medecinaddr) view public returns (string memory , string memory ){
        return (patientInfo[patientaddr].nom,medecinInfo[medecinaddr].nom);
    }

    
    function donner_Acces(address addr) payable public {
        require(msg.value == 2 ether);

        ensembleCredit += 2;
        
        medecinInfo[addr].AccesPatientListe.push(msg.sender);
        patientInfo[msg.sender].AccesMedecinListe.push(addr);
    }

    //Appeler par le medecin
    function insurance_claim(address paddr, uint _diagnostic, string memory  _hash,string memory _hashRapport) payable public {
    
        bool patienttrouve = false;
        for(uint i = 0;i<medecinInfo[msg.sender].AccesPatientListe.length;i++){
            if(medecinInfo[msg.sender].AccesPatientListe[i]==paddr){
                //a voir
                payable(msg.sender).transfer(2 ether);
                ensembleCredit -= 2;
                patienttrouve = true;
                
            }
            
        }
        if(patienttrouve==true){
            set_hash(paddr, _hash,_hashRapport);
            delete_patient(paddr, msg.sender);
        
        }else {
            revert();
        }

        bool DiagnosticFound = false;
        for(uint j = 0; j < patientInfo[paddr].diagnostic.length;j++){
            if(patientInfo[paddr].diagnostic[j] == _diagnostic)
            DiagnosticFound = true;
        }
    }


    function delete_element_array(address[] storage Array, address addr) internal returns(uint)
    {
        bool check = false;
        uint del_index = 0;
        for(uint i = 0; i<Array.length; i++){
            if(Array[i] == addr){
                check = true;
                del_index = i;
            }
        }
        if(!check) revert();
        else{
            if(Array.length == 1){
                delete Array[del_index];
            }
            else {
                Array[del_index] = Array[Array.length - 1];
                delete Array[Array.length - 1];

            }
            //a voir
            Array.pop();
        }
    }

    function delete_patient(address paddr, address maddr) public {
        delete_element_array(medecinInfo[maddr].AccesPatientListe, paddr);
        delete_element_array(patientInfo[paddr].AccesMedecinListe, maddr);
    }

    function get_AccesMedecinListe(address addr) public view returns (address[] memory )
    { 
        address[] storage medecinaddr = patientInfo[addr].AccesMedecinListe;
        return medecinaddr;
    }

    function get_AccesPatientListe(address addr) public view returns (address[] memory )
    {
        return medecinInfo[addr].AccesPatientListe;
    }

    //appeler par Patient
    function retirer_Acces(address maddr) public payable{
        delete_patient(msg.sender,maddr);
        payable(msg.sender).transfer(2 ether);
        ensembleCredit -= 2;
    }

   

    function get_hash(address paddr) public view returns(string memory ){
        return patientInfo[paddr].dossier;
    }

    function get_Rapporthash(address paddr) public view returns(string[] memory ){
        return patientInfo[paddr].rapport;
    }

    function set_hash(address paddr, string memory _hash,string memory _hashRapport) internal {
        patientInfo[paddr].dossier = _hash;
        patientInfo[paddr].rapport.push(_hashRapport);
    }


    
}