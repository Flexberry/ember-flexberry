export default function() {

  this.urlPrefix = 'https://northwindodata.azurewebsites.net';
  this.namespace = 'odata';

  this.passthrough('https://northwindodata.azurewebsites.net/Token');

  this.get('/Employees', ({employee}, request) => {
    var response = {
      value: []
    };

    if (request.queryParams.hasOwnProperty("$count") && request.queryParams.$count === "true") {
      response["@odata.count"] = employee.all().length;
    }

    if (request.queryParams.hasOwnProperty("$skip") || request.queryParams.hasOwnProperty("$top")) {
      var skip = !isNaN(request.queryParams.$skip) ? request.queryParams.$skip : 0;
      var top = !isNaN(request.queryParams.$top) ? request.queryParams.$top : 5;
      for (var i = 0; i < employee.all().length; i++) {
        if (i >= skip && response.value.length < top) {
          response.value.push(employee.all()[i].attrs);
        }
      }
    }

    return response;
  });

  this.passthrough();

}
