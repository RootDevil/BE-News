exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
      }
    else next(err);
}

exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23502") {
        res.status(400).send({ message: "Bad request" });
    }
    else if (err.code === "23503") {
        res.status(404).send({ message: "Resource does not exist" });
    }
    else if (err.code === "42703") {
        res.status(400).send({ message: "Invalid sort_by value"});
    }
    else if (err.code === "42601") {
        res.status(400).send({ message: "Invalid order value"});
    }
    else next(err);
}

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ message: "Internal server error" });
}