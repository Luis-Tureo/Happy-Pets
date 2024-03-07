class Donation {
  constructor(name, email, phone, amount) {
    this.name       = name;
    this.email      = email;
    this.phone      = phone;
    this.amount     = amount;
  }
}

class Contact {
  constructor(name, email, message) {
    this.name       = name;
    this.email      = email;
    this.message    = message;

  }
}

function donate() {
  let name            = $("#name").val();
  let email           = $("#email").val();
  let phone           = $("#phone").val();
  let amount          = parseInt($("#amount").val());

  if (validate(amount, email, phone) === false) {
    return;
  } else {
    const newDonation = new Donation(name, email, phone, amount);

    // Crear una lista de donaciones existentes o cargarla si ya existe
    let donations = JSON.parse(localStorage.getItem('donations')) || [];
  
    // Agregar la nueva donación a la lista
    donations.push(newDonation);
  
    // Guardar la lista de donaciones en el localStorage
    localStorage.setItem('donations', JSON.stringify(donations));

    alert("¡Guardado Exitoso!");

    $("#errorAmount").html("");
    $("#errorEmail").html("");
    $("#errorPhone").html("");
  }
 
  $("#name").val("");
  $("#email").val("");
  $("#phone").val("");
  $("#amount").val("");
}

function contact() {
  let name            = $("#nameContact").val();
  let email           = $("#emailContact").val();
  let message         = $("#message").val();

  if (validate(null, email, null) === false) {
    return;
  } else {
    const newContact = new Contact(name, email, message);

     // Crear una lista de contactos existentes o cargarla si ya existe
    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    // Agregar el nuevo contacto a la lista
    contacts.push(newContact);

    // Guardar la lista de contactos en el localStorage
    localStorage.setItem('contacts', JSON.stringify(contacts));

    alert("¡Guardado Exitoso!");
    $("#errorEmail").html("");
  }

  $("#nameContact").val("");
  $("#emailContact").val("");
  $("#message").val("");
}

// Guardar Donaciones en Storage
$("#registerButton").click(donate);

// Guardar Contacto en Storage
$("#contactButton").click(contact);

// Buscar Contactos en el archivo tipo json list_contact
$("#findButton").click(function () {
  if ($('#findContact').val().length > 0) {
    findContact();
  }
});

// Buscar Donadores
$("#findButtonDonator").click(function () {
  if ($('#findDonator').val().length > 0) {
    findDonator();
  }
});

// Borrar Donaciones del Storage
$("#clearButton").click(function () {
  localStorage.removeItem('donations');
  location.reload();
});


function validate(amount, email, phone) {
  const regex_email     = /[\w-\.]{2,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;
  const regex_phone     = /^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$/; //Expresión regular para validar celulares chilenos

  let is_valid = true;

    if (isNaN(amount) || amount <= 0 || amount === NaN || amount === '' || amount === undefined) {
      is_valid = false;
      $("#errorAmount").css("color", "red").html("Introduzca un monto válido");
    }
  
  
  if (email) {
    if (!regex_email.test(email.trim())) {
      is_valid = false;
      $("#errorEmail").css("color", "red").html("Introduzca un correo válido");
    }
  }

  if (phone) {
    if (!regex_phone.test(phone.trim())) {
      is_valid = false;
      $("#errorPhone").css("color", "red").html("Introduzca un número telefónico válido");
    }
  }
  
  return is_valid;
}

function loadDonationsFromStorage() {

  const donationsJSON = localStorage.getItem('donations');
  let   number        = 0;

  if (donationsJSON) {

    const donations = JSON.parse(donationsJSON).map(donation => new Donation(donation.name, donation.email, donation.phone, donation.amount));
  

    if (donations && donations.length > 0) {

      donations.forEach(donation => {
        const donationRow = document.createElement('tr');
        donationRow.innerHTML = `
        <td class="contactTd">${number++}</td>
          <td class="contactTd">${donation.name}</td>
          <td class="contactTd">${donation.email}</td>
          <td class="contactTd">${donation.phone}</td>
          <td class="contactTd">$ ${donation.amount}</td>
        `;
        $("#donationList").append(donationRow);
       
      });

      const totalItem   = document.createElement('tr');
      const totalDonation = donations.reduce((total, donation) => total + donation.amount, 0);

      totalItem.innerHTML = `
      <td></td>
      <td></td>
      <td></td>
      <td class="contactTd">Total:</td>
      <td class="contactTd">$ ${totalDonation}</td>
      `;
      $("#donationList").append(totalItem);

    } 
  }
}

function findDonator() {
  const findContact = $('#findDonator').val().trim();
  const filteredRow = $('#donationList tbody tr').filter(function() {
    const rowContent = $(this).text();
    return rowContent.includes(findContact);
  });

  $('#donationList tbody tr').hide();
  filteredRow.show();

  const backRowButton = document.createElement('tr');
  backRowButton.innerHTML = `
    <th></th>
    <th></th>
    <th class="contactTd"><button type="button" id="backRowButtonDonator">Regresar</button></th>
    <th></th>
    <th></th>
  `;
  $("#donationList").append(backRowButton);

  $("#backRowButtonDonator").click(() => {
    $("#donationList tbody tr").show();
    backRowButton.remove();
    $('#findDonator').val("")
  });
  
}

function findContact() {
  const findContact = $('#findContact').val().trim();
  const filteredRow = $('#contactList tbody tr').filter(function() {
    const rowContent = $(this).text();
    return rowContent.includes(findContact);
  });

  $('#contactList tbody tr').hide();
  filteredRow.show();

  const backRowButton = document.createElement('tr');
  backRowButton.innerHTML = `
    <th></th>
    <th></th>
    <th class="contactTd"><button type="button" id="backRowButton">Regresar</button></th>
    <th></th>
    <th></th>
  `;
  $("#contactList").append(backRowButton);

  $("#backRowButton").click(() => {
    $("#contactList tbody tr").show();
    backRowButton.remove();
    $('#findContact').val("")
  });
}

const getListContact = async () => {
  
  try {
    const response = await fetch('./list_contact.json');

    if (!response.ok) {
      throw new Error('Error al realizar la petición');
    }
    const list_contact =  await response.json();

    let number = 0;
    for (const contact of list_contact) {
      const contactRow = document.createElement('tr');
      contactRow.innerHTML = `
        <td class="contactTd">${number++}</td>
        <td class="contactTd">${contact.nameContact}</td>
        <td class="contactTd">${contact.emailContact}</td>
        <td class="contactTd">${contact.message}</td>
      `;
      $("#contactList").append(contactRow);
    }
  } catch(err) {
    console.log(err)
  }
};

$(document).ready(function () {
  loadDonationsFromStorage();
  getListContact();
});








