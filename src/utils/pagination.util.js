export const getPaginationParams = (req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50); 
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

export const buildPaginationMeta = (totalRecords, page, limit) => {
    const safeLimit = limit > 0 ? limit : 10; 
    const totalPages = Math.ceil(totalRecords / safeLimit);
    
    const currentPage = page > totalPages && totalPages > 0 ? totalPages : page;
    const isLastPage = currentPage >= totalPages;
    const isFirstPage = currentPage === 1;

    return {
        totalRecords: totalRecords,
        totalPages: totalPages,
        currentPage: currentPage,
        perPage: safeLimit,
        isFirstPage: isFirstPage,
        isLastPage: isLastPage,
    };
};