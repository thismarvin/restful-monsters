/**
 * Tell the Express Router to send a status of 400 (Bad Request)
 * and a neat JSON object with information regarding the error.
 * @param {*} res The response that is attached to an Express Router.
 * @param {String} message An optional parameter that is used to personalize the JSON error message.
 */
function sendBadRequest(res, message) {
    res.status(400).json({
        "error": {
            "code": 400,
            "message": message ? message : `Bad Request.`
        }
    });
}

/**
 * Tell the Express Router to send a status of 404 (Not Found)
 * and a neat JSON object with information regarding the error.
 * @param {*} res The response that is attached to an Express Router.
 * @param {String} message An optional parameter that is used to personalize the JSON error message.
 */
function sendNotFound(res, message) {
    res.status(404).json({
        "error": {
            "code": 404,
            "message": message ? message : `Not Found.`
        }
    });
}

/**
 * Tell the Express Router to send a status of 409 (Conflict)
 * and a neat JSON object with information regarding the error.
 * @param {*} res The response that is attached to an Express Router.
 * @param {String} message An optional parameter that is used to personalize the JSON error message.
 */
function sendConflict(res, message) {
    res.status(409).json({
        "error": {
            "code": 409,
            "message": message ? message : `Conflict.`
        }
    });
}

/**
 * Tell the Express Router to send a status of 500 (Internal Server Error)
 * and a neat JSON object with information regarding the error.
 * @param {*} res The response that is attached to an Express Router.
 * @param {String} message An optional parameter that is used to personalize the JSON error message.
 */
function sendInternalServerError(res, message) {
    res.status(500).json({
        "error": {
            "code": 500,
            "message": message ? message : `Internal Server Error.`
        }
    });
}

/**
 * Tell the Express Router to send a status of 502 (Bad Gateway)
 * and a neat JSON object with information regarding the error.
 * @param {*} res The response that is attached to an Express Router.
 * @param {String} message An optional parameter that is used to personalize the JSON error message.
 */
function sendBadGateway(res, message) {
    res.status(502).json({
        "error": {
            "code": 502,
            "message": message ? message : `Bad Gateway.`
        }
    });
}

/**
 * A last resort that catches any error you throw at it.
 * @param {*} res The response that is attached to an Express Router.
 * @param {Error} error The error that needs to be handled.
 */
function handle(res, error) {
    switch (error.code) {
        case "ECONNREFUSED":
            sendBadGateway(res, "Could not connect to database.");
            break;

        default:
            sendInternalServerError(res, error);
            break;
    }
}

module.exports = {
    sendBadRequest,
    sendNotFound,
    sendConflict,
    sendInternalServerError,
    sendBadGateway,
    handle
}