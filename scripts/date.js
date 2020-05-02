var makeDate = function () {
  var d = newDate();
  var formattedDate = "";

  formattedDate += d.getMonth() + 1 + "_";
  formattedDate += d.getDate() + "_";
  formattedDate += d.getFullYear();

  return formattedDate;
};

module.exports = makeDate;
