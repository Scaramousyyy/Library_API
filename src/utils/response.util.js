export const buildSuccessResponse = (message, data, pagination = null) => {
    
    const response = {
        success: true,
        message: message,
        data: data || null, 
    };

    if (pagination) {
        response.pagination = pagination;
    }

    return response;
};