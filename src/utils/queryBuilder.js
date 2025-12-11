import { getPaginationParams } from './pagination.util.js';

export const buildQueryOptions = (req, allowedFilters = [], searchFields = []) => {
    
    // 1. Ambil Parameter Pagination dari helper
    const { page, limit, skip } = getPaginationParams(req);

    // 2. Sorting
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "desc" ? "desc" : "asc";

    // 3. Filtering (only allow specific fields)
    const where = {};
    allowedFilters.forEach((field) => {
        if (req.query[field]) {
            where[field] = req.query[field];
        }
    });

    // 4. Searching (case insensitive)
    if (req.query.search && searchFields.length > 0) {
        where.OR = searchFields.map((f) => ({
            [f]: {
                contains: req.query.search,
                mode: "insensitive",
            },
        }));
    }

    return {
        skip,
        take: limit, 
        
        paginationMeta: { page, limit },
        
        orderBy: { [sortBy]: order },
        where,
    };
};