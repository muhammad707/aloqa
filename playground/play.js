// const md5 = require('md5');

// var pwd = '$2a$10$0gbTYB9lUcTVMOfd29RGMOAAkYlijlaL3ZYboZhiYo9T4Qz3BL35u';
// var time = Date.now();
// var hashedPwd = md5(pwd+time);
// console.log(hashedPwd);
// console.log(time);

//$2a$10$0gbTYB9lUcTVMOfd29RGMOAAkYlijlaL3ZYboZhiYo9T4Qz3BL35u

const fs = require('fs');

// var header = "Sl No"+"\t"+" Age"+"\t"+"Name"+"\n";
// var row1 = "0"+"\t"+" 21"+"\t"+"Rob"+"\n";
// var row2 = "1"+"\t"+" 22"+"\t"+"bob"+"\n";

// writeStream.write(header);
// writeStream.write(row1);
// writeStream.write(row2);

// writeStream.close();
const models = require('../models');
const result = [];

const excel = require('node-excel-export');
 
// You can define styles as json object
const styles = {
  headerDark: {
    fill: {
      fgColor: {
        rgb: 'FF000000'
      }
    },
    font: {
      color: {
        rgb: 'FFFFFFFF'
      },
      sz: 14,
      bold: true,
      underline: true
    }
  },
  cellPink: {
    fill: {
      fgColor: {
        rgb: 'FFFFCCFF'
      }
    }
  },
  cellGreen: {
    fill: {
      fgColor: {
        rgb: 'FF00FF00'
      }
    }
  }
};
 
//Array of objects representing heading rows (very top)
// const heading = [
//   [{value: 'a1', style: styles.headerDark}, {value: 'b1', style: styles.headerDark}, {value: 'c1', style: styles.headerDark}],
//   ['a2', 'b2', 'c2'] // <-- It can be only values
// ];
 
//Here you specify the export structure
const specification = {
    transaction: {
        displayName: "Тартиб рақами",
        header: styles.headerDark,
        width: 50
    },
    sender_full_name: { // <- the key should match the actual data key
    displayName: 'Пул юборувчи Ф.И.О', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    // cellStyle: function(value, row) { // <- style renderer function
    //   // if the status is 1 then color in green else color in red
    //   // Notice how we use another cell value to style the current one
    //   return (row.status == 'создан') ? styles.cellGreen : {fill: {fgColor: {rgb: 'FFFF0000'}}}; // <- Inline cell style is possible 
    // },
    width: 250 // <- width in pixels
  },
  sender_passport_info: {
    displayName: "Паспорт серияси ва рақами",
    headerStyle: styles.headerDark,
    // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
    //   return (value == 1) ? 'Active' : 'Inactive';
    // },
    width: 200 // <- width in chars (when the number is passed as string)
  },
  send_paymentMethod: {
    displayName: "Пул юбориш шакли",
    headerStyle: styles.headerDark,
    width: 200
  },

  send_currency: {
    displayName: "Пул бирлиги",
    headerStyle: styles.headerDark,
    width: 200
  },

  send_amount_in_number: {
    displayName: "Суммаси",
    headerStyle: styles.headerDark,
    width: 200
  },

  bank_profit: {
    displayName: "Банк даромади",
    headerStyle: styles.headerDark,
    width: 200
  },

  createdAt: {
    displayName: "Пул ўтказмаси юборилган сана",
    headerStyle: styles.headerDark,
    width: 200
  },

  createdAt: {
    displayName: "Пул ўтказмаси юборилган сана",
    headerStyle: styles.headerDark,
    width: 200
  },

  send_department: {
    displayName: "Пул юборилган филиал",
    headerStyle: styles.headerDark,
    width: 200
  },

  send_department: {
    displayName: "Пул юборилган филиал",
    headerStyle: styles.headerDark,
    width: 200
  },

  receiver_fullname: {
    displayName: "Пул юборувчи оператор",
    headerStyle: styles.headerDark,
    width: 200
  },

  receiver_fullname: {
    displayName: "Пул юборувчи оператор",
    headerStyle: styles.headerDark,
    width: 200
  },

  sender_phone_number: {
    displayName: 'Phone number',
    headerStyle: styles.headerDark,
    cellStyle: styles.cellPink, // <- Cell style
    width: 200 // <- width in pixels
  }
}
 
// The data set should have the following shape (Array of Objects)
// The order of the keys is irrelevant, it is also irrelevant if the
// dataset contains more fields as the report is build based on the
// specification provided above. But you should have all the fields
// that are listed in the report specification
const dataset = [
  {customer_name: 'IBM', status_id: 1, note: 'some note', misc: 'not shown'},
  {customer_name: 'HP', status_id: 0, note: 'some note'},
  {customer_name: 'MS', status_id: 0, note: 'some note', misc: 'not shown'}
]
models.Transaction.findAll({
    include: [{
        model: models.TransactionStatus
    }, {
        model: models.PaymentMethod
    }, {
        model: models.Currency
    }, {
        model: models.Currency,
        as: 'reciveCurrency'
    }, {
        model: models.PaymentMethod,
        as: 'receiveMethod'
    }]
}).then(transactions => {
    for(transaction of transactions) {
        data = {};
        data.transaction = ( transaction.id != null ?  transaction.id : "");
        data.send_department = (transaction.send_department != null ? transaction.send_department : "");
        data.sender_full_name = ((transaction.sender_firstName != null && transaction.sender_lastName != null && transaction.sender_middleName) ? `${transaction.sender_lastName} ${transaction.sender_firstName} ${transaction.sender_middleName}`: "");
        data.sender_passport_info = ((transaction.sender_passport_series != null && transaction.sender_passport_number != null) ? `${transaction.sender_passport_series} ${transaction.sender_passport_number}` : ""); 
        data.sender_passport_date_of_issue = (transaction.sender_passport_date_of_issue != null ? transaction.sender_passport_date_of_issue : "");
        data.sender_passport_date_of_expiry = (transaction.sender_passport_date_of_expiry != null ? transaction.sender_passport_date_of_expiry : "");
        data.sender_passport_place_of_given = (transaction.sender_passport_place_of_given != null ? transaction.sender_passport_place_of_given : "");
        data.sender_permanent_address = (transaction.sender_permanent_address != null ? transaction.sender_permanent_address : "");
        data.sender_phone_number = (transaction.sender_phone_number != null ? transaction.sender_phone_number : "");
        data.sender_account_number = (transaction.sender_account_number != null ? transaction.sender_account_number : "");
        data.send_amount_in_number = (transaction.send_amount_in_number != null ? transaction.send_amount_in_number : "");
        data.send_amount_in_word = (transaction.send_amount_in_word != null ? transaction.send_amount_in_word: "");
        data.receive_department = (transaction.receive_department != null ? transaction.receive_department : "");
        data.receiver_fullname = (transaction.receiver_fullname != null ? transaction.receiver_fullname : "");
        data.receiver_passport_info = ((transaction.receiver_passport_series != null && transaction.receiver_passport_number != null) ? `${transaction.receiver_passport_series} ${transaction.receiver_passport_number}` : "") 
        data.receiver_passport_date_of_issue = (transaction.receiver_passport_date_of_issue != null ? transaction.receiver_passport_date_of_issue : "");
        data.receiver_passport_date_of_expiry = (transaction.receiver_passport_date_of_expiry != null ? transaction.receiver_passport_date_of_expiry : "");
        data.receiver_passport_place_of_given = (transaction.receiver_passport_place_of_given != null ? transaction.receiver_passport_place_of_given : "");
        data.receiver_permanent_address = (transaction.receiver_permanent_address != null ? transaction.receiver_permanent_address : "");
        data.receiver_phone_number = (transaction.receiver_phone_number != null ? transaction.receiver_phone_number : "");
        data.receiver_account_number = (transaction.receiver_account_number != null ? transaction.receiver_account_number : "");
        data.createdAt = (transaction.createdAt != null ? transaction.createdAt : "");
        data.updatedAt = (transaction.updatedAt != null ? transaction.updatedAt : "");
        data.status = (transaction.Status.status != null ? transaction.Status.status : "");
        data.send_paymentMethod = (transaction.Payment.name != null ? transaction.Payment.name : "");
        data.receive_paymentMethod = (transaction.receiveMethod != null ? transaction.receiveMethod.name : "");
        data.send_currency = (transaction.Currency.name != null ? transaction.Currency.name : "");
        data.receive_currency = (transaction.reciveCurrency != null ? transaction.reciveCurrency.name : "");
        data.bank_profit = (transaction.bank_profit != null ? transaction.bank_profit : "");
        result.push(data);
    }
console.log(result);
// Define an array of merges. 1-1 = A:1
// The merges are independent of the data.
// A merge will overwrite all data _not_ in the top-left cell.
// const merges = [
//   { start: { row: 1, column: 1 }, end: { row: 1, column: 10 } },
//   { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
//   { start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
// ]
 
// Create the excel report.
// This function will return Buffer
const report = excel.buildExport(
  [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
    {
      name: 'Report', // <- Specify sheet name (optional)
    //   heading: heading, // <- Raw heading array (optional)
    //   merges: merges, // <- Merge cell ranges
      specification: specification, // <- Report specification
      data: result// <-- Report data
    }
  ]
);
 
// You can then return this straight
// res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
// return res.send(report);
var writeStream = fs.createWriteStream("file.xlsx");
writeStream.write(report, () => {
    console.log('cccc');
});
writeStream.close();
});
// writeStream.write(row1);
// writeStream.write(row2);
// OR you can save this buffer to the disk by creating a file.