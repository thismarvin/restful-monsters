function sendBadGateway(res, message) {
    res.status(502).json({
        "error": {
            "code": 502,
            "message": message ? message : `Bad Gateway (most likely the server could not connect to the database).`
        }
    });
}

function sendBadRequest(res, message) {
    res.status(400).json({
        "error": {
            "code": 400,
            "message": message ? message : `Bad Request (most likely the body of a POST request could not be validated).`
        }
    });
}

module.exports = {
    sendBadGateway,
    sendBadRequest
}