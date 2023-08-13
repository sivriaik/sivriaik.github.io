(function () {
	// Create the connector object
    var myConnector = tableau.makeConnector();

	// Define the schema
    myConnector.getSchema = function (schemaCallback) {
		// tableau.log("Hello WDC!");
		
		// Σχήμα για την σειρά δεδομένων "Ανανεώσιμες πηγές ενέργειας"
		var admie_realtimescadares_cols = [{
			id: "datetime",
			alias: "Ημερομηνία και ώρα",
			dataType: tableau.dataTypeEnum.datetime
		}, {
			id: "date",
			alias: "Ημερομηνία",
			dataType: tableau.dataTypeEnum.date
		}, {
			id: "energy_mwh",
			alias: "Ενέργεια (MWh)",
			dataType: tableau.dataTypeEnum.int
		}];
		
		var admie_realtimescadares_schema = {
			id: "admie_realtimescadares_table",
			alias: "Ανανεώσιμες πηγές ενέργειας",
			columns: admie_realtimescadares_cols
		};
		
		// Σχήμα για την σειρά δεδομένων "Ενεργειακό Ισοζύγιο"
		var admie_dailyenergybalanceanalysis_cols = [{
			id: "datetime",
			alias: "Ημερομηνία και ώρα",
			dataType: tableau.dataTypeEnum.datetime
		}, {
			id: "date",
			alias: "Ημερομηνία",
			dataType: tableau.dataTypeEnum.date
		}, {
			id: "energy_mwh",
			alias: "Ενέργεια (MWh)",
			dataType: tableau.dataTypeEnum.int
		}, {
			id: "percentage",
			alias: "Ποσοστό",
			dataType: tableau.dataTypeEnum.float
		}, {
			id: "fuel",
			alias: "Πηγή Ενέργειας",
			dataType: tableau.dataTypeEnum.string
		}];

		var admie_dailyenergybalanceanalysis_schema = {
			id: "admie_dailyenergybalanceanalysis_table",
			alias: "Ενεργειακό Ισοζύγιο",
			columns: admie_dailyenergybalanceanalysis_cols
		};
		
		// Σχήμα για την σειρά δεδομένων "Φορτίο συστήματος ενέργειας"
		var admie_realtimescadasystemload_cols = [{
			id: "datetime",
			alias: "Ημερομηνία και ώρα",
			dataType: tableau.dataTypeEnum.datetime
		}, {
			id: "date",
			alias: "Ημερομηνία",
			dataType: tableau.dataTypeEnum.date
		}, {
			id: "energy_mwh",
			alias: "Ενέργεια (MWh)",
			dataType: tableau.dataTypeEnum.int
		}];

		var admie_realtimescadasystemload_schema = {
			id: "admie_realtimescadasystemload_table",
			alias: "Φορτίο συστήματος ενέργειας",
			columns: admie_realtimescadasystemload_cols
		};

		schemaCallback([admie_realtimescadares_schema, admie_dailyenergybalanceanalysis_schema, admie_realtimescadasystemload_schema]);

    };

    myConnector.getData = function (table, doneCallback) {
		
		var connectionDataObj = JSON.parse(tableau.connectionData),
		data = {
		  date_from: connectionDataObj.startDate,
		  date_to: connectionDataObj.endDate
		},
		tokenSring = "Token " + connectionDataObj.apiToken;

		// tableau.log(tokenSring);
		
		if (table.tableInfo.id == "admie_realtimescadares_table") {
			$.ajax({
				url: 'https://data.gov.gr/api/v1/query/admie_realtimescadares',
				data: data,
				dataType: 'json',
				headers: {
					'Authorization': tokenSring
				},
				success: function(data) {
					// alert('Total results found: ' + data.length)
					// tableau.log(data);
					var tableData = [];

					// Iterate over the JSON object
					for (var i = 0, len = data.length; i < len; i++) {
						tableData.push({
							"datetime": data[i].date,
							"date": data[i].date,
							"energy_mwh": data[i].energy_mwh
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
		}
		
		if (table.tableInfo.id == "admie_dailyenergybalanceanalysis_table") {
			$.ajax({
				url: 'https://data.gov.gr/api/v1/query/admie_dailyenergybalanceanalysis',
				data: data,
				dataType: 'json',
				headers: {
					'Authorization': tokenSring
				},
				success: function(data) {
					// alert('Total results found: ' + data.length)
					// tableau.log(data);
					var tableData = [];

					// Iterate over the JSON object
					for (var i = 0, len = data.length; i < len; i++) {
						tableData.push({
							"datetime": data[i].date,
							"date": data[i].date,
							"energy_mwh": data[i].energy_mwh,
							"percentage": data[i].percentage,
							"fuel": data[i].fuel
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
		}
		
		if (table.tableInfo.id == "admie_realtimescadasystemload_table") {
			$.ajax({
				url: 'https://data.gov.gr/api/v1/query/admie_realtimescadasystemload',
				data: data,
				dataType: 'json',
				headers: {'Authorization': tokenSring},
				success: function(data) {
					// alert('Total results found: ' + data.length)
					// tableau.log(data);
					var tableData = [];

					// Iterate over the JSON object
					for (var i = 0, len = data.length; i < len; i++) {
						tableData.push({
							"datetime": data[i].date,
							"date": data[i].date,
							"energy_mwh": data[i].energy_mwh
						});
					}

					table.appendRows(tableData);
					doneCallback();
				},
				error: function(xhr){
					tableau.abortWithError("Ώχ! Κάτι πήγε στραβά! Συνέβη κάποιο λάθος: " + xhr.status + " " + xhr.statusText);
					// alert("Ώχ! Κάτι πήγε στραβά! An error occured: " + data.status + " " + data.statusText);
					return;
				}
			});
		}
		
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
					tableau.connectionName = "Δεδομένα ΑΔΜΗΕ";
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