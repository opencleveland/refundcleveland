function lookup_address() {

    // let address = "1717 E 9th St Cleveland, OH 44114";
    let address = document.getElementById("id_address").value

    const csrftoken = Cookies.get('csrftoken');

    theUrl = '/lookup_address';

    const request = new Request(
      theUrl,
      { headers: {'X-CSRFToken': csrftoken},
        method: 'POST',
        body: '{"address" : "' + address + '"}'
      }
    );
    fetch(request, {
      mode: 'same-origin'  // Do not send CSRF token to another domain.
    }).then(function(response) {
      return response.json()
    }).then(function(data) {
      document.getElementById("id_ward").value = data.ward;
    });

}
