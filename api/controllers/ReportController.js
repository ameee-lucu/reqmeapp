/**
 * ReportController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var Firebase = require('firebase');
var reqmeApp = new Firebase('https://reqmeapp.firebaseio.com/');
var accounting = require('accounting');
var Report = require('fluentReports' ).Report;

module.exports = {
    
  
  /**
   * Action blueprints:
   *    `/report/request`
   */
   request: function (req, res) {

      var param=req.body;

      reqmeApp = new Firebase('https://reqmeapp.firebaseio.com/transactions');
      reqmeApp.once('value', function(snap){
              return res.json({
                    message : "Success",
                    data : snap.val()
              });
          });

  },

    //leasing_otr,leasing_dp,leasing_angsuran

    print: function (req, res) {

        var type=req.param("type");
        if(type==="hitungan"){
            var param=JSON.parse(req.param("param"));
            var mydata =
                [
                    {Type: "Perhitungan" ,OTR : param.leasing_otr,DP : param.leasing_dp,Tenor:param.tenor,Angsuran:param.leasing_angsuran}
                ];
            var dataDetail = function ( report, data ) {
                report.band( [
                    ["OTR", 80],
                    [data.OTR, 100]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["DP", 80],
                    [data.DP, 100, 3]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Tenor", 80],
                    [data.Tenor, 100, 3],
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Angsuran", 80],
                    [data.Angsuran, 100, 3],
                ], {border:1, width: 0, wrap: 1,fontSize :13} );
            };

            /*var namefooter = function ( report, data, state ) {
                report.band( [
                    ["Totals for " + data.name, 180],
                    [report.totals.hours, 100, 3]
                ] );
                report.newLine();
            };*/

            var nameheader = function ( report, data ) {
                report.print( "Perhitungan", {fontBold: true} );
            };

            /*var weekdetail = function ( report, data ) {
                // We could do this -->  report.setCurrentY(report.getCurrentY()+2);   Or use the shortcut below of addY: 2
                report.print( ["Week Number: " + data.week], {x: 100, addY: 2} );
            };*/

            var totalFormatter = function(data, callback) {
                // if (data.hours) { data.hours = ': ' + data.hours; }
                callback(null, data);
            };

            // You don't have to pass in a report name; it will default to "report.pdf"
            var d = new Date();
            var dd = d.getDate();
            var mm = d.getMonth() + 1; //Months are zero based
            var yy = d.getFullYear();
            var reportName = "detail_hitungan_"+dd+mm+yy+".pdf";

            var rpt = new Report(reportName)
                .autoPrint(false) // Optional
                .pageHeader( ["Laporan Perhitungan Unit"] )// Optional
                .userdata( {hi: 1} )// Optional
                .data( mydata )	// REQUIRED
                .detail( dataDetail ) // Optional
                .totalFormatter( totalFormatter ) // Optional
                .fontSize(11); // Optional

            rpt.groupBy( "Type" )
                .header( nameheader );

            // Debug output is always nice (Optional, to help you see the structure)
            // This does the MAGIC...  :-)
            //rpt.printStructure();
            console.time("Rendered");
            var a= rpt.render(function(err, name) {
                console.timeEnd("Rendered");
                if (err) {
                    console.error("Report had an error",err);
                } else {
                    console.log("Report is named and rendered:",name);
                    console.log("report==>"+rpt);
                    return res.download(name);
                    //res.send(rpt);
                }
            });
        }else if(type==="profile"){
            var param=JSON.parse(req.param("param"));
            var mydata =
                [
                    {type: "Data Konsumen" ,
                     email : param.email,
                     nama : param.name,
                     no_ktp:param.id_no,
                     tanggal_ktp:param.id_date,
                     alamat_ktp:param.address,
                     alamat_survey:param.surveyAddress,
                     tempat_lahir:param.birth_place,
                     tanggal_lahir:param.birth_date,
                     no_telp:param.phone,
                     handphone:param.handphone,
                     pekerjaan:param.job,
                     penghasilan:param.income,
                     penghasilan_lain:param.anotherIncome,
                     alamat_kantor:param.office_address,
                     no_telp_kantor:param.office_phone,
                     pk_pasangan:param.partnerJob
                    }
                ];
            var dataDetail = function ( report, data ) {
                report.band( [
                    ["Email", 150],
                    [data.email, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Nama", 150],
                    [data.nama,300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["No KTP", 150],
                    [data.no_ktp, 300],
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Tanggal Berlaku KTP", 150],
                    [data.tanggal_ktp, 300],
                ], {border:1, width: 0, wrap: 1,fontSize :13} );


                report.band( [
                    ["Alamat Sesuai KTP", 150],
                    [data.alamat_ktp, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );


                report.band( [
                    ["Alamat Survey (Jika Berbeda dengan KTP)", 150],
                    [data.alamat_survey, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );


                report.band( [
                    ["Tempat Lahir", 150],
                    [data.tempat_lahir, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Tanggal Lahir", 150],
                    [data.tanggal_lahir, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["No Telp", 150],
                    [data.no_telp, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Handphone", 150],
                    [data.handphone, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Pekerjaan", 150],
                    [data.pekerjaan, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Penghasilan", 150],
                    [accounting.formatNumber(data.penghasilan), 300, 3]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Penghasilan Lain", 150],
                    [accounting.formatNumber(data.penghasilan_lain), 300, 3]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Alamat Kantor / Usaha", 150],
                    [data.alamat_kantor, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["No Telp Kantor / Usaha", 150],
                    [data.no_telp_kantor, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Pekerjaan Pasangan", 150],
                    [data.pk_pasangan, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );
            };

            /*var namefooter = function ( report, data, state ) {
             report.band( [
             ["Totals for " + data.name, 180],
             [report.totals.hours, 100, 3]
             ] );
             report.newLine();
             };*/

            var nameheader = function ( report, data ) {
                report.print( "Data Konsumen", {fontBold: true} );
            };

            /*var weekdetail = function ( report, data ) {
             // We could do this -->  report.setCurrentY(report.getCurrentY()+2);   Or use the shortcut below of addY: 2
             report.print( ["Week Number: " + data.week], {x: 100, addY: 2} );
             };*/

            var totalFormatter = function(data, callback) {
                // if (data.hours) { data.hours = ': ' + data.hours; }
                callback(null, data);
            };

            // You don't have to pass in a report name; it will default to "report.pdf"
            var d = new Date();
            var dd = d.getDate();
            var mm = d.getMonth() + 1; //Months are zero based
            var yy = d.getFullYear();
            var reportName = "detail_konsumen_"+dd+mm+yy+".pdf";

            var rpt = new Report(reportName)
                .autoPrint(false) // Optional
                .pageHeader( ["Laporan Data Konsumen"])// Optional
                .userdata( {hi: 1} )// Optional
                .data( mydata )	// REQUIRED
                .detail( dataDetail ) // Optional
                .totalFormatter( totalFormatter ) // Optional
                .fontSize(11); // Optional

            rpt.groupBy( "Type" )
                .header( nameheader );
            // Debug output is always nice (Optional, to help you see the structure)
            // This does the MAGIC...  :-)
            //rpt.printStructure();
            console.time("Rendered");
            var a= rpt.render(function(err, name) {
                console.timeEnd("Rendered");
                if (err) {
                    console.error("Report had an error",err);
                } else {
                    console.log("Report is named and rendered:",name);
                    console.log("report==>"+rpt);
                    return res.download(name);
                    //res.send(rpt);
                }
            });

        }else if(type==="all"){
            var user=JSON.parse(req.param("user"));
            var trans=JSON.parse(req.param("trans"));

            var mydata =
                [
                    {
                        email : user.email,
                        nama : user.name,
                        no_ktp:user.id_no,
                        tanggal_ktp:user.id_date,
                        alamat_ktp:user.address,
                        alamat_survey:user.surveyAddress,
                        tempat_lahir:user.birth_place,
                        tanggal_lahir:user.birth_date,
                        no_telp:user.phone,
                        handphone:user.handphone,
                        pekerjaan:user.job,
                        penghasilan:user.income,
                        penghasilan_lain:user.anotherIncome,
                        alamat_kantor:user.office_address,
                        no_telp_kantor:user.office_phone,
                        pk_pasangan:user.partnerJob,
                        OTR : trans.leasing_otr,
                        DP : trans.leasing_dp,
                        Tenor:trans.tenor,
                        Angsuran:trans.leasing_angsuran
                    }
                ];
            var dataDetail = function ( report, data ) {

                report.band( [
                    ["Data Konsumen", 150],
                    ["", 300]
                ], {border:0, width: 0, wrap: 1,fontSize :13,fontBold: true} );


                report.band( [
                    ["Email", 150],
                    [data.email, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Nama", 150],
                    [data.nama,300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["No KTP", 150],
                    [data.no_ktp, 300],
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Tanggal Berlaku KTP", 150],
                    [data.tanggal_ktp, 300],
                ], {border:1, width: 0, wrap: 1,fontSize :13} );


                report.band( [
                    ["Alamat Sesuai KTP", 150],
                    [data.alamat_ktp, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );


                report.band( [
                    ["Alamat Survey (Jika Berbeda dengan KTP)", 150],
                    [data.alamat_survey, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Tempat Lahir", 150],
                    [data.tempat_lahir, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Tanggal Lahir", 150],
                    [data.tanggal_lahir, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["No Telp", 150],
                    [data.no_telp, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Handphone", 150],
                    [data.handphone, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Pekerjaan", 150],
                    [data.pekerjaan, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Penghasilan", 150],
                    [accounting.formatNumber(data.penghasilan), 300, 3]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Penghasilan Lain", 150],
                    [accounting.formatNumber(data.penghasilan_lain), 300, 3]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Alamat Kantor / Usaha", 150],
                    [data.alamat_kantor, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["No Telp Kantor / Usaha", 150],
                    [data.no_telp_kantor, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Pekerjaan Pasangan", 150],
                    [data.pk_pasangan, 300]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.newLine();

                report.band( [
                    ["Data Perhitungan", 150],
                    ["", 300]
                ], {border:0, width: 0, wrap: 1,fontSize :13,fontBold: true} );

                report.band( [
                    ["OTR", 80],
                    [data.OTR, 100]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["DP", 80],
                    [data.DP, 100, 3]
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Tenor", 80],
                    [data.Tenor, 100, 3],
                ], {border:1, width: 0, wrap: 1,fontSize :13} );

                report.band( [
                    ["Angsuran", 80],
                    [data.Angsuran, 100, 3],
                ], {border:1, width: 0, wrap: 1,fontSize :13} );
            };

            /*var namefooter = function ( report, data, state ) {
             report.band( [
             ["Totals for " + data.name, 180],
             [report.totals.hours, 100, 3]
             ] );
             report.newLine();
             };*/

            /*var nameheader = function ( report, data ) {
                report.print( data.type, {fontBold: true} );
            };*/

            /*var weekdetail = function ( report, data ) {
             // We could do this -->  report.setCurrentY(report.getCurrentY()+2);   Or use the shortcut below of addY: 2
             report.print( ["Week Number: " + data.week], {x: 100, addY: 2} );
             };*/

            var totalFormatter = function(data, callback) {
                // if (data.hours) { data.hours = ': ' + data.hours; }
                callback(null, data);
            };

            // You don't have to pass in a report name; it will default to "report.pdf"
            var d = new Date();
            var dd = d.getDate();
            var mm = d.getMonth() + 1; //Months are zero based
            var yy = d.getFullYear();
            var reportName = "detail_all_"+dd+mm+yy+".pdf";

            var rpt = new Report(reportName)
                .autoPrint(false) // Optional
                .pageHeader( ["Laporan Data"])// Optional
                .userdata( {hi: 1} )// Optional
                .data( mydata )	// REQUIRED
                .detail( dataDetail ) // Optional
                .totalFormatter( totalFormatter ) // Optional
                .fontSize(11); // Optional

            //rpt.groupBy( "type" )
            //    .header( nameheader );



            // Debug output is always nice (Optional, to help you see the structure)
            // This does the MAGIC...  :-)
            //rpt.printStructure();
            console.time("Rendered");
            var a= rpt.render(function(err, name) {
                console.timeEnd("Rendered");
                if (err) {
                    console.error("Report had an error",err);
                } else {
                    console.log("Report is named and rendered:",name);
                    console.log("report==>"+rpt);
                    return res.download(name);
                    //res.send(rpt);
                }
            });



        }



    },



  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ReportController)
   */
  _config: {}

  
};
