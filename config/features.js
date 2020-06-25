const _ = require("lodash");

class ApiFeatures {
  constructor(query, queryString) {
    this.query = query; // Tour
    this.queryString = queryString; // req.query
  }

  filter() {
    console.log("1)Filtering");
    const queryObj = _.clone(this.queryString);
    const excludeFields = ["category"];
    excludeFields.forEach((el) => delete queryObj[el]);
    console.log(queryObj);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
}

module.exports = ApiFeatures;
