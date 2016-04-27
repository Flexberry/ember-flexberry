export default function() {

  this.urlPrefix = 'https://northwindodata.azurewebsites.net';
  this.namespace = 'odata';

  this.get('/Employees', ({employee}, request) => {
    var response = {
      value: []
    };

    var db = employee.all().map((employee) => { return employee.attrs; });

    if (request.queryParams.hasOwnProperty("$orderby")) {
      var orderby_params = request.queryParams.$orderby.split(" ");
      db.sort(function(a, b){
        if (a[orderby_params[0]] < b[orderby_params[0]]) { return -1; }
        if (a[orderby_params[0]] > b[orderby_params[0]]) { return 1; }
        return 0;
      });
      if (orderby_params[1] === "desc") {
        db.reverse();
      }
    }

    if (request.queryParams.hasOwnProperty("$filter")) {
      var search = request.queryParams.$filter.match(/\'(.*?)\'/)[1].toLowerCase();
      db = db.filter((item) => {
        return item.FirstName.toLowerCase().indexOf(search) !== -1 & item.LastName.toLowerCase().indexOf(search) !== -1;
      });
    }

    if (request.queryParams.hasOwnProperty("$count") && request.queryParams.$count === "true") {
      response["@odata.count"] = db.length;
    }

    if (request.queryParams.hasOwnProperty("$skip") || request.queryParams.hasOwnProperty("$top")) {
      var skip = !isNaN(request.queryParams.$skip) ? request.queryParams.$skip : 0;
      var top = !isNaN(request.queryParams.$top) ? request.queryParams.$top : 5;
      for (var i = 0; i < db.length; i++) {
        if (i >= skip && response.value.length < top) {
          response.value.push(db[i]);
        }
      }
    }

    return response;
  });

  this.passthrough('https://northwindodata.azurewebsites.net/**');

  this.passthrough();

}
