(function () {
	// Create the connector object
    var myConnector = tableau.makeConnector();

	// Define the schema
    myConnector.getSchema = function (schemaCallback) {
		
		// Σχήμα για την σειρά δεδομένων "Στατιστικά εμβολιασμού για τον COVID-19"
		var mdg_emvolio_cols = [{
			id: "areaid",
			alias: "Κωδικός Περιοχής",
			dataType: tableau.dataTypeEnum.int
		}, {
			id: "area",
			alias: "Περιφερειακή ενότητα",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "date",
			alias: "Ημερομηνία",
			dataType: tableau.dataTypeEnum.date
		}, {
			id: "dosetype",
			alias: "Eμβολιασμός",
			dataType: tableau.dataTypeEnum.string
		}, {
			id: "dailydose",
			alias: "Ημερήσιοι εμβολιασμοί",
			dataType: tableau.dataTypeEnum.int
		}, {
			id: "totaldose",
			alias: "Συνολικοί εμβολιασμοί",
			dataType: tableau.dataTypeEnum.int
		}, {
			id: "totaldistinctpersons",
			alias: "Σύνολο εμβολιασμένων",
			dataType: tableau.dataTypeEnum.int
		}];
		
		var mdg_emvolio_schema = {
			id: "mdg_emvolio_table",
			alias: "Εμβολιασμοί COVID-19",
			columns: mdg_emvolio_cols
		};

		schemaCallback([mdg_emvolio_schema]);

    };

    myConnector.getData = function (table, doneCallback) {
		
		var connectionDataObj = JSON.parse(tableau.connectionData),
		data = {
		  date_from: connectionDataObj.startDate,
		  date_to: connectionDataObj.endDate
		},
		tokenSring = "Token " + connectionDataObj.apiToken;
		
		$.ajax({
			url: 'https://data.gov.gr/api/v1/query/mdg_emvolio',
			data: data,
			dataType: 'json',
			headers: {
				'Authorization': tokenSring
			},
			success: function(data) {
				// alert('Total results found: ' + data.length)
				// tableau.log(data);
				
				var tableData = [], id = 0, n = "", d = "", p = 0;

				// Iterate over the JSON object
				for (var i = 0, len = data.length; i < len; i++) {
					id = data[i].areaid;
					a = data[i].area;
					d = data[i].referencedate;
					p = data[i].totaldistinctpersons;
					
					tableData.push({
						"areaid": id,
						"area": a,							
						"date": d,
						"totaldistinctpersons": p,
						"dosetype": "1η Δόση",
						"dailydose": data[i].dailydose1,
						"totaldose": data[i].totaldose1
					});
					tableData.push({
						"areaid": id,
						"area": a,							
						"date": d,
						"totaldistinctpersons": p,
						"dosetype": "2η Δόση",
						"dailydose": data[i].dailydose2,
						"totaldose": data[i].totaldose2
					});
					tableData.push({
						"areaid": id,
						"area": a,							
						"date": d,
						"totaldistinctpersons": p,
						"dosetype": "3η Δόση",
						"dailydose": data[i].dailydose3,
						"totaldose": data[i].totaldose3
					});
					tableData.push({
						"areaid": id,
						"area": a,							
						"date": d,
						"totaldistinctpersons": p,
						"dosetype": "Σύνολο",
						"dailydose": data[i].daytotal,
						"totaldose": data[i].totalvaccinations
					});
					
				}

				table.appendRows(tableData);
				doneCallback();
			},
			error: function(xhr){
				tableau.abortWithError("Ώχ! Κάτι πήγε στραβά! Συνέβη κάποιο λάθος: " + xhr.status + " " + xhr.statusText);
				return;
			}
		});
    };

    tableau.registerConnector(myConnector);
	
	$(document).ready(function () {
		$("#submitButton").click(function() {
			var connectionDataObj = {
				startDate: $('#start-date-one').val().trim(),
				endDate: $('#end-date-one').val().trim(),
				apiToken: $('#api-token').val().trim()
			};

			function isValidDate(dateStr) {
				var d = new Date(dateStr);
				return !isNaN(d.getDate());
			}

			
			if (connectionDataObj.startDate <= connectionDataObj.endDate) {
				if (isValidDate(connectionDataObj.startDate) && isValidDate(connectionDataObj.endDate)) {
					tableau.connectionData = JSON.stringify(connectionDataObj);
					tableau.connectionName = "Εμβολιασμοί COVID-19";
					tableau.submit();
				} else {
					$('#errorMsg').html("Enter valid dates. For example, 2016-05-08.");
				}
			} else {
				$('#errorMsg').html("Η ημερομηνία στο πεδίο <Εως> δεν μπορέι να είναι μικρότερη από την ημερομηνία στο πεδίο <Από>.");
			}
			
		});
	});

})();