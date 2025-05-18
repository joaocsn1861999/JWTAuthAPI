class DBAsyncHelpers {
  async run({ db, sql, params = [], rejectMessage }) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (error) {
        if (error) return reject(rejectMessage);
        const result = {
          insertedID: this.lastID,
          affectedRows: this.changes,
        }
        return resolve(result);
      });
    });
  }

  async get({ db, sql, params = [], rejectMessage }) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (error, result) => {
        if (error) return reject(rejectMessage);
        if (!result) return resolve(null);
        const parsedResult = JSON.parse(JSON.stringify(result));
        return resolve(parsedResult);
      });
    });
  }

  async all({ db, sql, params = [], rejectMessage }) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (error, result) => {
        if (error) return reject(rejectMessage);
        if (!result || result.length === 0) return resolve(null);
        const parsedResult = JSON.parse(JSON.stringify(result));
        return resolve(parsedResult);
      });
    });
  }
}

export default new DBAsyncHelpers();