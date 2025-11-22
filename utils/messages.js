
class Messages {

    success(message, data = {}) {
        return {
            "success": true,
            "message": message,
            "data": data
        }
    }
    errors(message, errors = []) {
        return {
            "success": false,
            "message": message,
            "errors": errors
        }
    }
    error(message) {
        return {
            "success": false,
            "message": message
        }
    }
}

module.exports = new Messages();