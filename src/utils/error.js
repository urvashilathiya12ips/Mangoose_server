const serverError = (error, response) => {
    return response.status(500).json({
        type: 'error',
        message: error.message || 'Something went wrong.',
    });
}

module.exports = serverError