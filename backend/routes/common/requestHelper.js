class RequestHelper {
    /**
     * Returns whether or not a given request body contains all of a given set of keys.
     * @param {Object} request An HTTP request.
     * @param {Set<String>} keys A Set of Strings that represents all expected keys.
     */
    static expectFullBody(request, keys) {
        return RequestHelper.getTotalOverlap(request, keys) === keys.size;
    }

    /**
     * Returns whether or not a given request body contains at least one of a given set of keys.
     * @param {Object} request An HTTP request.
     * @param {Set<String>} keys A Set of Strings that represents all expected keys.
     */
    static expectMinimumBody(request, keys) {
        return RequestHelper.getTotalOverlap(request, keys) > 0;
    }

    /**
     * Returns the total amount of expected keys in a given request.
     * @param {Object} request An HTTP request.
     * @param {Set<String>} keys A Set of Strings that represents all expected keys.
     * @private
     */
    static getTotalOverlap(request, keys) {
        if (!request) {
            throw {
                "code": "REQUEST_NOT_FOUND",
                "message": "Expected a valid HTTP request Object; got nothing instead."
            };
        }

        if (!keys) {
            throw {
                "code": "KEYS_NOT_FOUND",
                "message": "Expected a Set of keys; got nothing instead."
            };
        }

        if (!request.body) {
            throw {
                "code": "REQUEST_BODY_NOT_FOUND",
                "message": "Expected the request to have a body; got nothing instead."
            };
        }

        const reqBodyKeys = Object.keys(request.body);
        let total = 0;

        for (let key of reqBodyKeys) {
            if (keys.has(key)) {
                total++;
            }
        }

        return total;
    }
}

module.exports = RequestHelper;